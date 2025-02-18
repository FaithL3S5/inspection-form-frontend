// components/Footer/Footer.tsx
import { Container, Flex, Text, Icon, Link } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const MotionContainer = motion(Container);
const MotionFlex = motion(Flex);
const MotionIcon = motion(Icon);

const Footer = () => {
  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/yourusername" },
    { icon: FaLinkedin, href: "https://linkedin.com/in/yourusername" },
    { icon: FaTwitter, href: "https://twitter.com/yourusername" },
  ];

  return (
    <MotionContainer
      as="footer"
      maxW="full"
      py={6}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Flex
        maxW="87.5rem"
        mx="auto"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        gap={4}
      >
        <MotionFlex
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Text fontSize="sm" fontWeight="medium">
            Built with ❤️ by Faith_L3S5
          </Text>
        </MotionFlex>

        <Flex gap={6}>
          {socialLinks.map((social, index) => (
            <Link
              key={index}
              href={social.href}
              _hover={{ textDecoration: "none" }}
            >
              <MotionIcon
                as={social.icon}
                fontSize="xl"
                whileHover={{
                  scale: 1.2,
                  color: "blue.400",
                }}
                whileTap={{ scale: 0.95 }}
              />
            </Link>
          ))}
        </Flex>
      </Flex>
    </MotionContainer>
  );
};

export default Footer;
