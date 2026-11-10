import mongoose from "mongoose"

const lentSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        lentTo: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0.01
        },
        repaid: {
            type: Boolean,
            required: true,
            default: false
        },
        date: {
            type: Date,
            default: Date.now()
        }
    },
    {
        timestamps: true
    }
)

lentSchema.index({ userID: 1, date: -1 });

export default Lent = mongoose.model("Lent", lentSchema);