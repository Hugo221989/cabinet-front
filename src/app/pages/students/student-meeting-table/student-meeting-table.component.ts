import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CalendarEvent } from 'angular-calendar';
import { Subject, Subscription } from 'rxjs';
import { MeetingsPage, MeetingDto } from 'src/app/models/meeting';
import Utils from 'src/app/utils/utils';
import Helper from '../../appointments/list/appointments-list-helper';
import { AppointmentReactiveService } from '../../appointments/service/appointment-reactive.service';
import { AppointmentWebsocketService } from '../../appointments/service/appointment-websocket.service';
import { AppointmentsService } from '../../appointments/service/appointments.service';
import { MeetingFormDialog } from '../../form-dialog/meeting-form-dialog/meeting-form-dialog';

const STUDENT_DETAIL_PATH = '/student/detail';

@Component({
  selector: 'app-student-meeting-table',
  templateUrl: './student-meeting-table.component.html',
  styleUrls: ['./student-meeting-table.component.scss'],
  providers: [
    DatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentMeetingTableComponent implements OnInit {

  private subscription: Subscription[] = [];
  public displayedColumns: string[] = ['title', 'color', 'start', 'end', 'location', 'actions'];
  public dataSource = new MatTableDataSource<MeetingDto>();
  public pageSize: number[] = [5];
  private pageSizeSelected: number = 5;
  private currentPage: number = 0;
  public pageIndex: number = 0;
  public textToSearch: string = '';
  public totalLength: number = 0;
  private columnsOrder: string = 'desc';
  private columnName: string = 'usuario';
  public meetingsPage: MeetingsPage;
  @Input() studentId: string;
  public locale: string = this.translate.currentLang;

  constructor(private appointmentsService: AppointmentsService, 
    private appointmentReactiveService: AppointmentReactiveService,
    private appointmentWebsocketService: AppointmentWebsocketService,
    private router: Router, 
    private route: ActivatedRoute, 
    public translate: TranslateService, 
    public dialog: MatDialog, 
    private _snackBar: MatSnackBar, 
    public datepipe: DatePipe,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAppointmentsPage();
  }

  getAppointmentsPage(){
    this.appointmentReactiveService.getAllMeetingsByStudentIdPage(this.currentPage, this.pageSizeSelected, this.textToSearch, this.studentId).subscribe( data => { 
      this.meetingsPage = data;
      this.setTableDataSource();   
      this.cdr.detectChanges();
    });
  }

  setTableDataSource(){
    this.dataSource = new MatTableDataSource(this.meetingsPage.content);
    this.totalLength = this.meetingsPage.totalElements;
    //this.cdr.markForCheck();
  }


  changePage(event) {
    this.pageSizeSelected = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAppointmentsPage();
  }

  busquedaOrden(event) {
    this.currentPage = 0;
    if (event.active != null) {
      this.columnsOrder = event.direction;
      this.columnName = event.active;
    }
  }

  filterByName(){
    this.getAppointmentsPage();
  }

  openDialog(student: MeetingDto): void {

    /* const dialogRef = this.dialog.open(ConfirmDialog, {
      //width: '250px',
      data: {name: customer.nombre}
    });

    dialogRef.afterClosed().subscribe(result => {
    }); */
  }

  openMeetingModal(selectedMeeting: MeetingDto){
    //this.cdr.detach();
    let refresh: Subject<any> = new Subject();
    let selectedMeetingCalendarEvent: CalendarEvent = Helper.fillSingleApointmentCalendar(selectedMeeting, null);
    const dialogRef = this.dialog.open(MeetingFormDialog, {
      width: '50%', 
      data: {meetingEvent: selectedMeetingCalendarEvent, refresh: refresh, locale: this.locale, studentList: null} 
    });
    this.cdr.detectChanges();
    console.log("OpenDialog");

    this.subscription.push(dialogRef.afterClosed().subscribe(result => {
      //this.cdr.reattach();
      if(result){
        selectedMeetingCalendarEvent = dialogRef.componentInstance.meetingDialog;
        this.saveEvent(selectedMeetingCalendarEvent);
      }
    }));
  }

  saveEvent(event: any){
    let meeting: MeetingDto = Helper.fillMeetingDto(event, this.datepipe);
    if(meeting.id != null && meeting.id != undefined){console.log("update meeting table");
      this.updateEvent(meeting);
    }else{console.log("save meeting table");
      this.createEvent(meeting);
    }
  }

  updateEvent(appointment: MeetingDto){
    this.appointmentWebsocketService.updateStudentMeeeting(appointment);
  }

  createEvent(appointment: MeetingDto){ 
    this.appointmentWebsocketService.createStudentMeeting(appointment);
  }

  getMessageAfterSave(data: any){
    if(data){
      let status = data.status;
      if(status != 200 && status != 204)this.openMessageAlert('Error al guardar los datos', '');
      else this.openMessageAlert('Cambios guardados correctamente', '');
    }
  }
  
  openMessageAlert(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['snackBarStyle']
    });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.appointmentReactiveService.deleteStudentMeeting(eventToDelete.id).subscribe(data =>{
      this.getMessageAfterDelete(data, eventToDelete);
    },error => this.openMessageAlert('Error al eliminar el evento', ''));
  }

  getMessageAfterDelete(data: any, eventToDelete: CalendarEvent){
    if(data){
      let status = data.status;
      if(status != 200 && status != 204)this.openMessageAlert('Error al eliminar el evento', '');
      else{ 
        this.openMessageAlert('Evento eliminardo correctamente', '');
    }
    }
  }

  addEvent(): void {
    let meeting: MeetingDto = {
      title: '',
      description: '',
      start: '',
      end: '',
      colorPrimary: '',
      colorSecondary: '',
      idStudent: Utils.ConvertStringToNumber(this.studentId),
      location: '',
      mode: false,
    }
    this.openMeetingModal(meeting);
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }
}
