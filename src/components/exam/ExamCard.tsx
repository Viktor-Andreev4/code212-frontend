import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@chakra-ui/react";
import {
  Heading,
  Box,
  Center,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import WithAction from '../../NavBar.tsx';
import jwt_decode from 'jwt-decode';
import { getExam, enrollUser, getUserId } from '../../services/client.ts';

interface Problem {
  id: number;
  title: string;
  description: string;
  input_url: string;
  output_url: string;
}

interface Exam {
  problems: Problem[]
  name: string;
  startTime: string;
  endTime: string;
  id: number;
}

interface DecodedToken {
  exp: number;
  sub: string;
  scopes: string[];
}

function ExamProfile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getExam().then(res => {
      setExam(res.data);
      console.log(res.data);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setLoading(false);
    })
  }, []);

  

  const handleStart = async () => {
    if (exam) {
      try {

        const token = localStorage.getItem('jwtToken');
        
        if (token === null) {
          throw new Error('No JWT token found');
        }
        
        const decodedToken: DecodedToken = jwt_decode(token);
        const email: string = decodedToken.sub; 
        
        const response = await getUserId(email);
        console.log(exam);

        const userId: number = response.data; 
        
        console.log(userId, exam.id);
        await enrollUser(userId, exam.id);
        
        toast({
          title: "Enrollment Successful",
          description: "You have enrolled in the exam!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        navigate('/problems', { state: { problems: exam.problems } });
      } catch (error) {
        toast({
          title: "Enrollment Failed",
          description: "An error occurred while enrolling in the exam",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error(error);
      }
    }
  }

  if (loading) {
    if (!exam) {
      return (
        <Center py={6}>
          <Text>No upcomming exams</Text>
        </Center>
      );
    }
    else {
      return (
        <div className='App'>
          <WithAction />
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </div>
      );
    }

  }

  return (
    <Center py={6}>
      <Box
        maxW={'540px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        textAlign={'center'}
        mt={175}>
        <Heading fontSize={'2xl'} fontFamily={'body'} mb={5}>
          {exam?.name}
        </Heading>
        <Text fontWeight={600} color={'gray.500'} mb={4}>
          Starts: {exam && exam.startTime ? new Date(exam.startTime).toLocaleString() : 'Loading...'}
        </Text>
        <Text fontWeight={600} color={'gray.500'} mb={4}>
          Ends: {exam && exam.endTime ? new Date(exam.endTime).toLocaleString() : 'Loading...'}
        </Text>

        <Stack mt={8} direction={'row'} spacing={4}>
          <Button
            onClick={handleStart}
            flex={1}
            fontSize={'sm'}
            rounded={'full'}
            bg={'blue.400'}
            color={'white'}
            boxShadow={
              '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
            }
            _hover={{
              bg: 'blue.500',
            }}
            _focus={{
              bg: 'blue.500',
            }}>
            Start
          </Button>
        </Stack>
      </Box>
    </Center>
  );
}

export default ExamProfile;