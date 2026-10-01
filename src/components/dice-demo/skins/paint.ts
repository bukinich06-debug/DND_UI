const random = (min: number, max: number) => min + Math.random() * (max - min)

export const fillGlow = (
  ctx: CanvasRenderingContext2D,
  size: number,
  inner: string,
  outer: string,
) => {
  const c = size / 2
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, size * 0.7)
  gradient.addColorStop(0, inner)
  gradient.addColorStop(1, outer)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
}

export const drawVeins = (
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string,
  count: number,
) => {
  const p = () => random(0, size)
  ctx.strokeStyle = color
  ctx.lineCap = "round"

  for (let i = 0; i < count; i++) {
    ctx.globalAlpha = random(0.1, 0.4)
    ctx.lineWidth = random(1, 6)
    ctx.beginPath()
    ctx.moveTo(p(), p())
    ctx.bezierCurveTo(p(), p(), p(), p(), p(), p())
    ctx.stroke()
  }
}

export const drawSparks = (
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string,
  count: number,
) => {
  ctx.fillStyle = color

  for (let i = 0; i < count; i++) {
    ctx.globalAlpha = random(0.3, 1)
    ctx.fillRect(random(0, size), random(0, size), 2, 2)
  }
}

export const drawBrush = (
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string,
  count: number,
) => {
  ctx.strokeStyle = color

  for (let i = 0; i < count; i++) {
    const y = random(0, size)
    ctx.globalAlpha = random(0.05, 0.25)
    ctx.lineWidth = random(0.5, 2)
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(size, y + random(-6, 6))
    ctx.stroke()
  }
}
