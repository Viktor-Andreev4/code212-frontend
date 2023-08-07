import {
  Alert,
  AlertIcon,
  Box,
  Button,
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
  Input,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { getProblems } from '../../services/client.ts';
import { Formik, Form, useField } from 'formik';
import { useToast } from "@chakra-ui/react";
import * as Yup from 'yup';
import { postExam } from '../../services/client.ts';
import DateTimePicker from 'react-datetime-picker';
import './DateTime.css';



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

interface MyTextInputProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  id?: string;
}

interface MyDateTimeInputProps {
  label: string;
  name: string;
  id?: string;
}

const MyTextInput = ({ label, ...props }: MyTextInputProps) => {
  const [field, meta] = useField(props);
  return (
    <Box>
      <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
      <Input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <Alert className="error" status={"error"} mt={2}>
          <AlertIcon />
          {meta.error}
        </Alert>
      ) : null}
    </Box>
  );
};

const MyDateTimeInput = ({ label, ...props }: MyDateTimeInputProps) => {
  const [field, meta, helpers] = useField(props.name);
  const [key, setKey] = useState(Math.random());

  const handleClose = (value: Date | null) => {
    helpers.setValue(value);
    setKey(Math.random());
  }

  return (
    <Box>
      <FormLabel htmlFor={props.name}>{label}</FormLabel>
      <DateTimePicker
        key={key}
        onChange={handleClose}
        value={field.value}
      />
      {meta.touched && meta.error ? (
        <Alert className="error" status={"error"} mt={2}>
          <AlertIcon />
          {meta.error}
        </Alert>
      ) : null}
    </Box>
  );
};


function ExamDrawer({ isOpen, onClose, onOpen }: ExamDrawerProps) {

  const firstField = useRef(null);
  const toast = useToast();
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

    if (isOpen) {
      fetchProblems();
    }
  }, [isOpen]);

  const handleProblemSelection = (e: any) => {
    const selectedProblemId = e.target.value;
    const selectedProblem = availableProblems.find(problem => problem.id.toString() === selectedProblemId);
    const remainingProblems = availableProblems.filter(problem => problem.id.toString() !== selectedProblemId);

    if (selectedProblem) {
      setSelectedProblems([...selectedProblems, selectedProblem]);
      setAvailableProblems(remainingProblems);
    }
  }

  const handleRemoveProblem = (id: number) => {
    const problemToRemove = selectedProblems.find(problem => problem.id === id);
    const remainingProblems = selectedProblems.filter(problem => problem.id !== id);

    if (problemToRemove) {
      setSelectedProblems(remainingProblems);
      setAvailableProblems([...availableProblems, problemToRemove]);
    }
  }

  return (
    <>
      <Button colorScheme='blue' onClick={onOpen} mr={4}>
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
            <Formik
              initialValues={{ examName: '', examStartDate: new Date(), examEndDate: new Date() }}
              validationSchema={Yup.object({
                examName: Yup.string()
                  .required('Required'),
                examStartDate: Yup.date()
                  .required('Required')
                  .nullable(),
                examEndDate: Yup.date()
                  .required('Required')
                  .nullable()
              })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const response = await postExam(
                    values.examName,
                    values.examStartDate,
                    values.examEndDate,
                    selectedProblems.map(problem => problem.id)
                  );
                  console.log(response.data);
                  toast({
                    title: "Exam created.",
                    description: "Your exam has been successfully created.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  });
                  onClose();
                } catch (error) {
                  console.error("Error while creating exam", error);
                  toast({
                    title: "Error.",
                    description: "An error occurred while creating the exam.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                }
                setSubmitting(false);
              }}
            >
              <Form>
                <Stack spacing={10}>
                  <MyTextInput
                    label={"Exam Name"}
                    name={"examName"}
                    type={"text"}
                    placeholder={"Type the exam name"}
                  />
                  <MyDateTimeInput
                    label={"Exam Start Date"}
                    name={"examStartDate"}
                  />
                  <MyDateTimeInput
                    label={"Exam End Date"}
                    name={"examEndDate"}
                  />
                </Stack>

                <Stack spacing='24px'>
                  <Box mt={18}>
                    <FormLabel htmlFor='owner'>Select Problems</FormLabel>
                    <Select id='owner' onChange={handleProblemSelection}>
                      <option value="">Please select a problem</option>
                      {availableProblems.map((problem) => (
                        <option key={problem.id} value={problem.id}>{problem.title}</option>
                      ))}
                    </Select>
                  </Box>
                </Stack>

                <Box mb={3} mt={5} ml={2}>
                  <h4>Selected Problems</h4>
                  {selectedProblems.map(problem => (
                    <Box key={problem.id} mt={1} display="flex" alignItems="center">
                      <Box mr={2}>{problem.title}</Box>
                      <Button size="sm" colorScheme="red" onClick={() => handleRemoveProblem(problem.id)}>Remove</Button>
                    </Box>
                  ))}
                </Box>
                <DrawerFooter borderTopWidth='1px'  >
                  <Button variant='outline' mr={3} mt={50} onClick={onClose} >
                    Cancel
                  </Button>
                  <Button colorScheme='blue' type="submit" mt={50}>Submit</Button>
                </DrawerFooter>
              </Form>
            </Formik>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
export default ExamDrawer;