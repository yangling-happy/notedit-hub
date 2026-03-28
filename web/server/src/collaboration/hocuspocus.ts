import { Hocuspocus } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";

export const hocuspocusServer = new Hocuspocus({
  name: "hocuspocus-wiki",
  extensions: [new Logger()],
});