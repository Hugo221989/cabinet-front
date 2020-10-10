import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MeetingDto, MeetingListDto } from 'src/app/models/meeting';
import { environment } from 'src/environments/environment';

const URL_MEETING = environment.urlAddress+'appointment/'

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(private httpClient: HttpClient) { }

  public getAllMeetings(): Observable<MeetingListDto>{
    return this.httpClient.get<MeetingListDto>(`${URL_MEETING}getAllMeetings/`);
  }

  public getAllMeetingsByStudentId(studentId: number): Observable<MeetingListDto>{
    return this.httpClient.get<MeetingListDto>(`${URL_MEETING}getAllMeetingsByStudentId/?studentId=${studentId}`);
  }

  public getMeetingData(id: number): Observable<MeetingDto>{
    return this.httpClient.get<MeetingDto>(`${URL_MEETING}?id=${id}`);
  }

  public createStudentMeeting(meeting: MeetingDto): Observable<any>{
    return this.httpClient.post<MeetingDto>(`${URL_MEETING}`, meeting, {observe: 'response'});
  }

  public updateStudentMeeeting(meeting: MeetingDto): Observable<any>{
    return this.httpClient.put<MeetingDto>(`${URL_MEETING}`, meeting, {observe: 'response'});
  }

  public deleteStudentMeeting(idMeeting: any): Observable<any>{
    return this.httpClient.delete<any>(`${URL_MEETING}?idMeeting=${idMeeting}`, {observe: 'response'});
  }

  public deleteAllStudentMeetings(idStudent: number): Observable<any>{
    return this.httpClient.delete<any>(`${URL_MEETING}?idStudent=${idStudent}`, {observe: 'response'});
  }
  
}
