import React from "react"
import { fetchRestaurant } from "@/services/restaurantService"

const RestaurantDetails = async ({ params }: any) => {
  const { restroId } = params

  const response = await fetchRestaurant(restroId)
  if (!response) throw new Error("Network response was not ok.")

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold">{response.name}</h1>
      <p>{response.address}</p>
      <p>Table size: {response.table_size}</p>
    </div>
  )
}

export default RestaurantDetails
