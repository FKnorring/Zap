import { getFirebaseServices } from "@/firebase";
import { ref, get, set, update, remove, DatabaseReference, Query } from "firebase/database";
import { nanoid } from 'nanoid'

export type FirebaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

export class BaseService<T> {
  protected path: string;

  constructor(path: string) {
    this.path = path;
  }

  protected getRef(path?: string): DatabaseReference {
    const { database } = getFirebaseServices();
    return ref(database, path || this.path);
  }

  async getById(id: string): Promise<FirebaseResponse<T>> {
    try {
      const snapshot = await get(this.getRef(`${this.path}/${id}`));
      return { data: snapshot.val() as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async create(payload: Partial<T>, const_id?: string): Promise<FirebaseResponse<T>> {
    const id = const_id || nanoid();
    try {
      await set(this.getRef(`${this.path}/${id}`), payload);
      return { data: { ...payload, id } as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async update(id: string, payload: Partial<T>): Promise<FirebaseResponse<T>> {
    try {
      await update(this.getRef(`${this.path}/${id}`), payload);
      return { data: payload as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async delete(id: string): Promise<FirebaseResponse<void>> {
    try {
      await remove(this.getRef(`${this.path}/${id}`));
      return { data: undefined, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  protected transformFirebaseResponse(snapshot: { [key: string]: T }): T[] {
    if (!snapshot) return [];
    return Object.entries(snapshot).map(([id, value]) => ({
      id,
      ...value
    })) as T[];
  }

  async list(ref?: DatabaseReference | Query): Promise<FirebaseResponse<T[]>> {
    try {
      const snapshot = await get(ref || this.getRef());
      return { 
        data: this.transformFirebaseResponse(snapshot.val()),
        error: null 
      };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}