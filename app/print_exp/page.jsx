"use client"

import React, { useState } from "react"

const PRINT_SERVICE_UUID = "000018F0-0000-1000-8000-00805F9B34FB".toLowerCase()
const PRINT_CHARACTERISTIC_UUID =
  "00002AF1-0000-1000-8000-00805F9B34FB".toLowerCase()

const Welcome = () => {
  const [connect, setConnect] = useState(false)
  const [device, setDevice] = useState(null)
  const [server, setServer] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRequestDevice = async () => {
    try {
      setIsLoading(true)
      const selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: [PRINT_SERVICE_UUID] }],
        optionalServices: [PRINT_SERVICE_UUID],
      })
      setDevice(selectedDevice)
      const gattServer = await selectedDevice.gatt.connect()
      setServer(gattServer)
      setConnect(true)
      console.log(`Connected to device: ${selectedDevice.name}`)
    } catch (error) {
      console.error("Connection failed:", error)
      setConnect(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = async () => {
    if (!server) return

    try {
      setIsLoading(true)
      const service = await server.getPrimaryService(PRINT_SERVICE_UUID)
      const characteristic = await service.getCharacteristic(
        PRINT_CHARACTERISTIC_UUID
      )

      const data = new Uint8Array([
        0x1b,
        0x21,
        0x00, // Select normal text
        ...new TextEncoder().encode(
          "Hello, world!\n\n\n\n\n\n\n\n\n\n\n\nI am ByteEat\n\n\nYo Yo Yo\n\n\nSaksham"
        ),
        0x1d,
        0x56,
        0x41, // Cut paper
      ])

      await characteristic.writeValue(data)
      console.log("Print command sent successfully.")
    } catch (error) {
      console.error("Failed to send print command:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">
        Welcome to the Print Experience:{" "}
        {connect ? `Connected to ${device?.name}` : "Disconnected"}
      </h1>
      <div className="space-x-4">
        <button
          onClick={handleRequestDevice}
          disabled={isLoading}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          {isLoading ? "Connecting..." : "Connect to Bluetooth Device"}
        </button>
        <button
          onClick={handlePrint}
          disabled={!connect || isLoading}
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          {isLoading ? "Printing..." : "Print"}
        </button>
      </div>
    </div>
  )
}

export default Welcome
