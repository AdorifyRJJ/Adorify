import { HydratedDocument, Types } from "mongoose";
import AdorifySessionModel, { AdorifySession } from "./model";
import { PlaylistDate, generateLast30Days } from './util';

class AdorifySessionCollection {

  static async testAddOne(username: string, length: number, spotifyId: string, startTime: Date, completed: number, initializedSessions: number): Promise<HydratedDocument<AdorifySession>> {
    const as = new AdorifySessionModel({
      username: "jztubaman",
      spotifyPlaylistId: "2E97C5dfeyPyCgTr6ntCpA",
      length: length,
      startTime: startTime,
      completed: completed,
      initializedSessions: initializedSessions,
    });
    await as.save();
    return as;
  }

  static async addOne(username: string, length: number, spotifyId: string, initializedSessions: number): Promise<HydratedDocument<AdorifySession>> {
    const date = new Date();
    const as = new AdorifySessionModel({
      username: username,
      spotifyPlaylistId: spotifyId,
      length: length,
      startTime: date,
      completed: 0,
      initializedSessions: initializedSessions,
    });
    await as.save();
    return as;
  }

  static async endOne(id: Types.ObjectId | string): Promise<void> {
    const as = await AdorifySessionModel.findOne({ _id: id });
    as.completed = as.completed + 1;
    await as.save();
  }

  static async getTotalTimeByUsername(username: string): Promise<number> {
    return (await AdorifySessionModel.aggregate([
      {
        $match: { username: username, completed: { $gte: 0 } }
      },
      {
        $project: { username: 1, total: { $multiply: ["$length", "$completed"] } }
      },
      {
        $group: { _id: "$username", totalTime: { $sum: "$total" } }
      }
    ]))[0]?.totalTime;
  }

  static async getTotalCompletedByUsername(username: string): Promise<number> {
    return (await AdorifySessionModel.aggregate([
      {
        $match: { username: username, completed: { $gte: 0 } }
      },
      {
        $group: { _id: "$username", totalCompleted: { $sum: "$completed" } }
      }
    ]))[0]?.totalCompleted;
  }

  static async getTotalSessionsByUsername(username: string): Promise<number> {
    return (await AdorifySessionModel.aggregate([
      {
        $match: { username: username }
      },
      {
        $group: { _id: "$username", totalSessions: { $sum: "$initializedSessions" } }
      }
    ]))[0]?.totalSessions;
  }

  static async getMostPlayedByUsername(username: string): Promise<{ week: Array<PlaylistDate>, month: Array<PlaylistDate>/*, allTime: Array<PlaylistDate>*/ }> {
    //find in as model by username, filter by date.
    //call helper function to split into week, month, and alltime* arrays
    //sum up as sessions and combine per playlist
    //filter to most played and convert to playlist date

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const mostPlayedWeek = (await AdorifySessionModel.aggregate([
      {
        $match: { username: username, startTime: { $gte: lastWeek } }
      },
      {
        $group: { _id: "$spotifyPlaylistId", plays: { $sum: "$completed" } }
      },
      {
        $sort: { plays: -1 }
      }
    ]))?.slice(0, 10);

    const mostPlayedMonth = (await AdorifySessionModel.aggregate([
      {
        $match: { username: username, startTime: { $gte: lastMonth } }
      },
      {
        $group: { _id: "$spotifyPlaylistId", plays: { $sum: "$completed" } }
      },
      {
        $sort: { plays: -1 }
      }
    ]))?.slice(0, 10);

    // const mostPlayedAll = (await AdorifySessionModel.aggregate([
    //   {
    //     $match: { username: username }
    //   },
    //   {
    //     $group: { _id: "$spotifyPlaylistId", plays: { $sum: "$completed" } }
    //   },
    //   {
    //     $sort: { plays: -1 }
    //   }
    // ]))?.slice(0, 10);

    return {
      week: mostPlayedWeek,
      month: mostPlayedMonth,
      //allTime: mostPlayedAll,
    }


  }

  static async getRanking(username: string): Promise<{ topUsers: { week: Array<string>, month: Array<string>, allTime: Array<string> }, userRank: { week: number, month: number, allTime: number } }> {
    //split into week, month, and alltime* arrays
    //for all users, their stat is f(stat, time interval). compute this and return.
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const findUser = (obj: { _id: string, focusTime: number }) => username === obj._id;

    const leaderboardWeek = (await AdorifySessionModel.aggregate([
      {
        $match: { startTime: { $gte: lastWeek } }
      },
      {
        $project: { username: 1, time: { $multiply: ["$length", "$completed"] }, data: 1 }
      },
      {
        $group: { _id: "$username", focusTime: { $sum: "$time" } }
      },
      {
        $sort: { focusTime: -1 }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "username",
          as: "fromItems"
        }
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$fromItems", 0] }, "$$ROOT"] } }
      },
      {
        $project: { fromItems: 0 }
      },
      {
        $project: { displayName: 1, imgURL: 1, focusTime: 1 }
      }

    ]))

