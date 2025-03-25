"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { PLYLoader, OBJLoader, GLTFLoader, STLLoader, FBXLoader } from "three-stdlib";
import * as THREE from "three";

function ThreeDimView({ mediaSrc }: { mediaSrc: string }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [object, setObject] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!mediaSrc) return;

    const extension = mediaSrc.split(".").pop()?.toLowerCase();
    const controller = new AbortController(); // For cleanup
    let isMounted = true; // Prevents state update if unmounted

    async function loadModel() {
      try {
        setGeometry(null);
        setObject(null);

        switch (extension) {
          case "ply": {
            const loader = new PLYLoader();
            const geom = await loader.loadAsync(mediaSrc);
            if (isMounted) setGeometry(geom);
            break;
          }
          case "obj": {
            const loader = new OBJLoader();
            const obj = await loader.loadAsync(mediaSrc);
            if (isMounted) setObject(obj);
            break;
          }
          case "gltf":
          case "glb": {
            const loader = new GLTFLoader();
            const gltf = await loader.loadAsync(mediaSrc);
            if (isMounted) setObject(gltf.scene);
            break;
          }
          case "stl": {
            const loader = new STLLoader();
            const geom = await loader.loadAsync(mediaSrc);
            if (isMounted) setGeometry(geom);
            break;
          }
          case "fbx": {
            const loader = new FBXLoader();
            const fbx = await loader.loadAsync(mediaSrc);
            if (isMounted) setObject(fbx);
            break;
          }
          default:
            console.error("Unsupported file format:", extension);
        }
      } catch (error) {
        console.error("Error loading 3D model:", error);
      }
    }

    loadModel();

    return () => {
      isMounted = false; // Prevent updates if unmounted
      controller.abort(); // Cleanup fetch calls
    };
  }, [mediaSrc]);

  return (
    <Canvas camera={{ position: [0, 1, 1], fov: 60 }}> {/* Adjusted camera position */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        {geometry ? (
          <mesh>
            <bufferGeometry attach="geometry" {...geometry} />
            <meshStandardMaterial attach="material" color="gray" />
          </mesh>
        ) : object ? (
          <primitive object={object} />
        ) : null}
      </Suspense>
      <OrbitControls enableDamping dampingFactor={0.2} rotateSpeed={0.3} />
    </Canvas>
  );
}

export default ThreeDimView;
