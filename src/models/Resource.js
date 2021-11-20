const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String, 
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
//   image
  likes: {
    type: Number, 
    default: 0,
  },
  image: {
    type: String,
    reruired:true,
  },
  resourcelikes: [
    {
      type: ObjectId,
      ref: "Resource",
    },
  ],
});
module.exports = mongoose.model("Resource", resourceSchema);
