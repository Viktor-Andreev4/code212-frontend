import axios from 'axios';

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
    },
})


export const getUsers = async () => {  
    try {
        return await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users`,
        getAuthConfig());
    } catch (error) {
        throw error;
    }
}

export const getExam = async () => {  
    try {
        return await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/exams`,
        getAuthConfig());
    } catch (error) {
        throw error;
    }
}

export const login = async (username:string, password:string) => {  
    try {
        return await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`
        , {username, password});
    } catch (error) {
        throw error;
    }
}
