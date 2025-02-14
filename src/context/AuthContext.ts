import { createContext, useContext } from "react";
import { Admin } from "../types/Admin";
import { User } from "../types/User";

export interface AuthContextType {
    admin: Admin | null;
    user: User | null;
    loginAdmin: (username: string, password: string) => Promise<boolean>;
    loginUser: (username: string, profilePicture?: File | null) => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
