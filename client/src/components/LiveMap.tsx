import { useState, useEffect } from "react";
import { MapPin, Navigation, Clock, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock bus tracking data
const mockBuses = [
  {
    id: 'bus-001',
    routeId: 'patiala-chandigarh-deluxe',
    busNumber: 'PB-05-2847',
    routeName: 'Patiala - Chandigarh Express',
    currentLocation: 'Rajpura Junction',
    nextStop: 'Chandigarh Sector 17',
    estimatedArrival: '14:25',
    delay: 0,
    coordinates: { lat: 30.4828, lng: 76.3903 },
    passengers: 28,
    capacity: 45,
    busType: 'Deluxe',
    status: 'en-route'
  },
  {
    id: 'bus-002',
    routeId: 'ropar-chandigarh',
    busNumber: 'PB-03-1569',
    routeName: 'Ropar - Chandigarh Circuit',
    currentLocation: 'Morinda Bypass',
    nextStop: 'Chandigarh Rock Garden',
    estimatedArrival: '15:42',
    delay: 5,
    coordinates: { lat: 30.7916, lng: 76.4951 },
    passengers: 15,
    capacity: 35,
    busType: 'Ordinary',
    status: 'delayed'
  }
];

interface LiveMapProps {
  selectedRouteId?: string;
  onBackToSearch: () => void;
}

export default function LiveMap({ selectedRouteId, onBackToSearch }: LiveMapProps) {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Updating bus positions...'); // Mock update
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredBuses = selectedRouteId 
    ? mockBuses.filter(bus => bus.routeId === selectedRouteId)
    : mockBuses;

  const selectedBusData = selectedBus 
    ? mockBuses.find(bus => bus.id === selectedBus)
    : null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Map Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                Live Bus Tracking
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time bus positions and ETA updates
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsTracking(!isTracking)}
                data-testid="button-toggle-tracking"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isTracking ? 'Stop' : 'Start'} Tracking
              </Button>
              <Button 
                variant="ghost" 
                onClick={onBackToSearch}
                data-testid="button-back-search"
              >
                Back to Search
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="h-96 lg:h-[500px]">
            <CardContent className="p-0 h-full">
              {/* Placeholder for Google Maps */}
              <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-center space-y-4">
                  <MapPin className="w-16 h-16 text-primary mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Interactive Map</h3>
                    <p className="text-muted-foreground">
                      Google Maps integration will show live bus positions
                    </p>
                  </div>
                </div>

                {/* Mock Bus Markers */}
                {filteredBuses.map((bus, index) => (
                  <Button
                    key={bus.id}
                    variant={selectedBus === bus.id ? "default" : "secondary"}
                    size="sm"
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 hover-elevate`}
                    style={{
                      left: `${30 + index * 25}%`,
                      top: `${40 + index * 15}%`
                    }}
                    onClick={() => setSelectedBus(bus.id)}
                    data-testid={`button-bus-marker-${bus.id}`}
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    {bus.busNumber}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bus Information Panel */}
        <div className="space-y-4">
          {/* Active Buses List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active Buses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredBuses.map((bus) => (
                <div
                  key={bus.id}
                  className={`p-3 rounded-md border cursor-pointer transition-all hover-elevate ${
                    selectedBus === bus.id 
                      ? 'border-primary bg-accent' 
                      : 'border-border bg-card hover:border-muted-foreground'
                  }`}
                  onClick={() => setSelectedBus(bus.id)}
                  data-testid={`card-bus-${bus.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{bus.busNumber}</span>
                    <div className="flex items-center gap-1">
                      {bus.busType === 'Deluxe' && <Zap className="w-3 h-3 text-primary" />}
                      <Badge 
                        variant={bus.status === 'en-route' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {bus.status === 'en-route' ? 'On Route' : 'Delayed'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{bus.currentLocation}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>ETA: {bus.estimatedArrival}</span>
                      {bus.delay > 0 && (
                        <span className="text-destructive">({bus.delay}min late)</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Selected Bus Details */}
          {selectedBusData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bus Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">{selectedBusData.busNumber}</h4>
                  <p className="text-sm text-muted-foreground">{selectedBusData.routeName}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Location</span>
                    <span className="font-medium">{selectedBusData.currentLocation}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next Stop</span>
                    <span className="font-medium">{selectedBusData.nextStop}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ETA</span>
                    <span className="font-medium text-primary">{selectedBusData.estimatedArrival}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Occupancy</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span className="font-medium">
                        {selectedBusData.passengers}/{selectedBusData.capacity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => console.log('Get directions to bus')}
                    data-testid="button-directions"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live Updates Status */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  Live updates active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Bus positions updated every 30 seconds
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}