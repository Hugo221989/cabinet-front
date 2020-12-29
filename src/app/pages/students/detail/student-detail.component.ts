import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DiagnosisDto, StudentDto } from 'src/app/models/student';
import { StudentsService } from '../service/students.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Utils from 'src/app/utils/utils';
import { StudentMeetingTableComponent } from '../student-meeting-table/student-meeting-table.component';
import { StudentsReactiveService } from '../service/students-reactive.service';
import { StudentsWebsocketService } from '../service/students-websocket.service';

const STUDENTS_LIST_PATH = '/students/list';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDetailComponent implements OnInit {

  public studentDataForm: FormGroup;
  public diagnosisDataForm: FormGroup;
  public studentId: string;
  public studentData: StudentDto;
  public studentName: string;
  public birthPickerField = new FormControl(new Date());
  public diagnosisData: DiagnosisDto;
  public isNewStudent: boolean = false;
  public progress: any = {};
  
  //@ViewChild(StudentMeetingTableComponent, {static: true}) meetingTable: StudentMeetingTableComponent;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentsService,
    private studentReactiveService: StudentsReactiveService,
    private studentWebsocketService: StudentsWebsocketService,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initStudentForm();
    this.initDiagnosisForm();
    this.getUrlParams();
    // Init Progress WebSocket.
    this.initProgressWebSocket();
  }
  private initProgressWebSocket = () => {

  }

  /**
   * Apply result of the java server notification to the view.
   */
  private onNewProgressMsg = receivedMsg => {
    if (receivedMsg.type === 'SUCCESS') {
      this.progress = receivedMsg.message;
    }
  }

  initStudentForm(){
    this.studentDataForm = this.fb.group({
      'name': new FormControl(''),
      'lastName': new FormControl(''),
      'birth': new FormControl(''),
      'aditionalInfo': new FormControl('')
    })
  }

  initDiagnosisForm(){
    this.diagnosisDataForm = this.fb.group({
      'title': new FormControl(''),
      'description': new FormControl('')
    })
  }

  getUrlParams(){
    this.studentId = this.route.snapshot.paramMap.get("id");
    if(null != this.studentId && this.studentId != "")
      this.getStudentData();
    else
      this.initNewStudent();
  }

  initNewStudent(){
    this.isNewStudent = true;
    this.diagnosisData = {
      title: '',
      description: ''
    }
    this.studentData = {
      name: '',
      lastName: '',
      birth: new Date(),
      aditionalInfo: '',
      diagnosis: this.diagnosisData
    }
    this.setStudentForm();
  }

  getStudentData(){
    this.isNewStudent = false;
    this.studentReactiveService.getStudentData(this.studentId).subscribe( data =>{
      this.studentData = data;
      this.setStudentForm();
      this.cdr.detectChanges();
    })
  }

  setStudentForm(){
    this.studentName = this.studentData.name+" "+this.studentData.lastName;
    this.studentDataForm.controls['name'].setValue(this.studentData.name);
    this.studentDataForm.controls['lastName'].setValue(this.studentData.lastName);
    this.studentDataForm.controls['birth'].setValue(this.studentData.birth);
    let nacimiento = this.studentData.birth;
    if(nacimiento)
        this.birthPickerField.setValue(Utils.createDateFromString(nacimiento.toLocaleString()));
    else
      this.birthPickerField.setValue(null);
    this.studentDataForm.controls['aditionalInfo'].setValue(this.studentData.aditionalInfo);
    if(this.studentData.diagnosis){
      this.diagnosisData = this.studentData.diagnosis
      this.setDiagnosisForm(this.diagnosisData);
    }
  }

  setDiagnosisForm(diagnosis: DiagnosisDto){
    this.diagnosisDataForm.controls['title'].setValue(diagnosis.title);
    this.diagnosisDataForm.controls['description'].setValue(diagnosis.description);
  }

  updateStudentData(){
    this.fillStudentData();
    this.fillDiagnosisData();
    this.saveUpdatedStudent();
  }

  fillStudentData(){
    this.studentData.name = this.studentDataForm.value.name;
    this.studentData.lastName = this.studentDataForm.value.lastName;
    let birthWithoutFormat = this.birthPickerField.value;
    this.studentData.birth = birthWithoutFormat.toLocaleDateString();
    this.studentData.aditionalInfo = this.studentDataForm.value.aditionalInfo;
  }

  fillDiagnosisData(){
    this.diagnosisData.title = this.diagnosisDataForm.value.title;
    this.diagnosisData.description = this.diagnosisDataForm.value.description;
  }

  saveUpdatedStudent(){
    this.studentWebsocketService.updateStudent(this.studentData);
  }

  saveStudentData(){
    this.fillStudentData();
    this.fillDiagnosisData();
    this.saveNewStudent();
  }

  saveNewStudent(){
    this.studentWebsocketService.createStudent(this.studentData);
  }

  getMessageAfterSave(data: any){
    if(data){
      let status = data.status;
      if(status != 200 && status != 204)this.openMessageAfterUpdate('Error al guardar los datos', '');
      else this.openMessageAfterUpdate('Cambios guardados correctamente', '');
      setTimeout(() => {
        this.router.navigate([STUDENTS_LIST_PATH])
      }, 2000);
    }
  }

  openMessageAfterUpdate(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['snackBarStyle']
    });
  }

  studentToExcel(){
    const fileName = `reporte_${Math.random()}.xlsx`; 
    this.studentService.getExcelFromStudent(this.studentId).subscribe(response => {
      this.manageExcelFile(response, fileName);
    });
  }

  manageExcelFile(response: any, fileName: string): void {
    const dataType = response.type;
    const binaryData = [];
    binaryData.push(response);

    const filtePath = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
    const downloadLink = document.createElement('a');
    downloadLink.href = filtePath;
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  listToPdf(){
    
  }
  
}
