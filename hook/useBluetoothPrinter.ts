import { useState, useEffect } from 'react';

const PRINT_SERVICE_UUID = "000018f0-0000-1000-8000-00805f9b34fb";
const PRINT_CHARACTERISTIC_UUID = "00002af1-0000-1000-8000-00805f9b34fb";

export function useBluetoothPrinter() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [server, setServer] = useState<any>(null);

  useEffect(() => {
    const savedServer = localStorage.getItem('bluetoothServer');
    if (savedServer) {
      reconnectToServer(JSON.parse(savedServer));
    }
  }, []);

  const reconnectToServer = async (savedServer: any) => {
    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: [PRINT_SERVICE_UUID] }],
        optionalServices: [PRINT_SERVICE_UUID],
      });
      const gattServer = await device.gatt.connect();
      setServer(gattServer);
      setIsConnected(true);
      localStorage.setItem('bluetoothServer', JSON.stringify(gattServer));
    } catch (error) {
      console.error("Error reconnecting:", error);
      setIsConnected(false);
      localStorage.removeItem('bluetoothServer');
    }
  };

  const handleRequestDevice = async (): Promise<void> => {
    try {
      const selectedDevice = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: [PRINT_SERVICE_UUID] }],
        optionalServices: [PRINT_SERVICE_UUID],
      });

      const gattServer = await selectedDevice.gatt.connect();

      if (gattServer) {
        setServer(gattServer);
        setIsConnected(true);
        localStorage.setItem('bluetoothServer', JSON.stringify(gattServer));
        console.log("Connected to GATT server:", gattServer);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsConnected(false);
      localStorage.removeItem('bluetoothServer');
    }
  };

  return { isConnected, server, handleRequestDevice };
}

export async function printOrder(server: any, receiptData: string) {
  try {
    const service = await server.getPrimaryService(PRINT_SERVICE_UUID);
    const characteristic = await service.getCharacteristic(PRINT_CHARACTERISTIC_UUID);
    await characteristic.writeValue(new TextEncoder().encode(receiptData));
    console.log("Print command sent successfully.");
  } catch (error) {
    console.error("Error printing:", error);
    throw error;
  }
}
