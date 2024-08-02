export function getHrefsAndLinks(
  restroId: string
): { href: string; text: string }[] {
  return [
    { href: `/manage/restaurant/${restroId}/orders`, text: "Current Orders" },
    {
      href: `/manage/restaurant/${restroId}/orders/all-orders`,
      text: "All Orders",
    },
    { href: `/manage/restaurant/${restroId}`, text: "Back to restaurant" },
  ]
}
