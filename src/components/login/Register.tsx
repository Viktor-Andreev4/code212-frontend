import {
    Alert,
    AlertIcon,
    Flex,
    Box,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from '@chakra-ui/react';
import { register } from '../../services/client';
import { Formik, Form, useField } from "formik";
import { errorNotification } from '../../services/notification';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

interface MyTextInputProps {
    label: string;
    name: string;
    type: string;
    id?: string;
    placeholder?: string;
}

interface AxiosError {
    response?: {
      data: {
        message: string;
      };
      status: number;
      headers: unknown;
    };
    code?: string;
}

const MyTextInput = ({label, ...props} : MyTextInputProps) => {
    const [field, meta] = useField(props);
    return (
        <Box>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Input className="text-input" {...field} {...props} />
            {meta.touched && meta.error ? (
                <Alert className="error" status={"error"} mt={2}>
                    <AlertIcon/>
                    {meta.error}
                </Alert>
            ) : null}
        </Box>
    );
};

const SignupForm = () => {
    const navigate = useNavigate();
    return (
        <Formik
            validateOnMount={true}
            validationSchema={Yup.object({
                firstName: Yup.string()
                    .required('Required'),
                lastName: Yup.string()
                    .required('Required'),
                email: Yup.string()
                    .email('Must be valid email')
                    .required('Required'),
                password: Yup.string()
                    .min(8, 'Must be 8 characters or more')
                    .required('Required')
            })}
            initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
            onSubmit={(values, { setSubmitting }) => {  
                    setSubmitting(true);

                    register(values.firstName, values.lastName, values.email, values.password)
                    .then((res) => {

                        console.log("User registered successfully!", res);
                        navigate("/login");
                    })
                    .catch((err: AxiosError) => {

                        errorNotification(err.code || 'Error', err.response?.data?.message || 'An error occurred');
                    })
                    .finally(() => {
                        setSubmitting(false);
                    });
                    
            }}>
        {({isValid, isSubmitting}) => (
            <Form>
                <Stack spacing={10}>
                    <MyTextInput 
                        label={"First Name"}
                        name={"firstName"}
                        type={"text"}
                        placeholder={"First Name"}
                    />
                    <MyTextInput 
                        label={"Last Name"}
                        name={"lastName"}
                        type={"text"}
                        placeholder={"Last Name"}
                    />
                    <MyTextInput 
                        label={"Email"}
                        name={"email"}
                        type={"email"}
                        placeholder={"Email"}
                    />
                    <MyTextInput 
                        label={"Password"}
                        name={"password"}
                        type={"password"}
                        placeholder={"Password"}
                    />
                    <Button 
                        backgroundColor={isValid ? "blue.400" : "gray.400"} 
                        color={'white'}
                        _hover={{
                            bg: isValid ? 'blue.500' : 'gray.500',
                        }}
                        disabled={!isValid || isSubmitting} 
                        type={"submit"}>
                        Sign up
                    </Button>
                </Stack>
            </Form>
        )}
        </Formik>
    )
}

export default function SignupCard() {
    const navigate = useNavigate();
    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'} mb={15}> Sign up and challenge yourself ✌️</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        Already a user? <Link color={'blue.400'} onClick={() => navigate("/login")}>Login</Link>
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <SignupForm/>           
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
