import express from "express";

// Routes
import authRouter from "./auth";
import userRouter from "./user";

const router = express.Router();

router.get("/healthcheck", (_, res) => res.sendStatus(200));

router.use(userRouter);
router.use(authRouter);

export default router;
