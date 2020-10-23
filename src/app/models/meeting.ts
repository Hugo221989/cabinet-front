export class MeetingDto {
    id?: number;
    title: string;
    start: string;
    end: string;
    colorPrimary: string;
    colorSecondary: string;
    description?: string;
    location?: string;
    mode?: boolean;
    idStudent?: number;
    studentName?: string;
}

export class MeetingListDto {
    meetingList: MeetingDto[];
}

export class MeetingsPage {
    content: MeetingDto[] = [];
    totalElements: number;
    totalPages: number;
    number: number;
}