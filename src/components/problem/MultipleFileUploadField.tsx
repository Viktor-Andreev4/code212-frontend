import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface MultipleFileUploadFieldProps {
  id: string;
  name: string;
  setFieldValue: (field: string, value: any) => void;
}

function MultipleFileUploadField({ name, setFieldValue }: MultipleFileUploadFieldProps) {
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/txt': ['.txt']
    },
    minSize: 2,
    onDrop: acceptedFiles => {
      setFieldValue(name, acceptedFiles);
      setUploadPercentage(100);
    }
  });

  const files = acceptedFiles.map(file => <li key={file.name} style={{listStyleType: 'none'}}>{file.name}</li>);

  return (
    <div style={{ width: '500px', margin: '0 auto', textAlign: 'center' }}>
      <div {...getRootProps({ className: 'dropzone' })} style={{ padding: '20px', border: '2px dashed #888', cursor: 'pointer', borderRadius: '5px', marginTop: '50px' }}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
      <aside>
        <ul>{files}</ul>
      </aside>
      <div>
        <div style={{ width: '100%', backgroundColor: '#ddd', borderRadius: '2px', marginTop: '15px', height: '20px' }}>
          <div style={{ width: `${uploadPercentage}%`, backgroundColor: '#75daad', height: '100%', borderRadius: '2px', transition: 'width 0.5s' }} />
        </div>
      </div>
    </div>
  );
}

export default MultipleFileUploadField;
