import { useState } from "react";
import { Filter, SortAsc, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BusScheduleCard from "./BusScheduleCard";

// Mock routes data based on the provided information
const mockRoutes = [
  {
    id: 'patiala-chandigarh-ordinary',
    name: 'Patiala - Chandigarh (Morning Service)',
    startLocation: 'Patiala Central Bus Stand',
    endLocation: 'Chandigarh ISBT 17',
    busType: 'Ordinary' as const,
    startTime: '07:26',
    endTime: '16:00',
    duration: '2h 45min',
    fare: 65,
    nextDeparture: '12:30',
    status: 'on-time' as const,
    availableSeats: 8
  },
  {
    id: 'patiala-chandigarh-deluxe',
    name: 'Patiala - Chandigarh (Evening Service)',
    startLocation: 'Patiala Railway Station',
    endLocation: 'Chandigarh Sector 43',
    busType: 'Deluxe' as const,
    startTime: '17:00',
    endTime: '23:00',
    duration: '2h 30min',
    fare: 95,
    nextDeparture: '18:45',
    status: 'delayed' as const,
    availableSeats: 15
  },
  {
    id: 'chandigarh-jalandhar',
    name: 'Chandigarh - Jalandhar Express',
    startLocation: 'Chandigarh Sector 17',
    endLocation: 'Jalandhar Main Bus Stand',
    busType: 'Ordinary' as const,
    startTime: '09:37',
    endTime: '15:45',
    duration: '3h 15min',
    fare: 120,
    nextDeparture: '13:20',
    status: 'on-time' as const,
    availableSeats: 5
  },
  {
    id: 'ropar-chandigarh',
    name: 'Ropar - Chandigarh Circuit',
    startLocation: 'Ropar Bus Stand',
    endLocation: 'Chandigarh Rock Garden',
    busType: 'Ordinary' as const,
    startTime: '07:00',
    endTime: '18:00',
    duration: '1h 45min',
    fare: 45,
    nextDeparture: '15:30',
    status: 'on-time' as const,
    availableSeats: 22
  }
];

interface RouteResultsProps {
  searchQuery: {
    source: string;
    destination: string;
  };
  onTrackBus: (routeId: string) => void;
  onViewMap: () => void;
}

export default function RouteResults({ searchQuery, onTrackBus, onViewMap }: RouteResultsProps) {
  const [sortBy, setSortBy] = useState<string>("departure");
  const [filterBy, setFilterBy] = useState<string>("all");

  // Filter and sort routes based on user selections
  const filteredRoutes = mockRoutes.filter(route => {
    if (filterBy === 'all') return true;
    if (filterBy === 'ordinary') return route.busType === 'Ordinary';
    if (filterBy === 'deluxe') return route.busType === 'Deluxe';
    if (filterBy === 'available') return route.availableSeats && route.availableSeats > 0;
    return true;
  });

  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    switch (sortBy) {
      case 'fare':
        return a.fare - b.fare;
      case 'duration':
        return a.duration.localeCompare(b.duration);
      case 'departure':
      default:
        return a.nextDeparture.localeCompare(b.nextDeparture);
    }
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Results Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Available Routes
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery.source} → {searchQuery.destination}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={onViewMap}
              className="hover-elevate"
              data-testid="button-view-map"
            >
              <MapPin className="w-4 h-4 mr-2" />
              View on Map
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {/* Filter Controls */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40" data-testid="select-filter">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buses</SelectItem>
                  <SelectItem value="ordinary">Ordinary</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="available">Available Seats</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="departure">Next Departure</SelectItem>
                  <SelectItem value="fare">Fare (Low to High)</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-2 ml-auto">
              <Badge variant="secondary" className="text-xs">
                {sortedRoutes.length} routes found
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Cards */}
      <div className="space-y-4">
        {sortedRoutes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No routes found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or check alternative locations.
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedRoutes.map((route) => (
            <BusScheduleCard
              key={route.id}
              route={route}
              onTrackBus={onTrackBus}
              onBookTicket={(routeId) => console.log('Book ticket for:', routeId)}
            />
          ))
        )}
      </div>

      {/* Live Updates Notice */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Live updates: Times and availability are updated every 30 seconds
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => console.log('Refresh data')}
              data-testid="button-refresh"
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}