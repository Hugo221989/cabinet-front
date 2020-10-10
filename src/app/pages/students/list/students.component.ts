import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { StudentDto, StudentListDto, StudentsPage } from 'src/app/models/student';
import { StudentsService } from '../service/students.service';

const STUDENT_DETAIL_PATH = '/student/detail';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentsComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  public studentList: StudentListDto;
  public displayedColumns: string[] = ['name', 'lastName', 'birth', 'aditionalInfo', 'actions'];
  public dataSource = new MatTableDataSource<StudentDto>();
  public pageSize: number[] = [5];
  private pageSizeSelected: number = 5;
  private currentPage: number = 0;
  public totalLength: number = 0;
  private columnsOrder: string = 'desc';
  private columnName: string = 'usuario';
  public studentPage: StudentsPage;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private studentService: StudentsService, private router: Router, public translate: TranslateService) { }

  ngOnInit(): void {
    this.studentService.getStudentPage().subscribe( data => { 
      this.studentPage = data;
      this.setTableDataSource();
    })
  }

  goToCustomerDetail(student: StudentDto){
    this.router.navigate([STUDENT_DETAIL_PATH, student.id])
  }

  setTableDataSource(){
    this.dataSource = new MatTableDataSource(this.studentPage.content);
    this.dataSource.paginator = this.paginator;
  }


  changePage(event) {
    this.pageSizeSelected = event.pageSize;
    this.currentPage = event.pageIndex;
    //this.obtenerTarjetas();
  }

  busquedaOrden(event) {
    this.currentPage = 0;
    if (event.active != null) {
      this.columnsOrder = event.direction;
      this.columnName = event.active;
    }
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
    this.router.navigate([STUDENT_DETAIL_PATH])
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }

}
