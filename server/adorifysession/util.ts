import { Playlist } from "../playlist/model";

// export type PlaylistDate = {
//     _id: string,
//     plays: number,
// }

export const generateLast28Days = (tzoffset: number): Array<Date> => {
    // const today = new Date();
    // const dates = [today]; // this return is never used

    // const localTime = new Date(today.getTime() - tzoffset*60*1000);
    // console.log(today.getDate(), localTime.getDate())

    // const dayoffset = today.getDate() === localTime.getDate() ? 0 : 1;

    // for (let i = 0; i < 29; i++) {
    //     const date = new Date();
    //     date.setDate(date.getDate() - i - dayoffset)
    //     date.setHours(0);
    //     date.setMinutes(0);
    //     date.setSeconds(0);
    //     date.setMilliseconds(0);
    //     date.setTime(date.getTime() + tzoffset*60*1000)
    //     dates.push(date)
    // }
    // return dates;

    const now = new Date();
    const dates = [now];

    const localTime = new Date(now.getTime() - tzoffset*60*1000);
    const startOfDayLocal = new Date(localTime.getTime());
    startOfDayLocal.setUTCHours(0, 0, 0, 0);

    console.log(localTime, startOfDayLocal)
    const elapsedTimeLocal = localTime.getTime() - startOfDayLocal.getTime();
    console.log(elapsedTimeLocal / 1000 / 60);

    for (let i = 0; i < 29; i++) {
        const begOfDay = new Date(now.getTime());
        begOfDay.setDate(begOfDay.getDate() - i);
        console.log(new Date(begOfDay.getTime() - elapsedTimeLocal))
        dates.push(new Date(begOfDay.getTime() - elapsedTimeLocal));
    }

    return dates;
}



//helper function to split into week, month, and alltime* arrays