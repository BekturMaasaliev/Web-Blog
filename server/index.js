import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import fs from "fs"
import { registerValidation, loginValidation, updateValidation } from "./validations/auth.js"
import  {UserController, PostController} from "./controllers/index.js"
import { postCreateValidation } from "./validations/post.js";
import cors from "cors"
import {handleValidationErrors,chekAuth} from "./utils/index.js"
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(()=> {
    console.log("DB is connected");
})
.catch((err)=> {
    console.log("DB error"+err);
})

const app = express()

const storage = multer.diskStorage({
    destination: (_, file, cb)=> {
        if(!fs.existsSync("uploads")){
            fs.mkdirSync("uploads")
        }
        cb(null, "uploads");
    },
    filename: (_, file, cb)=> {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use("/uploads", express.static("uploads"))

app.post("/auth/login",loginValidation, handleValidationErrors,UserController.login )
app.post("/auth/register",  registerValidation,handleValidationErrors, UserController.register )
app.get("/auth/profile",chekAuth, UserController.getUserInfo)
app.patch("/auth/profile/:id",chekAuth, updateValidation, handleValidationErrors, UserController.update)

app.post("/upload", upload.single("image"),(req,res)=>{
    res.json({
        url:`/uploads/${req.file.originalname}`
    })
})

app.get("/tags",PostController.getLastTags)
app.get("/posts",PostController.getAll)
app.get("/posts/tags",PostController.getLastTags)
app.get("/posts/:id", PostController.getOne)
app.post("/posts", chekAuth, postCreateValidation,handleValidationErrors, PostController.create)
app.delete("/posts/:id", chekAuth, PostController.remove)
app.patch("/posts/:id",chekAuth, postCreateValidation,handleValidationErrors,PostController.update)


app.listen(5000, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log("Server started without problems");
})