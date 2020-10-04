import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MeetingDto, MeetingListDto } from 'src/app/models/meeting';
import { environment } from 'src/environments/environment';

const URL_STUDENT = environment.urlAddress+'meeting/'

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(private httpClient: HttpClient) { }

  public getAllMeetingsByStudentId(studentId: number): Observable<MeetingListDto>{
    return this.httpClient.get<MeetingListDto>(`${URL_STUDENT}getAllMeetingsByStudentId/?studentId=${studentId}`);
  }

  public getMeetingData(id: number): Observable<MeetingDto>{
    return this.httpClient.get<MeetingDto>(`${URL_STUDENT}?id=${id}`);
  }

  public createStudentMeeting(meeting: MeetingDto): Observable<MeetingDto>{
    return this.httpClient.post<MeetingDto>(`${URL_STUDENT}`, meeting);
  }

  public updateStudentMeeeting(meeting: MeetingDto): Observable<MeetingDto>{
    return this.httpClient.put<MeetingDto>(`${URL_STUDENT}`, meeting);
  }

  public deleteStudentMeeting(idMeeting: number): Observable<MeetingDto>{
    return this.httpClient.delete<MeetingDto>(`${URL_STUDENT}?idMeeting=${idMeeting}`);
  }

  public deleteAllStudentMeetings(idStudent: number): Observable<MeetingDto>{
    return this.httpClient.delete<MeetingDto>(`${URL_STUDENT}?idStudent=${idStudent}`);
  }
  
}
