import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";

interface AuthProviderProps {
    children: ReactNode;
}

const ProtectedRoute = ( {children}: AuthProviderProps ) => {

    const { isUserAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(!isUserAuthenticated()) {
            navigate("/login");
        }
    }, [])

    return isUserAuthenticated() ? children : "";
}

export default ProtectedRoute;