import { Box, Text } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';

function MyDropzone() {
  const { getRootProps, getInputProps } = useDropzone();

  return (
    <Box {...getRootProps()} p={4} border='2px dashed gray' color='gray.600'>
      <input {...getInputProps()} />
      <Text>Drag 'n' drop some files here, or click to select files</Text>
    </Box>
  );
}

export default MyDropzone;
