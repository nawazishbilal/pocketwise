import e from "express";
import protect from '../middleware/authMiddleware'
import { addTransaction } from "../controllers/transactionController";

const router = e.Router();

router.use(protect);

router.route('/').post(addTransaction)

export default router;