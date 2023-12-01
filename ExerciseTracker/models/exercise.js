const { model, Schema } = require("mongoose");

const exerciseSchema = new Schema({
  duration: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    default: Date.now(),
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Exercise = model("Exercise", exerciseSchema);

module.exports = Exercise;
