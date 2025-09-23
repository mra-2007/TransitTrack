import { useState } from "react";
import Header from "@/components/Header";
import RouteSelector from "@/components/RouteSelector";
import RouteResults from "@/components/RouteResults";
import LiveMap from "@/components/LiveMap";
import Footer from "@/components/Footer";

type ViewState = 'search' | 'results' | 'map';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>('search');
  const [searchQuery, setSearchQuery] = useState<{source: string; destination: string} | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const handleRouteSearch = (source: string, destination: string) => {
    setSearchQuery({ source, destination });
    setCurrentView('results');
    console.log('Route search executed:', { source, destination });
  };

  const handleTrackBus = (routeId: string) => {
    setSelectedRouteId(routeId);
    setCurrentView('map');
    console.log('Track bus:', routeId);
  };

  const handleViewMap = () => {
    setCurrentView('map');
    console.log('View map');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSearchQuery(null);
    setSelectedRouteId(null);
    console.log('Back to search');
  };

  const handleBackToResults = () => {
    setCurrentView('results');
    setSelectedRouteId(null);
    console.log('Back to results');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'search' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                Welcome to <span className="text-primary">Sparta</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Track buses in real-time across Punjab. Get accurate departure times, 
                live locations, and ETA updates for your journey.
              </p>
            </div>
            
            <RouteSelector onRouteSearch={handleRouteSearch} />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Active Routes</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">15</div>
                <div className="text-sm text-muted-foreground">Cities Connected</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">Real-time</div>
                <div className="text-sm text-muted-foreground">Live Updates</div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'results' && searchQuery && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={handleBackToSearch}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-back-to-search"
              >
                ← Back to Search
              </button>
            </div>
            
            <RouteResults 
              searchQuery={searchQuery}
              onTrackBus={handleTrackBus}
              onViewMap={handleViewMap}
            />
          </div>
        )}

        {currentView === 'map' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={searchQuery ? handleBackToResults : handleBackToSearch}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-back-from-map"
              >
                ← {searchQuery ? 'Back to Results' : 'Back to Search'}
              </button>
            </div>
            
            <LiveMap 
              selectedRouteId={selectedRouteId || undefined}
              onBackToSearch={handleBackToSearch}
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}