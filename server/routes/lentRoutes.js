import e from "express";
import protect from "../middleware/authMiddleware.js";
import { createLent, getLent, updateLent, deleteLent } from "../controllers/lentController.js";

const router = e.Router();

router.use(protect);

router.route('/')
    .post(createLent)
    .get(getLent)

router.route('/:id')
    .put(updateLent)
    .delete(deleteLent)

export default router;