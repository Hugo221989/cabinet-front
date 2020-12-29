import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-meeting-dialog',
  templateUrl: './delete-meeting-dialog.component.html'
})
export class DeleteMeetingDialogComponent implements OnInit {

  constructor(public translate: TranslateService,
    public dialogRef: MatDialogRef<DeleteMeetingDialogComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
      this.dialogRef.close(true); 
  }

}
