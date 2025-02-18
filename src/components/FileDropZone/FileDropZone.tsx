import {
  FileUploadFileChangeDetails as FileChangeDetails,
  FileUpload,
  Flex,
  Icon,
  useFileUpload,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { FileUploadDropzone } from "../ui/file-upload";
import { setFiles } from "./fileDropSlice";

type FileDropZoneProps = {
  id: string;
  onDelete: () => void;
};

const FileDropZone: React.FC<FileDropZoneProps> = ({ id, onDelete }) => {
  const dispatch = useDispatch();

  const handleFileChange = (e: FileChangeDetails) => {
    // Create an array of file entries, one for each accepted file
    const fileEntries = e.acceptedFiles.map((file, index) => {
      const url = URL.createObjectURL(file);
      return {
        id: `${id}-${index}`, // Create unique IDs for each file
        fileUpload: {
          acceptedFiles: [
            {
              name: file.name,
              size: file.size,
              type: file.type,
              url: url,
              lastModified: file.lastModified,
            },
          ],
          rejectedFiles: [],
        },
      };
    });

    // Handle rejected files if needed
    const rejectedEntries = e.rejectedFiles.map((rejection, index) => {
      const url = URL.createObjectURL(rejection.file);
      return {
        id: `${id}-rejected-${index}`,
        fileUpload: {
          acceptedFiles: [],
          rejectedFiles: [
            {
              file: {
                name: rejection.file.name,
                size: rejection.file.size,
                type: rejection.file.type,
                url: url,
                lastModified: rejection.file.lastModified,
              },
              errors: rejection.errors,
            },
          ],
        },
      };
    });

    // Dispatch all file entries at once
    dispatch(setFiles([...fileEntries, ...rejectedEntries]));
  };

  const fileUpload = useFileUpload({
    maxFiles: 10, // Allow multiple files
    accept: ["image/png", "image/jpeg"],
    onFileChange: handleFileChange,
  });

  return (
    <Flex position="relative" w="100%">
      <Icon
        position="absolute"
        top={2}
        right={2}
        size="lg"
        zIndex={2}
        transition="all 0.2s ease-in-out"
        _hover={{ opacity: 0.7, color: "red" }}
        onClick={onDelete}
      >
        <FaTimes />
      </Icon>
      <FileUpload.RootProvider
        maxW="xl"
        alignItems="stretch"
        userSelect="none"
        value={fileUpload}
      >
        <FileUpload.HiddenInput />
        <FileUploadDropzone
          label="Drag and drop here to upload"
          description="Upload multiple .png, .jpg files up to 5MB each"
        />
      </FileUpload.RootProvider>
    </Flex>
  );
};

export default FileDropZone;
