import { Component, ViewChild, TemplateRef, OnInit, OnDestroy} from '@angular/core';
import { startOfDay, endOfDay,isSameDay, isSameMonth,} from 'date-fns';
import { Observable, Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarDateFormatter, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarEventTitleFormatter, CalendarView,} from 'angular-calendar';
import { TranslateService } from '@ngx-translate/core';
import { CustomDateFormatter } from '../custom-date-formatter/custom-date-formatter.provider';
import { Spanish } from "flatpickr/dist/l10n/es.js"
import flatpickr from 'flatpickr';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { SettingsState } from 'src/app/settings/settings.models';
import { selectSettingsCurrentLanguage } from 'src/app/settings/settings.selectors';
import { AppointmentsService } from '../service/appointments.service';
import { MeetingDto, MeetingListDto } from 'src/app/models/meeting';
import Helper from './appointments-list-helper';
import { CustomEventTitleFormatter } from '../custom-title-formatter/custom-title-formatter-provider';
import { StudentsService } from '../../students/service/students.service';
import { StudentDto } from 'src/app/models/student';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MeetingFormDialog } from '../meeting-form-dialog/meeting-form-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },{
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
    DatePipe
  ]
})
export class AppointmentsListComponent implements OnInit, OnDestroy {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();
  public locale: string = this.translate.currentLang;
  private currentLanguageOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  public loadingView = false;
  public appointmentsCalendar: CalendarEvent[];
  public studentList: StudentDto[];
  studentSelected: any;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.appointmentsCalendar = this.appointmentsCalendar.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;

  ngOnInit(){
    flatpickrFactory();
    this.setLanguageSelected();
    this.getAllApointments();
    this.getAllStudents();
  }

  constructor(public translate: TranslateService, 
              private modal: NgbModal,
              private store: Store<{settings: SettingsState}>,
              private router: Router,
              private appointmentsService: AppointmentsService,
              private studentsService: StudentsService,
              private _snackBar: MatSnackBar,
              public datepipe: DatePipe,
              public dialog: MatDialog) {}

  getAllApointments() {
    this.appointmentsService.getAllMeetings().subscribe( data => {
      this.appointmentsCalendar = [];
      this.fillApointmentsCalendar(data);
    })
  }
  
  fillApointmentsCalendar(meetings: MeetingListDto){
    this.appointmentsCalendar = Helper.fillApointmentsCalendar(meetings, this.appointmentsCalendar, this.actions);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {console.log("dayClicked");
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.appointmentsCalendar = this.appointmentsCalendar.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);console.log("eventTimesChanged");
  }

  handleEvent(action: string, event: CalendarEvent): void {console.log("handleEvent: ",event);
    /* this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' }); */
    this.openMeetingModal(event);
  }

  addEvent(): void {
    this.appointmentsCalendar = [
      ...this.appointmentsCalendar,
      {
        title: '',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: {
          "primary": "#000000",
          "secondary": "#000000"
        },
        draggable: true,
        actions: this.actions,
        meta: ''
      },
    ];
  }

  saveEvent(event: any){
    let meeting: MeetingDto = Helper.fillMeetingDto(event, this.datepipe);
    if(meeting.id != null && meeting.id != undefined){
      this.updateEvent(meeting);
    }else{
      this.createEvent(meeting);
    }
  }

  updateEvent(meeting: MeetingDto){
    this.appointmentsService.updateStudentMeeeting(meeting).subscribe(data =>{
      this.getMessageAfterSave(data);
    },error => this.openMessageAlert('Error al actualizar el evento', ''));
  }

  createEvent(meeting: MeetingDto){ 
    this.appointmentsService.createStudentMeeting(meeting).subscribe(data =>{
      this.getMessageAfterSave(data);
    },error => this.openMessageAlert('Error al crear el evento', ''));
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
    this.appointmentsService.deleteStudentMeeting(eventToDelete.id).subscribe(data =>{
      this.getMessageAfterDelete(data, eventToDelete);
    },error => this.openMessageAlert('Error al eliminar el evento', ''));
  }

  getMessageAfterDelete(data: any, eventToDelete: CalendarEvent){
    if(data){
      let status = data.status;
      if(status != 200 && status != 204)this.openMessageAlert('Error al eliminar el evento', '');
      else{ 
        this.openMessageAlert('Evento eliminardo correctamente', '');
        this.appointmentsCalendar = this.appointmentsCalendar.filter((event) => event !== eventToDelete);
    }
    }
  }

  setView(view: CalendarView) {
    this.view = view;
    this.loadingView = true;
    setTimeout(() => {
      this.loadingView = false;
    }, 1000);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  openMeetingModal(selectedMeetingCalendarEvent: CalendarEvent){
    window.localStorage.setItem("initialMeetingEvent", JSON.stringify(selectedMeetingCalendarEvent));
    const dialogRef = this.dialog.open(MeetingFormDialog, {
      width: '50%', 
      data: {meetingEvent: selectedMeetingCalendarEvent, refresh: this.refresh, local: this.locale, studentList: this.studentList} 
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        selectedMeetingCalendarEvent = dialogRef.componentInstance.meetingDialog;
        this.saveEvent(selectedMeetingCalendarEvent);
      }else{
        this.retrieveMeetingEventInitialValue(selectedMeetingCalendarEvent);
      }
    });
  }

  retrieveMeetingEventInitialValue(selectedMeetingCalendarEvent: CalendarEvent){
    if(window.localStorage.getItem("initialMeetingEvent")){
      selectedMeetingCalendarEvent = this.getMeetingEventFromLocalStorage(selectedMeetingCalendarEvent);

      this.appointmentsCalendar = this.appointmentsCalendar.map((iEvent) => {
        if (iEvent.id === selectedMeetingCalendarEvent.id) {
          return {
            ...selectedMeetingCalendarEvent,
            color: selectedMeetingCalendarEvent.color
          };
        }
        return iEvent;
      });
    }
  }

  getMeetingEventFromLocalStorage(selectedMeetingCalendarEvent: CalendarEvent){
    selectedMeetingCalendarEvent = JSON.parse(window.localStorage.getItem("initialMeetingEvent"));
    selectedMeetingCalendarEvent.start = new Date(selectedMeetingCalendarEvent.start);
    selectedMeetingCalendarEvent.end = new Date(selectedMeetingCalendarEvent.end);
    return selectedMeetingCalendarEvent;
  }

  setLanguageSelected(){
    this.currentLanguageOvservable$ = this.store.pipe(select(selectSettingsCurrentLanguage)); 
    this.subscription.push(this.currentLanguageOvservable$.subscribe( (language) => {
      if(language != null || language != ''){
        this.locale = language;
      }
    }))
  }

  getAllStudents(){
    this.studentsService.getStudentList().subscribe( data => {
      this.studentList = data.studentList;
    })
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }

}
export function flatpickrFactory() {
  flatpickr.localize(Spanish);
  flatpickr.l10ns.default.firstDayOfWeek = 1;
  return flatpickr;
}