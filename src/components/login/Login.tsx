import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./login.scss";

const Login = () => {
    const { loginAdmin, loginUser } = useAuth();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>(""); 
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false); 
    const [errorMessage, setError] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setIsAdmin(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); 
    
        try {
            let success;
            if (isAdmin) {
                success = await loginAdmin(username, password);
            } else {
                success = await loginUser(username, profilePicture);
            }
    
            const response = success
                ? { data: { status: "success" } }
                : { data: { status: "error", code: -1004 } }; 
    
            if (response.data.status === "error") {
                if (response.data.code === -1004) {
                    setError("Korisnik je već prijavljen. Pokušajte sa drugim korisničkim imenom.");
                    return;
                } else if (response.data.code === -1002) {
                    setError("Korisničko ime je zauzeto, pokušajte ponovo.");
                    return;
                } else {
                    setError("Došlo je do greške pri prijavi.");
                    return;
                }
            }
    
            navigate(isAdmin ? "/admin" : "/game");
        } catch (error: any) {
            setError("Došlo je do greške na serveru. Pokušajte ponovo kasnije.");
        }
    };
    
    return (
        <div className="login-container">
            <h2>{isAdmin ? "Prijava za admina" : "Prijava za korisnika"}</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Korisničko ime"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                {isAdmin ? (
                    <input
                        type="password"
                        placeholder="Lozinka"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                ) : (
                    <div className="file-input-wrapper">
                        <label className="custom-file-input">
                            Izaberi sliku (opciono)
                            <input
                                type="file"
                                className="file-input"
                                accept="image/*"
                                onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                            />
                        </label>
                        {profilePicture && (
                            <img
                                src={URL.createObjectURL(profilePicture)}
                                alt="Pregled slike"
                                className="image-preview"
                            />
                        )}
                    </div>
                )}
                <button type="submit">Prijavi se</button>
            </form>
            <button className="toggle-button" onClick={() => setIsAdmin(!isAdmin)}>
                {isAdmin ? "Prebaci na korisničku prijavu" : "Prebaci na admin prijavu"}
            </button>
        </div>
    );
};

export default Login;


