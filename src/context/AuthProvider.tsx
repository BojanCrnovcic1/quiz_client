import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { Admin } from "../types/Admin";
import { User } from "../types/User";
import { ApiConfig } from "../config/ApiConfig";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin");
        const storedUser = localStorage.getItem("user");

        try {
            if (storedAdmin) {
                setAdmin(JSON.parse(storedAdmin));
            }
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error parsing from localStorage:", error);
            localStorage.removeItem("admin");
            localStorage.removeItem("user");
        }
    }, []);

    const loginAdmin = async (username: string, password: string): Promise<boolean> => {
        try {
            const res = await axios.post(ApiConfig.API_URL + "auth/admin/login", { username, password });
            if (res.data.accessToken) {
                const adminData: Admin = {
                    adminId: res.data.adminId,
                    username,
                    password,
                };
                setAdmin(adminData);
                localStorage.setItem("admin", JSON.stringify(adminData));
                navigate("/admin");
                return true;
            }
        } catch (error) {
            console.error("Admin login failed:", error);
        }
        return false;
    };

    const loginUser = async (username: string, profilePicture?: File | null): Promise<boolean> => {
        try {
            const formData = new FormData();
            formData.append("username", username);
            if (profilePicture) {
                formData.append("profile", profilePicture);
            }

            const res = await axios.post(ApiConfig.API_URL + "api/user/login", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.userId) {
                const userData: User = {
                    userId: res.data.userId,
                    username: res.data.username,
                    profilePictureUrl: res.data.profilePictureUrl,
                };
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                navigate("/game");
                return true;
            }
        } catch (error) {
            console.error("User login failed:", error);
        }
        return false;
    };

    const logout = () => {
        setAdmin(null);
        setUser(null);
        localStorage.removeItem("admin");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ admin, user, loginAdmin, loginUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
