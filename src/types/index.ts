export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  patientId: string;
  createdAt: string;
  updatedAt: string;
  signed: boolean;
  signature?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin';
}