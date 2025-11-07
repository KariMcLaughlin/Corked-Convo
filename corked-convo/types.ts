
export enum Role {
  User = 'user',
  Model = 'model',
}

export interface Message {
  role: Role;
  parts: string;
  timestamp: Date;
}

export enum Page {
  Chat = 'Chat',
  Recommendations = 'Recommendations',
  Blog = 'Blog',
  Travel = 'Travel',
  Recipes = 'Recipes',
}
