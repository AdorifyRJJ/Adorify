import { HydratedDocument, Types } from "mongoose";
import AdorifySessionModel, { AdorifySession } from "./model";

class AdorifySessionCollection {
  static async addOne(username: string, length: number, spotifyId: string): Promise<HydratedDocument<AdorifySession>> {
    const date = new Date();
    const as = new AdorifySessionModel({
      username: username,
      playlist: spotifyId,
      length: length,
      startTime: date,
      completed: false,
    });
    await as.save();
    return as;
  }

  static async endOne(id: Types.ObjectId | string): Promise<void> {
    const as = await AdorifySessionModel.findOne({_id: id});
    as.completed = true;
    await as.save();
  }
}