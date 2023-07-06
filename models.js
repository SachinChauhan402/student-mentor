const { Schema, model } = require('mongoose');

const mentorSchema = new Schema({
  name:  { type: String, require },
  requestDetails: [
    {
      endpoint: String,
      method: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  // Add other mentor fields as needed
});

const studentSchema = new Schema({
  name:  { type: String, require },
  mentorId: Schema.Types.ObjectId, // Reference to Mentor
  requestDetails: [
    {
      endpoint: String,
      method: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  // Add other student fields as needed
});

const Mentor = model('Mentor', mentorSchema);
const Student = model('Student', studentSchema);

module.exports = {
  Mentor,
  Student,
};
