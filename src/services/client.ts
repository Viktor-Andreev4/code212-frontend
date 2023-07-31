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
export const register = async (
    firstName:string, lastName: string, email:string, password:string) => {

    return await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users`,
        {firstName, lastName, email, password});
}

export const login = async (username: string, password: string) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`
            , { username, password });
    } catch (error) {
        throw error;
    }
}

export const getProblems = async () => {
    try {
        return await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/problems`,
            getAuthConfig());
    } catch (error) {
        throw error;
    }
}

export const postExam = async (
    name: string,
    startTime: Date,
    endTime: Date,
    problems: number[]) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/exams`,
            { name, startTime, endTime, problems },
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
}

export const enrollUser = async (userId: number, examId: number) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/exams/enroll`,
            { userId, examId },
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
}

export const getUserId = async (email: string) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/email/${email}`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
}