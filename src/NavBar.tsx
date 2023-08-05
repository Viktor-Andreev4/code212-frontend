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
  Stack,
  Image,
  useColorModeValue,
  useColorMode
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import ExamCard from './components/exam/ExamCard';
import ExamDrawer from './components/exam/ExamUploadDrawer';
import ProblemDrawer from './components/problem/ProblemUploadDrawer';
import { useAuth } from '../src/components/context/AuthContext';
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';
import { LinkProps as RouterLinkProps } from 'react-router-dom';
import { ReactNode } from 'react';
import { LinkProps as ChakraLinkProps } from '@chakra-ui/react';

type ChakraRouterLinkProps = ChakraLinkProps & RouterLinkProps;


const ChakraRouterLink: React.FC<ChakraRouterLinkProps> = ({ to, children, ...props }) => (
  <ChakraLink as={RouterLink} to={to} {...props}>
    {children}
  </ChakraLink>
);

const Links = [
  { name: 'Exams', path: '/exams' },
  { name: 'Participants', path: '/participants' },
];

type NavLinkProps = {
  to: string;
  children: ReactNode;
}

function ToggleColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button onClick={toggleColorMode}>
      Toggle {colorMode === "light" ? "Dark" : "Light"}
    </Button>
  );
}

const NavLink = ({ to, children }: NavLinkProps) => (
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

function WithAction() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const examDisclosure = useDisclosure();
  const problemDisclosure = useDisclosure();
  const { logout } = useAuth();
  const bgColor = useColorModeValue("#F7FAFC", "#2D3748");
  const hoverColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <>
      <Box bg={bgColor} px={4}>
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
              <MenuList bg={bgColor}>
                <MenuDivider />
                <MenuItem onClick={logout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }} bg={bgColor}>
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
export default WithAction;