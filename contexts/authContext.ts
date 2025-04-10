import { createContext } from 'react';
import { User } from 'firebase/auth';

// Define the context type
export interface IAuthContext {
  user: User | null;
  loadingAuth: boolean;
  userData: any | null;
  signUp: (email: string, password: string, name: string, mobile: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Default context values
export const initialState: IAuthContext = {
  user: null,
  loadingAuth: true,
  signUp: async () => {},
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  userData: null,
};

// Create the Auth context with the initial state
export const AuthContext = createContext<IAuthContext>(initialState);
