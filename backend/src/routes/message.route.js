import express,{Router} from "express";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const messageRouter = express.Router(); 


messageRouter.get("/users",authenticate,getUsersForSidebar);
messageRouter.get("/:id",authenticate,getMessages);
messageRouter.post("/send/:id",authenticate,sendMessage)

export default messageRouter;