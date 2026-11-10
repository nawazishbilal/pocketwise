import Lent from "../models/Lent"

export const createLent = async (req, res) => {
    try {
        const {lentTo, amount, repaid, date} = req.body;

        if(!lentTo || amount == undefined) {
            res.status(400).json({
                message: "Please provide all the information"
            })
        }

        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json({
                message: 'Amount must be greater than zero'
            });
        }

        const lent = await Lent.create({
            userID: req.user._id,
            lentTo,
            amount: Number(amount),
            ...(repaid !== undefined && { repaid }),
            ...(date && { date })
        })

        res.status(201).json({
            message: 'Lending added successfully',
            transaction
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to add lending'
        });
    }
}