import React from "react";
import { Form, Formik } from "formik";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { LoginDocument } from "../gql/graphql";
import { useMutation } from "urql";
import { toErrorMap } from "../utils/toErrorMap";
import { Link, useNavigate } from "react-router-dom";

interface registerProps {}

const Login: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(LoginDocument);
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
          if(response.data?.login.errors){
              setErrors(toErrorMap(response.data?.login.errors));
          }
          else if(response.data?.login.user){
            navigate("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username or email"
              label="Username or Email"
            />

            <Box mt={4}>
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
              />
            </Box>

            <Button mt={4} mr={10} type="submit" isLoading={isSubmitting}>
              {" "}
              Login
            </Button>
            <Link  to="/forgot-password"><Text color={"red"} mt={2}>Forgot Password?</Text></Link>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
