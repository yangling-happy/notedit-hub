import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUploadAsset extends Document {
  owner: Types.ObjectId;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UploadAssetSchema = new Schema<IUploadAsset>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

UploadAssetSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.model<IUploadAsset>("UploadAsset", UploadAssetSchema);
