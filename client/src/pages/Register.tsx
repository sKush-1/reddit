import React from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { RegisterDocument } from "../gql/graphql";
import { useMutation } from "urql";
import { toErrorMap } from "../utils/toErrorMap";
import { useNavigate } from "react-router-dom";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(RegisterDocument);
  const navigate = useNavigate();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, {setErrors}) => {
          const payload = {
            options: {
              username: values.username,
              password: values.password,
            },
          };
          const response = await register(payload);
          if(response.data?.register.errors){
              setErrors(toErrorMap(response.data?.register.errors));
          }
          else if(response.data?.register.user){
            navigate("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />

            <Box mt={4}>
              <InputField
                name="password"
                placeholder="Password"
                label="password"
              />
            </Box>

            <Button mt={4} type="submit" isLoading={isSubmitting}>
              {" "}
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
