const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: "Please select a Country",
      text: true,
    },
    content: {
      type: String,
      required: "content is required",
      text: true,
    },
    image: {
      url: {
        type: String,
        default: "http://via.placeholder.com/200x200.png?text=Post",
      },
      public_id: {
        type: String,
        default: Date.now,
      },
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", postSchema);
