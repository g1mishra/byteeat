import CartProvider from "../store/CartProvider"

const SlugLayout = async ({ children }: any) => {
  return (
    <CartProvider>
      <div className="container relative flex min-h-screen max-w-screen-sm flex-col gap-y-2 bg-white p-0 sm:border sm:shadow-xl">
        {children}
      </div>
    </CartProvider>
  )
}

export default SlugLayout
