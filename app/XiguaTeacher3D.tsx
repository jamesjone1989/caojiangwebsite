"use client";

import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type FocusId =
  | "overview"
  | "books"
  | "village"
  | "wechat"
  | "xiaohongshu"
  | "echo";

const cameraViews: Record<
  FocusId,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  overview: { position: [0.15, 0.3, 10.6], target: [0.15, 0.25, 0] },
  books: { position: [-1.15, -0.15, 5.2], target: [-0.42, -0.18, 0] },
  village: { position: [0.65, 1.9, 4.9], target: [0.15, 1.75, 0] },
  wechat: { position: [1.25, 1.1, 5], target: [0.35, 1.05, 0] },
  xiaohongshu: { position: [-1.25, 1.05, 5], target: [-0.3, 1.05, 0] },
  echo: { position: [0.85, -0.3, 5.1], target: [0.2, -0.25, 0] },
};

function CameraRig({ focus }: { focus: FocusId }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const destination = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const view = cameraViews[focus];
    destination.set(...view.position);
    target.set(...view.target);
    camera.position.lerp(destination, 1 - Math.exp(-delta * 3.6));
    camera.lookAt(target);
  });

  return null;
}

function WatermelonHat() {
  const shape = useMemo(() => {
    const triangle = new THREE.Shape();
    triangle.moveTo(-0.78, -0.46);
    triangle.lineTo(0.72, -0.46);
    triangle.lineTo(0.24, 1);
    triangle.closePath();
    return triangle;
  }, []);

  const rindShape = useMemo(() => {
    const rind = new THREE.Shape();
    rind.moveTo(-0.78, -0.46);
    rind.lineTo(0.72, -0.46);
    rind.lineTo(0.66, -0.28);
    rind.lineTo(-0.6, -0.28);
    rind.closePath();
    return rind;
  }, []);

  const extrude = useMemo(
    () => ({ depth: 0.26, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04 }),
    [],
  );

  return (
    <group position={[0.15, 2.52, 0.05]} rotation={[0.08, -0.08, -0.24]} scale={0.9}>
      <mesh position={[0, 0, -0.08]} castShadow>
        <extrudeGeometry args={[shape, { ...extrude, bevelSize: 0.1 }]} />
        <meshStandardMaterial color="#121311" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.025]} castShadow>
        <extrudeGeometry args={[shape, extrude]} />
        <meshStandardMaterial color="#ff5b53" roughness={0.48} />
      </mesh>
      <mesh position={[0, 0, 0.15]} castShadow>
        <extrudeGeometry args={[rindShape, { ...extrude, depth: 0.035 }]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.12, 0.195]} castShadow>
        <extrudeGeometry args={[rindShape, { ...extrude, depth: 0.035 }]} />
        <meshStandardMaterial color="#8fcb57" roughness={0.5} />
      </mesh>
      {[
        [-0.25, 0.1, -0.2],
        [0.25, 0.3, 0.18],
        [0.04, 0.58, -0.05],
      ].map(([x, y, rotation], index) => (
        <mesh
          key={index}
          position={[x, y, 0.34]}
          rotation={[0, 0, rotation]}
          scale={[0.065, 0.13, 0.055]}
          castShadow
        >
          <sphereGeometry args={[1, 18, 18]} />
          <meshStandardMaterial color="#121311" roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function Glasses() {
  return (
    <group position={[0, 1.34, 0.8]}>
      {[-0.43, 0.43].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0, -0.025]}>
            <circleGeometry args={[0.295, 48]} />
            <meshPhysicalMaterial
              color="#fffdf7"
              roughness={0.12}
              transmission={0.12}
              transparent
              opacity={0.92}
            />
          </mesh>
          <mesh castShadow>
            <torusGeometry args={[0.305, 0.058, 18, 48]} />
            <meshStandardMaterial color="#11110f" roughness={0.38} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.015, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.24, 18]} />
        <meshStandardMaterial color="#11110f" />
      </mesh>
    </group>
  );
}

