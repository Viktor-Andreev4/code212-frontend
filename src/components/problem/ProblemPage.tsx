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
    <Container maxW="container.lg" p="5">
      <VStack spacing={8} align="stretch">
        {problems.map((problem: Problem, index: number) => (
          <Box
            key={index}
            p={5}
            bg="white"
            shadow="lg"
            borderWidth="1px"
            borderRadius="md"
            _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
            transition="transform 0.2s ease, box-shadow 0.2s ease"
          >
            <Heading size="lg" mb={2}>
              {problem.title}
            </Heading>
            <Divider my={3} />
            <Text fontWeight="bold" mb={2}>Description:</Text>
            <UnorderedList spacing={2}>
              <ListItem key={index}>
                <Text>{problem.description}</Text>
              </ListItem>
            </UnorderedList>
            <Button onClick={() => handleStartProblem(problem)} colorScheme="blue" mt={4}>Start</Button> 
            {/* Start button */}
          </Box>
        ))}
      </VStack>
    </Container>
  );
}

export default ProblemsPage;