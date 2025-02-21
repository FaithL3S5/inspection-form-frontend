# Car Inspection Form - Frontend

## Overview

This React application provides a dynamic photo upload system for car inspection services. It allows inspectors to upload an unlimited number of photos, label them, and submit the information for reports.

## Features

- Dynamic image field management (add/remove fields)
- Single image upload per field
- Automatic creation of new fields for multiple image uploads
- Custom image labeling
- Form submission with validation
- Real-time image previews
- Confirmation dialogs for important actions
- Responsive design

## Tech Stack

- React with TypeScript
- Redux for state management
- Chakra UI for styling and components
- React Icons

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.x or higher)
- npm (v6.x or higher) or yarn (v1.x or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/FaithL3S5/inspection-form-frontend.git
   cd inspection-form-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or 
   yarn install
   ```

## Running the Application

Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at [http://localhost:5173](http://localhost:5173).

## Usage Guide

### Adding Image Fields

1. Click the "ADD" button in the top right corner to create a new image field.
2. Each field accepts a single image.
3. If you try to upload multiple images to a single field, new fields will be created automatically.

### Uploading Images

1. Drag and drop an image onto a field, or click on the field to select files.
2. Supported formats: .png, .jpg (up to 5MB each).
3. A preview will be displayed after successful upload.

### Labeling Images

1. Click on the filename below an uploaded image to enter edit mode.
2. Type a new name for the image.
3. Press Enter or click "OK" to save the new name.

### Deleting Images/Fields

1. Click the "DELETE" button on an image card to remove it.
2. For empty fields, click the "X" icon in the top right corner.

### Submitting the Form

1. After uploading all required images, click the "FINALIZE" button.
2. Confirm your submission in the dialog that appears.
3. Wait for the upload to complete.

## Limitations

- **Frontend Only Operations**: The application always starts with an empty form regardless of files available on the backend.
- **Image Deletion**: Deleting an image in the frontend does not actually remove the file from the backend storage.
- **File Renaming**: Changing the name of an image in the frontend doesn't rename the actual file on the backend.
- **Session Based**: The application doesn't maintain state between sessions - refreshing the page will reset the form.

## Project Structure

```
src/
├── components/
│   ├── ActionCard/         # Component for Add/Finalize buttons
│   ├── ConfirmationModal/  # Dialog for confirming actions
│   ├── FileDropZone/       # Image upload dropzone
│   ├── ImageCard/          # Displays uploaded images
│   ├── ImageDialogue/      # Image preview modal
│   └── ui/                 # UI components (toaster, dialog, etc.)
├── store/
│   └── store.ts            # Redux store configuration
├── utils/
│   └── fileUtils.ts        # File manipulation utilities
├── App.tsx                # Main application component
└── index.tsx              # Application entry point
```

## Key Components

### FileDropZone

Handles file uploading, validation, and initial storage.

### ImageCard

Displays uploaded images with options to rename and delete.

### ImageDialogue

Provides a modal preview for uploaded images.

## State Management

The application uses Redux for state management. The main slice is `fileDropSlice.ts`, which handles:

- Storing uploaded files
- Handling file operations (add, remove, rename)
- Managing upload status and errors

## Error Handling

The application includes:
- Input validation for file types and sizes
- Error toasts for failed operations
- Confirmation dialogs for destructive actions

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `build/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built by Faith_L3S5
- Used Chakra UI for component styling
