import {
  Box,
  Card,
  Center,
  Heading,
  Icon,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React from "react";

type ActionCardProps = {
  handleAddForm: () => void;
  disabled?: boolean;
  head: string;
  text: string;
  iconColor: string;
  icon: React.ReactNode;
};

const ActionCard: React.FC<ActionCardProps> = ({
  handleAddForm,
  disabled = false,
  head,
  text,
  iconColor,
  icon,
}) => {
  return (
    <Card.Root
      as="button"
      w="19rem"
      cursor="pointer"
      boxShadow="md"
      transition="all 0.2s ease-in-out"
      mb={{ base: 4, lg: 0 }}
      onClick={disabled ? () => {} : handleAddForm}
      opacity={disabled ? 0.8 : 1}
      _hover={{ opacity: 0.8 }}
      _active={disabled ? { transform: "" } : { transform: "scale(0.98)" }}
      _focusVisible={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
      className="group"
    >
      <Card.Body>
        <Card.Description as="div">
          <Center>
            <Icon
              size="xl"
              transition="all 0.2s ease-in-out"
              _groupHover={{ color: iconColor }}
            >
              {icon}
            </Icon>
            <Spacer />
            <Box
              userSelect="none"
              _groupHover={{ color: "black", _dark: { color: "white" } }}
            >
              <Heading>{head}</Heading>
              <Text>{text}</Text>
            </Box>
          </Center>
        </Card.Description>
      </Card.Body>
    </Card.Root>
  );
};
export default ActionCard;
