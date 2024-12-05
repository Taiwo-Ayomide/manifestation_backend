// // models/Question.js
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Define the Question schema
// const questionSchema = new Schema({
//   questionText: {
//     type: String,
//     required: true,
//   },
//   options: {
//     type: [String], // An array of possible answers
//     required: true,
//   },
//   correctAnswer: {
//     type: String,
//     required: true,
//   },
//   programme: {
//     type: Schema.Types.ObjectId,
//     ref: 'Programme', // Reference to the Programme model
//     required: true,
//   },
//   semester: {
//     type: String, // First, Second, Third, etc.
//     required: true,
//   },
//   session: {
//     type: Schema.Types.ObjectId,
//     ref: 'Session', // Reference to the Session model
//     required: true,
//   },
// });

// module.exports = mongoose.model('Question', questionSchema);


const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  programme: { type: String, required: true },
  semester: { type: String, required: true },
  session: { type: String, required: true },
  text: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
});

module.exports = mongoose.model('Question', QuestionSchema);