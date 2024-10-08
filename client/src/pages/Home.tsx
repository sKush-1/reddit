import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useQuery } from 'urql';
import { PostDocument } from '../gql/graphql';
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';

interface homeProps {}

type Post = {
  __typename?: 'Post';
  _id: number;
  title: string;
  textSnippet: string;
  points: number;
  creatorId: number;
};

const Home: React.FC<homeProps> = () => {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastPostId, setLastPostId] = useState<number | null>(null);

  const [{ data: queryData,fetching,}] = useQuery({
    query: PostDocument,
    variables: { limit: 10, startDate: '2023-10-07', lastPostId },
  });
  console.log(lastPostId)

  useEffect(() => {
    if (queryData && !fetching) {
      setData((prevData) =>
        lastPostId
          ? [...prevData, ...(queryData?.post ?? [])] 
          : queryData?.post ?? []
      );
      setLoading(false); 
    }
  }, [queryData, fetching, lastPostId]);

  const loadMorePosts = () => {
    if (data.length > 0) {
      const newLastPostId = data[data.length - 1]._id;
      setLastPostId(newLastPostId); // Trigger useEffect to load more posts
      setLoading(true); // Set loading state to true while fetching
    }
  };

  return (
    <>
      <NavBar />
      <Flex align={'center'}>
        <Heading>LiReddit</Heading>
        <Link ml={'auto'} href='/create-post'>
          <Text ml='auto'>Create Post</Text>
        </Link>
      </Flex>
      {loading && !data.length ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data.map((p) => (
            <Box key={p._id} p={5} shadow='md' borderWidth='1px'>
              <Heading fontSize='xl'>{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data.length > 0 && (
        <Flex>
          <Button onClick={loadMorePosts} isLoading={loading} m={'auto'} my={4}>
            Load More
          </Button>
        </Flex>
      )}
    </>
  );
};

export default Home;
