import { useState } from 'react';
import { Calendar } from '../ui/calendar';

export function EventCalendar({ events, onEventClick }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const eventDates = events.reduce((acc, event) => {
    const date = new Date(event.startDate).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        modifiers={{
          hasEvent: (date) => {
            const dateStr = date.toISOString().split('T')[0];
            return !!eventDates[dateStr];
          }
        }}
        modifiersStyles={{
          hasEvent: { 
            backgroundColor: '#EBF4FF',
            color: '#2563EB',
            fontWeight: 'bold'
          }
        }}
      />
      
      <div className="mt-4 space-y-2">
        {eventDates[selectedDate.toISOString().split('T')[0]]?.map(event => (
          <div
            key={event.id}
            className="p-2 rounded bg-gray-50 hover:bg-gray-100 cursor-pointer"
            onClick={() => onEventClick(event)}
          >
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-gray-500">{event.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 