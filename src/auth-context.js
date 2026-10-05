import { createContext, useContext } from 'react';
export const AuthContext = createContext({ user: null, loading: false, requireAuth: () => {}, openProfile: () => {} });
export const useAuth = () => useContext(AuthContext);
