import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "用户名不能为空"],
      unique: true,
      trim: true,
      minlength: [3, "用户名至少 3 个字符"],
      maxlength: [20, "用户名最多 20 个字符"],
    },
    password: {
      type: String,
      required: [true, "密码不能为空"],
      minlength: [6, "密码至少 6 个字符"],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
