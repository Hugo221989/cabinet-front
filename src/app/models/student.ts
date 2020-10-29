export class DiagnosisDto {
    id?: number;
    title: string;
    description: string;
}

export class StudentDto {
    id?: number;
    name: string;
    lastName: string;
    birth: Date;
    aditionalInfo: string;
    diagnosis: DiagnosisDto;
}

export class StudentsPage {
    content: StudentDto[] = [];
    totalElements: number;
    totalPages?: number;
    number?: number;
    numberOfElements?: number;
}

export class Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export class StudentListDto {
    studentList: StudentDto[];
}

export class Filters {
    currentPage: number;
    pageSize: number;
    textToSearch: string;
}