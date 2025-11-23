import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * @utility function
 * Format date as "HH:MM, DD/MM/YY"
 * @returns {string}
 */

export function formatDate(iso: Date | string): string {
  const d = new Date(iso)

  const pad = (n: number) => n.toString().padStart(2, "0")

  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  const day = pad(d.getDate())
  const month = pad(d.getMonth() + 1)
  const year = d.getFullYear().toString().slice(-2)

  return `${hours}:${minutes}, ${day}/${month}/${year}`
}

/**
 * @utility function
 * Format date as "DD Month, YYYY"
 * @returns {string}
 */

export function getFormatedDate(iso: Date | string): string {
  const date = new Date(iso)

  const day = date.getDate()
  const month = date.toLocaleString("en-US", { month: "long" })
  const year = date.getFullYear()

  return `${day} ${month}, ${year}`
}

export function wordFilter(name: string, query: string): boolean {
  const nameLower = name.toLowerCase()
  const words = query.toLowerCase().trim().split(/\s+/) // split on spaces

  return words.every((word) => nameLower.includes(word))
}

export function getFormatedTime(iso: Date | string): string {
  const date = new Date(iso)

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  })
}

export function getCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0
  })
}

export function getProductId(lastId = "P000") {
  const prefix = "P"
  const num = parseInt(lastId.slice(1)) + 1 // extract numeric part and increment
  return prefix + num.toString().padStart(3, "0")
}
export function getSaleId(lastId = "S000") {
  const prefix = "S"
  const num = parseInt(lastId.slice(1)) + 1 // extract numeric part and increment
  return prefix + num.toString().padStart(3, "0")
}

export function avgPrice(c1, c2, q1, q2) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "BDT" }).format(
    (c1 + c2) / (q1 + q2)
  )
}

export function bdt(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0
  }).format(value)
}
