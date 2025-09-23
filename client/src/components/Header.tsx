import { Bus, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="w-full border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bus className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-foreground leading-none tracking-tight">
                S<span className="text-primary">P</span>ARTA
              </h1>
              <span className="text-xs text-muted-foreground hidden sm:block leading-none">
                Real-Time Transport Tracking
              </span>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden md:flex" data-testid="button-live-tracking">
              <MapPin className="w-4 h-4 mr-2" />
              Live Tracking
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex" data-testid="button-schedules">
              <Clock className="w-4 h-4 mr-2" />
              Schedules
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}