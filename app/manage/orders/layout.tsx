import OrderNav from "./order-nav"

const ManageOrderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Manage Orders</h1>
      <main className="rounded-lg bg-white shadow">
        <OrderNav />
        {children}
      </main>
    </div>
  )
}

export default ManageOrderLayout
