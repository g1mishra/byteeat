"use client"

import { useState } from "react"

export default function AddedDish() {
  const [addedDishes, setAddedDishes] = useState([])
  const handleAddDish = (dish) => {
    setAddedDishes([...addedDishes, dish])
  }
  const handleRemoveDish = (id) => {
    setAddedDishes(addedDishes.filter((dish) => dish.id !== id))
  }

  const totalPrice = addedDishes.reduce((total, dish) => total + dish.price, 0)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Added Dishes</h2>
      <ul className="grid grid-cols-1 gap-4">
        {addedDishes.map((dish) => (
          <li
            key={dish.id}
            className="bg-gray-100 rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-medium">{dish.name}</h3>
              <p className="text-gray-500">${dish.price.toFixed(2)}</p>
            </div>
            <button
              className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600"
              onClick={() => handleRemoveDish(dish.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-right">
        <p className="text-lg font-medium">Total: ${totalPrice.toFixed(2)}</p>
      </div>
    </div>
  )
}
