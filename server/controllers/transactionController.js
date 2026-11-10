import Transaction from "../models/Transactions.js";

export const addTransaction = async (req, res) => {
    try {
        const { description, amount, type, category, category2, remarks, date } = req.body;

        if (!description || !type || !category || amount == undefined) {
            res.status(400).json({
                message: "Please provide all the information"
            })
        }

        if (!['Income', 'Expense'].includes(type)) {
            return res.status(400).json({
                message: 'Invalid transaction type'
            });
        }

        if(!['Needs', 'Wants', 'Misc', 'Other'].includes(category)){
            return res.status(400).json({
                message: 'Invalid transaction category'
            })
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
            category2,
            remarks,
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
        console.log(error)
    }
}

export const updateTransaction = async (req, res) => {
    try {
        const { description, amount, type, category, category2, remarks, date } = req.body;

        const updates = {}

        if (description !== undefined) {
            if (!description.trim()) {
                return res.status(400).json({
                    message: "Description cannot be empty"
                })
            }
            updates.description = description;
        }

        if (category !== undefined) {
            if (!category.trim()) {
                return res.status(400).json({
                    message: "Category cannot be empty"
                })
            }
            updates.category = category;
        }

        if (category2 !== undefined) {
            updates.category2 = category2;
        }

        if (remarks !== undefined) {
            updates.remarks = remarks;
        }

        if (type !== undefined) {
            if (!['income', 'expense'].includes(type)) {
                return res.status(400).json({
                    message: 'Invalid transaction type'
                });
            }
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

        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id
            },
            {
                $set: updates
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            message: 'Transaction updated successfully',
            transaction
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to update transaction'
        });
    }
}

export const getTransaction = async (req, res) => {
    try {
        const { type, category, startDate, endDate, search, page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(1, Number(page));
        const pageSize = Math.min(50, Math.max(1, Number(limit)));

        if (!Number.isInteger(currentPage) || !Number.isInteger(pageSize)) {
            return res.status(400).json({
                message: 'Invalid pagination parameters'
            });
        }

        const filter = {
            userId: req.user._id
        }

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        if (search && search.trim()) {
            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&'
            );

            filter.description = {
                $regex: escapedSearch,
                $options: 'i'
            };
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

        const totalTransactions = await Transaction.countDocuments(filter);

        const transactions = await Transaction.find(filter)
            .sort({ date: -1, _id: -1 })
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json({
            count: transactions.length,
            totalTransactions,
            currentPage,
            totalPages: Math.ceil(totalTransactions / pageSize),
            transactions
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch transaction'
        });
    }
}

export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            })
        }

        res.status(200).json({
            message: 'Transaction deleted successfully',
        })
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete transaction'
        })
    }
}