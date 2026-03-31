<div align="center"><a name="readme-top"></a>

[![][image-banner]][project-link]

# NOTEDIT

面向团队与个人的 AI 协作笔记编辑器。<br/>
基于 BlockNote、Yjs/Hocuspocus、React 与 Express 构建。

[English](./README.md) · **简体中文** · [文档][docs-link] · [反馈][issues-link]

<!-- TECH STACK CARD -->
<p align="center">
	<img src="https://skillicons.dev/icons?i=react,typescript,vite,express,mongodb,nginx" />
</p>
<p align="center">
	<img src="https://img.shields.io/badge/BlockNote-000000?style=flat-square&logo=blocknote&logoColor=white" />
	<img src="https://img.shields.io/badge/Yjs-000000?style=flat-square&logo=yjs&logoColor=white" />
	<img src="https://img.shields.io/badge/Hocuspocus-5A67D8?style=flat-square" />
	<img src="https://img.shields.io/badge/Ant%20Design-0170FE?style=flat-square&logo=antdesign&logoColor=white" />
</p>

<sup>多人协作，灵感提速。</sup>

</div>

---

<details>
<summary><kbd>目录</kbd></summary>

####

- [功能特性](#-功能特性)
- [快速开始](#-快速开始)
- [本地开发](#️-本地开发)
- [参与贡献](#-参与贡献)
- [许可证](#-许可证)

</details>

---

## 项目简介

欢迎使用 **NOTEDIT**！这是一个聚焦于高效写作、实时协同与 AI 辅助创作的在线编辑器。

它解决了常见的协作写作痛点：在同一个工具里完成文档编辑、多人协同、格式导出与 AI 处理，无需频繁切换平台。

> [!IMPORTANT]
>
> **欢迎 Star** - 你的支持会让项目持续迭代！


![产品截图 1][image-screenshot-1]
![产品截图 2][image-screenshot-2]
![产品截图 3][image-screenshot-3]

---

## 功能特性

### 基于 Yjs + Hocuspocus 的实时协作

多人可同时编辑同一文档，协作状态可见，冲突自动合并，保证实时同步与一致性。

<!-- 替换为协作功能演示图 -->

![功能演示][image-feature-realtime]
![功能演示 2][image-feature-realtime-2]

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

### AI 写作与编辑辅助

内置 AI 对话与编辑能力，支持流式输出，适用于起草、改写、总结与结构化润色等场景。

<!-- 替换为 AI 功能演示图 -->

![功能演示][image-feature-ai]
![功能演示 2][image-feature-ai-2]
![功能演示 3][image-feature-ai-3]
![功能演示 4][image-feature-ai-4]

> [!TIP]
>
> **小技巧**：将 AI 辅助与实时协作结合使用，团队迭代效率更高。

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

### 富文本编辑 + 导出 + 分享

支持现代富文本编辑、图片上传、Markdown/PDF/DOCX 导出，以及分享链接生成，方便团队协同交付。

```ts
// 示例：协作 hook
const { editor, status } = useCollaboration({
  docId,
  userName: user?.username,
  userColor: "#1971c2",
});
```

<!-- 替换为编辑/导出功能演示图 -->

![功能演示][image-feature-export]
![功能演示 2][image-feature-export-2]

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

## 快速开始

### 环境要求

- Node.js 20+
- pnpm 10+
- MongoDB（本地或云端）

### 1) 安装依赖

在仓库根目录执行：

```bash
pnpm install
```

### 2) 配置环境变量

创建 `web/server/.env`（可从 `web/server/.env.example` 复制）并填写：

```env
MONGODB_URI=
PORT=3001
JWT_SECRET=
ALIBABA_CLOUD_API_KEY=
ALIBABA_CLOUD_BASE_URL=
ALIBABA_CLOUD_MODEL_NAME=
CLIENT_ORIGIN=http://localhost:5173
```

前端可选变量：

```env
VITE_COLLAB_WS_URL=ws://localhost:3001
```

### 3) 启动后端

```bash
cd web/server
pnpm dev
```

### 4) 启动前端

```bash
cd web/client
pnpm dev
```

前端默认地址：`http://localhost:5173`  
后端默认地址：`http://localhost:3001`

---

## 本地开发

### 项目结构

```
web/
├── client/          # React + Vite 前端
├── server/          # Express API + Hocuspocus 协作服务
└── server/uploads/  # 上传文件目录
```

### 主要路由

- 前端：`/login`、`/wiki`、`/wiki/:docId`
- 后端：`/api/auth`、`/api/documents`、`/api/uploads`、`/health`
- WebSocket：`/`、`/collaboration`、`/collaboration/:documentName`

### 技术栈

| 分类 | 技术                                                       |
| ---- | ---------------------------------------------------------- |
| 前端 | React 19, TypeScript, Vite, Ant Design, BlockNote, i18next |
| 协作 | Yjs, Hocuspocus                                            |
| 后端 | Express 5, TypeScript, Mongoose, JWT, Multer               |
| AI   | AI SDK + OpenAI 兼容模型提供方（Qwen/Alibaba Cloud）       |

---

## 参与贡献

欢迎提交 Issue 和 PR！

1. Fork 本仓库
2. 创建你的功能分支
3. 提交代码变更
4. 发起 Pull Request

建议每个 PR 聚焦单一主题，并在修复问题时附上复现步骤。

---

## 许可证

ISC © NOTEDIT

---

<div align="center">
	<sub>
		如果这个项目对你有帮助，欢迎点个 Star。
	</sub>
</div>

[![][back-to-top]](#readme-top)

[project-link]: https://github.com/yangling-happy/notedit-hub
[docs-link]: https://github.com/yangling-happy/notedit-hub#readme
[issues-link]: https://github.com/yangling-happy/notedit-hub/issues
[image-banner]: ./web/images/image-banner.png
[image-screenshot-1]: ./web/images/NOTEDIT_Screenshot1.png
[image-screenshot-2]: ./web/images/NOTEDIT_Screenshot2.png
[image-screenshot-3]: ./web/images/NOTEDIT_Screenshot3.png
[image-feature-realtime]: ./web/images/Realtime+Collaboration1.png
[image-feature-realtime-2]: ./web/images/Realtime+Collaboration2.png
[image-feature-ai]: ./web/images/AI+Assistant1.png
[image-feature-ai-2]: ./web/images/AI+Assistant2.png
[image-feature-ai-3]: ./web/images/AI+Assistant3.png
[image-feature-ai-4]: ./web/images/AI+Assistant4.png
[image-feature-export]: ./web/images/Export1.png
[image-feature-export-2]: ./web/images/Export2.png
[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square
