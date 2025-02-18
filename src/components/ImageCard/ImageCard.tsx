import {
  Card,
  Flex,
  Text,
  Group,
  Input,
  InputAddon,
  Button,
} from "@chakra-ui/react";
import { Field } from "../ui/field";
import { Tooltip } from "../ui/tooltip";
import React, { useState, useEffect } from "react";
import ImageDialogue from "../ImageDialogue/ImageDialogue";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import {
  updateFileName,
  SerializableFile,
} from "../FileDropZone/fileDropSlice";

type ImageCardProps = {
  id: string;
  onDelete: () => void;
};

// Extract filename without extension utility function
const getNameWithoutExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf(".");
  return lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
};

const ImageCard: React.FC<ImageCardProps> = ({ onDelete, id }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [fileData, setFileData] = useState<{
    file: SerializableFile | null;
    valid: boolean;
  }>({
    file: null,
    valid: false,
  });

  const dispatch = useDispatch();

  // Get all file data from Redux store
  const fileEntries = useSelector((state: RootState) => state.fileDrop);

  // Use useEffect to safely handle file data retrieval and setup
  useEffect(() => {
    try {
      // Find the specific file entry using id
      const entry = fileEntries.entries.find((entry) => entry.id === id);

      if (!entry || !entry.fileUpload.acceptedFiles.length) {
        setFileData({ file: null, valid: false });
        return;
      }

      const file = entry.fileUpload.acceptedFiles[0];
      setFileData({ file, valid: true });

      // Set the display name without extension
      const nameWithoutExt = getNameWithoutExtension(file.name);
      setDisplayName(nameWithoutExt);
      setEditName(nameWithoutExt);
    } catch (error) {
      console.error("Error processing file data:", error);
      setFileData({ file: null, valid: false });
    }
  }, [fileEntries, id]);

  // If we don't have valid file data, render nothing
  if (!fileData.valid || !fileData.file) {
    return null;
  }

  const file = fileData.file;

  const handleIsActive = () => {
    setIsActive(!isActive);
    // Reset edit name to current display name when activating
    if (!isActive) {
      setEditName(displayName);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const handleSaveName = () => {
    if (editName.trim() !== "" && fileData.file) {
      // Get the file extension
      const extension = fileData.file.name.slice(
        fileData.file.name.lastIndexOf(".")
      );

      // Update display name
      setDisplayName(editName);

      // Update the file name in Redux
      const newFullName = `${editName}${extension}`;
      dispatch(
        updateFileName({
          id: id,
          newFileName: newFullName,
        })
      );

      // Exit edit mode
      setIsActive(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName();
    } else if (e.key === "Escape") {
      setIsActive(false);
      setEditName(displayName); // Reset to current display name
    }
  };

  return (
    <Card.Root width="100%" overflow="hidden">
      <Card.Body gap="2" p={0}>
        <ImageDialogue imageSrc={file.url} alt={file.name} />

        <Card.Title w="90%" alignSelf="center">
          {!isActive && (
            <Flex onClick={handleIsActive}>
              <Field
                label="File Name"
                helperText="tap or click the file name to change"
              >
                <Tooltip content={file.name}>
                  <Text fontWeight="semibold" w="90%" truncate>
                    {displayName}
                  </Text>
                </Tooltip>
              </Field>
            </Flex>
          )}
          {isActive && (
            <Field
              label="File Name"
              helperText="Press Enter to save, Escape to cancel"
            >
              <Group attached w="100%">
                <Input
                  value={editName}
                  onChange={handleNameChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <InputAddon cursor="pointer" onClick={handleSaveName}>
                  OK
                </InputAddon>
              </Group>
            </Field>
          )}
        </Card.Title>
      </Card.Body>
      <Card.Footer mt={5} mb={0} mx={0}>
        <Button w="90%" colorPalette="red" flex="1" onClick={onDelete}>
          DELETE
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default ImageCard;
