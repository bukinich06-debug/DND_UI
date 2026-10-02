import type {
  BufferGeometry,
  MeshPhysicalMaterialParameters,
  Quaternion,
  Texture,
  Vector3,
} from "three"

export interface IFace {
  number: number
  normal: Vector3
  center: Vector3
  corners: Vector3[]
  frame: Quaternion
}

export interface IDie {
  id: string
  sides: number
  skin: ISkin
  faces: IFace[]
  geometry: BufferGeometry
  cols: number
  rows: number
}

export interface ISpin {
  axis: Vector3
  angle: number
}

export interface IRoll {
  die: IDie
  value: number
  target: Quaternion
  spins: ISpin[]
}

export interface ISkin {
  id: string
  paint: (ctx: CanvasRenderingContext2D, size: number) => void
  ink: string
  font: string
  material: MeshPhysicalMaterialParameters
}

export interface ITextures {
  map: Texture
  bump: Texture
  glow: Texture
}
