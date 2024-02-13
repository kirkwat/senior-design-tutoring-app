import { Request, Response } from "express";
import { z } from "zod";
import Tutor from "../models/Tutor";

const newTutorSchema = z.object({
    user_id: z.number(),
    bio: z.string()
});

const handleFindAvailableTutorsByTime = async (req: Request, res: Response) => {
    try{
      const time_req = req.query.time
      var time = 0
      if(time_req){
        time = new Date(time_req.toString()).getTime()
      }
      const tutors = await Tutor.findAvailableTutorsByTime(time)

      if(!tutors) {
        res.json(null)
      } else {
        res.json(tutors)
      }
    } catch(err) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
}

export {handleFindAvailableTutorsByTime}