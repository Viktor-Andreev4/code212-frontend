import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import ExamCard from './components/exam/ExamCard';
import ExamDrawer from './components/exam/ExamUploadDrawer';
import ProblemDrawer from './components/problem/ProblemUploadDrawer';
import { useAuth } from '../src/components/context/AuthContext';
import { Link as ChakraLink } from "@chakra-ui/react";
import { LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

type ChakraRouterLinkProps = ChakraLinkProps & RouterLinkProps;

const ChakraRouterLink: React.FC<ChakraRouterLinkProps> = (props) => {
  return <ChakraLink as={RouterLink} {...props} />;
};

const Links = [
  { name: 'Exams', path: '/exams' },
  { name: 'Participants', path: '/participants' },
];

type NavLinkProps = {
  to: string;
  children: ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => (
  <ChakraRouterLink
    to={to}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
  >
    {children}
  </ChakraRouterLink>
);

export default function withAction() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const examDisclosure = useDisclosure();
  const problemDisclosure = useDisclosure();
  const { logout } = useAuth();
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Image
              borderRadius='full'
              boxSize='35px'
              src="https://play-lh.googleusercontent.com/fHfTlNIq5PMps_296XPMC2N-u5ARCmaSM_lNuukKjhK8ITbHHS5YyYyT5ABJU1s8_Q=w240-h480"
            />
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.name} to={link.path}>
                  {link.name}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <ExamDrawer
              onOpen={examDisclosure.onOpen}
              onClose={examDisclosure.onClose}
              isOpen={examDisclosure.isOpen}
            />
            <ProblemDrawer
              onOpen={problemDisclosure.onOpen}
              onClose={problemDisclosure.onClose}
              isOpen={problemDisclosure.isOpen}
            />

            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={
                    'https://img.freepik.com/free-icon/user_318-504048.jpg?w=360'
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuDivider />
                <MenuItem onClick={logout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name} to={link.path}>
                  {link.name}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <Box p={4}>
        <ExamCard />
      </Box>
    </>
  );
}