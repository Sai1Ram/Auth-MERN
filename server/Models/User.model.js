import mongoose from "mongoose";
import bcrypt from "bcrypt";
//DEFINING SCHEMA
const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      trim: true,
    },
  },
  { timestamps: true }
);

// MONOGDB MIDDLEWARE
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    console.log(this.password)
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// INSTANCE METHOD
UserSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password);
}
//MODEL
const User = mongoose.model("user", UserSchema);

export default User;
