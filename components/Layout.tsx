import { Flex, Center, Link } from "@chakra-ui/react";

const Layout: React.FC = ({ children }) => {
  return (
    <Flex
      w="100%"
      h="100%"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      {children}
      <Center marginTop="auto" mb="15px">
        <Link
          isExternal
          href="https://9gag.com/gag/aQomRzK"
          color="green.300"
          fontWeight="bold"
        >
          Inspiration
        </Link>
      </Center>
    </Flex>
  );
};

export default Layout;
