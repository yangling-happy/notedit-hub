import { Hocuspocus } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import * as Y from "yjs";
import Document from "../models/document.js";
import {
  canAccessDocument,
  verifyCollaborationToken,
} from "../services/documentAccess.js";

const toUint8Array = (value: unknown): Uint8Array | null => {
  if (!value) return null;

  if (Buffer.isBuffer(value)) {
    return new Uint8Array(value);
  }

  if (value instanceof Uint8Array) {
    return value;
  }

  if (Array.isArray(value)) {
    return Uint8Array.from(value);
  }

  if (typeof value === "string") {
    const buf = Buffer.from(value, "base64");
    return buf.length > 0 ? new Uint8Array(buf) : null;
  }

  if (typeof value === "object") {
    const raw = value as {
      type?: string;
      data?: unknown;
      buffer?: unknown;
    };

    if (raw.type === "Buffer" && Array.isArray(raw.data)) {
      return Uint8Array.from(raw.data);
    }

    if (raw.buffer) {
      return toUint8Array(raw.buffer);
    }
  }

  return null;
};

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

    const stored = await Document.findById(
      documentName,
      "yjsState yjsStateUpdatedAt",
    ).lean();
    if (!stored?.yjsState) {
      return null;
    }

    const update = toUint8Array(stored.yjsState);
    if (!update || update.length === 0) {
      console.warn(
        `[onLoadDocument] Invalid yjsState format for document ${documentName}.`,
      );
      return null;
    }

    const ydoc = new Y.Doc();
    try {
      Y.applyUpdate(ydoc, update);
      return ydoc;
    } catch (error) {
      console.error(
        `[onLoadDocument] Failed to decode yjsState for document ${documentName}:`,
        error,
      );

      await Document.findByIdAndUpdate(documentName, {
        $unset: { yjsState: 1, yjsStateUpdatedAt: 1 },
      });

      return null;
    }
  },
  async onStoreDocument({ documentName, document }) {
    const yjsState = Buffer.from(Y.encodeStateAsUpdate(document));
    await Document.findByIdAndUpdate(documentName, {
      yjsState,
      yjsStateUpdatedAt: new Date(),
    });
  },
});
