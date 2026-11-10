import e from "express";
import protect from '../middleware/authMiddleware.js'
import { addTransaction, getTransaction, updateTransaction, deleteTransaction } from "../controllers/transactionController.js";

const router = e.Router();

router.use(protect);

router.route('/')
    .post(addTransaction)
    .get(getTransaction)

router.route('/:id')
    .put(updateTransaction)
    .delete(deleteTransaction)

export default router;