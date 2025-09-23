import LiveMap from '../LiveMap';

export default function LiveMapExample() {
  return (
    <LiveMap 
      selectedRouteId="patiala-chandigarh-deluxe"
      onBackToSearch={() => console.log('Back to search clicked')}
    />
  );
}