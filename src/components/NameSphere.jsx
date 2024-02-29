import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TrackballControls } from "@react-three/drei";
import * as THREE from "three"; // Import THREE for Vector3, Spherical, and Color
import { Text } from "@react-three/drei";

/**
 * Word component represents a single word in the sphere.
 * It handles hovering effects and renders the word using Three.js text rendering.
 */
function Word({ children, color, hoveredColor, ...props }) {
  // Reference for the word component
  const ref = useRef();

  // State to manage hover effect
  const [hovered, setHovered] = useState(false);

  // Handler for mouse over
  const over = (e) => {
    e.stopPropagation();
    setHovered(true);
  };

  // Handler for mouse out
  const out = () => setHovered(false);

  // Set cursor style based on hover state
  useEffect(() => {
    if (hovered) document.body.style.cursor = "pointer";
    return () => (document.body.style.cursor = "auto");
  }, [hovered]);

  // Rotate the word based on camera's quaternion and apply color based on hover state
  useFrame(({ camera }) => {
    ref.current.quaternion.copy(camera.quaternion);
    ref.current.material.color.set(hovered ? hoveredColor : color);
  });

  // Render the word
  return (
    <Text
      ref={ref}
      onPointerOver={over}
      onPointerOut={out}
      onClick={() => console.log("clicked")}
      {...props}
    >
      {children}
    </Text>
  );
}

/**
 * Cloud component generates the sphere of words.
 * It distributes the words evenly on a sphere.
 */
function Cloud({ count, radius, words, color, hoveredColor }) {
  // Logic to generate word components without useMemo
  const wordComponents = [];
  const spherical = new THREE.Spherical();
  const phiSpan = Math.PI / (count + 1);
  const thetaSpan = (Math.PI * 2) / count;
  let k = 0;

  for (let i = 1; i < count + 1; i++)
    for (let j = 0; j < count; j++) {
      wordComponents.push({
        position: new THREE.Vector3().setFromSpherical(
          spherical.set(radius, phiSpan * i, thetaSpan * j)
        ),
        word: words[k % words.length],
      });
      k++;
    }

  // Render the word components
  return (
    <>
      {wordComponents.map(({ position, word }, index) => (
        <Word
          key={index}
          position={position}
          color={color}
          hoveredColor={hoveredColor}
        >
          {word}
        </Word>
      ))}
    </>
  );
}


/**
 * NameSphere component represents the main component for the sphere of words.
 * It takes various properties to customize the sphere.
 */
const NameSphere = ({
  count = 5,
  radius = 15,
  words = [],
  color = "black",
  hoveredColor = "#e1af16",
  width = "100%",
  height = "100vh",
}) => {
  return (
    <div className="cloud">
      <Canvas style={{ width, height }}>
        {/* Set up fog */}
        <fog attach="fog" args={["#202025", 0, 80]} />

        {/* Render the cloud of words */}
        <Cloud
          count={count}
          radius={radius}
          words={words}
          color={color}
          hoveredColor={hoveredColor}
        />

        {/* Add trackball controls for interaction */}
        <TrackballControls />
      </Canvas>
    </div>
  );
};

export default NameSphere;
