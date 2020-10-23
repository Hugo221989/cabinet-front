import { Component, OnDestroy, OnInit,  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { StudentDto, StudentListDto, StudentsPage, Filters } from 'src/app/models/student';
import { StudentsService } from '../service/students.service';

const STUDENT_DETAIL_PATH = '/student/detail';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentsComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  public studentList: StudentListDto;
  public displayedColumns: string[] = ['name', 'lastName', 'birth', 'aditionalInfo', 'actions'];
  public dataSource = new MatTableDataSource<StudentDto>();
  public pageSize: number[] = [5];
  private pageSizeSelected: number = 5;
  private currentPage: number = 0;
  public pageIndex: number = 0;
  public textToSearch: string = '';
  public totalLength: number = 0;
  private columnsOrder: string = 'desc';
  private columnName: string = 'usuario';
  public studentPage: StudentsPage;

  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private studentService: StudentsService, private router: Router, public translate: TranslateService) { }

  ngOnInit(): void {
  this.getFiltersFromStorage();
    this.getStudentsPage();
  }

  goToCustomerDetail(student: StudentDto){
    this.setFiltersToStorage();
    this.router.navigate([STUDENT_DETAIL_PATH, student.id])
  }

  getStudentsPage(){
    this.studentService.getStudentPage(this.currentPage, this.pageSizeSelected, this.textToSearch).subscribe( data => { 
      this.studentPage = data;
      this.setTableDataSource();   
    });
  }

  getFiltersFromStorage(){
    if(window.localStorage.getItem("filters")){
      let filters: Filters =  JSON.parse(window.localStorage.getItem("filters"));
      this.currentPage = filters.currentPage;
      this.pageIndex = this.currentPage;
      this.pageSizeSelected = filters.pageSize;
      this.textToSearch = filters.textToSearch;
    }
  }

  setFiltersToStorage(){
    let filters: Filters = {
      currentPage : this.currentPage,
      pageSize : this.pageSizeSelected,
      textToSearch : this.textToSearch
    }
    window.localStorage.setItem("filters", JSON.stringify(filters));
  }

  setTableDataSource(){
    this.dataSource = new MatTableDataSource(this.studentPage.content);
    //this.dataSource.paginator = this.paginator;
    this.totalLength = this.studentPage.totalElements;
  }


  changePage(event) {
    this.pageSizeSelected = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getStudentsPage();
  }

  busquedaOrden(event) {
    this.currentPage = 0;
    if (event.active != null) {
      this.columnsOrder = event.direction;
      this.columnName = event.active;
    }
  }

  filterByName(){
    this.getStudentsPage();
  }

  openDialog(student: StudentDto): void {

    /* const dialogRef = this.dialog.open(ConfirmDialog, {
      //width: '250px',
      data: {name: customer.nombre}
    });

    dialogRef.afterClosed().subscribe(result => {
    }); */
  }

  addNewStudent(){
    this.setFiltersToStorage();
    this.router.navigate([STUDENT_DETAIL_PATH])
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }

  listToPdf(){
    const fileName = `reporte_${Math.random()}.pdf`;
    this.studentService.getPdf().subscribe(response => {
      this.manageExcelFile(response, fileName);
    });
  }

  listToExcel(){
    const fileName = `reporte_${Math.random()}.xlsx`;
    this.studentService.getExcel().subscribe(response => {
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

}
