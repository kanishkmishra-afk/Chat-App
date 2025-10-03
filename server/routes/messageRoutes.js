import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import { getAllUsersForSidebar, getMessage, markMessageSeen, sendMessage } from "../controller/messageController.js";

const messageRouter=express.Router()

messageRouter.get("/users",protectRoute,getAllUsersForSidebar)
messageRouter.get("/:id",protectRoute,getMessage)
messageRouter.put("/mark/:id",protectRoute,markMessageSeen)
messageRouter.post("/send/:id",protectRoute,sendMessage)

export default messageRouter