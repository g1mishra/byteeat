import CartProvider from "../store/CartProvider"

const SlugLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CartProvider>
      <div className="container relative flex min-h-screen max-w-screen-sm flex-col gap-y-2 bg-white p-0 sm:border sm:border-t-0 sm:shadow-xl">
        {children}
      </div>
    </CartProvider>
  )
}

export default SlugLayout
