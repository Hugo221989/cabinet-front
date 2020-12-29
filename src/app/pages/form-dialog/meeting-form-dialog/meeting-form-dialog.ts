import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { StudentDto } from 'src/app/models/student';
import Utils from 'src/app/utils/utils';

@Component({
    selector: 'meeting-form-dialog',
    templateUrl: 'meeting-form-dialog.html',
  })
  export class MeetingFormDialog implements OnInit{
    public meetingDialogRecieved: CalendarEvent;
    public meetingDialog: CalendarEvent;
    public refresh: Subject<any> = new Subject();
    public locale: string;
    public start: Date = new Date();
    public end: Date = new Date();
    public studentList: StudentDto[];
  
    constructor(
      public translate: TranslateService,
      public dialogRef: MatDialogRef<MeetingFormDialog>,
      public datepipe: DatePipe,
      @Inject(MAT_DIALOG_DATA) public data: any) {
          this.initializeMeetingDialog();
          this.fillMeetingDialog(data);
      }

      ngOnInit(){
        
      }

      initializeMeetingDialog(){
        this.meetingDialog = {
          title: '',
          start: new Date(),
          end: new Date(),
          color: {
            "primary": "#000000",
            "secondary": "#000000"
          },
          meta: {
            id: 0,
            title: '',
            start: '',
            end: '',
            colorPrimary: '#000000',
            colorSecondary: '#000000',
            description: '',
            location: '',
            mode: false,
            idStudent: 1,
            studentName: '',
          }
        }
      }

      fillMeetingDialog(data: any){
        this.meetingDialogRecieved = data.meetingEvent;
        if(this.meetingDialogRecieved.meta.id != null)
          this.meetingDialog.meta.id = this.meetingDialogRecieved.meta.id;
        if(this.meetingDialogRecieved.meta.title != null)
          this.meetingDialog.meta.title = this.meetingDialogRecieved.meta.title;
        if(this.meetingDialogRecieved.meta.description != null)
          this.meetingDialog.meta.description = this.meetingDialogRecieved.meta.description;
        if(this.meetingDialogRecieved.meta.location != null)
          this.meetingDialog.meta.location = this.meetingDialogRecieved.meta.location;
        if(this.meetingDialogRecieved.meta.idStudent != null)
          this.meetingDialog.meta.idStudent = this.meetingDialogRecieved.meta.idStudent;
        if(this.meetingDialogRecieved.start != null){
          let startDate = this.datepipe.transform(this.meetingDialogRecieved.start, 'dd/MM/yyyy HH:mm');
          this.meetingDialog.start = new Date(Utils.createDateFromStringToCalendarFormat(startDate.toLocaleString()));
        }
        if(this.meetingDialogRecieved.end != null){
          let endDate = this.datepipe.transform(this.meetingDialogRecieved.end, 'dd/MM/yyyy HH:mm');
          this.meetingDialog.end = new Date(Utils.createDateFromStringToCalendarFormat(endDate.toLocaleString()));
        }
        if(this.meetingDialogRecieved.color.primary != null)
          this.meetingDialog.color.primary = this.meetingDialogRecieved.color.primary;
        if(this.meetingDialogRecieved.color.secondary != null)
          this.meetingDialog.color.secondary = this.meetingDialogRecieved.color.secondary;
        this.refresh = data.refresh;
        this.locale = data.locale;
        this.studentList = data.studentList;
      }
    
      onNoClick(): void {
        this.dialogRef.close();
      }

      onYesClick(): void {
          this.meetingDialog.color.primary = this.meetingDialogRecieved.color.primary;
          this.dialogRef.close(true); 
      }
  }