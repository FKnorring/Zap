import { BaseService, FirebaseResponse } from './base';
import User from '@/models/User';

class UserService extends BaseService<User> {
  constructor() {
    super('users');
  }

  async findOrCreate(
    id: string,
    email: string
  ): Promise<FirebaseResponse<User>> {
    try {
      // Check if user exists
      const snapshot = await this.getById(id);

      if (snapshot.data) {
        return { data: snapshot.data as User, error: null };
      }

      // Create new user if doesn't exist
      const newUser = {
        id,
        email,
        created_at: new Date().toISOString(),
        username: 'temp',
        avatar: 'temp',
        collectionName: 'micah',
        completedTutorials: [],
      };

      await this.create(newUser, id);
      return { data: newUser, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

export const userService = new UserService();
