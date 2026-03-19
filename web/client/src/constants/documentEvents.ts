export const DOCUMENTS_CHANGED_EVENT = "documents:changed";

export const notifyDocumentsChanged = () => {
  window.dispatchEvent(new Event(DOCUMENTS_CHANGED_EVENT));
};
