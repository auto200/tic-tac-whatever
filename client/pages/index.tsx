import { Box, Flex, Grid, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const BOARD_SIZE = 3;

const Home = () => {
  const [board] = useState(() => new Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [pieces] = useState([20, 40, 60, 80, 100]);
  return (
    <Flex
      w="100%"
      mt="50px"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
    >
      <SimpleGrid columns={BOARD_SIZE} spacing="2" bgColor="gray.300">
        {board.map((_, i) => (
          <Cell key={i}>cell</Cell>
        ))}
      </SimpleGrid>
      <Flex mt="50px" alignItems="center">
        {pieces.map((size) => (
          <Box
            key={size}
            margin="10px"
            width={`${size}px`}
            height={`${size}px`}
            border="2px solid red"
            borderRadius="50%"
          ></Box>
        ))}
      </Flex>
    </Flex>
  );
};

const Cell: React.FC = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      w="200px"
      h="200px"
      bgColor="gray.800"
    >
      cell
    </Flex>
  );
};

export default Home;
