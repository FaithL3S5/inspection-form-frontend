import {
  Box,
  Container,
  Flex,
  Grid,
  Text,
  Blockquote,
  Float,
  Separator,
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { FaAngleDoubleUp, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFile,
  uploadFiles,
} from "./components/FileDropZone/fileDropSlice";
import FileDropZone from "./components/FileDropZone/FileDropZone";
import ImageCard from "./components/ImageCard/ImageCard";
import ActionCard from "./components/ActionCard/ActionCard";
import { AppDispatch, RootState } from "./store/store";
import { Toaster, toaster } from "./components/ui/toaster";
import ConfirmationModal from "./components/ConfirmationModal/ConfirmationModal";

interface TodayQuote {
  q: string;
  a: string;
  h: string;
}

function App() {
  const [formId, setFormId] = useState<string[]>([]);
  const [todayQuote, setTodayQuote] = useState<TodayQuote | null>(null);
  const [isUploadConfirmOpen, setUploadConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const {
    entries: uploadedFiles,
    uploadStatus,
    error: uploadError,
  } = useSelector((state: RootState) => state.fileDrop);

  const showToast = (
    title: string,
    description: string,
    type: "success" | "error"
  ) => {
    toaster.create({
      title,
      description,
      type,
      duration: 3000,
      action: { label: "X", onClick: () => {} },
    });
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      showToast("No files to upload", "Please add some files first", "error");
      return;
    }

    const result = await dispatch(uploadFiles(uploadedFiles));

    if (uploadFiles.fulfilled.match(result)) {
      showToast("Upload successful", "All files have been uploaded", "success");
    } else {
      showToast(
        "Upload failed",
        uploadError || "An error occurred while uploading",
        "error"
      );
    }
  };

  const handleFileOperations = {
    add: () => setFormId((prev) => [...prev, String(Date.now())]),

    delete: (id: string) => {
      dispatch(removeFile(id));
      const baseFormId = id.split("-")[0];
      const remainingFiles = uploadedFiles.filter(
        (file) => file.id.startsWith(baseFormId) && file.id !== id
      );
      if (remainingFiles.length === 0) {
        setFormId((prev) => prev.filter((itemId) => itemId !== baseFormId));
      }
    },

    deleteForm: (formId: string) => {
      uploadedFiles
        .filter((file) => file.id.startsWith(formId))
        .forEach((file) => dispatch(removeFile(file.id)));
      setFormId((prev) => prev.filter((itemId) => itemId !== formId));
    },
  };

  const modalOperations = {
    upload: {
      open: () => uploadedFiles.length > 0 && setUploadConfirmOpen(true),
      confirm: async () => {
        setUploadConfirmOpen(false);
        await handleUpload();
      },
    },
    delete: {
      open: (fileId: string) => {
        setFileToDelete(fileId);
        setDeleteConfirmOpen(true);
      },
      confirm: () => {
        if (fileToDelete) {
          handleFileOperations.delete(fileToDelete);
          setFileToDelete(null);
        }
        setDeleteConfirmOpen(false);
      },
      cancel: () => {
        setFileToDelete(null);
        setDeleteConfirmOpen(false);
      },
    },
  };

  useEffect(() => {
    fetch("http://localhost:3001/quote")
      .then((res) =>
        res.ok ? res.json() : Promise.reject(`Response status: ${res.status}`)
      )
      .then((json) => setTodayQuote(json[0]))
      .catch(console.error);
  }, []);

  const getFileNameForModal = () => {
    const file = uploadedFiles.find((entry) => entry.id === fileToDelete);
    return file?.fileUpload.acceptedFiles[0]?.name || "";
  };

  const MemoizedFileDropZone = memo(FileDropZone);
  const MemoizedImageCard = memo(ImageCard);

  return (
    <Box _dark={{ bgColor: "gray.800" }}>
      <Toaster />
      <Grid
        templateRows="auto 1fr auto"
        maxW="75rem"
        h="100vh"
        margin="auto"
        shadow="xl"
      >
        <ConfirmationModal
          title={
            isUploadConfirmOpen
              ? "Confirm Upload"
              : `Confirm Delete ${getFileNameForModal()}`
          }
          description={
            isUploadConfirmOpen
              ? "Are you sure you want to upload these files?"
              : `Are you sure you want to delete "${getFileNameForModal()}"?`
          }
          onConfirm={
            isUploadConfirmOpen
              ? modalOperations.upload.confirm
              : modalOperations.delete.confirm
          }
          isOpen={isUploadConfirmOpen || isDeleteConfirmOpen}
          onClose={
            isUploadConfirmOpen
              ? () => setUploadConfirmOpen(false)
              : modalOperations.delete.cancel
          }
        />

        <Container
          as="header"
          shadow="sm"
          py={4}
          px={6}
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
        >
          <Text>Inspection Form</Text>
        </Container>

        <Flex p={5} bgColor="bg.muted" direction="column">
          <Flex
            mb={10}
            w="100%"
            minH={{ base: "150px", lg: "200px" }}
            direction={{ base: "column", lg: "row" }}
            justify={{ base: "end", lg: "space-between" }}
            align={{ base: "end", lg: "center" }}
          >
            <ActionCard
              handleAddForm={modalOperations.upload.open}
              head="FINALIZE"
              text="Press here to finalize your upload!"
              iconColor="blue"
              icon={<FaAngleDoubleUp />}
              disabled={uploadStatus === "loading"}
            />

            <Blockquote.Root variant="plain" maxW="20rem">
              <Float placement="top-start" offsetY="2">
                <Blockquote.Icon />
              </Float>
              <Blockquote.Content>
                <Text fontWeight="semibold" fontStyle="italic">
                  {todayQuote?.q || "Loading..."}
                </Text>
              </Blockquote.Content>
              <Blockquote.Caption>
                <cite>{todayQuote?.a || "Unknown"}</cite>
              </Blockquote.Caption>
            </Blockquote.Root>

            <ActionCard
              handleAddForm={handleFileOperations.add}
              head="ADD"
              text="Press here to add more fields!"
              iconColor="green"
              icon={<FaPlus />}
            />
          </Flex>

          <Separator />

          <Grid
            templateColumns={{
              base: "100%",
              sm: "repeat(auto-fit, minmax(250px, 1fr))",
              md: "repeat(3, minmax(250px, 1fr))",
              lg: "repeat(4, minmax(250px, 1fr))",
            }}
            autoRows="minmax(300px, auto)"
            alignItems="center"
            justifyItems="center"
            gap={3}
            mt={5}
          >
            {formId.map((itemId) => {
              const fileEntries = uploadedFiles.filter(
                (file) =>
                  file.id.startsWith(itemId) &&
                  file.fileUpload.acceptedFiles.length > 0
              );

              return fileEntries.length > 0 ? (
                fileEntries.map((fileEntry) => (
                  <MemoizedImageCard
                    key={fileEntry.id}
                    id={fileEntry.id}
                    onDelete={() => modalOperations.delete.open(fileEntry.id)}
                  />
                ))
              ) : (
                <MemoizedFileDropZone
                  id={itemId}
                  key={itemId}
                  onDelete={() => handleFileOperations.deleteForm(itemId)}
                />
              );
            })}
          </Grid>
        </Flex>

        <Container as="footer" shadow="sm" py={4} px={6} flexShrink={0}>
          <Flex maxW="87.5rem" mx="auto" justify="center">
            <Text fontSize="sm">
              ▼ Built by Faith_L3S5. All rights reserved.
            </Text>
          </Flex>
        </Container>
      </Grid>
    </Box>
  );
}

export default App;
