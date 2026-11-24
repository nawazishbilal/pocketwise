import Lent from "../models/Lent.js"

export const createLent = async (req, res) => {
    try {
        const { lentTo, amount, repaid, date } = req.body;

        if (!lentTo || amount == undefined) {
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
            lent
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to add lending'
        });
    }
}

export const updateLent = async (req, res) => {
    try {
        const { lentTo, amount, repaid, date } = req.body;

        const updates = {}

        if (lentTo !== undefined) {
            if (!lentTo.trim()) {
                return res.status(400).json({
                    message: "Person name cannot be empty"
                })
            }

            updates.lentTo = lentTo;
        }

        if (amount !== undefined) {
            if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
                return res.status(400).json({
                    message: 'Amount must be greater than zero'
                });
            }

            updates.amount = amount;
        }

        if (date !== undefined) {
            const parsedDate = new Date(date);

            if (Number.isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    message: 'Invalid date'
                });
            }

            updates.date = parsedDate;
        }

        if (repaid !== undefined) {
            updates.repaid = repaid;
        }

        const lent = await Lent.findOneAndUpdate(
            {
                _id: req.params.id,
                userID: req.user._id
            },
            {
                $set: updates
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!lent) {
            return res.status(404).json({
                message: 'Lending record not found'
            });
        }

        res.status(200).json({
            message: 'Lending record updated successfully',
            lent
        })


    } catch (error) {
        res.status(500).json({
            message: 'Failed to update lending record'
        })
    }
}

export const getLent = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const filter = {
            userID: req.user._id
        }

        if (startDate || endDate) {
            filter.date = {};

            if (startDate) {
                const start = new Date(`${startDate}T00:00:00.000Z`);

                if (Number.isNaN(start.getTime())) {
                    return res.status(400).json({
                        message: 'Invalid start date'
                    });
                }

                filter.date.$gte = start;
            }

            if (endDate) {
                const end = new Date(`${endDate}T00:00:00.000Z`);

                if (Number.isNaN(end.getTime())) {
                    return res.status(400).json({
                        message: 'Invalid end date'
                    });
                }

                end.setUTCDate(end.getUTCDate() + 1);

                filter.date.$lt = end;
            }

            if (
                filter.date.$gte &&
                filter.date.$lt &&
                filter.date.$gte >= filter.date.$lt
            ) {
                return res.status(400).json({
                    message: 'Start date must be before or equal to end date'
                });
            }
        }

        const lents = await Lent.find(filter)
            .sort({ date: -1, _id: - 1 });

        res.status(200).json({
            lents
        })
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch lendings'
        });
    }
}

export const deleteLent = async (req, res) => {
    try {
        
        const lent = await Lent.findOneAndDelete({
            _id: req.params.id,
            userID: req.user._id
        })

        if (!lent) {
            return res.status(404).json({
                message: 'Lending record not found'
            })
        }

        res.status(200).json({
            message: 'Lending record deleted successfully',
        })
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete lending record'
        })
    }
}