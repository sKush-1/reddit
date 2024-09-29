import React from 'react'
import { Formik } from 'formik'
import { FormControl, FormLabel, Input } from '@chakra-ui/react'

interface registerProps {}
const Register: React.FC<registerProps> = ({}) => {
  return (
    <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async () => {
          
        }}


      >
        {({values, handleChange}) => (
            <FormControl >
            <FormLabel htmlFor='username'>Username</FormLabel>
            <Input value={values.username} placeholder='Username' 
            onChange={handleChange}
            id='username'
            />
            
          </FormControl>
        )}
      </Formik>
  )
}

export default Register
