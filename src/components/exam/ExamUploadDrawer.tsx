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
  const [problems, setProblems] = useState<Problem[]>([]); // provide type to the state

  useEffect(() => {
    async function fetchProblems() {
      try {
        const result = await getProblems();
        setProblems(result.data);
      } catch (error) {
        console.error("Error while fetching problems", error);
      }
    }

    if(isOpen) { // Fetch problems when the drawer opens
      fetchProblems();
    }
  }, [isOpen]);

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
        <Box>
                <FormLabel htmlFor='examname'>Exam name</FormLabel>
                <Input
                  ref={firstField}
                  id='examname'
                  placeholder='Please enter name for the exam'
                />
              </Box>
          <Box>
            <FormLabel htmlFor='owner'>Select Problems</FormLabel>
            <Select id='owner'>
              {problems.map((problem) => (
                <option key={problem.id} value={problem.id}>{problem.title}</option>
              ))}
            </Select>
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