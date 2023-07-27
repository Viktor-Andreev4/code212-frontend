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
} from '@chakra-ui/react';
import { Formik, Form, useField } from "formik";
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { errorNotification } from '../../services/notification';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface MyTextInputProps {
    label: string;
    name: string;
    type: string;
    id?: string;
    placeholder?: string;
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


const LoginForm = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    return (
        <Formik
            validateOnMount={true}
            validationSchema={Yup.object({
                username: Yup.string()
                    .email('Must be valid email')
                    .required('Required'),
                password: Yup.string()
                    .min(8, 'Must be 8 characters or more')
                    .required('Required')
            })
            }
            initialValues={{ username: '', password: '' }}
            onSubmit={(values, { setSubmitting }) => {  
                    setSubmitting(true);
                    login(values.username, values.password).then((res) => {
                        navigate("/dashboard");
                        console.log("GREIT SUCCESS!", res);
                    }).catch(err => {  
                        errorNotification(err.code, err.response.data.message);
                    }).finally(() => {
                        setSubmitting(false);
                    })
            }}>
        {({isValid, isSubmitting}) => (
            <Form>
                <Stack spacing={10}>
                    <MyTextInput 
                        label={"Email"}
                        name={"username"}
                        type={"email"}
                        placeholder={"warrenbuffet@trading212.com"}
                    />
                    <MyTextInput 
                        label={"Password"}
                        name={"password"}
                        type={"password"}
                        placeholder={"Type your password"}
                    />
                    <Button 
                        backgroundColor={isValid ? "blue.400" : "gray.400"} 
                        color={'white'}
                        _hover={{
                            bg: isValid ? 'blue.500' : 'gray.500',
                        }}
                        disabled={!isValid || isSubmitting} 
                        type={"submit"}>
                        Sign in
                    </Button>
                </Stack>
            </Form>
        )}
        </Formik>
    )
}


export default function SimpleCard() {

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(user) {
            navigate("/dashboard");
        }
    }, [])
    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justifyContent={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Welcome to Code212</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        Sign in to your account to continue
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <LoginForm/>           
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}