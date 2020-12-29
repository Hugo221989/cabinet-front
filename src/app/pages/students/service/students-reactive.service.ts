import { HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { EventSourcePolyfill } from 'ng-event-source';
import { Observable } from 'rxjs';
import { StudentDto, StudentsPage } from 'src/app/models/student';
import { environment } from 'src/environments/environment';

const URL_STUDENT = environment.urlAddress+'info/'
const URL_EXPORT = environment.urlAddress+'export/'

@Injectable({
  providedIn: 'root'
})
export class StudentsReactiveService {

  constructor(private _zone: NgZone) { }

  public getStudentList(): Observable<any>{
    return new Observable<any>((observer) => {
      let url = URL_STUDENT+'allList';
      let eventSource = new EventSource(url);
      let studentDtoList: StudentDto[] = [];
      eventSource.onmessage = (event) => {
        this._zone.run(() => {
          let studentDto: StudentDto = JSON.parse(event.data);
          studentDtoList.push(studentDto);
          observer.next(studentDtoList);
        });
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

  public getStudentData(id: string): Observable<StudentDto>{
    return new Observable<any>((observer) => {
      let url = URL_STUDENT+'?id='+id;
      let eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        let json = JSON.parse(event.data);
        let studentDto: StudentDto = json;
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
/* 
  public createStudent(student: StudentDto): Observable<any>{
    return this.httpClient.post<StudentDto>(`${URL_STUDENT}`, student, {observe: 'response'});
  }

  public updateStudent(student: StudentDto): Observable<any>{
    return this.httpClient.put<StudentDto>(`${URL_STUDENT}`, student, {observe: 'response'});
  }

  public deleteStudent(id: number): Observable<StudentDto>{
    return this.httpClient.delete<StudentDto>(`${URL_STUDENT}?id=${id}`);
  } */

  public getExcelFromList(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    //return this.httpClient.get(`http://localhost:8087/export/getStudentInfoExcel?studentId=${id}`, { headers, responseType: 'blob' as 'json'});

    return new Observable<any>((observer) => {
      let url = URL_EXPORT+'getStudentListInfoExcel';
      let eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        let json = JSON.parse(event.data);
        let excelData: any = json;
        observer.next(excelData);
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

  public getExcelFromStudent(id: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    //return this.httpClient.get(`http://localhost:8087/export/getStudentInfoExcel?studentId=${id}`, { headers, responseType: 'blob' as 'json'});
    let url = URL_EXPORT+'getStudentInfoExcel?studentId='+id;
    return new Observable<any>((observer) => {
      let eventSource = new EventSourcePolyfill(url, {headers:headers });
      eventSource.onmessage = (event => {
        let json = JSON.parse(event.data);
        let excelData: any = json;
        observer.next(excelData);
      });
      eventSource.onopen = (a) => {
          // Do stuff here
      };
      eventSource.onerror = (error) => {
        if(eventSource.readyState === 0) {
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      }
    });

    /* return new Observable<any>((observer) => {
      let url = URL_EXPORT+'getStudentInfoExcel?studentId='+id;
      let eventSource = new EventSource(url);
      eventSource.onmessage = (event) => {
        let json = JSON.parse(event.data);
        let excelData: any = json;
        observer.next(excelData);
      };
      eventSource.onerror = (error) => {
        if(eventSource.readyState === 0) {
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      }
    }) */
  }
  

}
