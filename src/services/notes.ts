import { reactive } from "vue";
import { apiGet } from "@/services/api/Api";

/**
 * Интерфейс, представляющий заметку.
 * @interface Note
 */
export interface Note {
  userId: number; // ID пользователя, связанного с заметкой
  id: number; // Уникальный идентификатор заметки
  title: string; // Заголовок заметки
  body: string; // Содержимое заметки
  completed?: boolean; // Статус выполнения заметки (опционально)
}

/**
 * Сервис для управления заметками.
 * @class NotesService
 */
class NotesService {
  /**
   * Реактивный массив заметок.
   * @type {Note[]}
   */
  public notes: Note[] = reactive<Note[]>([]);

  /**
   * Получает список заметок с API и добавляет их в массив `notes`.
   * @returns {Promise<Note[]>} Массив заметок.
   * @throws {Error} Если произошла ошибка при получении данных.
   */
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

  /**
   * Возвращает все заметки из массива `notes`.
   * @returns {Note[]} Массив всех заметок.
   */
  getAllNotes(): Note[] {
    return this.notes;
  }

  /**
   * Находит заметку по заголовку.
   * @param {string} title - Заголовок заметки.
   * @returns {Promise<Note | undefined>} Найденная заметка или `undefined`, если заметка не найдена.
   */
  async getNoteByTitle(title: string): Promise<Note | undefined> {
    const notes = await this.fetchNotes();
    return notes.find((note) => note.title === title);
  }

  /**
   * Редактирует заметку по её ID.
   * @param {number} id - ID заметки для редактирования.
   * @param {Partial<Note>} updatedData - Данные для обновления.
   * @returns {Note | undefined} Обновлённая заметка или `undefined`, если заметка не найдена.
   */
  editNote(id: number, updatedData: Partial<Note>): Note | undefined {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) {
      return;
    }

    this.notes[noteIndex] = { ...this.notes[noteIndex], ...updatedData };
    return this.notes[noteIndex];
  }

  /**
   * Удаляет заметку по её ID.
   * @param {number} id - ID заметки для удаления.
   * @returns {boolean} Возвращает `true`, если заметка была удалена, иначе `false`.
   */
  deleteNote(id: number): boolean {
    const noteIndex = this.notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      return false;
    }

    this.notes.splice(noteIndex, 1);
    return true;
  }

  /**
   * Добавляет новую заметку.
   * @param {Omit<Note, "id">} newNote - Новая заметка без ID.
   * @returns {Note} Добавленная заметка с сгенерированным ID.
   */
  addNote(newNote: Omit<Note, "id">): Note {
    const existingIds = new Set(
      noteService.getAllNotes().map((note) => note.id)
    );
    let newId = 1;

    while (existingIds.has(newId)) {
      newId++;
    }
    const note: Note = { ...newNote, id: newId };
    this.notes.unshift(note);
    return note;
  }

}

export const noteService = new NotesService();
