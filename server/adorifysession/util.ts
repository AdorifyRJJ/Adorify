import { Playlist } from "../playlist/model";

// export type PlaylistDate = {
//     _id: string,
//     plays: number,
// }

export const generateLast28Days = (tzoffset: number): Array<Date> => {
    const now = new Date();
    const dates = [now];

    const localTime = new Date(now.getTime() - tzoffset*60*1000);
    const startOfDayLocal = new Date(localTime.getTime());
    startOfDayLocal.setUTCHours(0, 0, 0, 0);

    const elapsedTimeLocal = localTime.getTime() - startOfDayLocal.getTime();

    for (let i = 0; i < 29; i++) {
        const begOfDay = new Date(now.getTime());
        begOfDay.setDate(begOfDay.getDate() - i);
        dates.push(new Date(begOfDay.getTime() - elapsedTimeLocal));
    }

    return dates;
}



//helper function to split into week, month, and alltime* arrays