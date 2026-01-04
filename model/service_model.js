import mongoose from "mongoose";

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    basePrice: { //optional general price, to be provider-specific in usage
      type: Number,
    },
    baseDescription: {
      type: String, 
    },
  },
  { timestamps: true }
);
const Service = mongoose.model("Service", serviceSchema);
export default Service