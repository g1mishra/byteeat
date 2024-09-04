import { create } from "zustand"

interface BluetoothPrinterState {
  server: any
  setServer: (server: any) => void
  isConnected: boolean
  setIsConnected: (isConnected: boolean) => void
}

export const bluetoothPrinterStore = create<BluetoothPrinterState>(
  (set) => ({
    server: null,
    setServer: (server) => set({ server }),
    isConnected: false,
    setIsConnected: (isConnected) => set({ isConnected }),
  })
)
