import { 
  Button,
  Box, 
  Heading, 
  UnorderedList, 
  ListItem, 
  Text, 
  VStack, 
  Container, 
  Divider 
} from "@chakra-ui/react";
import { useLocation, useNavigate } from 'react-router-dom';

interface Problem {
  id: number;
  title: string;
  description: string;
  input_url: string;
  output_url: string;
}

function ProblemsPage() {
  const location = useLocation();
  const problems = location.state.problems;
  const navigate = useNavigate();

  const handleStartProblem = (problem: Problem) => {
    navigate('/code-editor', { state: { problem: problem } });
  };

  return (
    <Container maxW="container.lg" p="5" bg="#282828" color="white" height="100vh">
      <VStack spacing={8} align="stretch">
        {problems.map((problem: Problem, index: number) => (
          <Box
            key={index}
            p={5}
            bg="#282828"
            shadow="lg"
            borderWidth="1px"
            borderColor="gray.600"
            borderRadius="md"
            _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
            transition="transform 0.2s ease, box-shadow 0.2s ease"
          >
            <Heading size="lg" mb={2} color="white">
              {problem.title}
            </Heading>
            <Divider my={3} borderColor="gray.600" />
            <Text fontWeight="bold" mb={2}>Description:</Text>
            <UnorderedList spacing={2} color="gray.300">
              <ListItem key={index}>
                <Text>{problem.description}</Text>
              </ListItem>
            </UnorderedList>
            <Button onClick={() => handleStartProblem(problem)} colorScheme="blue" mt={4}>Start</Button>
          </Box>
        ))}
      </VStack>
    </Container>
  );
}

export default ProblemsPage;
