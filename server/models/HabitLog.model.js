import mongoose from 'mongoose';

const habitLogSchema = new mongoose.Schema({
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        // Store just the date part, normalized to midnight if needed, 
        // or rely on query ranges. Storing simpler for now.
    },
    status: {
        type: String,
        enum: ['completed', 'missed', 'unmarked'],
        default: 'unmarked'
    }
}, {
    timestamps: true
});

// Compound index to ensure one log per habit per date (if we want to restrict it)
// For now, allowing multiple might be useful if goal > 1, but "checklist" style usually implies binary.
// Let's assume daily checklist for now.
habitLogSchema.index({ habitId: 1, date: 1 });

const HabitLog = mongoose.model('HabitLog', habitLogSchema);

export default HabitLog;
