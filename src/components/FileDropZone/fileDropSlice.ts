import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { blobUrlToFile } from "../../utils/fileUtils";

interface SerializableFile {
  name: string;
  size: number;
  type: string;
  url: string;
  lastModified: number;
}

interface SerializableFileUpload {
  acceptedFiles: SerializableFile[];
  rejectedFiles: {
    file: SerializableFile;
    errors: string[];
  }[];
}

interface FileUploadEntry {
  id: string;
  fileUpload: SerializableFileUpload;
}

// Define payload type for the updateFileName action
interface UpdateFileNamePayload {
  id: string;
  newFileName: string;
}

interface FileDropState {
  entries: FileUploadEntry[];
  uploadStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FileDropState = {
  entries: [],
  uploadStatus: "idle",
  error: null,
};

// const initialState: FileUploadEntry[] = [];

export const fileDropSlice = createSlice({
  name: "fileDrop",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<FileUploadEntry[]>) => {
      const newEntries = action.payload;
      newEntries.forEach((newEntry) => {
        const index = state.entries.findIndex(
          (entry) => entry.id === newEntry.id
        );
        if (index !== -1) {
          state.entries[index] = newEntry;
        } else {
          state.entries.push(newEntry);
        }
      });
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter(
        (entry) => entry.id !== action.payload
      );
    },
    // Add the new updateFileName action
    updateFileName: (state, action: PayloadAction<UpdateFileNamePayload>) => {
      const { id, newFileName } = action.payload;
      const fileEntryIndex = state.entries.findIndex(
        (entry) => entry.id === id
      );

      if (
        fileEntryIndex !== -1 &&
        state.entries[fileEntryIndex].fileUpload.acceptedFiles.length > 0
      ) {
        // Update the filename while preserving all other properties
        state.entries[fileEntryIndex].fileUpload.acceptedFiles[0] = {
          ...state.entries[fileEntryIndex].fileUpload.acceptedFiles[0],
          name: newFileName,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.uploadStatus = "loading";
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state) => {
        state.uploadStatus = "succeeded";
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

// handle uploads
export const uploadFiles = createAsyncThunk(
  "fileDrop/uploadFiles",
  async (fileEntries: FileUploadEntry[], { rejectWithValue }) => {
    try {
      // Convert all accepted files to actual File objects
      const filePromises = fileEntries.flatMap((entry) =>
        entry.fileUpload.acceptedFiles.map(async (fileInfo) => {
          const file = await blobUrlToFile(fileInfo.url, fileInfo.name);
          return { id: entry.id, file };
        })
      );

      const files = await Promise.all(filePromises);

      // Create FormData with all files
      const formData = new FormData();
      files.forEach(({ file }) => {
        formData.append("files", file);
      });

      // Send to backend
      const response = await fetch("http://localhost:3001/upload-multiple", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      return result.files;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export type { SerializableFile, SerializableFileUpload, FileUploadEntry };
export const { setFiles, removeFile, updateFileName } = fileDropSlice.actions;
export default fileDropSlice.reducer;
