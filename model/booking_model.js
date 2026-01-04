import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  trackingId: {
    type: Number,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: date.now
    },
    scheduledAt: { //optional but users can add a scheduled time with the provider
        type: Date
    }
});

const Booking = mongoose.model("Booking", bookingSchema)
export default Booking