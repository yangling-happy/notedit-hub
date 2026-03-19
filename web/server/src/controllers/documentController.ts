import Document from "../models/document.js";

export const createDocument = async (req: any, res: any) => {
  try {
    const { title, content } = req.body;
    const newDoc = await Document.create({ title, content });
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ message: "服务器内部错误" });
  }
};

export const getAllDocuments = async (req: any, res: any) => {
  try {
    const docs = await Document.find({}, "title _id updatedAt createdAt").sort({
      updatedAt: -1,
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: "服务器内部错误" });
  }
};

export const getDocumentById = async (req: any, res: any) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "文档不存在" });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: "服务器内部错误" });
  }
};

export const updateDocument = async (req: any, res: any) => {
  try {
    const { title, content } = req.body;
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
      },
      { new: true },
    );
    if (!doc) return res.status(404).json({ message: "文档不存在" });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: "服务器内部错误" });
  }
};

export const deleteDocument = async (req: any, res: any) => {
  try {
    const deletedDoc = await Document.findByIdAndDelete(req.params.id);
    if (!deletedDoc) return res.status(404).json({ message: "文档不存在" });
    res.json({ message: "删除成功" });
  } catch (error) {
    res.status(500).json({ message: "服务器内部错误" });
  }
};
