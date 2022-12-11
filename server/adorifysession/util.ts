export type StudyDate = {
    date: Date,
    studyTime: number,
}

export type PlaylistDate = {
    _id: string,
    plays: number,
}

export enum Stats {
    TIME = "Time",
    SESSION = "Sessions",
    COMPLETED = "Completed",
}

export enum Period {
    WEEK = "Week",
    MONTH = "Month",
    ALLTIME = "AllTime",
}

export const generateLast30Days = (): Array<Date> => {
    const today = new Date();
    const dates = [today];
    for (let i = 0; i < 29; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        dates.push(date)
    }
    return dates;
}



//helper function to split into week, month, and alltime* arrays