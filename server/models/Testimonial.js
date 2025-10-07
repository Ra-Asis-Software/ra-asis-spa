import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  title: { type: String },
  testimonial: { type: String, required: true },
  approved: { type: Boolean, default: false },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
