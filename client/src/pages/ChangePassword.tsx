import React from 'react'
import { useParams } from 'react-router-dom';
import Wrapper from '../components/Wrapper';
import { Form, Formik } from 'formik';
import { InputField } from '../components/InputField';
import { Button } from '@chakra-ui/react';
import { useMutation } from 'urql';
import { ChangePasswordDocument } from '../gql/graphql';
import { toErrorMap } from '../utils/toErrorMap';

interface changePasswordProps{

}

const ChangePassword: React.FC<changePasswordProps> = () => {
    let searchparam= useParams();
    const [,changePassword] = useMutation(ChangePasswordDocument);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "", }}
        onSubmit={async (values, {setErrors}) => {
        
            const response = await changePassword({
                newPassword: values.newPassword,
                token: searchparam.token as string
            })

            if(response.data?.changePassword.errors){
                setErrors(toErrorMap(response.data?.changePassword.errors));
            }
          
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="Enter new password"
              label="New Password"
            />

            <Button mt={4} type="submit" isLoading={isSubmitting}>
              {" "}
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default ChangePassword;
