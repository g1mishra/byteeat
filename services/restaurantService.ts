"use server"

import { PlanType, Restaurant, SubscriptionStatus } from "@prisma/client"

import prisma from "@/lib/prisma"
import { Slugify } from "@/lib/string"

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
): Promise<SubscriptionStatusResult> {
  if (!slug) {
    return {
      isActive: false,
      status: null,
      message: "Restaurant slug is required.",
      expirationDate: null,
    }
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
      throw new Error("Restaurant not found")
    }

    const subscription = restaurant.subscription

    if (!subscription) {
      return {
        isActive: false,
        status: null,
        message: "No subscription found for this restaurant.",
        expirationDate: null,
      }
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

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      return {
        isActive: false,
        status: subscription.status,
        message: `Subscription is ${subscription.status.toLowerCase()}.`,
        expirationDate,
      }
    }

    if (expirationDate && now > expirationDate) {
      return {
        isActive: false,
        status: subscription.status,
        message: "Subscription has expired.",
        expirationDate,
      }
    }

    return {
      isActive: true,
      status: subscription.status,
      message: "Subscription is active.",
      expirationDate,
    }
  } catch (error) {
    console.error("Error fetching subscription status:", error)
    if (error instanceof Error && error.message === "Restaurant not found") {
      throw new Error("NOT_FOUND")
    }
    throw error
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

export type FetchRestaurantReturnType = Awaited<
  ReturnType<typeof fetchRestaurant>
>

const addRestaurant = async (
  restaurantData: Partial<Restaurant>,
  userId: string
) => {
  try {
    let baseSlug = Slugify(`${restaurantData.name} ${restaurantData.city}`)
    let slug = baseSlug

    let existingRestaurant = await prisma.restaurant.findUnique({
      where: { slug },
    })
    let suffix = 1

    // If slug exists, increment suffix until a unique slug is found
    while (existingRestaurant) {
      slug = `${baseSlug}-${suffix}`
      existingRestaurant = await prisma.restaurant.findUnique({
        where: { slug },
      })
      suffix++
    }

    restaurantData = {
      ...restaurantData,
      slug,
      address_string: restaurantData?.address_string?.trim() || "",
    }

    return await prisma.$transaction(async (prisma) => {
      // Create the restaurant
      const newRestaurant = await prisma.restaurant.create({
        data: {
          ...(restaurantData as Restaurant),
          userRestaurants: { create: { user: { connect: { id: userId } } } },
        },
      })

      const now = new Date()
      const freeTrialEndDate = new Date(now.getTime() + 30 * 24 * 3600 * 1000)

      // Create the subscription
      await prisma.subscription.create({
        data: {
          restaurantId: newRestaurant.id,
          planType: PlanType.STARTER,
          startDate: now,
          freeTrialEndDate: freeTrialEndDate,
          status: SubscriptionStatus.ACTIVE,
          // endDate is not set initially
        },
      })

      return newRestaurant
    })
  } catch (error) {
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

const addOrUpdateSocialLinks = async (
  restaurantId: string,
  socialLinks: any
) => {
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
    throw new Error(
      "An error occurred while updating social links. Please try again."
    )
  }
}

const checkUserRestaurantPermission = async (
  userId: string,
  restaurantId: string
) => {
  if (!userId || !restaurantId) {
    throw new Error("User ID and restaurant ID are required")
  }

  try {
    const userWithRestaurants = await prisma.user.findUnique({
      where: { id: userId },
      include: { userRestaurants: true },
    })

    return userWithRestaurants?.userRestaurants.some(
      (ur) => ur.restaurantId === restaurantId
    )
  } catch (error) {
    throw error
  }
}

export {
  addOrUpdateSocialLinks,
  addRestaurant,
  deleteRestaurant,
  fetchRestaurant,
  fetchRestaurantBySlug,
  fetchRestaurants,
  fetchRestaurantSubscriptionStatus,
  getRestaurantIdBySlug,
  getRestaurantSlug,
  updateRestaurant,

  // checks
  checkUserRestaurantPermission,
}
