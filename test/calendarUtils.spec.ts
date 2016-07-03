import {expect} from 'chai';
import * as sinon from 'sinon';
import * as moment from 'moment';
import {getWeekViewHeader, getWeekView, WeekDay, CalendarEvent, WeekViewEventRow} from './../src/calendarUtils';

const TIMEZONE_OFFSET: number = new Date().getTimezoneOffset() * 60 * 1000;

describe('getWeekViewHeader', () => {

  let clock: any;
  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date('2016-06-28').getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it('get all days of the week for the given date', () => {
    const days: WeekDay[] = getWeekViewHeader({
      viewDate: new Date('2016-06-28')
    });
    days.forEach((day: any) => {
      day.timestamp = day.date.valueOf();
      delete day.date;
    });

    expect(days).to.deep.equal([{
      timestamp: new Date('2016-06-26').getTime() + TIMEZONE_OFFSET,
      isPast: true,
      isToday: false,
      isFuture: false,
      isWeekend: true
    }, {
      timestamp: new Date('2016-06-27').getTime() + TIMEZONE_OFFSET,
      isPast: true,
      isToday: false,
      isFuture: false,
      isWeekend: false
    }, {
      timestamp: new Date('2016-06-28').getTime() + TIMEZONE_OFFSET,
      isPast: false,
      isToday: true,
      isFuture: false,
      isWeekend: false
    }, {
      timestamp: new Date('2016-06-29').getTime() + TIMEZONE_OFFSET,
      isPast: false,
      isToday: false,
      isFuture: true,
      isWeekend: false
    }, {
      timestamp: new Date('2016-06-30').getTime() + TIMEZONE_OFFSET,
      isPast: false,
      isToday: false,
      isFuture: true,
      isWeekend: false
    }, {
      timestamp: new Date('2016-07-01').getTime() + TIMEZONE_OFFSET,
      isPast: false,
      isToday: false,
      isFuture: true,
      isWeekend: false
    }, {
      timestamp: new Date('2016-07-02').getTime() + TIMEZONE_OFFSET,
      isPast: false,
      isToday: false,
      isFuture: true,
      isWeekend: true
    }]);

  });

});

