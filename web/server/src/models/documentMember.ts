import mongoose from "mongoose";
const { Schema } = mongoose;

const DocumentMemberSchema = new Schema({
  documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["editor"], default: "editor" },
  joinedAt: { type: Date, default: Date.now },
});
DocumentMemberSchema.index({ documentId: 1, userId: 1 }, { unique: true });
export default mongoose.model("DocumentMember", DocumentMemberSchema);
