import React from "react"

const CenterLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
      <div className="loader size-16 animate-spin rounded-full border-t-4 border-solid border-blue-500"></div>
    </div>
  )
}

export default CenterLoading
