import { DatePipe } from '@angular/common';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { MeetingDto, MeetingListDto } from 'src/app/models/meeting';
import Utils from 'src/app/utils/utils';


export default class Helper {
    static fillApointmentsCalendar(meetings: MeetingListDto, appointmentsCalendar: CalendarEvent[], actionsEvent: CalendarEventAction[]){
        for(let meeting of meetings.meetingList){
            let colorEvent: any = {
              "primary": meeting.colorPrimary,
              "secondary": meeting.colorSecondary
            };
            let appointmentCalendar: CalendarEvent<MeetingDto> = {
              id: meeting.id,
              start: new Date(Utils.createDateFromStringToCalendarFormat(meeting.start)),
              end: new Date(Utils.createDateFromStringToCalendarFormat(meeting.end)),
              title: meeting.title,
              color: colorEvent,
              actions: actionsEvent,
              draggable: true, 
              meta: {
                id: meeting.id,
                title: meeting.title,
                description: meeting.description,
                start: meeting.start,
                end: meeting.end,
                colorPrimary: meeting.colorPrimary,
                colorSecondary: meeting.colorSecondary,
                idStudent: meeting.idStudent,
                location: meeting.location
              }
              //meta: meeting.idStudent
            }
            appointmentsCalendar.push(appointmentCalendar);
          }
          return appointmentsCalendar;
    }

    static fillSingleApointmentCalendar(meeting: MeetingDto, actionsEvent: CalendarEventAction[]){
          let colorEvent: any = {
            "primary": meeting.colorPrimary,
            "secondary": meeting.colorSecondary
          };
          let appointmentCalendar = {
            id: meeting.id,
            start: new Date(Utils.createDateFromStringToCalendarFormat(meeting.start)),
            end: new Date(Utils.createDateFromStringToCalendarFormat(meeting.end)),
            title: meeting.title,
            color: colorEvent,
            actions: actionsEvent,
            draggable: true, meta: {
              id: meeting.id,
              title: meeting.title,
              description: meeting.description,
              start: meeting.start,
              end: meeting.end,
              colorPrimary: meeting.colorPrimary,
              colorSecondary: meeting.colorSecondary,
              idStudent: meeting.idStudent,
              location: meeting.location
            }
          }
        return appointmentCalendar;
  }

    static fillMeetingDto(event: any, datepipe: DatePipe){
      let title: string = event.title;
      let titleArray: string[] = title.split(" con ");
      title = titleArray[0];
      let meetingMetaData: MeetingDto = event.meta;
      let meeting: MeetingDto = {
        id: meetingMetaData.id,
        colorPrimary: event.color.primary,
        colorSecondary: event.color.primary,
        start: meetingMetaData.start,//datepipe.transform(meetingMetaData.start, 'dd/MM/yyyy HH:mm'),
        end: meetingMetaData.end,//datepipe.transform(meetingMetaData.end, 'dd/MM/yyyy HH:mm'),
        title: meetingMetaData.title,
        idStudent: meetingMetaData.idStudent,
        description: meetingMetaData.description,
        location: meetingMetaData.location
      }
      return meeting;
    }
    
}