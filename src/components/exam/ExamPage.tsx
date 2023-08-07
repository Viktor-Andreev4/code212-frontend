import { useState, useEffect } from "react";
import {
    Box, Text, List, ListItem, Heading,
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalCloseButton, ModalBody, Flex, Icon, Spacer, Divider, ModalFooter, Button
} from "@chakra-ui/react";
import { ChevronRightIcon } from '@chakra-ui/icons';
import { getAllExams } from "../../services/client";
import { useNavigate } from "react-router-dom";


interface Problem {
    id: number;
    title: string;
    description: string;
}
interface Exam {
    problems: Problem[]
    name: string;
    startTime: string;
    endTime: string;
    id: number;
}

const ExamsList = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const navigate = useNavigate();

    const handleExamClick = (exam: Exam) => {
        setSelectedExam(exam);
        setIsModalOpen(true);
    }

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await getAllExams();
                setExams(response.data);
                setLoading(false);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(String(err)); 
                }
            }
        };

        fetchExams();
    }, []);

    return (
        <Box p={4} boxShadow="md" borderWidth="1px" borderRadius="md">
        <Button onClick={() => navigate(-1)} colorScheme="teal" mb={4}>Go Back</Button>

            <Heading mb={6} fontSize="2xl" fontWeight="semibold" color="teal">Exams</Heading>
            {loading ? (
                <Text fontSize="md">Loading...</Text>
            ) : error ? (
                <Text color="red.500" fontSize="md">Error loading exams: {error}</Text>
            ) : (
                <List spacing={4}>
                    {exams.map((exam) => (
                        <ListItem
                            key={exam.id}
                            onClick={() => handleExamClick(exam)}
                            cursor="pointer"
                            p={4}
                            borderRadius="md"
                            _hover={{ bg: "teal.200"}}
                            transition="background-color 0.2s">
                            <Flex>
                                <Text fontWeight="medium" color="teal">{exam.name}</Text>
                                <Spacer />
                                <Icon as={ChevronRightIcon} color="teal" />
                            </Flex>
                        </ListItem>
                    ))}
                </List>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md" isCentered>
                <ModalOverlay />
                <ModalContent borderRadius="xl" bg="gray.50" boxShadow="xl">
                    <ModalHeader fontSize="xl" fontWeight="bold" color="teal.500" pb={2} borderBottom="1px solid" borderColor="gray.200">{selectedExam?.name}</ModalHeader>
                    <ModalCloseButton color="#4299E1" _hover={{ bg: "blue.100" }} />
                    <ModalBody>
                        <Heading size="md" mb={4} color="teal.500">Problems:</Heading>
                        <List spacing={2} mb={4}>
                            {selectedExam?.problems.map(problem => (
                                <ListItem key={problem.id} borderRadius="sm" p={2} bg="teal.100" my={1}>
                                    <Text color="teal.700">{problem.title}</Text>
                                </ListItem>
                            ))}
                        </List>
                        <Divider my={4} />
                        <Text fontSize="md" mb={2}><strong>Start Time:</strong> {selectedExam?.startTime}</Text>
                        <Text fontSize="md" mb={4}><strong>End Time:</strong> {selectedExam?.endTime}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" mr={3} onClick={() => setIsModalOpen(false)}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ExamsList;
