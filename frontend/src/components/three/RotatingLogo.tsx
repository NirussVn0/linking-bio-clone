'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RotatingLogoProps {
  className?: string;
}

export default function RotatingLogo({ className = '' }: RotatingLogoProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(400, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create a complex geometric logo
    const group = new THREE.Group();

    // Central sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0080,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);

    // Orbiting rings
    const ringGeometry = new THREE.TorusGeometry(1.2, 0.1, 8, 100);
    const ringMaterials = [
      new THREE.MeshBasicMaterial({ color: 0x00ff80, wireframe: true, transparent: true, opacity: 0.6 }),
      new THREE.MeshBasicMaterial({ color: 0x8000ff, wireframe: true, transparent: true, opacity: 0.6 }),
      new THREE.MeshBasicMaterial({ color: 0x0080ff, wireframe: true, transparent: true, opacity: 0.6 }),
    ];

    const rings: THREE.Mesh[] = [];
    ringMaterials.forEach((material, index) => {
      const ring = new THREE.Mesh(ringGeometry, material);
      ring.rotation.x = (index * Math.PI) / 3;
      ring.rotation.y = (index * Math.PI) / 4;
      group.add(ring);
      rings.push(ring);
    });

    // Floating cubes
    const cubeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    const cubes: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      const angle = (i / 8) * Math.PI * 2;
      cube.position.set(
        Math.cos(angle) * 2,
        Math.sin(angle * 2) * 0.5,
        Math.sin(angle) * 2
      );
      group.add(cube);
      cubes.push(cube);
    }

    scene.add(group);
    camera.position.z = 4;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Rotate the main group
      group.rotation.y += 0.01;
      group.rotation.x += 0.005;

      // Rotate individual rings
      rings.forEach((ring, index) => {
        ring.rotation.z += 0.02 + index * 0.01;
      });

      // Animate cubes
      cubes.forEach((cube, index) => {
        const time = Date.now() * 0.001;
        cube.rotation.x += 0.02;
        cube.rotation.y += 0.03;
        cube.position.y = Math.sin(time + index) * 0.5;
      });

      // Pulse the central sphere
      const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
      sphere.scale.setScalar(scale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      ringGeometry.dispose();
      ringMaterials.forEach(material => material.dispose());
      cubeGeometry.dispose();
      cubeMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`w-96 h-96 ${className}`}
    />
  );
}
