"use client";

import React from 'react';
import { useQRCode } from 'next-qrcode';
import { Button } from '@/components/ui/button';

function QRMenu({params}: any) {
  const { Canvas } = useQRCode();
  const root_url = window.location.origin
   
  const url_to_render = `${root_url}/${params.slug}`

  return (
    <div>
         <Canvas
      text={url_to_render}
      options={{
        errorCorrectionLevel: 'M',
        margin: 3,
        scale: 4,
        width: 200,
        color: {
          dark: '#010599FF',
          light: '#FFBF60FF',
        },
      }}
    />
    <br></br>
    <Button>Order stickers</Button>
    </div>
   
  );
}

export default QRMenu; 