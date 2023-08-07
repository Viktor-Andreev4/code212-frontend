import {
  CloseButton,
  SimpleGrid,
  Heading,
  Box,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  List,
  ListItem,
} from '@chakra-ui/react';
import { FiBook } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { getAllExams, getExamParticipants, getParticipantGrades } from '../../services/client';
import { Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import EditReportModal from './EditReportModal';

interface NavItemProps extends FlexProps {
  exam: Exam;
  onExamSelect: (examId: number) => void;
  setSelectedExamId: (examId: number) => void;
}
interface Exam {
  id: number;
  name: string;
}

interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
interface Problem {
  id: number;
  title: string;
  description: string;
}

interface Grade {
  id: number;
  problem: Problem;
  grade: number;
  report: string;
  participant: Participant;
  examId: number;
}

interface SidebarContentProps extends BoxProps {
  examsProp: Exam[];
  selectExam: (examId: number) => void;
  setSelectedExamId: (examId: number) => void;
  onClose: () => void;
}



const NavItem = ({ exam, onExamSelect, setSelectedExamId, ...rest }: NavItemProps) => {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onExamSelect(exam.id);
  };
  return (
    <Box
      as="button"
      onClick={handleClick}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      {...rest}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        <Icon
          as={FiBook}
          mr="4"
          fontSize="16"
          _groupHover={{
            color: 'white',
          }}
        />
        <Text>{exam.name}</Text>
      </Flex>
    </Box>
  );
};

const SidebarContent = ({ examsProp: exams, selectExam, setSelectedExamId, onClose, ...rest }: SidebarContentProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>

      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="center"
      >
        <ChakraLink as={Link} to="/dashboard">
          <Button colorScheme="teal">Dashboard</Button>
        </ChakraLink>
      </Flex>

      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
      >
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Exam list
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      {exams.map((exam) => (
        <NavItem key={exam.id} exam={exam} onExamSelect={selectExam} setSelectedExamId={setSelectedExamId} />
      ))}
    </Box>
  )
}

function Participants() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [exams, setExams] = useState<Exam[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [selectedGradeToEdit, setSelectedGradeToEdit] = useState<Grade | null>(null);

  const handleEdit = (grade: Grade) => {
    setSelectedGradeToEdit(grade);
    console.log(grade);

  };
  
  useEffect(() => {
    getAllExams().then((response) => {
      setExams(response.data);
    }).catch((error) => {
      console.error("Failed to fetch exams:", error);
    });
  }, []);

  const handleExamSelect = (examId: number) => {
    setSelectedExamId(examId);


    getExamParticipants(examId).then((response) => {
      setParticipants(response.data);
    }).catch((error) => {
      console.error(`Failed to fetch participants for exam ${examId}:`, error);
    });
  };

  const handleViewClick = (participant: Participant) => {
    setSelectedParticipant(participant);

    if (selectedExamId !== null) {
      getParticipantGrades(selectedExamId, participant.id)
        .then(response => {
          setGrades(response.data);
        })
        .catch(error => {
          console.error("Failed to fetch grades:", error);
        });
    }
    setModalOpen(true);
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent 
      examsProp={exams} 
      selectExam={handleExamSelect} 
      setSelectedExamId={setSelectedExamId} 
      onClose={onClose} 
      display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent 
          examsProp={exams} 
          selectExam={handleExamSelect} 
          setSelectedExamId={setSelectedExamId} 
          onClose={onClose} 
          display={{ base: 'none', md: 'block' }} />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(400px, 2fr))'>
          {participants.length === 0 ? (
            <Text>No participants</Text>
          ) : (
            participants.map((participant: Participant) => (
              <Card mb={5} mr={5} key={participant.email}>
                <CardHeader>
                  <Heading size='md' textAlign="center"> {participant.firstName + " " + participant.lastName}</Heading>
                </CardHeader>
                <CardBody>
                  <Text textAlign="center">Email: {participant.email}</Text>
                  <Text textAlign="center">View how this student is graded.</Text>
                </CardBody>
                <CardFooter display="flex" justifyContent="center">
                  <Button onClick={() => handleViewClick(participant)}>View here</Button>
                </CardFooter>
              </Card>
            ))
          )}
        </SimpleGrid>
      </Box>


      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Participant Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedParticipant && (
              <>
                <Text>Name: {selectedParticipant.firstName} {selectedParticipant.lastName}</Text>
                <Text>Email: {selectedParticipant.email}</Text>
                <Text>Grades:</Text>
                <List>
                  {grades.map((grade, index) => (
                    <ListItem key={index}>
                      <Text>{grade.problem.title} - {grade.grade}</Text>
                      <Text>{grade.report}</Text>
                      <Button onClick={() => handleEdit(grade)}>Edit</Button>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {selectedGradeToEdit && (
        <EditReportModal grade={selectedGradeToEdit} onClose={() => setSelectedGradeToEdit(null)} />
      )}
    </Box>
  )
}

export default Participants;