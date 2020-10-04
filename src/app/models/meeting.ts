export class MeetingDto {
    id: number;
    name: string;
    date: Date;
    reason: string;
    mode: boolean;
    idStudent: number;
}

export class MeetingListDto {
    meetingList: MeetingDto;
}