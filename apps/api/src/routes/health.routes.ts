import { Request, Response, Router } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
});


export default router;