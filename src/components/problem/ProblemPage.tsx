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
}

function ProblemsPage() {
  const location = useLocation();
  const problems = location.state.problems;
  const navigate = useNavigate();

  const handleStartProblem = (problem: Problem) => {
    navigate('/code-editor', { state: { problem: problem } });
  };

  return (
    <Container maxW="container.lg" p="5" color="#282828" bg="#F7F7F7" height="100vh" display="flex" flexDirection="column" fontFamily={'"Space Mono", sans-serif'}>
      <VStack spacing={8} align="stretch" justify="start" flexDirection="column" height="100%"> 
        {problems.map((problem: Problem, index: number) => (
          <Box
            key={index}
            p={5}
            bg="white"
            shadow="lg"
            borderWidth="1px"
            borderColor="gray.300"
            borderRadius="md"
            _hover={{ transform: "translateY(-4px)", shadow: "xl", borderColor: "gray.400" }}
            transition="transform 0.2s ease, box-shadow 0.2s ease"
          >
            <Heading size="lg" mb={2} color="#282828" fontFamily={'"Space Mono", sans-serif'}>
              {problem.title}
            </Heading>
            <Divider my={3} borderColor="gray.300" />
            <Text fontWeight="bold" mb={2}>Description:</Text>
            <UnorderedList spacing={2} color="gray.700">
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
