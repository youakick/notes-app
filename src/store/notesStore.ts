import { defineStore } from "pinia";
import type { TodoSection, TodoSectionListItem } from "@/types/note-types";

const defaultNotes: TodoSection[] = [
  {
    title: "Work",
    list: [
      { todo: "Came to work", status: false },
      { todo: "Drink coffee", status: false },
      { todo: "Work on some tasks", status: false },
      { todo: "Eat", status: false },
      { todo: "Make task list for tomorrow", status: false },
      { todo: "Go home!!!", status: false },
    ],
  },
  {
    title: "Shop",
    list: [
      { todo: "Meat", status: false },
      { todo: "Milk", status: false },
      { todo: "Potato", status: false },
      { todo: "Cheese", status: false },
      { todo: "Ketchup", status: false },
      { todo: "Water", status: false },
    ],
  },
  {
    title: "Training",
    list: [
      { todo: "Running", status: false },
      { todo: "Lifting", status: false },
      { todo: "Make some photo", status: false },
      { todo: "Shower", status: false },
    ],
  },
  {
    title: "Family",
    list: [
      { todo: "Buy birthday present", status: false },
      { todo: "Don't forget to feed the dog!", status: false },
      { todo: "Play with children's", status: false },
      { todo: "Kiss a wife", status: false },
      { todo: "Help with cleaning", status: false },
    ],
  },
];

function saveToLocalStorage(todoList: TodoSection[]) {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

function loadFromLocalStorage(): TodoSection[] {
  return JSON.parse(
    localStorage.getItem("todoList") || JSON.stringify(defaultNotes)
  );
}

export const useNotesStore = defineStore("notes", {
  state: () => ({
    todoList: loadFromLocalStorage() as TodoSection[],
  }),

  actions: {
    save() {
      saveToLocalStorage(this.todoList);
    },
    addNote(note: TodoSection) {
      this.todoList.push(note);
      saveToLocalStorage(this.todoList);
    },

    deleteNote(title: string) {
      const sectionIndex = this.todoList.findIndex(
        (note: TodoSection) => note.title.toLowerCase() === title.toLowerCase()
      );
      if (sectionIndex !== -1) {
        this.todoList.splice(sectionIndex, 1);
        saveToLocalStorage(this.todoList);
      }
    },
    editNote(title: string, updatedList: TodoSectionListItem[]) {
      const note = this.todoList.find(
        (note: TodoSection) => note.title === title
      );
      if (note) {
        note.list = updatedList;
        this.save();
      }
    },
  },
});
