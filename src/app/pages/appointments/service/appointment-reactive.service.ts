import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MeetingDto, MeetingsPage } from 'src/app/models/meeting';

const URL_APPOINTMENTS = environment.urlAddressAppointments+'appointment/';
const URL_APPOINTMENTS_HANDLER = environment.urlHandler;

@Injectable({
  providedIn: 'root'
})
export class AppointmentReactiveService {

  private meetingWatchSource = new BehaviorSubject(new MeetingDto());
  _meetingsWatchSource: Observable<MeetingDto> = this.meetingWatchSource.asObservable();

  constructor(private zone: NgZone) { 
    this.getAllMeetings().subscribe(data => {
      this.meetingWatchSource.next(data);
    }, error => console.log('Error: ' + error),
    () => console.log('done loading team stream'));
  }

  public getAllMeetings(): Observable<any>{console.log("Se llama getAllMeetings service");
    return new Observable<any>((observer) => {
      //let url = URL_APPOINTMENTS+'getAllAppointments';
      let url = `${URL_APPOINTMENTS_HANDLER}all`; 
      let eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        let json = JSON.parse(event.data);
        let appointmentDto: MeetingDto = json;
        this.zone.run(() =>observer.next(appointmentDto));
      };
      eventSource.onerror = (error) => {
        if(eventSource.readyState === 0) {
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      }
    })
  }

  public getAllMeetingsByStudentId(studentId: number): Observable<any>{
    return new Observable<any>((observer) => {
      let url = `${URL_APPOINTMENTS}getAllMeetingsByStudentId/?studentId=${studentId}`;
      let eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        let json = JSON.parse(event.data);
        let appointmentDto: MeetingDto = json;
        observer.next(appointmentDto);
      };
      eventSource.onerror = (error) => {
        if(eventSource.readyState === 0) {
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      }
    })
  }

  public getAllMeetingsByStudentIdPage(page: number, size: number, textToSearch: string, studentId: string): Observable<any>{
    return new Observable<any>((observer) => {
      let params: string = '?page='+page+'&size='+size+'&textToSearch='+textToSearch+'&studentId='+studentId;
      let url = `${URL_APPOINTMENTS}getAppointmentsByStudentIdPage${params}`;
      let eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        let appointmentPage: MeetingsPage = this.fillAppointmentsPage(event);
        observer.next(appointmentPage);
      };
      eventSource.onerror = (error) => {
        if(eventSource.readyState === 0) {
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      }
    })
  }

  private fillAppointmentsPage(event): MeetingsPage{
    let json = JSON.parse(event.data);
    let appointmentPage: MeetingsPage = {
      content: json['content'],
      totalElements: json['totalElements']
    }
    return appointmentPage;
  }

  public getMeetingData(id: string): Observable<MeetingDto>{
    return new Observable<any>((observer) => {
      let url = URL_APPOINTMENTS+'?id='+id;
      let eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        let json = JSON.parse(event.data);
        let appointmentDto: MeetingDto = json;
        observer.next(appointmentDto);
      };
      eventSource.onerror = (error) => {
        if(eventSource.readyState === 0) {
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      }
    })
  }

  public deleteStudentMeeting(idAppointment: any): Observable<any>{
    return new Observable<any>((observer) => {
      let url = `${URL_APPOINTMENTS_HANDLER}remove/${idAppointment}`; 
      let eventSource = new EventSource(url);
      //eventSource.addEventListener("message", event => console.log("DELETE RESPONSE: "+event));
      eventSource.onmessage = (event) => {console.log("Delete Response: "+event);
        let json = JSON.parse(event.data);
        let appointmentDto: MeetingDto = json;
        this.zone.run(() =>observer.next(appointmentDto));
      };
      eventSource.onerror = (error) => {
        if(eventSource.readyState === 0) {
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error!!!!!!!!!: ' + error.type);
        }
      }
    })
  }

}
