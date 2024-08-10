'use client'

import React, { useState } from 'react';

const Welcome = () => {
    const [connect, setConnect] = useState(false);
    const [device, setDevice] = useState(null);
    const [server, setServer] = useState(null);

    const handleRequestDevice = () => {
        navigator.bluetooth.requestDevice({filters: [{ services: ['000018F0-0000-1000-8000-00805F9B34FB'.toLowerCase()] }], // Replace with your service UUID
            optionalServices: ['000018F0-0000-1000-8000-00805F9B34FB'.toLowerCase()] })
            .then(selectedDevice => {
                setDevice(selectedDevice);
                return selectedDevice.gatt.connect();
            })
            .then(gattServer => {
                setServer(gattServer);
                setConnect(true);
            })
            .catch(error => {
                console.error(error);
                setConnect(false);
            });
    };

    const handlePrint = () => {
        if (!server) return;

        // Replace with your service and characteristic UUIDs
        const PRINT_SERVICE_UUID = '000018F0-0000-1000-8000-00805F9B34FB'.toLowerCase();
        const PRINT_CHARACTERISTIC_UUID = '00002AF1-0000-1000-8000-00805F9B34FB'.toLowerCase();

        server.getPrimaryService(PRINT_SERVICE_UUID)
            .then(service => service.getCharacteristic(PRINT_CHARACTERISTIC_UUID))
            .then(characteristic => {
                const data = new Uint8Array([
                    // Example ESC/POS command for text
                    0x1B, 0x21, 0x00, // Select normal text
                    ...new TextEncoder().encode('Hello, world!\n\n\n\n\n\n\n\n\n\n\n\nI am ByteEat\n\n\nYo Yo Yo\n\n\nSaksham'),
                    0x1D, 0x56, 0x41 // Cut paper
                ]);
                return characteristic.writeValue(data);
            })
            .then(() => {
                console.log('Print command sent successfully.');
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div>
            <h1>Welcome to the Print Experience: {connect ? "Connected" : "Disconnected"}</h1>
            <button onClick={handleRequestDevice}>Connect to Bluetooth Device</button>
            <button onClick={handlePrint} disabled={!connect}>Print</button>
        </div>
    );
};

export default Welcome;
