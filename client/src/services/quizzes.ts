import { quizDefaults } from "@/components/quiz-editor/utils/quiz-defaults";
import { BaseService, FirebaseResponse } from "./base";
import Quiz, { SharedQuizzes, UserQuizzes } from "@/models/Quiz";
import { query, orderByChild, equalTo, get,ref, set, limitToFirst, update, remove } from "firebase/database";
import { database } from "@/firebase";
import { nanoid } from 'nanoid';

class QuizService extends BaseService<Quiz> {
  private userQuizzesRef: string;

  constructor() {
    super("quizzes");
    this.userQuizzesRef = "userQuizzes";
  }

  async create(quiz: Partial<Quiz>, const_id?: string): Promise<FirebaseResponse<Quiz>> {
    if(!quiz.user_id || !quiz.quiz_name) return { data: null, error: new Error('User ID is required') };
    const quizId = const_id || nanoid();

    const now = new Date().toISOString().toLocaleString();

    const userQuizRef = ref(database, `userQuizzes/${quizId}`);
    const userQuiz = {
      userId: quiz.user_id,
      quizId: quizId,
      quizName: quiz.quiz_name,
      isHosted: false,
      isShared: false,
      createdAt: now,
      updatedAt: now,
    }
    
    const quizRef = ref(database, `quizzes/${quizId}`);
    const quizData = {
      id: quizId,
      ...quiz,
      created_at: now,
      updated_at: now,
      settings: {
        ...quizDefaults
      }
    };

    try {
      await Promise.all([
        set(quizRef, quizData),
        set(userQuizRef, userQuiz)
      ]);
      return { data: quizData as Quiz, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async getById(id: string): Promise<FirebaseResponse<Quiz>> {
    const quizRef = ref(database, `${this.path}/${id}`);
    
    try {
      const snapshot = await get(quizRef);
      if (!snapshot.exists()) {
        return { data: null, error: new Error('Quiz not found') };
      }
      return { data: snapshot.val(), error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async update(id: string, quiz: Partial<Quiz>): Promise<FirebaseResponse<Quiz>> {
    const quizRef = ref(database, `${this.path}/${id}`);
    const userQuizRef = ref(database, `${this.userQuizzesRef}/${id}`);
    
    try {
      // Update the main quiz document
      const quizUpdate = {
        ...quiz,
        updated_at: new Date().toISOString().toLocaleString(),
      };
      await update(quizRef, quizUpdate);

      // Update the user quiz document (excluding slides)
      if (quiz.quiz_name || quiz.isHosted !== undefined || quiz.isShared !== undefined) {
        const userQuizUpdate = {
          ...(quiz.quiz_name && { quizName: quiz.quiz_name }),
          ...(quiz.isHosted !== undefined && { isHosted: quiz.isHosted }),
          ...(quiz.isShared !== undefined && { isShared: quiz.isShared }),
          updatedAt: new Date().toISOString().toLocaleString(),
        };
        await update(userQuizRef, userQuizUpdate);
      }

      return { data: { ...quiz, id } as Quiz, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async listShared(userId: string): Promise<FirebaseResponse<SharedQuizzes[]>> {
    const sharedQuizzesRef = query(
      ref(database, 'sharedQuizzes'),
      orderByChild("userId"),
      limitToFirst(10), // TODO: Fetch more dynamically
    );
    
    try {
      const snapshot = await get(sharedQuizzesRef); 
      if (!snapshot.exists()) {
        console.log('No data found')
        return { data: null, error: null }; 
      }
      const data = snapshot.val();
      const quizzes = Object.values(data) as SharedQuizzes[]; 

      // Filter out quizzes belonging to the user
      const filteredQuizzes = quizzes.filter(quiz => quiz.userId !== userId);
  
      return { data: filteredQuizzes, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async listUserQuizzes(userId: string): Promise<FirebaseResponse<UserQuizzes[]>> {
    const userQuizzesRef = query(
      ref(database, 'userQuizzes'),
      orderByChild("userId"),
      equalTo(userId),
    );
    
    try {
      const snapshot = await get(userQuizzesRef); 
      if (!snapshot.exists()) {
        console.log('No data found')
        return { data: null, error: null }; 
      }
      const data = snapshot.val();
      const quizzes = Object.values(data) as UserQuizzes[]; 
  
      return { data: quizzes, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async getByUserId(userId: string): Promise<FirebaseResponse<Quiz[]>> {
    try {
      const userQuizzesRef = query(
        ref(database, this.userQuizzesRef),
        orderByChild("userId"),
        equalTo(userId)
      );

      try {
        const snapshot = await get(userQuizzesRef);
        if (!snapshot.exists()) {
          return { data: [], error: null };
        }
        
        // Transform UserQuizzes to Quiz format
        const userQuizzes = Object.values(snapshot.val()) as UserQuizzes[];
        const quizzes = userQuizzes.map(userQuiz => ({
          id: userQuiz.quizId,
          quiz_name: userQuiz.quizName,
          user_id: userQuiz.userId,
          isHosted: userQuiz.isHosted,
          isShared: userQuiz.isShared,
          created_at: userQuiz.createdAt,
          updated_at: userQuiz.updatedAt,
        })) as Quiz[];
        
        return { data: quizzes, error: null };
      } catch (getError) {
        console.error('Error getting snapshot:', getError);
        throw getError;
      }
    } catch (error) {
      console.error('Overall error:', error);
      return { data: null, error: error as Error };
    }
  }

  async deleteQuiz(quizId: string): Promise<FirebaseResponse<void>> {
    const userQuizRef = ref(database, `${this.userQuizzesRef}/${quizId}`);
    const quizRef = ref(database, `${this.path}/${quizId}`);
    const sharedQuizRef = ref(database, `sharedQuizzes/${quizId}`);

    try {
      await Promise.all([
        remove(userQuizRef),
        remove(quizRef),
        remove(sharedQuizRef),
      ]);
      return { data: undefined, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async shareQuiz(quizId: string, user: { id: string, username?: string, avatar?: string }, quizName: string): Promise<FirebaseResponse<boolean>> {
    try {
      const sharedQuizRef = ref(database, `sharedQuizzes/${quizId}`);
      const sharedQuizSnap = await get(sharedQuizRef);

      if (sharedQuizSnap.exists()) {
        await remove(sharedQuizRef);
        const userQuizRef = ref(database, `${this.userQuizzesRef}/${quizId}`);
        await update(userQuizRef, { isShared: false });
        return { data: false, error: null };
      }

      const newShared: SharedQuizzes = {
        userId: user.id,
        userName: user.username || 'NoName',
        userAvatar: user.avatar || 'NoAvatar',
        quizId: quizId,
        quizName: quizName,
        sharedAt: new Date().toLocaleString(),
        collectionName: 'micah',
      };

      await set(sharedQuizRef, newShared);
      const userQuizRef = ref(database, `${this.userQuizzesRef}/${quizId}`);
      await update(userQuizRef, { isShared: true });
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async copyQuiz(quiz: SharedQuizzes, userId: string): Promise<FirebaseResponse<Quiz>> {
    try {
      const quizRef = ref(database, `${this.path}/${quiz.quizId}`);
      const quizData = await get(quizRef);

      if (!quizData.exists()) {
        return { data: null, error: new Error('Quiz not found') };
      }

      const newQuizId = nanoid();
      const newQuizRef = ref(database, `${this.path}/${newQuizId}`);
      const quizUpdate = {
        ...quizData.val(),
        id: newQuizId,
        quiz_name: `${quizData.val().quiz_name} (Copy)`,
        user_id: userId,
        isShared: false,
        updated_at: new Date().toLocaleString(),
      };
      await set(newQuizRef, quizUpdate);

      const userQuizRef = ref(database, `${this.userQuizzesRef}/${newQuizId}`);
      const userQuiz = {
        userId: userId,
        quizId: newQuizId,
        quizName: `${quizData.val().quiz_name} (Copy)`,
        isHosted: false,
        isShared: false,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };
      await set(userQuizRef, userQuiz);

      return { data: quizUpdate, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

export const quizService = new QuizService();