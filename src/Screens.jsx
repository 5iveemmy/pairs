import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Box, Button, Text, Flex, HStack } from "@chakra-ui/react";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <>
      <Flex justifyContent="center" alignItems="center" padding="20px">
        <Flex
          bgColor="#e6fffa"
          height="350px"
          width="360px"
          alignItems="center"
          flexDir="column"
          borderRadius="20px"
          paddingTop="5em"
          gap="1.5rem"
        >
          <Text color="#31979598" fontSize="30px" fontWeight="700">
            Memory
          </Text>
          <Text color="#369a98" textAlign="center">
            Flip over tiles looking for pairs
          </Text>
          <Box>
            <Button
              _hover={{
                backgroundColor: "normal",
              }}
              _active={{
                backgroundColor: "normal",
              }}
              onClick={start}
              bgColor="#399795"
              bg="linear-gradient(to bottom, #399795, #265f5b)"
              width="100px"
              borderRadius="30px"
              color="#ffffff"
            >
              Play
            </Button>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti();
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <>
      <HStack justifyContent="center" py="20px" gap="2">
        <Text textAlign="center" color="#2f855b">
          Tries
        </Text>
        <HStack
          p="0px 5px"
          bgColor="#9ae6b4"
          alignItems="center"
          borderRadius="5px"
          justifyContent="center"
        >
          <Text color="#368b61">{tryCount}</Text>
        </HStack>
      </HStack>
      <Flex justifyContent="center" alignItems="center">
        <Flex
          bgColor="#f0fff4"
          padding="20px"
          borderRadius="20px"
          justifyContent="center"
          alignItems="center"
          gap="1.5rem"
        >
          <Flex
            gap="13px"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            maxWidth="320px"
            width="100%"
          >
            {getTiles(16).map((tile, i) => (
              <Tile key={i} flip={() => flip(i)} {...tile} />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
