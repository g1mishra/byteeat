import CartProvider from "../store/CartProvider"

const SlugLayout = async ({ children }: any) => {
  return (
    <CartProvider>
      <div className="container relative flex min-h-screen max-w-screen-sm flex-col gap-y-2 bg-white py-4 sm:border sm:py-8 sm:shadow-xl">
        {children}
      </div>
    </CartProvider>
  )
}

export default SlugLayout
