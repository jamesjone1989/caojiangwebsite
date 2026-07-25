"use client";

import {
  ContactShadows,
  Float,
  PresentationControls,
  RoundedBox,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
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
    <group position={[-0.08, 1.32, 0.98]}>
      {[-0.4, 0.4].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0, -0.025]}>
            <circleGeometry args={[0.32, 48]} />
            <meshPhysicalMaterial
              color="#f2e4d0"
              roughness={0.58}
              transmission={0.02}
            />
          </mesh>
          <mesh castShadow>
            <torusGeometry args={[0.33, 0.07, 22, 56]} />
            <meshStandardMaterial color="#10110f" roughness={0.5} metalness={0.02} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.015, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.048, 0.048, 0.16, 20]} />
        <meshStandardMaterial color="#10110f" roughness={0.48} />
      </mesh>
    </group>
  );
}

function XiguaCharacter({ focus }: { focus: FocusId }) {
  return (
    <Float
      speed={1.25}
      rotationIntensity={focus === "overview" ? 0.06 : 0.02}
      floatIntensity={0.16}
    >
      <group position={[0.3, -0.1, 0]} scale={0.98}>
        <group>
          <mesh position={[0, 1.3, -0.18]} scale={[1.02, 1.08, 0.91]} castShadow>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial color="#11110f" roughness={0.72} />
          </mesh>
          <mesh position={[-0.06, 1.25, 0.09]} scale={[0.94, 0.99, 0.83]} castShadow>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial color="#f0dfc8" roughness={0.7} />
          </mesh>

          {[
            [-0.83, 1.88, 0.02, 0.54],
            [-0.42, 2.12, -0.06, 0.58],
            [0.05, 2.15, -0.1, 0.57],
            [0.5, 2.04, -0.04, 0.56],
            [0.79, 1.72, 0.02, 0.49],
          ].map(([x, y, z, scale], index) => (
            <mesh key={index} position={[x, y, z]} scale={scale} castShadow>
              <sphereGeometry args={[1, 40, 40]} />
              <meshStandardMaterial color="#11110f" roughness={0.72} />
            </mesh>
          ))}

          <mesh position={[0.84, 1.18, 0.08]} scale={[0.28, 0.34, 0.22]} castShadow>
            <sphereGeometry args={[1, 40, 40]} />
            <meshStandardMaterial color="#f0dfc8" roughness={0.7} />
          </mesh>
          <Glasses />

          <WatermelonHat />
        </group>

        <mesh position={[-0.05, 0.24, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.31, 0.62, 32]} />
          <meshStandardMaterial color="#f0dfc8" roughness={0.72} />
        </mesh>

        <group position={[0, -0.55, 0]}>
          <mesh scale={[1.04, 1.22, 0.58]} castShadow>
            <sphereGeometry args={[1, 52, 52]} />
            <meshStandardMaterial color="#f5f0e7" roughness={0.76} />
          </mesh>
          <mesh position={[-0.04, 0.22, 0.55]} scale={[0.33, 0.92, 0.1]} castShadow>
            <capsuleGeometry args={[0.5, 0.72, 12, 28]} />
            <meshStandardMaterial color="#181816" roughness={0.7} />
          </mesh>

          <mesh
            position={[-0.38, 0.47, 0.62]}
            rotation={[0.02, -0.05, -0.52]}
            scale={[0.5, 0.11, 0.075]}
          >
            <capsuleGeometry args={[0.42, 0.58, 12, 24]} />
            <meshStandardMaterial color="#fffaf1" roughness={0.76} />
          </mesh>
          <mesh
            position={[0.36, 0.47, 0.62]}
            rotation={[0.02, 0.05, 0.52]}
            scale={[0.5, 0.11, 0.075]}
          >
            <capsuleGeometry args={[0.42, 0.58, 12, 24]} />
            <meshStandardMaterial color="#fffaf1" roughness={0.76} />
          </mesh>

          {[-1, 1].map((side) => (
            <group key={side}>
              <mesh
                position={[side * 1.04, -0.08, -0.01]}
                rotation={[0, 0, side * -0.12]}
                castShadow
              >
                <capsuleGeometry args={[0.3, 1.18, 14, 28]} />
                <meshStandardMaterial color="#f5f0e7" roughness={0.76} />
              </mesh>
            </group>
          ))}

          <RoundedBox
            args={[0.48, 0.42, 0.08]}
            radius={0.1}
            smoothness={5}
            position={[0.56, -0.31, 0.58]}
            rotation={[0, -0.04, 0]}
          >
            <meshStandardMaterial color="#eee8de" roughness={0.78} />
          </RoundedBox>
          <mesh position={[-0.52, -0.44, 0.59]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.06, 28]} />
            <meshStandardMaterial color="#171715" roughness={0.5} />
          </mesh>
          <mesh position={[-0.52, -0.44, 0.63]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.055, 0.018, 12, 26]} />
            <meshStandardMaterial color="#47463f" roughness={0.45} />
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
      <PresentationControls
        global
        cursor
        snap={false}
        speed={1.15}
        rotation={[0, -0.12, 0]}
        polar={[-0.25, 0.25]}
        azimuth={[-Infinity, Infinity]}
        damping={0.22}
      >
        <XiguaCharacter focus={focus} />
      </PresentationControls>
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
