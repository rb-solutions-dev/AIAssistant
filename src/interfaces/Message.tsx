export interface Message {
  id: number;
  content: string;
  created_at: string;
  conversations: {
    id: number;
    assistants: {
      name: string;
      avatar_url: string;
    };
  };
}
