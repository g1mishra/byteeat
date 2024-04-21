"use client";

import UploadLogo from "@/components/upload_logo";
export default function Upload({params}: any){
    const slg: string = params.slug
    return <div>
        
        <UploadLogo folderName={slg}></UploadLogo>
        </div>
}