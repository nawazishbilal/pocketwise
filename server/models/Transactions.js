import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        description: {
            type: String,
            max: 1000,
            trim: true,
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        type: {
            type: String,
            enum: ['Expense', 'Income'],
            required: true
        },
        category: {
            type: String,
            enum: ['Needs', 'Wants', 'Misc', 'Other'],
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
)

transactionSchema.index({ userId: 1, date: -1 });

export default Transaction = mongoose.model('Transaction', transactionSchema);