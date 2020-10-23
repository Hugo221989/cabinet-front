import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMeetingTableComponent } from './student-meeting-table.component';

describe('StudentMeetingTableComponent', () => {
  let component: StudentMeetingTableComponent;
  let fixture: ComponentFixture<StudentMeetingTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentMeetingTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMeetingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
