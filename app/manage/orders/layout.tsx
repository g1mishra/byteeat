import OrderNav from "../../../components/manage/order-nav"

const hrefsAndLinks = [
  { href: `/manage/orders/current`, text: "Current Orders" },
  { href: `/manage/orders/all`, text: "All Orders" },
]

const ManageOrderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Manage Orders</h1>
      <OrderNav hrefsAndLinks={hrefsAndLinks} />
      {children}
    </>
  )
}

export default ManageOrderLayout
