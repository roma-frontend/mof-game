'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, Text } from '@react-three/drei';
import * as THREE from 'three';

function RoomModel({ roomType }: { roomType: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  // Սենյակի գույները ըստ տեսակի
  const roomColors = {
    office: { walls: '#4a5568', floor: '#2d3748', details: '#ecc94b' },
    kitchen: { walls: '#f7fafc', floor: '#cbd5e0', details: '#ed8936' },
    'orange-meeting': { walls: '#ed8936', floor: '#c05621', details: '#ffffff' },
    'blue-meeting': { walls: '#4299e1', floor: '#2b6cb0', details: '#ffffff' },
    'consultant': { walls: '#38b2ac', floor: '#285e61', details: '#e6fffa' },
    reception: { walls: '#9f7aea', floor: '#6b46c1', details: '#faf5ff' },
    'it-room': { walls: '#1a202c', floor: '#2d3748', details: '#00ff00' },
  };

  const colors = roomColors[roomType as keyof typeof roomColors] || roomColors.office;

  return (
    <group>
      {/* Հատակ */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[20, 20, 0.2]} />
        <meshStandardMaterial color={colors.floor} />
      </mesh>

      {/* Պատեր */}
      {[
        { position: [0, 2, -10], size: [20, 8, 0.2] }, // հետևի պատ
        { position: [-10, 2, 0], size: [0.2, 8, 20], rotation: [0, Math.PI / 2, 0] }, // ձախ պատ
        { position: [10, 2, 0], size: [0.2, 8, 20], rotation: [0, Math.PI / 2, 0] }, // աջ պատ
      ].map((wall, idx) => (
        <mesh key={idx} position={wall.position as [number, number, number]}>
          <boxGeometry args={wall.size as [number, number, number]} />
          <meshStandardMaterial color={colors.walls} />
        </mesh>
      ))}

      {/* Կահույք ըստ սենյակի տեսակի */}
      {roomType === 'office' && (
        <>
          {/* Սեղան */}
          <mesh position={[0, -1, -5]}>
            <boxGeometry args={[6, 0.2, 3]} />
            <meshStandardMaterial color="#8b5a2b" />
          </mesh>
          
          {/* Աթոռներ */}
          <mesh position={[-2, -1.5, -5]}>
            <boxGeometry args={[0.5, 1, 0.5]} />
            <meshStandardMaterial color="#4a5568" />
          </mesh>
        </>
      )}

      {/* Լույսեր */}
      <pointLight position={[0, 5, 0]} intensity={0.5} color={colors.details} />
      <ambientLight intensity={0.3} />
    </group>
  );
}

function InteractiveObject({ position, onClick, children }: any) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <mesh
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
      scale={hovered ? 1.1 : 1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#ff6b6b' : '#4ecdc4'} />
      <Html distanceFactor={10}>
        <div className="bg-black/70 text-white p-2 rounded-lg text-sm">
          {children}
        </div>
      </Html>
    </mesh>
  );
}

export function OfficeRoom3D({ roomType = 'office', onObjectClick }: { 
  roomType: string; 
  onObjectClick?: (object: string) => void;
}) {
  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
        <color attach="background" args={['#1a202c']} />
        <RoomModel roomType={roomType} />
        
        {/* Ինտերակտիվ օբյեկտներ */}
        <InteractiveObject 
          position={[-3, 0, -3]} 
          onClick={() => onObjectClick?.('calendar')}
        >
          📅 Օրացույց
        </InteractiveObject>
        
        <InteractiveObject 
          position={[3, 0, -3]} 
          onClick={() => onObjectClick?.('computer')}
        >
          💻 Համակարգիչ
        </InteractiveObject>
        
        <InteractiveObject 
          position={[0, 0, 3]} 
          onClick={() => onObjectClick?.('safe')}
        >
          🔒 Գաղտնարան
        </InteractiveObject>
        
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={20}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}