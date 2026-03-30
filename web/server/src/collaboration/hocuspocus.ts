import { Hocuspocus } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import * as Y from "yjs";
import Document from "../models/document.js";
import {
  canAccessDocument,
  verifyCollaborationToken,
} from "../services/documentAccess.js";

export const hocuspocusServer = new Hocuspocus({
  name: "hocuspocus-wiki",
  extensions: [new Logger()],
  async onAuthenticate({ token, documentName }) {
    const user = verifyCollaborationToken(token);
    const allowed = await canAccessDocument(documentName, user.userId);
    if (!allowed) {
      throw new Error("permission-denied");
    }

    return { user };
  },
  async onLoadDocument({ documentName, context }) {
    const userId = context?.user?.userId as string | undefined;
    if (!userId) {
      throw new Error("permission-denied");
    }

    const allowed = await canAccessDocument(documentName, userId);
    if (!allowed) {
      throw new Error("permission-denied");
    }

    const stored = await Document.findById(documentName, "yjsState").lean();
    if (!stored?.yjsState) {
      return null;
    }

    const ydoc = new Y.Doc();
    const update = Uint8Array.from(stored.yjsState);
    Y.applyUpdate(ydoc, update);
    return ydoc;
  },
  async onStoreDocument({ documentName, document }) {
    const yjsState = Buffer.from(Y.encodeStateAsUpdate(document));
    await Document.findByIdAndUpdate(documentName, {
      yjsState,
      yjsStateUpdatedAt: new Date(),
    });
  },
});
