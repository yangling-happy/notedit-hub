import {  Button } from "antd";

export const FileList = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
  >
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
      }}
    > 
    </div>
    <Button type="text" block style={{ flexShrink: 0 }}>
      打开文件夹...
    </Button>
  </div>
);
