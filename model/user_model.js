import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"],
    },
    password: { type: String, required: true },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "provider", "admin", "owner"],
      default: "user",
    },
    // When user role is provider, the next block stores their offered services from the services model
    providedServices: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        price: { type: Number, required: true },
        description: { type: String, required: true },
      },
    ],
    courses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: false,
        },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        duration: {
          type: String
        },
      },
    ],
    experienceYears: {
      required: false,
      type: Number,
    },
  },
  { timestamps: true }
);

// Add indexes
userSchema.index({ email: 1 }); // ensure fast lookups by email
userSchema.index({ username: 1 }); // fast lookups by username
userSchema.index({ role: 1 }); // queries filtering by role
userSchema.index({ createdAt: -1 }); // sort by newest users

const User = mongoose.model("User", userSchema);
export default User;
