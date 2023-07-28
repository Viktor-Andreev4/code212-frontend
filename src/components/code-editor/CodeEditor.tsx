import {
    Box,
    Button,
    Heading,
    Text,
    Flex,
    Spacer,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useState, useRef } from 'react';
import Editor from "@monaco-editor/react";
import * as monaco from 'monaco-editor';

interface Files {
    [fileName: string]: {
        name: string;
        language: string;
        value: string;
    }
}

const files: Files = {
    "script.py": {
        name: "script.py",
        language: "python",
        value: "print('Hello, World')"
    },
    "Main.java": {
        name: "Main.java",
        language: "java",
        value: `package org.example;
        public class HelloWorld {
            public static void main(String[] args) {
                System.out.println("Hello, World");
            }
        }
        `
    },
    "script.js": {
        name: "script.js",
        language: "javascrip",
        value: `console.log("Hello, World")
          `
    }
}
function ProblemPage() {
    const [fileName, setFileName] = useState("Main.java");
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const file = files[fileName];
    const problem = {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'Easy',
    };


    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, _monaco: typeof monaco) {
        editorRef.current = editor as monaco.editor.IStandaloneCodeEditor;
    }
    function getEditorValue() {
        if (editorRef.current) {
            const model = editorRef.current.getModel();
            if (model) {
                const value: string = model.getValue();
                alert(value);
            }
        }
    }   

    return (
        <Flex  p={1} h="100vh">
            <Box flex="1" p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{problem.title}</Heading>
                <Text mt={4}>{problem.description}</Text>
            </Box>
            <Spacer />
            <Box position="fixed" right="0%" top="1%" bottom="1%" width="48.9%" height="85vh">
            <   Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Switch Language
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={() => setFileName("Main.java")}>Java</MenuItem>
                    <MenuItem onClick={() => setFileName("script.js")}>JavaScript</MenuItem>
                    <MenuItem onClick={() => setFileName("script.py")}>Python</MenuItem>
                </MenuList>
                </Menu>

                <Editor
                    height="100%"
                    width="100%"
                    theme="vs-dark"
                    onMount={handleEditorDidMount}
                    path={file.name}
                    defaultLanguage={file.language}
                    defaultValue={file.value}
                />
                <Button position="fixed" right="0%" onClick={getEditorValue}>
                    Get Editor Value
                </Button>
            </Box>
        </Flex>
    );
}

export default ProblemPage;