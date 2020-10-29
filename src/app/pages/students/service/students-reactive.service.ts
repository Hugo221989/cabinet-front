import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentDto, StudentsPage } from 'src/app/models/student';
import { environment } from 'src/environments/environment';

const URL_STUDENT = environment.urlAddress+'info/'

@Injectable({
  providedIn: 'root'
})
export class StudentsReactiveService {

  constructor() { }

  public getStudentList(): Observable<any>{
    return new Observable<any>((observer) => {
      let url = URL_STUDENT+'allList';
      let eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        let json = JSON.parse(event.data);
        let studentDto: StudentDto[] = json;
        observer.next(studentDto);
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

  public getStudentPage(page: number, size: number, textToSearch: string): Observable<any>{
    return new Observable<any>((observer) => {
      let params: string = '?page='+page+'&size='+size+'&textToSearch='+textToSearch;
      let url = URL_STUDENT+'allPage'+params;
      let eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        let studentPage: StudentsPage = this.fillStudentsPage(event);
        observer.next(studentPage);
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

  private fillStudentsPage(event): StudentsPage{
    let json = JSON.parse(event.data);
    let studentPage: StudentsPage = {
      content: json['content'],
      totalElements: json['totalElements']
    }
    return studentPage;
  }

/*   public getStudentData(id: string): Observable<StudentDto>{
    return this.httpClient.get<StudentDto>(`${URL_STUDENT}?id=${id}`);
  } */

}
