const express = require('express');
const router = express.Router();
const Question = require('../model/Question');
const { verifyToken, verifyTokenAndCoordinator } = require('./middleware');  // Assuming you have auth middleware

// Create a new question
router.post('/questions', verifyTokenAndCoordinator, async (req, res) => {
    try {
        const {
            title,
            description,
            options,
            difficulty,
            category,
            marks,
            timeLimit,
            tags
        } = req.body;

        // Validate options array
        if (!Array.isArray(options) || options.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'At least 2 options are required'
            });
        }

        // Ensure at least one correct answer exists
        const hasCorrectAnswer = options.some(option => option.isCorrect);
        if (!hasCorrectAnswer) {
            return res.status(400).json({
                success: false,
                message: 'At least one correct answer must be specified'
            });
        }

        const question = new Question({
            title,
            description,
            options,
            difficulty,
            category,
            marks: marks || 1,
            timeLimit: timeLimit || 60,
            tags: tags || [],
            createdBy: req.user.id,
            status: 'active'
        });

        const savedQuestion = await question.save();

        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            data: savedQuestion
        });

    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating question',
            error: error.message
        });
    }
});

// Get all questions with filtering and pagination
router.get('/questions', verifyToken, async (req, res) => {
    try {
        const { 
            difficulty, 
            category, 
            status,
            page = 1, 
            limit = 10 
        } = req.query;

        const query = {};
        if (difficulty) query.difficulty = difficulty;
        if (category) query.category = category;
        if (status) query.status = status;

        const questions = await Question.find(query)
            .populate('createdBy', 'name email')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Question.countDocuments(query);

        res.json({
            success: true,
            data: questions,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching questions',
            error: error.message
        });
    }
});

// Get a specific question by ID
router.get('/questions/:id', verifyToken, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching question',
            error: error.message
        });
    }
});

// Update a question
router.put('/questions/:id', verifyToken, async (req, res) => {
    try {
        const {
            title,
            description,
            options,
            difficulty,
            category,
            marks,
            timeLimit,
            tags,
            status
        } = req.body;

        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check if user is authorized to update
        if (question.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this question'
            });
        }

        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                options,
                difficulty,
                category,
                marks,
                timeLimit,
                tags,
                status
            },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Question updated successfully',
            data: updatedQuestion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating question',
            error: error.message
        });
    }
});

// Delete a question
router.delete('/questions/:id', verifyToken, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check if user is authorized to delete
        if (question.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this question'
            });
        }

        await Question.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting question',
            error: error.message
        });
    }
});

module.exports = router;