import Transaction from "../models/Transactions";

export const addTransaction = async (res, req) => {
    try {
        const { description, amount, type, category, category2, remarks, date } = req.body;

        if (!description || !type || !category || amount == undefined) {
            res.status(400).json({
                message: "Please provide all the information"
            })
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({
                message: 'Invalid transaction type'
            });
        }

        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json({
                message: 'Amount must be greater than zero'
            });
        }

        const transaction = await Transaction.create({
            userId: req.user._id,
            description,
            amount: Number(amount),
            type,
            category,
            ...(date && { date })
        });

        res.status(201).json({
            message: 'Transaction added successfully',
            transaction
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add transaction'
        });
    }
}