'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create geometric shapes
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.7, 32, 32),
      new THREE.ConeGeometry(0.7, 1.5, 8),
      new THREE.TorusGeometry(0.7, 0.3, 16, 100),
    ];

    const materials = [
      new THREE.MeshBasicMaterial({
        color: 0xff0080,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      }),
      new THREE.MeshBasicMaterial({
        color: 0x00ff80,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      }),
      new THREE.MeshBasicMaterial({
        color: 0x8000ff,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      }),
      new THREE.MeshBasicMaterial({
        color: 0x0080ff,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      }),
    ];

    const meshes: THREE.Mesh[] = [];

    geometries.forEach((geometry, index) => {
      const mesh = new THREE.Mesh(geometry, materials[index]);
      mesh.position.set(
        (index - 1.5) * 3,
        Math.sin(index) * 2,
        -5 - index * 2
      );
      scene.add(mesh);
      meshes.push(mesh);
    });

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.01 + index * 0.002;
        mesh.rotation.y += 0.01 + index * 0.003;
        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
