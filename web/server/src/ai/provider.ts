import { createOpenAI } from "@ai-sdk/openai";

export const aliyun = createOpenAI({
  apiKey: process.env.ALIBABA_CLOUD_API_KEY!,
  baseURL: process.env.ALIBABA_CLOUD_BASE_URL!,
});

export const resolveModelName = () =>
  process.env.ALIBABA_CLOUD_MODEL_NAME || "qwen-plus";
