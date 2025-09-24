import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Search, Navigation, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock locations data with coordinates for location-based suggestions
const locations = [
  {
    id: "patiala",
    name: "Patiala",
    type: "city",
    coordinates: { lat: 30.3398, lng: 76.3869 },
    subLocations: [
      { id: "patiala-bus-stand", name: "Central Bus Stand", type: "bus_stop", coordinates: { lat: 30.3441, lng: 76.3845 } },
      { id: "patiala-railway", name: "Railway Station", type: "bus_stop", coordinates: { lat: 30.3302, lng: 76.4018 } },
      { id: "patiala-mall", name: "Mall Road", type: "landmark", coordinates: { lat: 30.3398, lng: 76.3869 } },
      { id: "patiala-university", name: "University Gate", type: "landmark", coordinates: { lat: 30.3204, lng: 76.3924 } },
    ]
  },
  {
    id: "chandigarh",
    name: "Chandigarh",
    type: "city",
    coordinates: { lat: 30.7333, lng: 76.7794 },
    subLocations: [
      { id: "chandigarh-sector17", name: "Sector 17 Plaza", type: "bus_stop", coordinates: { lat: 30.7418, lng: 76.7715 } },
      { id: "chandigarh-isbt", name: "ISBT 17", type: "bus_stop", coordinates: { lat: 30.7411, lng: 76.7686 } },
      { id: "chandigarh-sector43", name: "Sector 43 Bus Stand", type: "bus_stop", coordinates: { lat: 30.7185, lng: 76.8103 } },
      { id: "chandigarh-rock-garden", name: "Rock Garden", type: "landmark", coordinates: { lat: 30.7516, lng: 76.8079 } },
    ]
  },
  {
    id: "mohali",
    name: "Mohali",
    type: "city",
    coordinates: { lat: 30.7046, lng: 76.7179 },
    subLocations: [
      { id: "mohali-bus-stand", name: "Phase 3B2 Bus Stand", type: "bus_stop", coordinates: { lat: 30.7046, lng: 76.7179 } },
      { id: "mohali-airport", name: "Airport Road", type: "landmark", coordinates: { lat: 30.6769, lng: 76.6245 } },
      { id: "mohali-stadium", name: "PCA Stadium", type: "landmark", coordinates: { lat: 30.6932, lng: 76.7368 } },
    ]
  },
  {
    id: "jalandhar", 
    name: "Jalandhar",
    type: "city",
    coordinates: { lat: 31.3260, lng: 75.5762 },
    subLocations: [
      { id: "jalandhar-bus-stand", name: "Main Bus Stand", type: "bus_stop", coordinates: { lat: 31.3260, lng: 75.5762 } },
      { id: "jalandhar-railway", name: "Railway Station", type: "bus_stop", coordinates: { lat: 31.3154, lng: 75.5972 } },
      { id: "jalandhar-devi-talab", name: "Devi Talab Mandir", type: "landmark", coordinates: { lat: 31.3162, lng: 75.5851 } },
    ]
  }
];

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

interface RouteSelectorProps {
  onRouteSearch: (source: string, destination: string) => void;
}

export default function RouteSelector({ onRouteSearch }: RouteSelectorProps) {
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearbyStops, setNearbyStops] = useState<any[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Get user's location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        findNearbyBusStops(latitude, longitude);
        setIsLoadingLocation(false);
        console.log('User location detected:', { lat: latitude, lng: longitude });
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location. Please select manually.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. You can enable it in your browser settings or select locations manually below.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please select locations manually.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again or select manually.";
            break;
          default:
            errorMessage = "Unable to retrieve your location. Please select manually.";
        }
        
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Find nearby bus stops based on user location
  const findNearbyBusStops = (userLat: number, userLng: number) => {
    const allBusStops = locations.flatMap(city => 
      city.subLocations
        .filter(sub => sub.type === 'bus_stop' && sub.coordinates)
        .map(stop => ({
          ...stop,
          parentCity: city.name,
          displayName: `${stop.name} (${city.name})`,
          distance: calculateDistance(userLat, userLng, stop.coordinates!.lat, stop.coordinates!.lng)
        }))
    );

    // Sort by distance and get top 5 closest
    const sorted = allBusStops.sort((a, b) => a.distance - b.distance).slice(0, 5);
    setNearbyStops(sorted);
    console.log('Nearby bus stops found:', sorted);
  };

  // Auto-detect location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

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
        {/* Location Services */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Find Nearby Bus Stops</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              data-testid="button-find-nearby"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {isLoadingLocation ? 'Locating...' : 'Use My Location'}
            </Button>
          </div>

          {locationError && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {locationError}
              </AlertDescription>
            </Alert>
          )}

          {nearbyStops.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Nearest bus stops to you:</p>
              <div className="flex flex-wrap gap-2">
                {nearbyStops.map((stop) => (
                  <Button
                    key={stop.id}
                    variant="outline"
                    size="sm"
                    className="text-xs hover-elevate"
                    onClick={() => {
                      setSource(stop.id);
                      console.log('Nearby stop selected:', stop.name);
                    }}
                    data-testid={`button-nearby-${stop.id}`}
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {stop.name} ({stop.distance.toFixed(1)}km)
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

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