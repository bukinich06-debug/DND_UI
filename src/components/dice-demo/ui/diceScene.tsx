import { Environment, Lightformer } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import type { IRoll, ISkin } from "../types"
import { Die } from "./die"

interface IDiceSceneProps {
  roll: IRoll | null
  skin: ISkin
  done: boolean
  onDone: () => void
}

export const DiceScene = ({ roll, skin, done, onDone }: IDiceSceneProps) => (
  <Canvas camera={{ position: [0, 0, 10], fov: 30 }}>
    <ambientLight intensity={0.35} />
    <directionalLight position={[2, 4, 8]} intensity={1.4} />

    <Environment resolution={256}>
      <Lightformer
        form="rect"
        intensity={1.2}
        position={[0, 5, 5]}
        scale={[8, 2, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.6}
        color="#8a5cff"
        position={[-5, 0, 3]}
        scale={[3, 5, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.8}
        color="#ffd48a"
        position={[5, 1, 3]}
        scale={[2, 4, 1]}
      />
    </Environment>

    {roll && <Die roll={roll} skin={skin} done={done} onDone={onDone} />}
  </Canvas>
)
