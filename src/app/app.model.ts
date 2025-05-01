export interface User {
    uid: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
  }
  
  export interface Comment {
    text: string;
    author: string;
  }
  
  export interface Task {
    id: string;
    title: string;
    projectDescription: string;
    status: 'pending' | 'in-progress' | 'completed';
    assignedTo: string;
    comments: Comment[];
  }
  
  export interface NewTask {
    title: string;
    projectDescription: string;
    status: 'pending' | 'in-progress' | 'completed';
    assignedTo: string;
    comments: Comment[];
  }
  