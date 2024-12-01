const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    }
});

const QuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    options: [OptionSchema],
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    marks: {
        type: Number,
        required: true,
        default: 1
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timeLimit: {
        type: Number,  // in seconds
        default: 60
    },
    tags: [{
        type: String,
        trim: true
    }]
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
QuestionSchema.index({ category: 1, difficulty: 1 });
QuestionSchema.index({ status: 1 });
QuestionSchema.index({ tags: 1 });

// Virtual for getting total attempts
QuestionSchema.virtual('totalAttempts', {
    ref: 'Attempt',
    localField: '_id',
    foreignField: 'questionId',
    count: true
});

module.exports = mongoose.model('Question', QuestionSchema); 