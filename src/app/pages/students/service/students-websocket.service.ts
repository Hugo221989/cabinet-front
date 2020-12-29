import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DiagnosisDto, StudentDto } from 'src/app/models/student';
declare var SockJS;
declare var Stomp;
const STUDENTS_LIST_PATH = '/students/list';

@Injectable({
  providedIn: 'root'
})
export class StudentsWebsocketService {

  constructor(public datepipe: DatePipe,
    private router: Router,
    private _snackBar: MatSnackBar) {
    setTimeout(() => {
      this.initializeWebSocketConnection();
    }, 1500);
    
  }

  public stompClient;
  public msg = [];

  initializeWebSocketConnection() {
    var _self = this;

    const serverUrl = 'http://localhost:8090/studentStompEndpoint';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const save = this;
    const update = this;
    this.stompClient.connect({}, function(frame) {
      save.stompClient.subscribe('/save/return', (response) => {
        _self.updateStudentMeetingResponse(response);
      });
      update.stompClient.subscribe('/update/return', (response) => {
        _self.updateStudentMeetingResponse(response);
      });
    });
  }

  createStudent(student: StudentDto) { 
    this.stompClient.send('/student/saveStudentInfo' , {}, JSON.stringify(student));
  }

  updateStudent(student: StudentDto) { 
    this.stompClient.send('/student/updateStudentInfo' , {}, JSON.stringify(student));
  }

/*   createStudentMeetingResponse(response: any){
    if(response != null){
      let appointment: StudentDto = JSON.parse(response);
      console.log("RESPONSE SAVE =>"+appointment);
    }else{
      console.log("NULL STUDENT");
    }
  } */

  updateStudentMeetingResponse(response: any){
    if(response != null){
      let temporalJson:any = JSON.parse(response.body);
      if(temporalJson.id != null && temporalJson.id != 'null'){
        this.getMessageAfterSave(true);
      }else{
        this.getMessageAfterSave(false);
      }
    }else{
      this.getMessageAfterSave(false);
    }
  }

  getMessageAfterSave(result: boolean){
    let message: string = 'Cambios guardados correctamente';
    if(!result)message = 'Error al guardar los datos';
    this.openMessageAfterUpdate(message, '');
    if(result){
      setTimeout(() => {
        this.router.navigate([STUDENTS_LIST_PATH])
      }, 2500);
    }
  }

  openMessageAfterUpdate(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['snackBarStyle']
    });
  }

  /*This method disconnects the WebSocket connection*/
  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected!');
  }

}
