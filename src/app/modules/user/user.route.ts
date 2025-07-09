import { Router } from "express";
import { UserController } from "./tour.controller";

const router = Router();

router.post("/register", UserController.createUser);

export const UserRoutes = router;
