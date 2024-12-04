const express = require('express');
const router = express.Router();
const Programme = require('../model/Programme');
const Session = require('../model/Session');
const Quiz = require('../model/Quiz');
const { verifyToken } = require('./middleware');

router.post('/start-quiz', verifyToken, async (req, res) => {
  const { programme, semester, session } = req.body;

  try {
    // Find the programme
    const programmeDoc = await Programme.findOne({ name: programme });
    if (!programmeDoc) {
      return res.status(404).json({ success: false, message: 'Programme not found.' });
    }

    // Find the session
    const sessionDoc = await Session.findOne({ name: session });
    if (!sessionDoc) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    // Find the quiz based on programme, semester, and session
    const quiz = await Quiz.findOne({
      programme: programmeDoc._id,
      semester: semester,
      session: sessionDoc._id
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found for selected options.' });
    }

    // Return the quiz data
    res.json({ success: true, quiz: quiz });
  } catch (error) {
    console.error(error);   
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
