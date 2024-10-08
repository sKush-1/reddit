import { Box, Button, Flex } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from 'urql';
import { LogoutDocument, MeDocument} from '../gql/graphql';

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps>= () => {
  const [_,logout] = useMutation(LogoutDocument)

  const [{data, fetching}] = useQuery({query: MeDocument});
  let body = null;

  if(fetching){

  }
  else if(!data?.me){
    body = (
      <>
      <Link to={'/login'} > Login </Link>
      <Link to={'/register'}> Register</Link>
      </>
    )
  }
  else{
    body = (
      <>
      <Flex>
      <Box mr={2}>
        {data.me.username}
      </Box>
      <Button onClick={async() => {
          logout({});
      }}  variant="link">Logout</Button>
      </Flex>
      </>
    )
  }


  return (
    <>
    <Flex bg='tomato' p={4} ml={'auto'}>
        <Box ml={'auto'}>
        {body}
        </Box>
    </Flex>
    </>
  )
}

export default NavBar;
