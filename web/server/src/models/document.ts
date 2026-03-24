import mongoose, { Document, Schema, Types } from "mongoose";

// 定义文档在代码中的类型接口
export interface IDocument extends Document {
  title: string;
  content: any;
  owner: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const DocumentSchema: Schema = new Schema(
  {
    title: { type: String, default: "Untitled" },
    content: { type: Schema.Types.Mixed },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

DocumentSchema.index({ owner: 1, updatedAt: -1 });

export default mongoose.model<IDocument>("Document", DocumentSchema);
