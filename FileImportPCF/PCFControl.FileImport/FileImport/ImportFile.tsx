import * as React from 'react';
import { Button } from '@fluentui/react-components';
import { ArrowUploadFilled, CheckmarkRegular } from '@fluentui/react-icons';
import mammoth from "mammoth"

import { IControlEvent } from './IControlEvent';
import { useState, createRef } from 'react';

export interface IImportProps {
  buttonLabel: string | null;
  onEvent: (event: IControlEvent) => void;
}


export const ImportFile: React.FC<IImportProps> = (props: IImportProps) => {
  const [imported, setImported] = useState<boolean>(false);
  const importFileRef = createRef<HTMLInputElement>();

  const readFile = (file: File) => {
    return new Promise((resolve, reject) => {
      //create file reader
      let reader = new FileReader();

      reader.onerror = () => {
        console.log(`Something Went wrong while file reading : ${reject}`);
      }

      reader.onloadend = () => {
        resolve(reader.result);
      }

      // read file
      reader.readAsArrayBuffer(file);

      //read file
      // reader.readAsDataURL(file);
    });
  };

  // const getAsByteArray = async (file: File) => {
  //   let fileContent: string | null = (await readFile(file) as string | null);
  //   return fileContent?.split(',')?.[1];
  // }

  const getFileContent = async (file: File) => {
    const fileContent =  (await readFile(file) as ArrayBuffer );
    if( fileContent ) {

      const { value } = await mammoth.extractRawText({arrayBuffer: fileContent});

      console.log( value  );
      return value;
  
    }

    throw new Error( "file content is null!" );
    
  }

  const onFileChange = async (event: any) => {
    let fileSelected: File = event.target.files[0];
    try {
      const fileContent = await getFileContent(fileSelected);

      props.onEvent({
        event: "ImportedFile", 
        errorMessage: "", 
        file: {
          content: fileContent,
          name: fileSelected?.name ?? ""
        }
     })
    }
    catch( e:any ) {
      
      props.onEvent({
        event: "ImportedFile", 
        errorMessage: e.message, 
        file: {
          content: "",
          name: fileSelected?.name ?? ""
        }
      })
    }

    setImported(true);
  };

  return (
    <div>
      <Button
        onClick={() => importFileRef.current?.click()}
        icon={imported ? <CheckmarkRegular /> : <ArrowUploadFilled/>}>{
          imported ? "File Imported" : (props.buttonLabel ? props.buttonLabel : "Import File")
        }</Button>
      <input ref={importFileRef} type="file" onChange={onFileChange} key={Math.random().toString(16)} style={{ display: 'none' }} />
    </div>);
}
