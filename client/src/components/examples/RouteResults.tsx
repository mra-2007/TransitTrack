import RouteResults from '../RouteResults';

export default function RouteResultsExample() {
  const mockSearchQuery = {
    source: 'patiala',
    destination: 'chandigarh'
  };

  return (
    <RouteResults 
      searchQuery={mockSearchQuery}
      onTrackBus={(routeId) => console.log('Track bus:', routeId)}
      onViewMap={() => console.log('View map clicked')}
    />
  );
}