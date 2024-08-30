import OrderNav from "@/components/manage/order-nav"

function getHrefsAndLinks(restroId: string): { href: string; text: string }[] {
  return [
    { href: `/manage/restaurant/${restroId}/orders`, text: "Current Orders" },
    {
      href: `/manage/restaurant/${restroId}/orders/all-orders`,
      text: "All Orders",
    },
  ]
}

const ManageOrderLayout = ({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    restroId: string
  }
}) => {
  return (
    <div className="sm:p-4">
      <h1 className="mb-4 text-2xl font-bold">Manage Orders</h1>
      <OrderNav hrefsAndLinks={getHrefsAndLinks(params.restroId)} />
      {children}
    </div>
  )
}

export default ManageOrderLayout
