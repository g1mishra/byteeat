import LogoOrAvatar from "@/components/logo-or-avatar"
import { ThemeFormValues } from "@/components/manage/RestaurantTheme"
import { Sidebar } from "@/components/sidebar"
import MenuView from "@/components/slug-view/MenuView"
import { formatAddress } from "@/lib/string"
import { getBasePath } from "@/lib/utils"
import { MenuItemI } from "@/services/menuService"
import { FullAdress, fetchRestaurantBySlug } from "@/services/restaurantService"
import { Metadata, ResolvingMetadata } from "next"
import { notFound, redirect } from "next/navigation"

export interface OrganizedMenu {
  [category: string]: MenuItemI[]
}

// Helper function to get theme-based styles
const getThemeStyles = (theme: ThemeFormValues) => {
  if (!theme) return {}

  return {
    "--background-color": theme.backgroundColor || "#f5f5f5",
    "--primary-color": theme.primaryColor || "#000000",
    "--secondary-color": theme.secondaryColor || "#ffffff",
    fontFamily:
      theme.fontFamily === "inter"
        ? "'Inter', sans-serif"
        : theme.fontFamily === "poppins"
          ? "'Poppins', sans-serif"
          : "'Roboto', sans-serif",
  } as React.CSSProperties
}

const Welcome = async ({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { tableNumber: string }
}) => {
  const { slug } = params

  const restaurant = await fetchRestaurantBySlug(slug, {
    includeMenuItems: true,
    includePrice: true,
  })

  if (!restaurant) {
    return notFound()
  }

  const tableNumber = Number(searchParams?.tableNumber)
  if (tableNumber < 1 || tableNumber > restaurant.tableSize) {
    return redirect(getBasePath(slug))
  }

  const theme = restaurant.theme as ThemeFormValues

  const address = formatAddress(restaurant as FullAdress)
  const themeStyles = getThemeStyles(theme)

  return (
    <>
      <Sidebar
        name={restaurant.name}
        socials={restaurant.SocialLinks}
        address={address}
        selfOrdering={restaurant?.selfOrdering || false}
      />
      <div className="px-6 py-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center">
            <LogoOrAvatar src={restaurant.logoUrl} name={restaurant.name} className="max-w-52" />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold" style={{ color: "var(--primary-color)" }}>
              {restaurant.name}
            </h1>
            <p className="text-sm font-light text-gray-500">{address}</p>
          </div>
        </div>
        {restaurant.ItemCategory ? (
          <MenuView
            data={restaurant.ItemCategory}
            selfOrdering={restaurant?.selfOrdering || false}
            theme={{
              menuStyle: theme?.menuStyle || "grid",
              buttonStyle: theme?.buttonStyle || "rounded",
              primaryColor: theme?.primaryColor || "#000000",
              secondaryColor: theme?.secondaryColor || "#ffffff",
              fontFamily: theme?.fontFamily || "inter",
            }}
          />
        ) : null}
      </div>
    </>
  )
}

export default Welcome

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params
  const response = await fetchRestaurantBySlug(slug)

  const previousImages = (await parent).openGraph?.images || []

  const { name, logoUrl, address_string, city, state, country, tableSize } = response || {}

  return {
    title: `${name || slug} - Restaurant in ${city}, ${state}`,

    description: `Experience a delightful dining experience at ${name} in ${city}, ${state}. Located at ${address_string}, our restaurant offers a cozy atmosphere and delicious food. Book your table today!`,
    openGraph: {
      title: `${name} - Restaurant`,
      description: `Visit ${name} in ${city} for a memorable dining experience. Located at ${address_string}, we provide a cozy ambiance and great food. Discover our menu and make a reservation today!`,
      images: [logoUrl || "", ...previousImages],
      url: getBasePath(slug),
      type: "website",
      siteName: "ByteEat",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} - Restaurant`,
      description: `Enjoy a great meal at ${name} in ${city}. Located at ${address_string}, our restaurant offers a cozy setting and delicious dishes. Reserve your table now!`,
      images: [logoUrl || ""],
    },
  }
}
