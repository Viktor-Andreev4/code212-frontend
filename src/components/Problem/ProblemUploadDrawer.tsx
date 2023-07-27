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
  DrawerBody,
  Textarea
} from '@chakra-ui/react'
import { useRef } from 'react'
import { useDropzone } from "react-dropzone"
import MyDropzone from '../Dropzome';
// import BasicDateTimePicker from '../Date/DatePicker';

interface ProblemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

function ProblemDrawer({ isOpen, onClose, onOpen }: ProblemDrawerProps) {

  const firstField = useRef(null);

  return (
    <>
      <Button colorScheme='teal' onClick={onOpen} mr={4}>
        Create Problem
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
                <FormLabel htmlFor='username'>Name</FormLabel>
                <Input
                  ref={firstField}
                  id='username'
                  placeholder='Please enter user name'
                />
              </Box>

              <Box>
                <FormLabel htmlFor='description'>Problem description</FormLabel>
                <Textarea placeholder="Enter some text" />
              </Box>
              <MyDropzone/>
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
export default ProblemDrawer;