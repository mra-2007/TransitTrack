import { useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Mock locations data
const locations = [
  {
    id: "patiala",
    name: "Patiala",
    type: "city",
    subLocations: [
      { id: "patiala-bus-stand", name: "Central Bus Stand", type: "bus_stop" },
      { id: "patiala-railway", name: "Railway Station", type: "bus_stop" },
      { id: "patiala-mall", name: "Mall Road", type: "landmark" },
      { id: "patiala-university", name: "University Gate", type: "landmark" },
    ]
  },
  {
    id: "chandigarh",
    name: "Chandigarh",
    type: "city", 
    subLocations: [
      { id: "chandigarh-sector17", name: "Sector 17 Plaza", type: "bus_stop" },
      { id: "chandigarh-isbt", name: "ISBT 17", type: "bus_stop" },
      { id: "chandigarh-sector43", name: "Sector 43 Bus Stand", type: "bus_stop" },
      { id: "chandigarh-rock-garden", name: "Rock Garden", type: "landmark" },
    ]
  },
  {
    id: "mohali",
    name: "Mohali",
    type: "city",
    subLocations: [
      { id: "mohali-bus-stand", name: "Phase 3B2 Bus Stand", type: "bus_stop" },
      { id: "mohali-airport", name: "Airport Road", type: "landmark" },
      { id: "mohali-stadium", name: "PCA Stadium", type: "landmark" },
    ]
  },
  {
    id: "jalandhar", 
    name: "Jalandhar",
    type: "city",
    subLocations: [
      { id: "jalandhar-bus-stand", name: "Main Bus Stand", type: "bus_stop" },
      { id: "jalandhar-railway", name: "Railway Station", type: "bus_stop" },
      { id: "jalandhar-devi-talab", name: "Devi Talab Mandir", type: "landmark" },
    ]
  }
];

interface RouteSelectorProps {
  onRouteSearch: (source: string, destination: string) => void;
}

export default function RouteSelector({ onRouteSearch }: RouteSelectorProps) {
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");

  const handleSearch = () => {
    if (source && destination && source !== destination) {
      onRouteSearch(source, destination);
      console.log('Route search:', { source, destination });
    }
  };

  const handleSwapLocations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
    console.log('Locations swapped');
  };

  // Flatten locations for dropdown
  const allLocations = locations.flatMap(city => [
    { id: city.id, name: city.name, type: city.type, parentCity: city.name },
    ...city.subLocations.map(sub => ({
      ...sub,
      parentCity: city.name,
      displayName: `${sub.name} (${city.name})`
    }))
  ]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Search className="w-5 h-5" />
          Find Your Bus Route
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {/* Source Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">From</label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger data-testid="select-source">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="Select departure location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {allLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    <div className="flex items-center gap-2">
                      <span>{'displayName' in location ? location.displayName : location.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {location.type === 'city' ? 'City' : location.type === 'bus_stop' ? 'Bus Stop' : 'Landmark'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwapLocations}
              className="hover-elevate"
              data-testid="button-swap-locations"
            >
              <ArrowRight className="w-4 h-4 rotate-90" />
            </Button>
          </div>

          {/* Destination Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">To</label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger data-testid="select-destination">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-destructive" />
                  <SelectValue placeholder="Select arrival location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {allLocations
                  .filter(loc => loc.id !== source) // Don't show selected source
                  .map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      <div className="flex items-center gap-2">
                        <span>{'displayName' in location ? location.displayName : location.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {location.type === 'city' ? 'City' : location.type === 'bus_stop' ? 'Bus Stop' : 'Landmark'}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <Button 
          className="w-full" 
          onClick={handleSearch}
          disabled={!source || !destination || source === destination}
          data-testid="button-search-routes"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Available Routes
        </Button>

        {/* Quick Route Suggestions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Popular Routes</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { from: "Patiala", to: "Chandigarh" },
              { from: "Chandigarh", to: "Mohali" },
              { from: "Patiala", to: "Jalandhar" }
            ].map((route, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs hover-elevate"
                onClick={() => {
                  setSource("patiala");
                  setDestination("chandigarh");
                  console.log('Quick route selected:', route);
                }}
                data-testid={`button-quick-route-${index}`}
              >
                {route.from} → {route.to}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}