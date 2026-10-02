import { getGlow } from "../helpers/getGlow"
import { getTextures } from "../helpers/getTextures"
import { usePlayback } from "../hooks/usePlayback"
import type { IRoll, ISkin } from "../types"

interface IDieProps {
  roll: IRoll
  skin: ISkin
  done: boolean
  onDone: () => void
}

export const Die = ({ roll, skin, done, onDone }: IDieProps) => {
  const body = usePlayback(roll, onDone)
  const glow = done ? getGlow(roll) : undefined
  const textures = getTextures(roll.die, skin)

  return (
    <group ref={body}>
      <mesh geometry={roll.die.geometry}>
        <meshPhysicalMaterial
          key={`${roll.die.id}/${skin.id}`}
          {...skin.material}
          map={textures.map}
          bumpMap={textures.bump}
          emissiveMap={textures.glow}
          emissive={glow ?? "#000000"}
          emissiveIntensity={glow ? 2.5 : 0}
          flatShading
        />
      </mesh>
      {glow && <pointLight color={glow} intensity={20} distance={5} />}
    </group>
  )
}
