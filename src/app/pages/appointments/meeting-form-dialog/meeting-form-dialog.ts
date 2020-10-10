import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { StudentDto } from 'src/app/models/student';
import Utils from 'src/app/utils/utils';
import { MeetingDto } from '../../../models/meeting';

@Component({
    selector: 'meeting-form-dialog',
    templateUrl: 'meeting-form-dialog.html',
  })
  export class MeetingFormDialog {
    public meetingDialog: CalendarEvent;
    public refresh: Subject<any> = new Subject();
    public locale: string;
    public start: Date;
    public end: Date;
    public studentList: StudentDto[];
  
    constructor(
      public dialogRef: MatDialogRef<MeetingFormDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
          this.meetingDialog = this.data.meetingEvent;
          this.start = new Date(Utils.createDateFromStringToCalendarFormat(this.meetingDialog.start.toLocaleString()));
          this.end = new Date(Utils.createDateFromStringToCalendarFormat(this.meetingDialog.end.toLocaleString()));
          this.refresh = this.data.refresh;
          this.locale = this.data.locale;
          this.studentList = this.data.studentList;
      }
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    onYesClick(): void {
        this.dialogRef.close(true); 
      }
  
  }