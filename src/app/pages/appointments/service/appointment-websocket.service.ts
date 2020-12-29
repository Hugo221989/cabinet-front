import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MeetingDto } from 'src/app/models/meeting';

declare var SockJS;
declare var Stomp;

@Injectable({
  providedIn: 'root'
})
export class AppointmentWebsocketService {

  constructor(public datepipe: DatePipe,
    private router: Router,
    private _snackBar: MatSnackBar) {
    this.initializeWebSocketConnection();
  }

  public stompClient;
  public msg = [];

  initializeWebSocketConnection() {
    var _self = this;
    const serverUrl = 'http://localhost:8091/appointmentStompEndpoint';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const save = this;
    const update = this;
    this.stompClient.connect({}, function(frame) {
      save.stompClient.subscribe('/save/return', (response) => {
        _self.createStudentMeetingResponse(response);
      });
      update.stompClient.subscribe('/update/return', (response) => {
        _self.updateStudentMeeetingResponse(response);
      });
    });
  }

  createStudentMeeting(appointment: MeetingDto) { 
    this.stompClient.send('/appointment/createStudentAppointment' , {}, JSON.stringify(appointment));
  }

  updateStudentMeeeting(appointment: MeetingDto) { 
    this.stompClient.send('/appointment/updateStudentAppointment' , {}, JSON.stringify(appointment));
  }

  createStudentMeetingResponse(response: any){
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

  updateStudentMeeetingResponse(response: any){
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
    /* if(result){
      setTimeout(() => {
        this.router.navigate([STUDENTS_LIST_PATH])
      }, 2500);
    } */
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
  }

}
