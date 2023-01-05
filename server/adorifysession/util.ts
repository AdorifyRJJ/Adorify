import { Playlist } from "../playlist/model";

// export type PlaylistDate = {
//     _id: string,
//     plays: number,
// }

export const generateLast28Days = (tzoffset: number): Array<Date> => {
    const today = new Date();
    const dates = [today]; // this return is never used
    console.log(today)
    for (let i = 0; i < 29; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setTime(date.getTime() + tzoffset*60*1000)
        if (0 === 1) console.log("yo", date)
        dates.push(date)
    }
    return dates;
}



//helper function to split into week, month, and alltime* arrays