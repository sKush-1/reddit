import React from "react";
import Wrapper from "../components/Wrapper";
import { Form, Formik } from "formik";
import { InputField } from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useMutation } from "urql";
import { ForgotPasswordDocument } from "../gql/graphql";
import toast from "react-hot-toast";

interface forgotPasswordProps {}

const ForgotPassword: React.FC<forgotPasswordProps> = () => {
  const [, forgotPassword] = useMutation(ForgotPasswordDocument);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          try {
            const response = await forgotPassword({
              email: values.email,
            });
            if (response.data) toast.success("Email sent");
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {({ isSubmitting }) => isSubmitting? <Box>If an Account with email or username exists we will send you a mail.</Box>:(
          <Form>
            <InputField
              name="email"
              placeholder="Enter you email or username"
              label="Email or username"
            />

            <Button mt={4} type="submit" isLoading={isSubmitting}>
              {" "}
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default ForgotPassword;
