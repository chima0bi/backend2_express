import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    course_name: {
      required: true,
      type: String,
      unique: true,
    },
    tuition: {
      required: true,
      type: Number,
    },
    duration: {
      type: String
    },
    
  { timestamps: true }
);

userSchema.index({ createdAt: -1 }); // sort by newest users

const Course = mongoose.model("Course", courseSchema);
export default Course;
