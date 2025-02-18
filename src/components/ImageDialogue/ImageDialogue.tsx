import { AspectRatio, Badge, Flex, Image, Skeleton } from "@chakra-ui/react";
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from "../ui/dialog";
import React from "react";

type ImageDialogueProps = {
  imageSrc: string;
  loading?: boolean;
  alt?: string;
};

const ImageDialogue: React.FC<ImageDialogueProps> = ({
  imageSrc,
  loading = false,
  alt,
}) => {
  // Extract filename from URL
  const fileName = React.useMemo(() => {
    try {
      const url = new URL(imageSrc);
      const pathSegments = url.pathname.split("/");
      const lastSegment = pathSegments[pathSegments.length - 1];
      // Remove any query parameters and file extension
      return lastSegment.split(".")[0];
    } catch {
      return alt || "Image";
    }
  }, [imageSrc, alt]);

  return (
    <DialogRoot size="lg">
      <DialogTrigger asChild>
        <Flex position="relative">
          <Skeleton height="180px" asChild loading={loading}>
            <AspectRatio w="100%" ratio={16 / 9}>
              <Image
                src={imageSrc}
                objectFit="cover"
                alt={alt || fileName}
                _hover={{ opacity: 0.7 }}
              />
            </AspectRatio>
          </Skeleton>
          <Badge position="absolute" bottom="2" right="2">
            tap or click to preview image
          </Badge>
        </Flex>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{alt || fileName}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Image src={imageSrc} alt={alt || fileName} />
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
export default ImageDialogue;