    const leaderboardMonth = (await AdorifySessionModel.aggregate([
      {
        $match: { startTime: { $gte: lastMonth } }
      },
      {
        $project: { username: 1, imgURL: 1, time: { $multiply: ["$length", "$completed"] } }
      },
      {
        $group: { _id: "$username", focusTime: { $sum: "$time" } }
      },
      {
        $sort: { focusTime: -1 }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "username",
          as: "fromItems"
        }
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$fromItems", 0] }, "$$ROOT"] } }
      },
      {
        $project: { fromItems: 0 }
      },
      {
        $project: { displayName: 1, imgURL: 1, focusTime: 1 }
      }
    ]))

    const leaderboardAll = (await AdorifySessionModel.aggregate([
      {
        $project: { username: 1, imgURL: 1, time: { $multiply: ["$length", "$completed"] } }
      },
      {
        $group: { _id: "$username", focusTime: { $sum: "$time" } }
      },
      {
        $sort: { focusTime: -1 }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "username",
          as: "fromItems"
        }
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$fromItems", 0] }, "$$ROOT"] } }
      },
      {
        $project: { fromItems: 0 }
      },
      {
        $project: { displayName: 1, imgURL: 1, focusTime: 1 }
      }
    ]))

    const userWeekRank = leaderboardWeek?.findIndex(findUser)
    const userMonthRank = leaderboardMonth?.findIndex(findUser)
    const userAllRank = leaderboardAll?.findIndex(findUser)

    const finalLeaderboardWeek = leaderboardWeek?.splice(0, 10)
    const finalLeaderboardMonth = leaderboardMonth?.splice(0, 10)
    const finalLeaderboardAll = leaderboardAll?.splice(0, 10)

    return {
      topUsers: {
        week: finalLeaderboardWeek,
        month: finalLeaderboardMonth,
        allTime: finalLeaderboardAll
      }, userRank: {
        week: userWeekRank,
        month: userMonthRank,
        allTime: userAllRank
      }
    }


  }

  static async getStudyTimeByUsername(username: string): Promise<Array<[string, unknown]>> {
    //find in as model by username, filter by date.
    //call helper function to split into week, month, and alltime* arrays
    //combine and convert to studydate
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const daysLastMonth = [...generateLast30Days()];

    const studyTimeMonth = (await AdorifySessionModel.aggregate([
      {
        $match: { username: username, startTime: { $gte: lastMonth } }
      },
      {
        $group: {
          _id: "$username",
          "0": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[1]]
                },
                {
                  $multiply: ["$length", "$completed"]
                },
                0
              ]
            },
          },
          "1": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[2]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[1]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "2": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[3]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[2]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "3": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[4]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[3]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "4": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[5]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[4]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "5": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[6]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[5]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "6": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[7]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[6]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "7": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[8]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[7]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "8": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[9]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[8]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "9": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[10]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[9]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "10": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[11]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[10]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "11": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[12]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[11]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "12": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[13]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[12]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "13": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[14]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[13]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "14": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[15]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[14]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "15": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[16]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[15]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "16": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[17]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[16]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "17": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[18]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[17]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "18": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[19]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[18]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "19": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[20]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[19]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "20": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[21]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[20]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "21": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[22]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[21]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "22": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[23]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[22]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "23": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[24]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[23]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "24": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[25]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[24]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "25": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[26]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[25]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "26": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[27]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[26]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "27": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[28]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[27]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
          "28": {
            $sum: {
              $cond: [
                {
                  $gt: ["$startTime", daysLastMonth[29]]
                },
                {
                  $cond: [
                    {
                      $lt: ["$startTime", daysLastMonth[28]]
                    },
                    {
                      $multiply: ["$length", "$completed"]
                    },
                    0
                  ]
                },
                0
              ]
            },
          },
        }
      },
    ]));

    if (studyTimeMonth[0]) {
      return [...Object.entries(studyTimeMonth[0])].splice(0, 28).reverse();
    }
    return []


  }

}

export default AdorifySessionCollection;