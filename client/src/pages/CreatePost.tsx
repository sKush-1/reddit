import React, { useEffect } from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation, useQuery } from "urql";
import { CreatePostDocument, MeDocument } from "../gql/graphql";
import toast from "react-hot-toast";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

interface createPostProps {}

const CreatePost: React.FC<createPostProps> = ({}) => {
    const navigate = useNavigate();
  const [{data, fetching}] = useQuery({query: MeDocument});
  useEffect(() => {
    if(!data?.me && !fetching){
        navigate("/login")
    }
  },[data,fetching])
  const [, register] = useMutation(CreatePostDocument);

  return (
    <>
    <NavBar/>
    <Wrapper variant="small">
      <Formik
        initialValues={{ title: "", text: ""}}
        onSubmit={async (values) => {
          const payload = {
              title: values.title,
              text: values.text,
          };
          const response = await register(payload);
          
          if(response.data){
            toast.success("Post created");
          }
          else{
            toast.error("Failed to post");
          }
          
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="title"
              label="Title"
            />

            <Box mt={4}>
              <InputField textarea
                name="text"
                placeholder="text"
                label="Text"
              />
            </Box>

            <Button mt={4} type="submit" isLoading={isSubmitting}>
              {" "}
              CreatePost
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
    </>
  );
};

export default CreatePost;
