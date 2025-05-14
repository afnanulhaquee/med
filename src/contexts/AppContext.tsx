import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, Document, User } from '../types';

interface AppContextType {
  patients: Patient[];
  documents: Document[];
  currentUser: User | null;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  deletePatient: (id: string) => void;
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'signed'>) => void;
  updateDocument: (id: string, document: Partial<Omit<Document, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteDocument: (id: string) => void;
  signDocument: (id: string, signature: string) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  initialize: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedPatients = localStorage.getItem('patients');
    const storedDocuments = localStorage.getItem('documents');
    const storedUser = localStorage.getItem('currentUser');

    if (storedPatients) setPatients(JSON.parse(storedPatients));
    if (storedDocuments) setDocuments(JSON.parse(storedDocuments));
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (patients.length) localStorage.setItem('patients', JSON.stringify(patients));
    if (documents.length) localStorage.setItem('documents', JSON.stringify(documents));
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [patients, documents, currentUser]);

  const initialize = () => {
    // Initialize admin user if not exists
    const adminUser: User = {
      id: '1',
      email: 'admin@example.com',
      password: 'password', // In a real app, this would be hashed
      role: 'admin',
    };

    localStorage.setItem('admin', JSON.stringify(adminUser));
  };

  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPatients([...patients, newPatient]);
  };

  const updatePatient = (id: string, patient: Omit<Patient, 'id' | 'createdAt'>) => {
    setPatients(patients.map(p => p.id === id ? { ...p, ...patient } : p));
  };

  const deletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
    // Also delete associated documents
    setDocuments(documents.filter(d => d.patientId !== id));
  };

  const addDocument = (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'signed'>) => {
    const now = new Date().toISOString();
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      signed: false,
    };
    setDocuments([...documents, newDocument]);
  };

  const updateDocument = (id: string, document: Partial<Omit<Document, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setDocuments(documents.map(d => 
      d.id === id ? { 
        ...d, 
        ...document, 
        updatedAt: new Date().toISOString() 
      } : d
    ));
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const signDocument = (id: string, signature: string) => {
    setDocuments(documents.map(d => 
      d.id === id ? { 
        ...d, 
        signature, 
        signed: true, 
        updatedAt: new Date().toISOString() 
      } : d
    ));
  };

  const login = (email: string, password: string): boolean => {
    const adminData = localStorage.getItem('admin');
    
    if (!adminData) {
      initialize();
      return false;
    }
    
    const admin = JSON.parse(adminData) as User;
    
    if (admin.email === email && admin.password === password) {
      setCurrentUser(admin);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    patients,
    documents,
    currentUser,
    addPatient,
    updatePatient,
    deletePatient,
    addDocument,
    updateDocument,
    deleteDocument,
    signDocument,
    login,
    logout,
    initialize,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}