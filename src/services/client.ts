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
    firstName: string, lastName: string, email: string, password: string) => {

    return await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users`,
        { firstName, lastName, email, password });
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

export const getAllExams = async () => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/exams/all`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
}

export const getExamParticipants = async (examId: number) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/exams/${examId}/participants`,
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
}

export const getS3UrlInput = async (problemName: string, fileName: string): Promise<string> => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/problems/upload/input`,
            {
                ...getAuthConfig(),
                params: {
                    problemName: problemName,
                    fileName: fileName
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getS3UrlOutput = async (problemName: string, fileName: string): Promise<string> => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/problems/upload/output`,
            {
                ...getAuthConfig(),
                params: {
                    problemName: problemName,
                    fileName: fileName
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const uploadFileS3 = async (file: File, url: string) => {
    try {

        const config = {
            headers: {
                "Content-Type": "text/plain"
            },
        };
        const response = await axios.put(url, file, config);

        return response;
    }
    catch (error) {
        throw error;
    }
}


export const createProblem = async (title: string, description: string, inputUrl: string, outputUrl: string) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/problems`,
            { title, description, inputUrl, outputUrl },
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
}

export const sendSubmission = async (code: string, examId: number, userId: number, problemId: number, language: string) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/code/execute`,
            { problemId, examId, userId, code, language },
            getAuthConfig()
        );
    } catch (error) {
        throw error;
    }
}

export const getS3SubmissionLink = async (userId: number, problemName: string, uuid: string): Promise<string> => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/code/upload`,
            {
                ...getAuthConfig(),
                params: {
                    userId: userId,
                    problemName: problemName,
                    uuid: uuid
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

