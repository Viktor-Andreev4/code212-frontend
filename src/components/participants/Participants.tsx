import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react'
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu, FiBook } from 'react-icons/fi'
import { IconType } from 'react-icons'
import { useEffect, useState } from 'react';
import { getAllExams, getExamParticipants } from '../../services/client';
import axios from 'axios';

interface LinkItemProps {
  name: string
  icon: IconType
}

interface Exam {
  id: number;
  name: string;
}

interface Participant {
  firstName: string;
  lastName: string;
  email: string;
}

const SidebarContent = ({ ...rest }: BoxProps) => {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await getAllExams();
        setExams(response.data);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
      }
    }

    fetchExams();
  }, []);
  console.log("Exams:");
  console.log(exams);

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
      </Flex>
      {Array.isArray(exams) && exams.map((exam) => (
        <NavItem key={exam.id} icon={FiBook} exam={exam}>
          {exam.name}
        </NavItem>
      ))}
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon: IconType
  children: React.ReactNode
  exam: Exam
}
const NavItem = ({ icon, children, exam, ...rest }: NavItemProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleExamClick = async () => {
    try {
      const response = await getExamParticipants(exam.id);
      setParticipants(response.data);
    } catch (err) {
      console.error(`Failed to fetch participants for exam ${exam.id}:`, err);
    }
  };

  return (
    <Box
      as="a"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      onClick={handleExamClick}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  )
}

// const MobileNav = ({ onOpen, ...rest }: FlexProps) => {
//   return (
//     <Flex
//       ml={{ base: 0, md: 60 }}
//       px={{ base: 4, md: 24 }}
//       height="20"
//       alignItems="center"
//       bg={useColorModeValue('white', 'gray.900')}
//       borderBottomWidth="1px"
//       borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
//       justifyContent="flex-start"
//       {...rest}>
//       <IconButton
//         variant="outline"
//         onClick={onOpen}
//         aria-label="open menu"
//         icon={<FiMenu />}
//       />

//       <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
//         Logo
//       </Text>
//     </Flex>
//   )
// }

function Participants() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [participants, setParticipants] = useState<Participant[]>([]);

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent />
        </DrawerContent>
      </Drawer>
      {/* <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} /> */}
      <Box ml={{ base: 0, md: 60 }} p="4">
        {participants.map((participant: Participant) => (
          <p>{participant.firstName}</p>
        ))}
      </Box>
    </Box>
  )
}

export default Participants;
