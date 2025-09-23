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
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Bus className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Sparta</h1>
            <span className="text-sm text-muted-foreground hidden sm:block">Real-Time Transport</span>
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