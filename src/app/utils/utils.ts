import { parse } from 'date-fns';

export default class Utils {
    static createDateFromString(dateString: string){
        const dateArray = dateString.split("/");
        const year = dateArray[2];
        const month = dateArray[1];
        const day = dateArray[0];
        return new Date(year+'-'+month+'-'+day);
      }

      static createDateFromStringToCalendarFormat(dateString: string){
        let date: Date = parse(dateString, 'dd/MM/yyyy HH:mm', new Date());
        return date;
      }

      static getHourToCalendar(dateString: string){
        const dateArray = dateString.split(" ");
        const hourPart = dateArray[1];
        return hourPart;
      }

      static ConvertStringToNumber(input: string) { 
    
        if (!input) return NaN;
    
        if (input.trim().length==0) { 
            return NaN;
        }
        return Number(input);
    }
}