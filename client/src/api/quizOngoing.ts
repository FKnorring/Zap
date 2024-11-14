import QuizOngoing from "@/models/QuizOngoing";
import { ApiResponse, BaseAPI } from "./base";
import Participant from "@/models/Participant";

class QuizOngoingApi extends BaseAPI<QuizOngoing> {
  constructor() {
    super("QuizOngoing");
  }

  // Method to check if an ongoing quiz exists by quiz code
  async getOngoingQuiz(quizCode: string): Promise<ApiResponse<QuizOngoing>> {
    const { data, error } = await this.client
      .from("QuizOngoing")
      .select("*")
      .eq("quiz_code", quizCode)
      .limit(1);

    return { data: data ? data[0] : null, error };
  }

  async generateQuizCode(): Promise<string> {
    let quizCode = "";
    let isUnique = false;

    while (!isUnique) {
      // Generate a random 4-letter code
      quizCode = Array.from({ length: 4 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join("");

      // Check if the code already exists in the QuizOngoing table
      const { error } = await this.client
        .from("QuizOngoing")
        .select("quiz_code")
        .eq("quiz_code", quizCode)
        .single();
      // If code does not exist
      if (error && error.code === "PGRST116") {
        isUnique = true;
      } else if (error) {
        console.error("Error checking quiz code:", error);
        throw error;
      }
    }
    return quizCode;
  }

  async createOngoingQuiz(
    //TODO: Check that a user can only host one game at a time
    quizHost: string,
    quizId: string
  ): Promise<ApiResponse<QuizOngoing>> {
    const quizCode = await this.generateQuizCode();
    const { data, error } = await this.client
      .from("QuizOngoing")
      .insert([
        {
          quiz_code: quizCode,
          host_user_id: quizHost,
          created_quiz_id: quizId,
          started_at: new Date().toISOString().toLocaleString(),
          current_slide_order: 0,
        },
      ])
      .select()
      .single();
    return { data: data, error };
  }

  async nextSlide(quizCode: string, participants: string[]): Promise<ApiResponse<QuizOngoing>> { 
    const { data: quizData, error: fetchError } = await this.client
      .from("QuizOngoing")
      .select("current_slide_order")
      .eq("quiz_code", quizCode)
      .single();

    if (fetchError) {
      console.error("Error fetching current slide order:", fetchError);
      return { data: null, error: fetchError };
    }
    // Reset participants answers
    for(const participant of participants){
      const { error: participantError } = await this.client
        .from("Participant")
        .update({ answer: null, has_answered: false })
        .eq("id", participant)
        .select()
        .single();

      if (participantError) {
        console.error("Error updating participants:", participantError);
      }
    }

    // Increment the current_slide_order by 1
    const { data: updatedData, error: updateError } = await this.client
      .from("QuizOngoing")
      .update({ current_slide_order: quizData.current_slide_order + 1 })
      .eq("quiz_code", quizCode)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating slide order:", updateError);
    }

    return { data: updatedData, error: updateError };
  }

  async getParticipants(
    ongoingQuizId: string
  ): Promise<ApiResponse<Participant[]>> {
    const { data: quizParticipants, error: quizParticipantsError } =
      await this.client
        .from("QuizParticipants")
        .select("*")
        .eq("ongoing_quiz_id", ongoingQuizId);

    if (quizParticipantsError) {
      return { data: null, error: quizParticipantsError };
    }

    const participantsPromises = quizParticipants.map(
      async (quizParticipant) => {
        const { data: participant, error: participantError } = await this.client
          .from("Participant")
          .select("*")
          .eq("id", quizParticipant.participant_id)
          .single();

        // If there's an error fetching a Participant, return null for that entry
        if (participantError) {
          console.error(
            `Error fetching participant with id ${quizParticipant.participant_id}:`,
            participantError
          );
          return null;
        }
        return participant;
      }
    );

    // Resolve all participant fetch requests
    const participants = await Promise.all(participantsPromises);

    // Filter out any null values in case some participants failed to load
    const validParticipants = participants.filter(
      (participant) => participant !== null
    );

    return { data: validParticipants, error: null };
  }

  async getCurrentSlide(quiz_code: string) {
    const { data, error } = await this.client
      .from("QuizOngoing")
      .select(`
        current_slide_order,
        created_quiz_id
      `)
      .eq("quiz_code", quiz_code)
      .single();
  
    // Filter to get the slide matching the current slide order
    console.log(data);
    //const currentSlide = data?.QuizSlides.find(
    //  (slide: any) => slide.slide_order === data.current_slide_order
    //);
  
    return { data: data, error };
  }
  


}

export const quizOngoingApi = new QuizOngoingApi();
