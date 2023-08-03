import { useFormik, FormikProvider, useField } from 'formik';
import * as Yup from 'yup';
import { useRef } from 'react';
import { Box, Button, Stack, FormLabel, DrawerFooter, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Alert, AlertIcon, Input, useToast } from '@chakra-ui/react';
import MultipleFileUploadField from './MultipleFileUploadField';
import { createProblem, getS3UrlInput, getS3UrlOutput, uploadFileS3 } from '../../services/client.ts';

const validationSchema = Yup.object({
  problemName: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  inputFiles: Yup.mixed().required('Required'),
  outputFiles: Yup.mixed().required('Required'),
});

interface ProblemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

interface MyTextInputProps {
  id?: string;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
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

function ProblemDrawer({ isOpen, onClose, onOpen }: ProblemDrawerProps) {
  const firstField = useRef(null);
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      problemName: '',
      description: '',
      inputFiles: null,
      outputFiles: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {

      console.log(values);
      const inputFile = values.inputFiles;
      const outputFile = values.outputFiles;

      // get Url
      const s3UrlInput = await getS3UrlInput(values.problemName);
      const s3UrlOutput = await getS3UrlOutput(values.problemName);
      console.log(s3UrlInput);
      // post to s3
      await uploadFileS3(inputFile!, s3UrlInput);
      await uploadFileS3(outputFile!, s3UrlOutput); 

      // post to backend
      await createProblem(values.problemName, values.description, s3UrlInput, s3UrlOutput);

      toast({
        title: "Problem created.",
        description: "Your problem has been successfully created.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      
    }
    
  });

  return (
    <FormikProvider value={formik}>
      <Button colorScheme='teal' onClick={onOpen} mr={4}>
        Create Problem
      </Button>
      <Drawer isOpen={isOpen} placement='right' initialFocusRef={firstField} onClose={onClose} size={'xl'}>
        <DrawerOverlay />
        <DrawerContent>
          <form onSubmit={formik.handleSubmit}>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
              Create a new problem
            </DrawerHeader>
            <DrawerBody>
              <Stack spacing='24px'>
                <MyTextInput id='problemName' name='problemName' label='Name' placeholder='Please enter problem name' />
                <MyTextInput id='description' name='description' label='Problem description' placeholder='Enter some text' />
                <FormLabel htmlFor='inputFiles'>Drop input .txt files here</FormLabel>
                <MultipleFileUploadField id='inputFiles' name='inputFiles' setFieldValue={formik.setFieldValue} />
                <FormLabel htmlFor='outputFiles'>Drop output .txt files here</FormLabel>
                <MultipleFileUploadField id='outputFiles' name='outputFiles' setFieldValue={formik.setFieldValue} />
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth='1px'>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='blue' type="submit">Submit</Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </FormikProvider>
  );
}

export default ProblemDrawer;

