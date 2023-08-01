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
} from '@chakra-ui/react';
import { FiBook } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { getAllExams, getExamParticipants } from '../../services/client';
import { Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface NavItemProps extends FlexProps {
  exam: Exam;
  onExamSelect: (examId: number) => void;
}
interface Exam {
  id: number;
  name: string;
}

interface Participant {
  firstName: string;
  lastName: string;
  email: string;
}

interface SidebarContentProps extends BoxProps {
  examsProp: Exam[];
  selectExam: (examId: number) => void;
  onClose: () => void;
}

const NavItem = ({ exam, onExamSelect, ...rest }: NavItemProps) => {
  const handleClick = () => {
    onExamSelect(exam.id);
  };

  return (
    <Box
      as="button"
      onClick={handleClick}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
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

const SidebarContent = ({ examsProp: exams, selectExam, onClose, ...rest }: SidebarContentProps) => {
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
        <NavItem key={exam.id} exam={exam} onExamSelect={selectExam} />
      ))}
    </Box>
  )
}

function Participants() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [exams, setExams] = useState<Exam[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    getAllExams().then((response) => {
      setExams(response.data);
    }).catch((error) => {
      console.error("Failed to fetch exams:", error);
    });
  }, []);

  const handleExamSelect = (examId: number) => {
    getExamParticipants(examId).then((response) => {
      setParticipants(response.data);
    }).catch((error) => {
      console.error(`Failed to fetch participants for exam ${examId}:`, error);
    });
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent examsProp={exams} selectExam={handleExamSelect} onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent examsProp={exams} selectExam={handleExamSelect} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(400px, 2fr))'>
          {participants.length === 0 ? (
            <Text>No participants</Text>
          ) : (
            participants.map((participant: Participant) => (
              <Card mb={5} mr={5}>
                <CardHeader>
                  <Heading size='md' textAlign="center"> {participant.firstName + " " + participant.lastName}</Heading>
                </CardHeader>
                <CardBody>
                  <Text textAlign="center">Email: {participant.email}</Text>
                  <Text textAlign="center">View a summary of all your customers over the last month.</Text>
                </CardBody>
                <CardFooter display="flex" justifyContent="center">
                  <Button>View here</Button>
                </CardFooter>
              </Card>
            ))
          )}
        </SimpleGrid>

      </Box>
    </Box>
  )
}

export default Participants;
