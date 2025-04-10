import { TodoSection } from "@/types/note-types";

export const LOCAL_NOTE_KEY = "localNoteDrafts";

// Функции для работы с черновиками в local storage
export function saveLocalNoteToStorage(note: TodoSection) {
  const drafts = JSON.parse(localStorage.getItem(LOCAL_NOTE_KEY) || "{}");
  drafts[note.title] = note;
  localStorage.setItem(LOCAL_NOTE_KEY, JSON.stringify(drafts));
}

export function loadLocalNoteFromStorage(title: string): TodoSection | null {
  const drafts = JSON.parse(localStorage.getItem(LOCAL_NOTE_KEY) || "{}");
  return drafts[title] || null;
}

export function removeLocalNoteFromStorage(title: string) {
  const drafts = JSON.parse(localStorage.getItem(LOCAL_NOTE_KEY) || "{}");
  delete drafts[title];
  localStorage.setItem(LOCAL_NOTE_KEY, JSON.stringify(drafts));
}
