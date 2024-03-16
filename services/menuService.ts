import { API_BASE_URL } from "@/config/apiConfig"

export interface MenuI {
  id?: number
  category: string
  dish: string
  price: number
  restaurant: number
}

const fetchMenus = async (): Promise<MenuI[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/menus/`, {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("Network response was not ok.")
    return await response.json()
  } catch (error) {
    throw error
  }
}

const fetchMenu = async (menuId: number): Promise<MenuI> => {
  try {
    const response = await fetch(`${API_BASE_URL}/menus/${menuId}`)
    if (!response.ok) throw new Error("Network response was not ok.")
    return await response.json()
  } catch (error) {
    throw error
  }
}

const addMenu = async (menuData: MenuI): Promise<MenuI> => {
  try {
    const response = await fetch(`${API_BASE_URL}/menus/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuData),
    })
    if (!response.ok) throw new Error("Error creating menu.")
    return await response.json()
  } catch (error) {
    throw error
  }
}

const updateMenu = async (menuData: MenuI): Promise<MenuI> => {
  try {
    const response = await fetch(`${API_BASE_URL}/menus/${menuData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuData),
    })
    if (!response.ok) throw new Error("Error updating menu.")
    return await response.json()
  } catch (error) {
    throw error
  }
}

const deleteMenu = async (menuId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/menus/${menuId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Error deleting menu.")
  } catch (error) {
    throw error
  }
}

export { fetchMenus, fetchMenu, addMenu, updateMenu, deleteMenu }
