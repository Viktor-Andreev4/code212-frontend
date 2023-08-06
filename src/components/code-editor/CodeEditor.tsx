import {
    Alert,
    AlertIcon,
    Spinner,
    Box,
    Button,
    Heading,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Flex
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useState, useRef } from 'react';
import Editor from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import { useLocation } from 'react-router-dom';
import SplitPane from './SplitPane';
import jwt_decode from 'jwt-decode';
import { getS3SubmissionLink, sendSubmission, uploadFileS3 } from '../../services/client';

interface Status {
    id: number;
    description: string;
}

interface Submission {
    memory: number;
    status: Status;
    stderr: string;
    stdin: string;
    stdout: string;
    time: number;
}

interface Files {
    [fileName: string]: {
        name: string;
        language: string;
        value: string;
    }
}

interface Problem {
    id: number;
    title: string;
    description: string;
    input_url: string;
    output_url: string;
}

interface DecodedToken {
    userId: number;
    exp: number;
    sub: string;
    scopes: string[];
}

const files: Files = {
    "Python": {
        name: "Python",
        language: "python",
        value: "print('Hello, World')"
    },
    "JavaScript": {
        name: "JavaScript",
        language: "javascript",
        value: `console.log("Hello, World")
          `
    },
    "Java": {
        name: "Java",
        language: "java",
        value: `class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
    `
    },
    "C++": {
        name: "C++",
        language: "cpp",
        value: `#include <iostream>

int main() {

    int number;
    std::cin >> number;
    std::cout << number << std::endl;
        
return 0;
}
    `
    }


}
function CodeEditor() {
    const [loading, setLoading] = useState(false);
    const [submissionResult, setSubmissionResult] = useState<string | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    const [language, setLanguage] = useState("c++");
    const [fileName, setFileName] = useState("C++");
    const location = useLocation();
    const problem: Problem = location.state.problem;
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const file = files[fileName];


    const switchLanguage = (lang: string, fileName: string) => {
        setLanguage(lang);
        setFileName(fileName);
    }
    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, _monaco: typeof monaco) {
        editorRef.current = editor as monaco.editor.IStandaloneCodeEditor;
    }
    async function getEditorValue() {
        if (editorRef.current) {
            const model = editorRef.current.getModel();
            if (model) {
                const code: string = model.getValue();
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    console.error('JWT not found');
                    return;
                }
                const decodedToken: DecodedToken = jwt_decode(token);
                const data = {
                    problemId: problem.id,
                    userId: decodedToken.userId,
                    code,
                    language
                }
                setLoading(true);
                setSubmissionResult(null);
                await sendSubmission(data.code, data.userId, data.problemId, data.language)
                    .then(async (res) => {

                        setLoading(false);
                        const submissionsData: Submission[] = res.data;
                        setSubmissions(submissionsData);
                        console.log(submissionsData);

                        const errorStatus = submissions.find(sub => sub.status.id > 4);

                        if (errorStatus) {

                            setSubmissionResult(errorStatus.status.description);
                        } else {
                            const statusCode4 = submissions.find(sub => sub.status.id === 4);

                            if (statusCode4) {
                                setSubmissionResult(`Input: ${statusCode4.stdin} | Output: ${statusCode4.stdout}`);
                            } else {
                                setSubmissionResult(`${submissionsData.length} / ${submissionsData.length}`);
                            }
                        }

                        const userId = data.userId;
                        const codeString = data.code;
                        const uuid = crypto.randomUUID() + ".txt";
                        const s3SignedUrl = await getS3SubmissionLink(userId, problem.title, uuid);

                        const blob = new Blob([codeString], { type: 'text/plain' });
                        const codeFile = new File([blob], crypto.randomUUID(), { type: 'text/plain' });
                        await uploadFileS3(codeFile, s3SignedUrl);

                    })
                    .catch((error) => {
                        console.error(error);
                        setLoading(false);
                        setSubmissionResult('Error');
                    });

            }
        }
    }


    return (
        <Box style={{ backgroundColor: '#282828', width: '100%', height: '100vh' }}>
            <SplitPane
                left={
                    <Box
                        p={5}
                        shadow="md"
                        borderWidth="2px"
                        borderColor="gray.600"
                        borderRadius="md"
                        color="white"
                        backgroundColor="#282828"
                    >
                        <Heading fontSize="xl">{problem.title}</Heading>
                        <Text mt={4} color="gray.300">{problem.description}</Text>
                    </Box>
                }
                right={
                    <Box position="relative" width="100%" height="100vh" backgroundColor="#282828">
                        <Box m={1}>
                            <Menu >
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} backgroundColor="#282828" color="white">
                                    {fileName}
                                </MenuButton>
                                <MenuList backgroundColor="#282828">
                                    {Object.keys(files).map((fileName) => (
                                        <MenuItem key={fileName} onClick={() => switchLanguage(files[fileName].language, fileName)}>
                                            {fileName}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        </Box>
                        <Box
                            borderWidth="2px"
                            borderColor="gray.600"
                            borderRadius="md"
                            mt={2}
                            mb={4}
                            overflow="hidden"
                            height="78%"
                        >
                            <Editor
                                height="100%"
                                width="100%"
                                theme="vs-dark"
                                onMount={handleEditorDidMount}
                                path={file.name}
                                defaultLanguage={file.language}
                                defaultValue={file.value}
                            />
                        </Box>
                        <Box
                            width="97%"
                            height="13%"
                            borderTop="1px solid"
                            borderColor="gray.300"
                            position="relative"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            mr={1}
                            ml={2}
                            px={4}
                            py={2}
                            borderRadius="md"
                            backgroundColor="#282828"
                            css={loading ? {
                                animation: "breathing 1.5s infinite",
                                boxShadow: "0 0 10px rgba(255, 165, 0, 0.9)"
                            } : {}}
                        >
                            <Flex>
                                {loading && <Spinner color="yellow.400" mr={4} />}
                                {submissionResult && (
                                    <Alert
                                        status={
                                            submissionResult === "Accepted" || !submissionResult.includes("Output")
                                                ? "success"
                                                : "error"
                                        }
                                        borderRadius="8px"
                                        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                                        p={4}
                                        transition="opacity 0.3s ease"
                                    >
                                        <AlertIcon boxSize="24px" mr={1} />
                                        {submissionResult}
                                    </Alert>
                                )}
                            </Flex>
                            <Button
                                onClick={getEditorValue}
                                colorScheme="green"
                                size="lg"
                                shadow="md"
                                _hover={{ opacity: 0.8 }}
                                _active={{ opacity: 0.6 }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                }
            />
        </Box>
    );

}

export default CodeEditor;
