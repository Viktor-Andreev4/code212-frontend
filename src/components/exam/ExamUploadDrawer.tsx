import {
  Box,
  Button,
  Input,
  Stack,
  Select,
  FormLabel,

  DrawerFooter,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody
} from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react'
import { getProblems } from '../../services/client.ts'
// import BasicDateTimePicker from '../Date/DatePicker';

interface ExamDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  inputUrl: string;
  outputUrl: string;
}

function ExamDrawer({ isOpen, onClose, onOpen }: ExamDrawerProps) {

  const firstField = useRef(null);
  const [availableProblems, setAvailableProblems] = useState<Problem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const result = await getProblems();
        setAvailableProblems(result.data);
      } catch (error) {
        console.error("Error while fetching problems", error);
      }
    }

    if(isOpen) { // Fetch problems when the drawer opens
      fetchProblems();
    }
  }, [isOpen]); // re-run the effect when `isOpen` changes

  const handleProblemSelection = (e: any) => {
    const selectedProblemId = e.target.value;
    const selectedProblem = availableProblems.find(problem => problem.id.toString() === selectedProblemId);
    const remainingProblems = availableProblems.filter(problem => problem.id.toString() !== selectedProblemId);
  
    if (selectedProblem) { // Check if selectedProblem is not undefined
      setSelectedProblems([...selectedProblems, selectedProblem]);
      setAvailableProblems(remainingProblems);
    }
  }

  return (
    <>
      <Button colorScheme='teal' onClick={onOpen} mr={4}>
        Create Exam
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        initialFocusRef={firstField}
        onClose={onClose}
        size={'xl'}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>
            Create a new exam
          </DrawerHeader>

          <DrawerBody>
        <Stack spacing='24px'>
          {/* ... */}
          <Box>
            <FormLabel htmlFor='owner'>Select Problems</FormLabel>
            <Select id='owner' onChange={handleProblemSelection}>
              <option value="">Please select a problem</option>
              {availableProblems.map((problem) => (
                <option key={problem.id} value={problem.id}>{problem.title}</option>
              ))}
            </Select>
          </Box>

          <Box>
            <h4>Selected Problems</h4>
            {selectedProblems.map(problem => (
              <div key={problem.id}>{problem.title}</div>
            ))}
          </Box>
        </Stack>
      </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
export default ExamDrawer;