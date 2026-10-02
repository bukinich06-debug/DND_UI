import {
  BufferGeometry,
  Float32BufferAttribute,
  Matrix4,
  Quaternion,
  Vector3,
} from "three"
import { ConvexGeometry } from "three/addons/geometries/ConvexGeometry.js"
import { RADIUS } from "../constants"
import type { IDie, IFace, ISkin } from "../types"
import { CELL, MARGIN, getCell, getGrid } from "./atlas"

interface IDieSpec {
  id: string
  skin: ISkin
  points: Vector3[]
  edgeUp?: boolean
}

interface IPolygon {
  normal: Vector3
  corners: Vector3[]
}

const same = (a: Vector3, b: Vector3) => a.distanceTo(b) < 1e-4

export const getPoints = (geometry: BufferGeometry) => {
  const position = geometry.getAttribute("position")
  const points: Vector3[] = []

  for (let i = 0; i < position.count; i++) {
    const point = new Vector3().fromBufferAttribute(position, i)
    if (!points.some((other) => same(other, point))) points.push(point)
  }

  return points
}

// The hull comes as triangles; triangles with the same normal form one flat face.
const getPolygons = (points: Vector3[]) => {
  const position = new ConvexGeometry(points).getAttribute("position")
  const polygons: IPolygon[] = []

  for (let i = 0; i < position.count; i += 3) {
    const [a, b, c] = [0, 1, 2].map((k) =>
      new Vector3().fromBufferAttribute(position, i + k),
    )
    const normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize()
    if (normal.dot(a) < 0) normal.negate()

    let polygon = polygons.find((other) => other.normal.dot(normal) > 0.999)
    if (!polygon) {
      polygon = { normal, corners: [] }
      polygons.push(polygon)
    }

    for (const corner of [a, b, c])
      if (!polygon.corners.some((other) => same(other, corner)))
        polygon.corners.push(corner)
  }

  return polygons
}

// Corners go counter-clockwise when looking at the face from outside.
const sortCorners = (corners: Vector3[], center: Vector3, normal: Vector3) => {
  const u = corners[0].clone().sub(center)
  const v = normal.clone().cross(u)
  const angle = (corner: Vector3) => {
    const d = corner.clone().sub(center)
    return Math.atan2(d.dot(v), d.dot(u))
  }

  return [...corners].sort((a, b) => angle(a) - angle(b))
}

// Where the number's "up" points: the farthest corner (d10 tip, triangle corner) or the middle of an edge (d6).
const getUpPoint = (corners: Vector3[], center: Vector3, edgeUp?: boolean) => {
  if (edgeUp) return corners[0].clone().add(corners[1]).multiplyScalar(0.5)
  return corners.reduce((far, corner) =>
    corner.distanceTo(center) > far.distanceTo(center) + 1e-6 ? corner : far,
  )
}

// Face orientation: z = outward normal, y = number's up.
const getFrame = (center: Vector3, upPoint: Vector3, normal: Vector3) => {
  const up = upPoint.clone().sub(center).normalize()
  const right = up.clone().cross(normal)
  return new Quaternion().setFromRotationMatrix(
    new Matrix4().makeBasis(right, up, normal),
  )
}

const toFace = ({ normal, corners }: IPolygon, edgeUp?: boolean): IFace => {
  const center = corners
    .reduce((sum, corner) => sum.add(corner), new Vector3())
    .divideScalar(corners.length)
  const sorted = sortCorners(corners, center, normal)
  const frame = getFrame(center, getUpPoint(sorted, center, edgeUp), normal)

  return { number: 0, normal, center, corners: sorted, frame }
}

// Real dice rule: opposite faces sum to sides + 1. A d4 has no opposite faces, so it is numbered in order.
const numberFaces = (faces: IFace[]) => {
  let next = 1

  for (const face of faces) {
    if (face.number) continue
    face.number = next++
    const opposite = faces.find(
      (other) => other.normal.dot(face.normal) < -0.999,
    )
    if (opposite) opposite.number = faces.length + 1 - face.number
  }
}

// Each face is drawn into its own atlas cell: face center → cell center, number's up → cell up.
const buildGeometry = (faces: IFace[], cols: number, rows: number) => {
  const reach = Math.max(
    ...faces.flatMap((face) =>
      face.corners.map((corner) => corner.distanceTo(face.center)),
    ),
  )
  const scale = (CELL / 2 - MARGIN) / reach
  const positions: number[] = []
  const uvs: number[] = []

  faces.forEach((face, i) => {
    const { center } = getCell(i, cols)
    const right = new Vector3(1, 0, 0).applyQuaternion(face.frame)
    const up = new Vector3(0, 1, 0).applyQuaternion(face.frame)

    const add = (corner: Vector3) => {
      const d = corner.clone().sub(face.center)
      const x = center[0] + d.dot(right) * scale
      const y = center[1] - d.dot(up) * scale
      positions.push(corner.x, corner.y, corner.z)
      uvs.push(x / (cols * CELL), 1 - y / (rows * CELL))
    }

    for (let k = 1; k < face.corners.length - 1; k++) {
      add(face.corners[0])
      add(face.corners[k])
      add(face.corners[k + 1])
    }
  })

  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3))
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2))
  geometry.computeVertexNormals()
  return geometry
}

export const buildDie = ({ id, skin, points, edgeUp }: IDieSpec): IDie => {
  const size = Math.max(...points.map((point) => point.length()))
  const scaled = points.map((point) =>
    point.clone().multiplyScalar(RADIUS / size),
  )
  const faces = getPolygons(scaled).map((polygon) => toFace(polygon, edgeUp))
  const { cols, rows } = getGrid(faces.length)

  numberFaces(faces)

  return {
    id,
    skin,
    sides: faces.length,
    faces,
    cols,
    rows,
    geometry: buildGeometry(faces, cols, rows),
  }
}
