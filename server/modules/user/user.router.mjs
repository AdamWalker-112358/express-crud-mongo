/* 
  if there is an error thrown in the DB, asyncMiddleware
  will pass it to next() and express will handle the error */
import raw from "../../middleware/route.async.wrapper.mjs";
import user_model from "./user.model.mjs";
import express from 'express';
import {userSchema} from './user.validation.mjs';

const router = express.Router();

// parse json req.body on post routes
router.use(express.json())

// CREATES A NEW USER
// router.post("/", async (req, res,next) => {
//    try{
//      const user = await user_model.create(req.body);
//      res.status(200).json(user);
//    }catch(err){
//       next(err)
//    }
// });

// CREATES A NEW USER
router.post("/", raw( async (req, res, next) => {
    const payload = await userSchema.validateAsync(req.body)
    const user = await user_model.create(payload);
    res.status(200).json(user);
}) );


// GET ALL USERS
router.get( "/",raw(async (req, res) => {
    let {page, items} = req.query;
    page = Number(page)
    items = Number(items)
    console.log(!page, !items)
    const users = (!page || !items)
      ? await user_model.find().select(`-_id first_name last_name email phone`)
      : await user_model.find().select(`-_id first_name last_name email phone`).skip(page*10).limit(items)    
    res.status(200).json(users)
  })  
);


// GETS A SINGLE USER
router.get("/:id",raw(async (req, res) => {
    const user = await user_model.findById(req.params.id)
                                    // .select(`-_id 
                                    //     first_name 
                                    //     last_name 
                                    //     email
                                    //     phone`);
    if (!user) return res.status(404).json({ status: "No user found." });
    res.status(200).json(user);
  })
);
// UPDATES A SINGLE USER
router.put("/:id",raw(async (req, res, next) => {
    const payload = await userSchema.validateAsync(req.body)
    const user = await user_model.findByIdAndUpdate(req.params.id, payload, {new: true, upsert: true })
    res.status(200).json(user)
})
);


// DELETES A USER
router.delete("/:id",raw(async (req, res) => {
    const user = await user_model.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).json({ status: "No user found." });
    res.status(200).json(user);
  })
);

export default router;
 