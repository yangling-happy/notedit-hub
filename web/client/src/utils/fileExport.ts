export const fileExport = (content: string, fileName: string) => {
  // 1. 创建 Blob，指定 MIME 类型为 text/markdown
  const blob = new Blob([content], { type: "text/markdown" });
  
  // 2. 生成一个浏览器内存里的 URL
  const url = URL.createObjectURL(blob);
  
  // 3. 创建一个隐藏的 <a> 标签
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  
  // 4. 执行模拟点击
  a.click();
  
  // 5. 关键：延迟释放内存，确保下载任务已启动
  setTimeout(() => URL.revokeObjectURL(url), 100);
};