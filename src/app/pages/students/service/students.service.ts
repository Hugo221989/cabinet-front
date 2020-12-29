import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentDto, StudentListDto, StudentsPage } from 'src/app/models/student';
import { environment } from 'src/environments/environment';

const URL_STUDENT = environment.urlAddress+'user/'

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private httpClient: HttpClient) { }

  public getStudentList(): Observable<any>{
    return this.httpClient.get<any>(`${URL_STUDENT}allList`);
  }

  public getStudentPage(page: number, size: number, textToSearch: string): Observable<any>{
    let params: string = '?page='+page+'&size='+size+'&textToSearch='+textToSearch;
    return this.httpClient.get<any>(`${URL_STUDENT}allPage${params}`);
  }

  public getStudentData(id: string): Observable<StudentDto>{
    return this.httpClient.get<StudentDto>(`${URL_STUDENT}?id=${id}`);
  }

  public getStudentDataByName(name: string): Observable<StudentDto>{
    return this.httpClient.get<StudentDto>(`${URL_STUDENT}byName/?name=${name}`);
  }

  public createStudent(student: StudentDto): Observable<any>{
    return this.httpClient.post<StudentDto>(`${URL_STUDENT}`, student, {observe: 'response'});
  }

  public updateStudent(student: StudentDto): Observable<any>{
    return this.httpClient.put<StudentDto>(`${URL_STUDENT}`, student, {observe: 'response'});
  }

  public deleteStudent(id: number): Observable<StudentDto>{
    return this.httpClient.delete<StudentDto>(`${URL_STUDENT}?id=${id}`);
  }

  public getExcelFromStudent(studentId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.get(`http://localhost:8085/export/getStudentInfoExcel?studentId=1`, { headers, responseType: 'blob' as 'json'});
  }

  public getPdf(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.get(`http://localhost:8085/export/getStudentInfoPdf?studentId=1`, { headers, responseType: 'blob' as 'json'});
  }

}
