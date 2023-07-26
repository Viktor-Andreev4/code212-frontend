import { Spinner } from '@chakra-ui/react'
import WithAction from './NavBar.tsx';
import { useEffect, useState } from 'react';
import { getUsers } from './services/client.ts';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}


function App() {  

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);


  // useEffect(() => {
  //   setLoading(true);
  //   getUsers().then(res => {
  //     if(res) {
  //       setUsers(res.data);
  //     }
  //   }).catch(err => {
  //     console.log(err);
  //   }).finally(() => {
  //     setLoading(false);
  //   }
  // )}, [])

  if (loading) {
    return (
      <div className='App'>
        <WithAction />
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
        />  
      </div>
    );
  }
  return (
    <div className='App'>
      <WithAction/>
       {users.map((user: User, index: number) => (
          <p key={index}>{user.firstName}</p>
        ))}

    </div>
  )
}

export default App
