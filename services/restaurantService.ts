import { API_BASE_URL } from "@/config/apiConfig"

interface RestaurantI {
  id?: number
  name: string
  table_size: number
  address: string
}

const fetchRestaurants = async (): Promise<RestaurantI[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/`, {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("Network response was not ok.")
    return await response.json()
  } catch (error) {
    throw error
  }
}

const fetchRestaurant = async (restaurantId: number): Promise<RestaurantI> => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`)
    if (!response.ok) throw new Error("Network response was not ok.")
    return await response.json()
  } catch (error) {
    throw error
  }
}

const addRestaurant = async (
  restaurantData: RestaurantI
): Promise<RestaurantI> => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurantData),
    })
    if (!response.ok) throw new Error("Error creating restaurant.")
    return await response.json()
  } catch (error) {
    throw error
  }
}

const updateRestaurant = async (
  restaurantData: RestaurantI
): Promise<RestaurantI> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/restaurants/${restaurantData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restaurantData),
      }
    )
    if (!response.ok) throw new Error("Error updating restaurant.")
    return await response.json()
  } catch (error) {
    throw error
  }
}

const deleteRestaurant = async (restaurantId: number): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/restaurants/${restaurantId}`,
      {
        method: "DELETE",
      }
    )
    if (!response.ok) throw new Error("Error deleting restaurant.")
  } catch (error) {
    throw error
  }
}

export {
  fetchRestaurants,
  fetchRestaurant,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
}
