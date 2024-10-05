"use server"

import { Restaurant, SubscriptionStatus } from "@prisma/client"

import prisma from "@/lib/prisma"

import { checkAuth } from "./utils.service"

export type FullAdress = {
  address_string: string
  city: string
  state: string
  country: string
}
interface RestaurantI extends FullAdress {
  id?: string
  name: string
  tableSize: number
  slug?: string
}

const fetchRestaurants = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required")
  }
  try {
    const userWithRestaurants = await prisma.user.findUnique({
      where: { id: userId },
      include: { userRestaurants: { include: { restaurant: true } } },
    })

    return userWithRestaurants?.userRestaurants.map((ur) => ur.restaurant)
  } catch (error) {
    throw error
  }
}

const getRestaurantIdBySlug = async (restaurantSlug: string) => {
  if (!restaurantSlug) {
    throw new Error("Restaurant slug is required")
  }

  try {
    return await prisma.restaurant.findUnique({
      where: {
        slug: restaurantSlug,
      },
      select: {
        id: true,
      },
    })
  } catch (error) {
    throw error
  }
}

const fetchRestaurantBySlug = async (
  restaurantSlug: string,
  options?: {
    includeMenuItems: boolean
    includePrice: boolean
  }
) => {
  if (!restaurantSlug) {
    throw new Error("Restaurant slug is required")
  }

  try {
    return await prisma.restaurant.findUnique({
      where: {
        slug: restaurantSlug,
      },
      include: {
        ItemCategory: options?.includeMenuItems
          ? {
              orderBy: {
                position: "asc", // Order categories by position
              },
              include: {
                Item: {
                  orderBy: {
                    position: "asc", // Order items within each category by position
                  },
                  include: options?.includePrice
                    ? {
                        PriceItemMap: true,
                        addons: {
                          select: {
                            id: true,
                            name: true,
                            price: true,
                          },
                        },
                      }
                    : {},
                },
              },
            }
          : false,
        SocialLinks: true,
      },
    })
  } catch (error) {
    throw error
  }
}

export type SubscriptionStatusResult = {
  isActive: boolean
  status: SubscriptionStatus | null
  message: string
  expirationDate: Date | null
}

async function fetchRestaurantSubscriptionStatus(
  slug: string
): Promise<{ isValid: boolean; isActive: boolean; status: SubscriptionStatus | null }> {
  if (!slug) {
    return { isValid: false, isActive: false, status: null }
  }

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        subscription: {
          select: {
            status: true,
            startDate: true,
            freeTrialEndDate: true,
            endDate: true,
          },
        },
      },
    })

    if (!restaurant) {
      return { isValid: false, isActive: false, status: null }
    }

    const subscription = restaurant.subscription

    if (!subscription) {
      return { isValid: true, isActive: false, status: null }
    }

    const now = new Date()
    let expirationDate: Date | null = null

    if (subscription.freeTrialEndDate) {
      expirationDate = new Date(subscription.freeTrialEndDate)
    }

    if (subscription.endDate) {
      const endDate = new Date(subscription.endDate)
      if (!expirationDate || endDate > expirationDate) {
        expirationDate = endDate
      }
    }

    const isActive =
      subscription.status === SubscriptionStatus.ACTIVE &&
      (!expirationDate || now <= expirationDate)

    return {
      isValid: true,
      isActive,
      status: subscription.status,
    }
  } catch (error) {
    console.error("Error fetching subscription status:", error)
    return { isValid: false, isActive: false, status: null }
  }
}

const fetchRestaurant = async (
  restaurantId: string,
  userId: string,
  options?: {
    includeMenuItems?: boolean
    includePrice?: boolean
    includeJoiningKey?: boolean
    includeSocialLinks?: boolean
  }
) => {
  if (!restaurantId) {
    throw new Error("Restaurant ID is required")
  }

  if (!userId) {
    throw new Error("User ID is required")
  }

  try {
    const userWithRestaurants = await prisma.user.findUnique({
      where: { id: userId },
      include: { userRestaurants: true },
    })

    const restaurant = userWithRestaurants?.userRestaurants.find(
      (r) => r.restaurantId === restaurantId
    )

    return await prisma.restaurant.findUnique({
      where: {
        id: restaurant?.restaurantId,
      },
      include: {
        joiningKey: options?.includeJoiningKey ? true : false,
        ItemCategory: {
          orderBy: {
            id: "asc",
          },
          include: {
            Item: options?.includeMenuItems
              ? {
                  include: options?.includePrice
                    ? {
                        PriceItemMap: true,
                        addons: {
                          select: {
                            id: true,
                            name: true,
                            price: true,
                          },
                        },
                      }
                    : {},
                }
              : false,
          },
        },
        SocialLinks: options?.includeSocialLinks ? true : false,
      },
    })
  } catch (error) {
    console.error("error", error)
    throw error
  }
}

