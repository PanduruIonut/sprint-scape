import React, { useState } from 'react';
import { type FileWithPath, useDropzone } from 'react-dropzone';

interface MyDropzoneProps {
  onFilesUploaded: (files: FileWithPath[]) => void;
}

const MyDropzone = ({ onFilesUploaded }: MyDropzoneProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
    onFilesUploaded(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const dropzoneStyle = {
    border: '2px dashed #aaa',
    borderRadius: '5px',
    padding: '20px',
    cursor: 'pointer',
  };

  const activeStyle = {
    borderColor: '#4fc3f7',
  };

  const paragraphStyle = {
    margin: '0',
  };

  return (
    <div
      {...getRootProps()}
      style={{ ...dropzoneStyle, ...(isDragActive ? activeStyle : {}) }}
    >
      <input {...getInputProps()} />
      <p style={paragraphStyle}>Drag and drop files here, or click to select files</p>
      {uploadedFiles.length > 0 && (
        <div>
          <ul style={{ listStyleType: 'none' }}>
            {uploadedFiles.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyDropzone;
