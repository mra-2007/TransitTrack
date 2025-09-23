import RouteSelector from '../RouteSelector';

export default function RouteSelectorExample() {
  return (
    <RouteSelector 
      onRouteSearch={(source, destination) => 
        console.log('Route search triggered:', { source, destination })
      } 
    />
  );
}