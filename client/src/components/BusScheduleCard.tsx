import { Clock, MapPin, Bus, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BusScheduleCardProps {
  route: {
    id: string;
    name: string;
    startLocation: string;
    endLocation: string;
    busType: 'Ordinary' | 'Deluxe';
    startTime: string;
    endTime: string;
    duration: string;
    fare: number;
    nextDeparture: string;
    status: 'on-time' | 'delayed' | 'cancelled';
    availableSeats?: number;
  };
  onTrackBus: (routeId: string) => void;
  onBookTicket?: (routeId: string) => void;
}

export default function BusScheduleCard({ route, onTrackBus, onBookTicket }: BusScheduleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-green-600';
      case 'delayed': return 'bg-yellow-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-time': return 'On Time';
      case 'delayed': return 'Delayed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="w-full hover-elevate transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground">{route.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{route.startLocation}</span>
              <span>→</span>
              <span>{route.endLocation}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={route.busType === 'Deluxe' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {route.busType === 'Deluxe' && <Zap className="w-3 h-3 mr-1" />}
              {route.busType}
            </Badge>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(route.status)}`} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Timing Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Service Hours</div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Clock className="w-4 h-4 text-primary" />
              {route.startTime} - {route.endTime}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Duration</div>
            <div className="text-sm font-medium">{route.duration}</div>
          </div>
        </div>

        {/* Next Departure */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Next Departure</span>
            <span className="text-sm font-bold text-primary">{route.nextDeparture}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={route.status === 'on-time' ? 'default' : 'destructive'} className="text-xs">
              {getStatusText(route.status)}
            </Badge>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-primary">₹{route.fare}</span>
            {route.availableSeats && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {route.availableSeats} seats
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTrackBus(route.id)}
              data-testid={`button-track-${route.id}`}
            >
              <Bus className="w-4 h-4 mr-1" />
              Track Live
            </Button>
            {onBookTicket && route.status !== 'cancelled' && (
              <Button 
                size="sm"
                onClick={() => onBookTicket(route.id)}
                data-testid={`button-book-${route.id}`}
              >
                Book Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}