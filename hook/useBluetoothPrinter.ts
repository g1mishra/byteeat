import { useEffect } from "react"

import { useToast } from "@/components/ui/use-toast"
import { bluetoothPrinterStore } from "@/app/store"

const PRINT_SERVICE_UUID = "000018f0-0000-1000-8000-00805f9b34fb"
const PRINT_CHARACTERISTIC_UUID = "00002af1-0000-1000-8000-00805f9b34fb"

export function useBluetoothPrinter() {
  const { toast } = useToast()
  const { server, setServer, isConnected, setIsConnected } =
    bluetoothPrinterStore()

  useEffect(() => {
    const checkConnection = async () => {
      if (server) {
        const isConnected = server.connected
        setIsConnected(isConnected)
      }
    }

    checkConnection()

    const interval = setInterval(checkConnection, 1000 * 30) //

    return () => clearInterval(interval)
  }, [server, setIsConnected])

  const handleRequestDevice = async (): Promise<void> => {
    try {
      if (isConnected) return
      const selectedDevice = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: [PRINT_SERVICE_UUID] }],
        optionalServices: [PRINT_SERVICE_UUID],
      })

      const gattServer = await selectedDevice.gatt.connect()

      if (gattServer) {
        setIsConnected(gattServer.connected)
        setServer(gattServer)
        console.log("Connected to GATT server:", gattServer)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const printOrder = async (receiptData: string) => {
    try {
      if (!server || !isConnected) {
        toast({
          title: "Printer Error",
          description: "Bluetooth printer is not connected",
          variant: "destructive",
        })
        setIsConnected(false)
        throw new Error("Bluetooth printer is not connected")
      }

      const service = await server.getPrimaryService(PRINT_SERVICE_UUID)
      const characteristic = await service.getCharacteristic(
        PRINT_CHARACTERISTIC_UUID
      )
      await characteristic.writeValue(new TextEncoder().encode(receiptData))
      console.log("Print command sent successfully.")
      toast({
        title: "Print Successful",
        description: "Print command sent successfully.",
      })
    } catch (error) {
      toast({
        title: "Print Error",
        description: "Failed to print order",
        variant: "destructive",
      })
      setIsConnected(false)
      throw new Error("Failed to print: " + (error as Error).message)
    }
  }

  return {
    handleRequestDevice,
    printOrder,
    server,
    isConnected,
  }
}