function XiguaCharacter({ focus }: { focus: FocusId }) {
  const character = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!character.current || !head.current || !eyes.current) return;

    const pointerX = reduced ? 0 : state.pointer.x;
    const pointerY = reduced ? 0 : state.pointer.y;
    head.current.rotation.y = THREE.MathUtils.damp(
      head.current.rotation.y,
      pointerX * 0.16,
      5,
      delta,
    );
    head.current.rotation.x = THREE.MathUtils.damp(
      head.current.rotation.x,
      -pointerY * 0.08,
      5,
      delta,
    );
    eyes.current.position.x = THREE.MathUtils.damp(
      eyes.current.position.x,
      pointerX * 0.06,
      8,
      delta,
    );
    eyes.current.position.y = THREE.MathUtils.damp(
      eyes.current.position.y,
      pointerY * 0.035,
      8,
      delta,
    );
    character.current.rotation.y = THREE.MathUtils.damp(
      character.current.rotation.y,
      focus === "overview" ? pointerX * 0.08 : 0,
      4,
      delta,
    );
  });

  return (
    <Float
      speed={1.25}
      rotationIntensity={focus === "overview" ? 0.06 : 0.02}
      floatIntensity={0.16}
    >
      <group ref={character} position={[0.3, -0.13, 0]} scale={0.98}>
        <group ref={head}>
          <mesh position={[0, 1.32, -0.04]} scale={[1.09, 1.13, 0.87]} castShadow>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial color="#11110f" roughness={0.58} />
          </mesh>
          <mesh position={[0, 1.29, 0.06]} scale={[1.01, 1.055, 0.84]} castShadow>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial color="#fffdf8" roughness={0.62} />
          </mesh>

          {[
            [-0.8, 1.9, 0.03, 0.53],
            [-0.36, 2.12, -0.04, 0.56],
            [0.13, 2.14, -0.08, 0.55],
            [0.56, 2.01, -0.03, 0.54],
            [0.82, 1.72, 0, 0.46],
          ].map(([x, y, z, scale], index) => (
            <mesh key={index} position={[x, y, z]} scale={scale} castShadow>
              <sphereGeometry args={[1, 40, 40]} />
              <meshStandardMaterial color="#11110f" roughness={0.58} />
            </mesh>
          ))}

          <group ref={eyes} position={[0, 0, 0]}>
            {[-0.43, 0.43].map((x) => (
              <mesh key={x} position={[x, 1.34, 0.825]} scale={[0.075, 0.1, 0.04]}>
                <sphereGeometry args={[1, 22, 22]} />
                <meshStandardMaterial color="#171715" />
              </mesh>
            ))}
          </group>
          <Glasses />

          <mesh position={[0.08, 0.89, 0.82]} rotation={[0, 0, Math.PI]} castShadow>
            <torusGeometry args={[0.3, 0.042, 12, 36, Math.PI]} />
            <meshStandardMaterial color="#11110f" />
          </mesh>
          <WatermelonHat />
        </group>

        <group position={[0, -0.48, 0]}>
          <mesh scale={[1.02, 1.2, 0.54]} castShadow>
            <sphereGeometry args={[1, 52, 52]} />
            <meshStandardMaterial color="#11110f" roughness={0.54} />
          </mesh>
          <mesh position={[0, 0.02, 0.08]} scale={[0.94, 1.12, 0.52]} castShadow>
            <sphereGeometry args={[1, 52, 52]} />
            <meshStandardMaterial color="#f9f7f0" roughness={0.64} />
          </mesh>

          <mesh position={[0, 0.14, 0.55]} scale={[0.28, 0.88, 0.09]} castShadow>
            <capsuleGeometry args={[0.5, 0.7, 12, 24]} />
            <meshStandardMaterial color="#181816" roughness={0.6} />
          </mesh>
          <mesh position={[-0.35, 0.4, 0.56]} rotation={[0, 0, -0.48]} scale={[0.48, 0.1, 0.065]}>
            <capsuleGeometry args={[0.4, 0.55, 10, 20]} />
            <meshStandardMaterial color="#e9e4d8" roughness={0.68} />
          </mesh>
          <mesh position={[0.35, 0.4, 0.56]} rotation={[0, 0, 0.48]} scale={[0.48, 0.1, 0.065]}>
            <capsuleGeometry args={[0.4, 0.55, 10, 20]} />
            <meshStandardMaterial color="#e9e4d8" roughness={0.68} />
          </mesh>

          {[-1, 1].map((side) => (
            <group key={side}>
              <mesh
                position={[side * 1.04, -0.1, -0.04]}
                rotation={[0, 0, side * -0.18]}
                castShadow
              >
                <capsuleGeometry args={[0.25, 1.12, 12, 24]} />
                <meshStandardMaterial color="#11110f" roughness={0.55} />
              </mesh>
              <mesh
                position={[side * 0.99, -0.08, 0.04]}
                rotation={[0, 0, side * -0.18]}
                scale={0.88}
                castShadow
              >
                <capsuleGeometry args={[0.22, 1.05, 12, 24]} />
                <meshStandardMaterial color="#f9f7f0" roughness={0.64} />
              </mesh>
            </group>
          ))}

          <mesh position={[0.62, -0.36, 0.56]}>
            <circleGeometry args={[0.12, 32]} />
            <meshStandardMaterial color="#ff5b53" />
          </mesh>
          <mesh position={[0.62, -0.36, 0.575]} scale={[0.04, 0.07, 0.02]}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshStandardMaterial color="#11110f" />
          </mesh>
        </group>

        <group position={[0, -1.68, 0]}>
          {[-0.42, 0.42].map((x) => (
            <group key={x}>
              <mesh position={[x, -0.36, 0]} castShadow>
                <capsuleGeometry args={[0.24, 0.82, 12, 24]} />
                <meshStandardMaterial color="#11110f" roughness={0.5} />
              </mesh>
              <RoundedBox
                args={[0.66, 0.28, 0.78]}
                radius={0.12}
                smoothness={5}
                position={[x + (x < 0 ? -0.08 : 0.08), -1.02, 0.14]}
                castShadow
              >
                <meshStandardMaterial color="#11110f" roughness={0.48} />
              </RoundedBox>
            </group>
          ))}
        </group>
      </group>
    </Float>
  );
}

export default function XiguaTeacher3D({ focus }: { focus: FocusId }) {
  return (
    <Canvas
      className="xigua-canvas"
      camera={{ position: cameraViews.overview.position, fov: 34, near: 0.1, far: 100 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
    >
      <ambientLight intensity={1.65} />
      <directionalLight
        position={[-4, 7, 6]}
        intensity={3.1}
        color="#fff9eb"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[4, 2, 3]} intensity={12} color="#ff8d72" distance={9} />
      <pointLight position={[-4, 1, 2]} intensity={10} color="#b8e88c" distance={9} />
      <CameraRig focus={focus} />
      <XiguaCharacter focus={focus} />
      <ContactShadows
        position={[0, -2.96, 0]}
        opacity={0.28}
        scale={5.5}
        blur={2.6}
        far={4.8}
        color="#151713"
      />
    </Canvas>
  );
}
