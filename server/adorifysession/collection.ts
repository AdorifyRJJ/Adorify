import { HydratedDocument, Types } from "mongoose";
import AdorifySessionModel, { AdorifySession } from "./model";
import { StudyDate, PlaylistDate } from './util';

class AdorifySessionCollection {
  static async addOne(username: string, length: number, spotifyId: string): Promise<HydratedDocument<AdorifySession>> {
    const date = new Date();
    const as = new AdorifySessionModel({
      username: username,
      spotifyPlaylistId: spotifyId,
      length: length,
      startTime: date,
      completed: false,
    });
    await as.save();
    return as;
  }

  static async endOne(id: Types.ObjectId | string): Promise<void> {
    const as = await AdorifySessionModel.findOne({ _id: id });
    as.completed = true;
    await as.save();
  }
  
  //function f to get stats for a user for the past time period

  //these functions return raw data and are processed/organized in the router.


  static async getTotalTimeByUsername(username: string): Promise<number> {
    //return f (time, alltime)
  }

  static async getTotalCompletedByUsername(username: string): Promise<number> {
    //return f (completed, alltime)
  }

  static async getTotalSessionsByUsername(username: string): Promise<number> {
    //return f (sessions, alltime)
  }

  static async getMostPlayedByUsername(username: string): Promise<{ week: Array<PlaylistDate>, month: Array<PlaylistDate>, allTime: Array<PlaylistDate> }> {
    //find in as model by username, filter by date.
    //call helper function to split into week, month, and alltime* arrays
    //sum up as sessions and combine per playlist
    //filter to most played and convert to playlist date

  }

  static async getStudyTimeByUsername(username: string): Promise<{ week: Array<StudyDate>, month: Array<StudyDate>, allTime: Array<StudyDate> }> {
    //find in as model by username, filter by date.
    //call helper function to split into week, month, and alltime* arrays
    //combine and convert to studydate
  }

  static async getTopTenUsers(): Promise<{ week: Array<string>, month: Array<string>, allTime: Array<string> }> {
    //split into week, month, and alltime* arrays
    //for all users, their stat is f(stat, time interval). compute this and return.
  }

  static async getRankingByUsername(username: string): Promise<{ week: number, month: number, allTime: number }> {
    //find in as model by username
    //call help function to split into week month and alltime* arrays
    //
  }


}

export default AdorifySessionCollection;