const getRestaurantSlug = async (
  restaurantId: string,
  select?: {
    slug?: boolean
    name?: boolean
  }
) => {
  if (!restaurantId) {
    throw new Error("Restaurant ID is required")
  }

  try {
    return await prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
      },
      select: select
        ? select
        : {
            slug: true,
          },
    })
  } catch (error) {
    console.error("error", error)
    throw error
  }
}

export type FetchRestaurantReturnType = Awaited<ReturnType<typeof fetchRestaurant>>

const addRestaurant = async (
  restaurant: RestaurantI & { logoUrl?: string; subscription: "STARTER" | "PRO" },
  userId: string
): Promise<Restaurant> => {
  try {
    if (!userId) {
      throw new Error("User ID is required")
    }
    await checkAuth("You are not authorized to create a restaurant")
    const newRestaurant = await prisma.restaurant.create({
      data: {
        name: restaurant.name,
        tableSize: restaurant.tableSize,
        address_string: restaurant.address_string,
        city: restaurant.city,
        state: restaurant.state ?? "",
        country: restaurant.country ?? "",
        slug: restaurant.slug ?? "",
        logoUrl: restaurant.logoUrl ?? "",
        userRestaurants: {
          create: {
            userId: userId,
          },
        },
        subscription: {
          create: {
            planType: restaurant.subscription,
            status: "ACTIVE",
            startDate: new Date(),
            freeTrialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          },
        },
      },
    })
    return newRestaurant
  } catch (error) {
    console.error("Error adding restaurant:", error)
    throw error
  }
}

const updateRestaurant = async (restaurantData: Partial<RestaurantI>) => {
  try {
    if (!restaurantData.id) {
      throw new Error("Restaurant ID is required")
    }
    await checkAuth("You are not authorized to update this restaurant")

    return await prisma.restaurant.update({
      where: {
        id: restaurantData.id,
      },
      data: restaurantData,
    })
  } catch (error) {
    throw error
  }
}

const deleteRestaurant = async (restaurantId: string): Promise<void> => {
  try {
    if (!restaurantId) {
      throw new Error("Restaurant ID is required")
    }
    await checkAuth("You are not authorized to delete this restaurant")
    await prisma.restaurant.update({
      data: {
        isActive: false,
      },
      where: {
        id: restaurantId,
      },
    })
  } catch (error) {
    throw error
  }
}

const addOrUpdateSocialLinks = async (restaurantId: string, socialLinks: any) => {
  if (!restaurantId) {
    throw new Error("Restaurant ID is required")
  }

  await checkAuth("You are not authorized to update this restaurant")

  try {
    return await prisma.socialLinks.upsert({
      where: {
        restaurantId: restaurantId,
      },
      create: {
        ...socialLinks,
        restaurantId: restaurantId,
      },
      update: {
        ...socialLinks,
      },
    })
  } catch (error) {
    console.error("Failed to add or update social links:", error)
    throw new Error("An error occurred while updating social links. Please try again.")
  }
}

const checkUserRestaurantPermission = async (userId: string, restaurantId: string) => {
  if (!userId || !restaurantId) {
    throw new Error("User ID and restaurant ID are required")
  }

  try {
    const userWithRestaurants = await prisma.user.findUnique({
      where: { id: userId },
      include: { userRestaurants: true },
    })

    return userWithRestaurants?.userRestaurants.some((ur) => ur.restaurantId === restaurantId)
  } catch (error) {
    throw error
  }
}

export {
  addOrUpdateSocialLinks,
  addRestaurant,
  // checks
  checkUserRestaurantPermission,
  deleteRestaurant,
  fetchRestaurant,
  fetchRestaurantBySlug,
  fetchRestaurants,
  fetchRestaurantSubscriptionStatus,
  getRestaurantIdBySlug,
  getRestaurantSlug,
  updateRestaurant,
}
