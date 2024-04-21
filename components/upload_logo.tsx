"use client";

import { Button } from "./ui/button";
import React, { useState } from "react";
import s3 from "get_s3";


export default function UploadLogo({folderName}: string) {

    const [file, setFile] = useState({"file":null, "name":null});
    console.log("slug_name", folderName)


    function handleChange(event){
       // console.log(e)
       setFile(event.target.files[0]);
       const uploadFile = event.target.files[0]
       console.log("File name is", uploadFile.name)
       
        
    }

    function handleSubmit(event){
        event.preventDefault()
        if (file.name != null){
          const params = {
              Bucket: 'byte-eat-staticfiles',
              Key: `${folderName}/logo.png`,
              Body:  file
            };
            s3.upload(params, function(err: any, data: { Location: any; }) {
              if (err) {
                console.error("Error uploading file: ", err);
              } else {
                console.log("File uploaded successfully. Location: ", data.Location);
              }
            });
          }
        
    }

    return <>
    <form onSubmit={handleSubmit}>
            <input type="file" accept="image/png" onInput={handleChange}/>
            <Button type="submit">Upload an image of your logo</Button>
        </form>
    </>
        

}

