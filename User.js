import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      default: "uploads/default.jpg",
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      select: false,
    },
    role: {
      type: String,
      emum: ["admin", "expert", "user"],
      required: true,
      default: "user",
    },
    passwordResetString: {
      type: String,
    },
    likes: {
      type: String,
    },
    dislikes: {
      type: String,
    },
    hobbies: {
      type: String,
    },
    problems: {
      type: String,
    },
    friends: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["accepted", "sent", "received"],
        },
        sent: {
          type: Date,
        },
        accepted: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare input password with database password
userSchema.methods.comparePassword = async function (inputPassword, dbPassword) {
  return await bcrypt.compare(inputPassword, dbPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
