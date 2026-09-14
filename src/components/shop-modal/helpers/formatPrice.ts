export const formatPrice = (cp: number): string => {
  if (cp === 0) return "Бесплатно"

  const gp = Math.floor(cp / 100)
  const sp = Math.floor((cp % 100) / 10)
  const cpRest = cp % 10

  const parts: string[] = []
  if (gp > 0) parts.push(`${gp} зм`)
  if (sp > 0) parts.push(`${sp} см`)
  if (cpRest > 0) parts.push(`${cpRest} мм`)

  return parts.join(" ")
}
