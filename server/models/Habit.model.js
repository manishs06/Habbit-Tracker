import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a habit title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters'],
        default: ''
    },
    color: {
        type: String,
        default: '#4F46E5'
    },
    icon: {
        type: String,
        default: 'check'
    },
    frequency: {
        type: [String], // Array of days: "Mon", "Tue", etc., or "Daily"
        default: ['Daily']
    },
    goal: {
        type: Number, // e.g., 1 time per day
        default: 1
    },
    reminderTime: {
        type: String, // HH:MM format
        default: ''
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    totalCompletions: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;
