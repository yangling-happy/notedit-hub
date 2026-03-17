import mongoose, { Document, Schema } from 'mongoose';

// 定义文档在代码中的类型接口
export interface IDocument extends Document {
  title: string;
  content: any; // BlockNote 的 JSON 数组，暂时用 any，后续可细化
  createdAt?: Date; 
  updatedAt?: Date; 
}

const DocumentSchema: Schema = new Schema({
  title: { type: String, default: 'Untitled' },
  content: { type: Schema.Types.Mixed }, 
}, { 
  timestamps: true 
});

export default mongoose.model<IDocument>('Document', DocumentSchema);