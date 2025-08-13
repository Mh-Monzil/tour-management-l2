import { Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);
router.get("/google", async (req: Request, res: Response) => {
  passport.authenticate("google", { scope: ["email", "profile"] })(req, res);
});

router.get("google/callback", AuthControllers.googleCallbackController);

export const AuthRoutes = router;
