import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from 'react';
import { login as performLogin } from '../../services/client.ts';
import { AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';

interface User {
    firstName?: string;
    lastName?: string;
    username?: string;
    password?: string;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<AxiosResponse<any>>;
    logout: () => void;
    isUserAuthenticated: () => boolean;
}

interface DecodedToken {
    exp: number;
    sub: string;
    scopes: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token: string | null = localStorage.getItem("jwtToken");
        if (token) {
            const decodedToken: DecodedToken = jwtDecode(token);
            setUser({
                username: decodedToken.sub,
                roles: decodedToken.scopes
            })
        }
    }, [])


    const login = async (username: string, password: string) => {
        return new Promise<AxiosResponse<any>>((resolve, reject) => {
            performLogin(username, password).then((res: AxiosResponse<any, any> | undefined) => {
                if (res) {
                    const jwtToken = res.headers["authorization"];
                    localStorage.setItem("jwtToken", jwtToken);
                    const decodedToken: DecodedToken = jwtDecode(jwtToken);
                    setUser({
                        username: decodedToken.sub,
                        roles: decodedToken.scopes
                    })
                    resolve(res);
                }
            }).catch(err => {
                reject(err);
            })
        })
    }

    

    const logout = () => {
        localStorage.removeItem("jwtToken");
        setUser(null);
    }

    const isUserAuthenticated = () => {

        const token: string | null = localStorage.getItem("jwtToken");

        if(!token) return false;

        const decodedToken: DecodedToken =  jwtDecode(token);
        const { exp: expiration } = decodedToken;

        if (Date.now() > expiration * 1000) {
            logout();
            return false;
        }
        return true;
    }
    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isUserAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider')
    }
    return context;
}


export default AuthProvider;