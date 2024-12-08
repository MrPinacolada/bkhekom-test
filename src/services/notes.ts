import { reactive } from "vue";
import { apiGet } from "@/services/api/Api";

export interface Note {
  userId: number;
  id: number;
  title: string;
  body: string;
  completed?: boolean;
}

export class NotesService {
  public notes = reactive<Note[]>([]);

  async fetchNotes(): Promise<Note[]> {
    const response = await apiGet({
      url: "https://jsonplaceholder.typicode.com/posts",
    });
    if (!response?.ok) {
      throw new Error("Ошибка при получении заметок");
    }
    const fetchedNotes = await response.json();
    fetchedNotes.forEach((note: Note) =>
      this.notes.push({ ...note, completed: false })
    );
    return this.notes;
  }

  getAllNotes(): Note[] {
    return this.notes;
  }

  editNote(id: number, updatedData: Partial<Note>): Note | undefined {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) {
      return;
    }
    this.notes[noteIndex] = { ...this.notes[noteIndex], ...updatedData };
    return this.notes[noteIndex];
  }

  deleteNote(id: number): boolean {
    const noteIndex = this.notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      return false;
    }

    this.notes.splice(noteIndex, 1);
    return true;
  }

  addNote(newNote: Omit<Note, "id">): Note {
    const newId = this.notes.length
      ? Math.max(...this.notes.map((note) => note.id)) + 1
      : 1;
    const note: Note = { ...newNote, id: newId };
    this.notes.push(note);
    return note;
  }

  getCompletedNotes(): Note[] {
    return this.notes.filter((note) => note.completed);
  }
}