describe('getWeekView', () => {

  it('should get the correct span, offset and extends values for events that start within the week', () => {

    const events: CalendarEvent[] = [{
      start: new Date('2016-06-27'),
      end: new Date('2016-06-29'),
      title: '',
      color: {primary: '', secondary: ''}
    }];

    const result: WeekViewEventRow[] = getWeekView({events, viewDate: new Date('2016-06-27')});
    expect(result).to.deep.equal([{
      row: [{
        event: events[0],
        offset: 1,
        span: 3,
        extendsLeft: false,
        extendsRight: false
      }]
    }]);

  });

  it('should get the correct span, offset and extends values for events that start before the week and end within it', () => {

    const events: CalendarEvent[] = [{
      start: new Date('2016-06-24'),
      end: new Date('2016-06-29'),
      title: '',
      color: {primary: '', secondary: ''}
    }];

    const result: WeekViewEventRow[] = getWeekView({events, viewDate: new Date('2016-06-27')});
    expect(result).to.deep.equal([{
      row: [{
        event: events[0],
        offset: 0,
        span: 4,
        extendsLeft: true,
        extendsRight: false
      }]
    }]);

  });

  it('should get the correct span, offset and extends values for events that start within the week and end after it', () => {

    const events: CalendarEvent[] = [{
      start: new Date('2016-06-27'),
      end: new Date('2016-07-10'),
      title: '',
      color: {primary: '', secondary: ''}
    }];

    const result: WeekViewEventRow[] = getWeekView({events, viewDate: new Date('2016-06-27')});
    expect(result).to.deep.equal([{
      row: [{
        event: events[0],
        offset: 1,
        span: 6,
        extendsLeft: false,
        extendsRight: true
      }]
    }]);

  });

  it('should get the correct span, offset and extends values for events that start before the week and end after it', () => {

    const events: CalendarEvent[] = [{
      start: new Date('2016-06-24'),
      end: new Date('2016-07-10'),
      title: '',
      color: {primary: '', secondary: ''}
    }];

    const result: WeekViewEventRow[] = getWeekView({events, viewDate: new Date('2016-06-27')});
    expect(result).to.deep.equal([{
      row: [{
        event: events[0],
        offset: 0,
        span: 7,
        extendsLeft: true,
        extendsRight: true
      }]
    }]);

  });

  // bit of a crappy test, could probably be done with breaking down into smaller parts
  it('should bucket sort all events', () => {

    const events: CalendarEvent[] = [{ // 0
      start: moment().startOf('week').add(4, 'days').toDate(),
      end: moment().startOf('week').add(5, 'days').toDate(),
      title: 'A final event',
      color: {primary: '', secondary: ''}
    }, { // 1
      start: moment().startOf('week').add(1, 'minutes').add(4, 'days').toDate(),
      end: moment().startOf('week').add(5, 'days').toDate(),
      title: 'A final event',
      color: {primary: '', secondary: ''}
    }, { // 2
      start: moment().startOf('week').add(2, 'minutes').add(4, 'days').toDate(),
      end: moment().startOf('week').add(5, 'days').toDate(),
      title: 'A final event',
      color: {primary: '', secondary: ''}
    }, { // 3
      start: moment().startOf('week').add(6, 'days').toDate(),
      end: moment().startOf('week').add(7, 'days').toDate(),
      title: 'I should be last',
      color: {primary: '', secondary: ''}
    }, { // 4
      start: moment().startOf('week').add(1, 'minutes').add(6, 'days').toDate(),
      end: moment().startOf('week').add(7, 'days').toDate(),
      title: 'I should be last',
      color: {primary: '', secondary: ''}
    }, { // 5
      start: moment().startOf('week').add(2, 'minutes').add(6, 'days').toDate(),
      end: moment().startOf('week').add(7, 'days').toDate(),
      title: 'I should be last',
      color: {primary: '', secondary: ''}
    }, { // 6
      start: moment().startOf('week').add(3, 'minutes').add(6, 'days').toDate(),
      end: moment().startOf('week').add(7, 'days').toDate(),
      title: 'I should be last',
      color: {primary: '', secondary: ''}
    }, { // 7
      start: moment().startOf('week').toDate(),
      end: moment().startOf('week').add(5, 'days').toDate(),
      title: 'Another event',
      color: {primary: '', secondary: ''}
    }, { // 8
      start: moment().startOf('week').add(1, 'minutes').toDate(),
      end: moment().startOf('week').add(5, 'days').toDate(),
      title: 'Another event',
      color: {primary: '', secondary: ''}
    }, { // 9
      start: moment().startOf('week').subtract(3, 'days').toDate(),
      end: moment().endOf('week').add(3, 'days').toDate(),
      title: 'My event',
      color: {primary: '', secondary: ''}
    }, { // 10
      start: moment().startOf('week').add(1, 'days').toDate(),
      end: moment().startOf('week').add(3, 'days').toDate(),
      title: '3 day event',
      color: {primary: '', secondary: ''}
    }, { // 11
      start: moment().startOf('week').add(1, 'days').toDate(),
      end: moment().startOf('week').add(2, 'days').toDate(),
      title: '2 day event',
      color: {primary: '', secondary: ''}
    }];

    for (let i: number = 0; i < 7; i++) {
      for (let j: number = 0; j < 5; j++) {
        events.push({
          start: moment().startOf('week').add(j, 'minutes').add(i, 'days').toDate(),
          title: `Event column ${i} count ${j}`,
          color: {primary: '', secondary: ''}
        });
      }
    }

    const result: WeekViewEventRow[] = getWeekView({events, viewDate: new Date()});

    expect(result.length).to.equal(11);

    expect(result[0].row.length).to.equal(1);
    expect(result[0].row[0].event).to.equal(events[9]);

    expect(result[1].row.length).to.equal(2);
    expect(result[1].row[0].event).to.equal(events[7]);
    expect(result[1].row[1].event).to.equal(events[3]);

    expect(result[2].row.length).to.equal(4);
    expect(result[2].row[0].event).to.equal(events[12]);
    expect(result[2].row[1].event).to.equal(events[10]);
    expect(result[2].row[2].event).to.equal(events[0]);
    expect(result[2].row[3].event).to.equal(events[42]);

    expect(result[3].row.length).to.equal(2);
    expect(result[3].row[0].event).to.equal(events[8]);
    expect(result[3].row[1].event).to.equal(events[4]);

    expect(result[4].row.length).to.equal(6);
    expect(result[4].row[0].event).to.equal(events[13]);
    expect(result[4].row[1].event).to.equal(events[11]);
    expect(result[4].row[2].event).to.equal(events[27]);
    expect(result[4].row[3].event).to.equal(events[32]);
    expect(result[4].row[4].event).to.equal(events[37]);
    expect(result[4].row[5].event).to.equal(events[43]);

    expect(result[5].row.length).to.equal(6);
    expect(result[5].row[0].event).to.equal(events[14]);
    expect(result[5].row[1].event).to.equal(events[17]);
    expect(result[5].row[2].event).to.equal(events[22]);
    expect(result[5].row[3].event).to.equal(events[28]);
    expect(result[5].row[4].event).to.equal(events[1]);
    expect(result[5].row[5].event).to.equal(events[5]);

    expect(result[6].row.length).to.equal(7);
    expect(result[6].row[0].event).to.equal(events[15]);
    expect(result[6].row[1].event).to.equal(events[18]);
    expect(result[6].row[2].event).to.equal(events[23]);
    expect(result[6].row[3].event).to.equal(events[29]);
    expect(result[6].row[4].event).to.equal(events[33]);
    expect(result[6].row[5].event).to.equal(events[38]);
    expect(result[6].row[6].event).to.equal(events[44]);

    expect(result[7].row.length).to.equal(6);
    expect(result[7].row[0].event).to.equal(events[16]);
    expect(result[7].row[1].event).to.equal(events[19]);
    expect(result[7].row[2].event).to.equal(events[24]);
    expect(result[7].row[3].event).to.equal(events[30]);
    expect(result[7].row[4].event).to.equal(events[2]);
    expect(result[7].row[5].event).to.equal(events[6]);

    expect(result[8].row.length).to.equal(6);
    expect(result[8].row[0].event).to.equal(events[20]);
    expect(result[8].row[1].event).to.equal(events[25]);
    expect(result[8].row[2].event).to.equal(events[31]);
    expect(result[8].row[3].event).to.equal(events[34]);
    expect(result[8].row[4].event).to.equal(events[39]);
    expect(result[8].row[5].event).to.equal(events[45]);

    expect(result[9].row.length).to.equal(5);
    expect(result[9].row[0].event).to.equal(events[21]);
    expect(result[9].row[1].event).to.equal(events[26]);
    expect(result[9].row[2].event).to.equal(events[35]);
    expect(result[9].row[3].event).to.equal(events[40]);
    expect(result[9].row[4].event).to.equal(events[46]);

    expect(result[10].row.length).to.equal(2);
    expect(result[10].row[0].event).to.equal(events[36]);
    expect(result[10].row[1].event).to.equal(events[41]);

  });

  it('should exclude any events that dont occur in the event period', () => {

    const events: CalendarEvent[] = [{
      start: new Date('2016-06-24'),
      end: new Date('2016-05-25'),
      title: '',
      color: {primary: '', secondary: ''}
    }];

    const result: WeekViewEventRow[] = getWeekView({events, viewDate: new Date('2016-06-27')});
    expect(result).to.deep.equal([]);

  });

  it('should exclude any events without an end date that dont occur in the event period', () => {

    const events: CalendarEvent[] = [{
      start: new Date('2016-06-24'),
      title: '',
      color: {primary: '', secondary: ''}
    }];

    const result: WeekViewEventRow[] = getWeekView({events, viewDate: new Date('2016-06-27')});
    expect(result).to.deep.equal([]);

  });

  it('should include events that start on the beginning on the week', () => {
    const events: CalendarEvent[] = [{
      start: moment(new Date('2016-06-27')).startOf('week').toDate(),
      end: new Date('2016-08-01'),
      title: '',
      color: {primary: '', secondary: ''}
    }];
    const result: WeekViewEventRow[] = getWeekView({events, viewDate: new Date('2016-06-27')});
    expect(result[0].row[0].event).to.deep.equal(events[0]);
  });

  it('should include events that end the end end of the week', () => {
    const events: CalendarEvent[] = [{
      start: new Date('2016-04-01'),
      end: moment(new Date('2016-06-27')).endOf('week').toDate(),
      title: '',
      color: {primary: '', secondary: ''}
    }];
    const result: WeekViewEventRow[] = getWeekView({events, viewDate: new Date('2016-06-27')});
    expect(result[0].row[0].event).to.deep.equal(events[0]);
  });

});
