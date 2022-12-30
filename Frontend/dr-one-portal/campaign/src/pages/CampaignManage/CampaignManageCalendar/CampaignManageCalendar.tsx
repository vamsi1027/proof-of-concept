import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const events = [
  {
    'title': 'All Day Event very long title',
    'allDay': true,
    'start': new Date(2021, 7, 0),
    'end': new Date(2021, 7, 1),
    'color': 'red'
  },
  {
    'title': 'Long Event',
    'start': new Date(2021, 7, 7),
    'end': new Date(2021, 7, 10),
    'color': 'green'
  },

  {
    'title': 'DTS STARTS',
    'start': new Date(2021, 7, 13, 0, 0, 0),
    'end': new Date(2021, 7, 20, 0, 0, 0),
    'color': 'black'
  },

  {
    'title': 'DTS ENDS',
    'start': new Date(2016, 10, 6, 0, 0, 0),
    'end': new Date(2016, 10, 13, 0, 0, 0),
    'color': 'blue'
  },

  {
    'title': 'Some Event',
    'start': new Date(2021, 7, 9, 0, 0, 0),
    'end': new Date(2021, 7, 9, 0, 0, 0),
    'color': 'orange'
  },
  {
    'title': 'Conference',
    'start': new Date(2021, 7, 11),
    'end': new Date(2021, 7, 13),
    desc: 'Big conference for important people',
    'color': 'yellow'
  },
  {
    'title': 'Meeting',
    'start': new Date(2021, 7, 12, 10, 30, 0, 0),
    'end': new Date(2021, 7, 12, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting',
    'color': 'pink'
  },
  {
    'title': 'Lunch',
    'start': new Date(2021, 7, 12, 12, 0, 0, 0),
    'end': new Date(2021, 7, 12, 13, 0, 0, 0),
    desc: 'Power lunch',
    'color': 'gray'
  },
  {
    'title': 'Meeting',
    'start': new Date(2021, 7, 12, 14, 0, 0, 0),
    'end': new Date(2021, 7, 12, 15, 0, 0, 0),
    'color': 'purple'
  },
  {
    'title': 'Happy Hour',
    'start': new Date(2021, 7, 12, 17, 0, 0, 0),
    'end': new Date(2021, 7, 12, 17, 30, 0, 0),
    desc: 'Most important meal of the day',
    'color': 'sky blue'
  },
  {
    'title': 'Dinner',
    'start': new Date(2021, 7, 12, 20, 0, 0, 0),
    'end': new Date(2021, 7, 12, 21, 0, 0, 0),
    'color': 'yellow'
  },
  {
    'title': 'Birthday Party',
    'start': new Date(2021, 7, 13, 7, 0, 0),
    'end': new Date(2021, 7, 13, 10, 30, 0),
    'color': 'orange'
  },
  {
    'title': 'Birthday Party 2',
    'start': new Date(2021, 7, 13, 7, 0, 0),
    'end': new Date(2021, 7, 13, 10, 30, 0),
    'color': 'red'
  },
  {
    'title': 'Birthday Party 3',
    'start': new Date(2021, 7, 13, 7, 0, 0),
    'end': new Date(2021, 7, 13, 10, 30, 0),
    'color': 'pink'
  },
  {
    'title': 'Late Night Event',
    'start': new Date(2021, 7, 17, 19, 30, 0),
    'end': new Date(2015, 3, 18, 2, 0, 0),
    'color': 'black'
  },
  {
    'title': 'Multi-day Event',
    'start': new Date(2021, 7, 20, 19, 30, 0),
    'end': new Date(2021, 7, 22, 2, 0, 0),
    'color': 'green'
  }
]

const eventStyleGetter = (event, start, end, isSelected) => {
  const style = {
    backgroundColor: event.color,
    borderRadius: '0px',
    opacity: 0.8,
    color: 'black',
    border: '0px',
    display: 'block'
  };
  return {
    style: style
  };
}
function CampaignManageCalendar() {
  moment.locale('en-GB');
  const localizer = momentLocalizer(moment);
  let allViews = Object.keys(Views).map(k => Views[k]);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        step={60}
        views={allViews}
        defaultDate={new Date(2021, 7, 1)}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={(eventStyleGetter)}
      />
    </div>
  );
}

export default CampaignManageCalendar;