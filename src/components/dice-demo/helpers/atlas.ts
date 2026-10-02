export const CELL = 256
export const MARGIN = 12

// Square-ish grid with one cell per face.
export const getGrid = (count: number) => {
  const cols = Math.ceil(Math.sqrt(count))
  return { cols, rows: Math.ceil(count / cols) }
}

export const getCell = (index: number, cols: number) => {
  const x = (index % cols) * CELL
  const y = Math.floor(index / cols) * CELL
  const center: [number, number] = [x + CELL / 2, y + CELL / 2]

  return { x, y, center }
}
