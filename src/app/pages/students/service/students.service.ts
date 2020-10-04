import { HttpClient } from '@angular/common/http';
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
    return this.httpClient.get<any>(`${URL_STUDENT}all`);
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

}
