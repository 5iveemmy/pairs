import { Box, Flex } from "@chakra-ui/react";

//auto import of tag after changing in mightymeld app not working properly

export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Box
          onClick={flip}
          display="inline-block"
          textAlign="center"
          bg="#68d491"
          width="70px"
          height="70px"
          borderRadius="8px"
        ></Box>
      );
    case "flipped":
      return (
        <Box
          display="inline-block"
          textAlign="center"
          bgColor="#37a169"
          w="70px"
          h="70px"
          borderRadius="8px"
          padding="8px"
        >
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
              color: "#ffffff",
            }}
          />
        </Box>
      );
    case "matched":
      return (
        <Flex
          width="70px"
          height="70px"
          justifyContent="center"
          alignItems="center"
        >
          <Content
            style={{
              display: "inline-block",
              width: "55px",
              height: "55px",
              verticalAlign: "top",
              color: '"#c6f6d6"',
            }}
          />
        </Flex>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}
