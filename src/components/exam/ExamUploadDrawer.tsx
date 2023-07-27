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
import { useRef } from 'react'
// import BasicDateTimePicker from '../Date/DatePicker';

interface ExamDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

function ExamDrawer({ isOpen, onClose, onOpen }: ExamDrawerProps) {

  const firstField = useRef(null);

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
            Create a new account
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing='24px'>
              <Box>
                <FormLabel htmlFor='username'>Problem Name</FormLabel>
                <Input
                  ref={firstField}
                  id='username'
                  placeholder='Please enter name for the problem'
                />
              </Box>

              <Box>
                <FormLabel htmlFor='owner'>Select Owner</FormLabel>
                <Select id='owner' defaultValue='segun'>
                  <option value='segun'>Segun Adebayo</option>
                  <option value='kola'>Kola Tioluwani</option>
                </Select>
              </Box>

              {/* <BasicDateTimePicker/> */}

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