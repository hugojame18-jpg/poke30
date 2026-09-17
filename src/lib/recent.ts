import { useCallback, useEffect, useState } from 'react'
import { getProduct, type Product } from './data'

const KEY = 'pokeloot-recent'
const read = (): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function pushRecent(slug: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify([slug, ...read().filter((s) => s !== slug)].slice(0, 8)))
  } catch {
    /* ignore */
  }
}

export function useRecent(exclude?: string): Product[] {
  const get = useCallback(() => read().filter((s) => s !== exclude).map(getProduct).filter((p): p is Product => !!p), [exclude])
  const [list, setList] = useState(get)
  useEffect(() => setList(get()), [get])
  return list
}
