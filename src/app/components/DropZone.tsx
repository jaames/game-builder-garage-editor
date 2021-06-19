import React from 'react';
import { useDropzone } from 'react-dropzone';

import styles from '../styles/DropZone.module.scss';

interface Props {
  onDrop: (acceptedFiles: any) => any;
  accept: string[];
}

export const DropZone: React.FunctionComponent<Props> = ({ onDrop, accept }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept
  });
  return (
    <div className={ styles.root }>
      <div className={ styles.zone } {...getRootProps()}>
        <input className={ styles.input } {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop files here ...</p> :
            <p>Drag &amp; drop some files here, or click to select</p>
        }
      </div>
    </div>
  );
}