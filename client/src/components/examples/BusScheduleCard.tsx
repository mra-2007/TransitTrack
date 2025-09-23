import BusScheduleCard from '../BusScheduleCard';

export default function BusScheduleCardExample() {
  const mockRoute = {
    id: 'route-1',
    name: 'Patiala - Chandigarh Express',
    startLocation: 'Patiala Central Bus Stand',
    endLocation: 'Chandigarh Sector 17',
    busType: 'Deluxe' as const,
    startTime: '07:00',
    endTime: '23:00',
    duration: '2h 30min',
    fare: 85,
    nextDeparture: '14:30',
    status: 'on-time' as const,
    availableSeats: 12
  };

  return (
    <div className="max-w-md">
      <BusScheduleCard 
        route={mockRoute}
        onTrackBus={(routeId) => console.log('Track bus clicked:', routeId)}
        onBookTicket={(routeId) => console.log('Book ticket clicked:', routeId)}
      />
    </div>
  );
}