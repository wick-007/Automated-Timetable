import Calendar from 'react-calendar';

const AnalyticsCalendar = ({ upcomingClasses , setSelectedDay }) => {
    return (
        <div className="upcoming-classes-container">
          <div className="upcoming-classes">
            <h3>Upcoming Classes</h3>
            {upcomingClasses.length ? upcomingClasses.map((entry, index) => (
              <div key={index} className="upcoming-class">
                {entry.entries.map(e => (
                  <div key={e._id}>
                    <p>{e.course.name}</p>
                    <p>{entry.time} - {entry.duration} hour(s)</p>
                    <p>{e.classroom.name}</p>
                  </div>
                ))}
              </div>
            )) : <p>No upcoming classes for today</p>}
          </div>
          
          <div className="calendar-container">
            <h3>Calendar</h3>
            <Calendar
              value={new Date()}
              onClickDay={(value) => setSelectedDay(value.toLocaleDateString('en-US', { weekday: 'long' }))}
            />
          </div>
        </div>
    )
}

export default AnalyticsCalendar;