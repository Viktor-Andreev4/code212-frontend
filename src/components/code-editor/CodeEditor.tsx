import {
    Box,
    Button,
    Heading,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useState, useRef } from 'react';
import Editor from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import { useLocation } from 'react-router-dom';
import SplitPane from './SplitPane';
import jwt_decode from 'jwt-decode';
import { sendSubmission } from '../../services/client';

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
    "script.py": {
        name: "script.py",
        language: "python",
        value: "print('Hello, World')"
    },
    "script.js": {
        name: "script.js",
        language: "javascript",
        value: `console.log("Hello, World")
          `
    }
}
function CodeEditor() {
    const [language, setLanguage] = useState("JavaScript");
    const [fileName, setFileName] = useState("script.js");
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
                const codeFile = new File([code], 'code.txt', { type: 'text/plain' });
                const data = {
                    problemId: problem.id,
                    userId: decodedToken.userId,
                    codeFile,
                    language
                }

                await sendSubmission(
                    data.problemId,
                    data.userId,
                    data.codeFile,
                    data.language)
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
    }

    return (
        <SplitPane
            left={
                <Box p={5} shadow="md" borderWidth="1px">
                    <Heading fontSize="xl">{problem.title}</Heading>
                    <Text mt={4}>{problem.description}</Text>
                </Box>
            }
            right={
                <Box position="relative" width="100%" height="100vh">
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            Switch Language
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => switchLanguage("Java", "Main.java")}>Java</MenuItem>
                            <MenuItem onClick={() => switchLanguage("JavaScript", "script.js")}>JavaScript</MenuItem>
                            <MenuItem onClick={() => switchLanguage("Python", "script.py")}>Python</MenuItem>
                        </MenuList>
                    </Menu>
                    <Editor
                        height="90%"
                        width="100%"
                        theme="vs-dark"
                        onMount={handleEditorDidMount}
                        path={file.name}
                        defaultLanguage={file.language}
                        defaultValue={file.value}
                    />
                    <Button position="fixed" right="0%" onClick={getEditorValue}>
                        Submit
                    </Button>
                </Box>
            }
        />
    );

}

export default CodeEditor;
