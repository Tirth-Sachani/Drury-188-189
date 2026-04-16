"use client";

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Plane, Grid, Html } from '@react-three/drei';
import { X, Save, Plus, MousePointer2, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock data for tables
const initialTables = [
  { id: 1, position: [-2, 0.5, -2], size: [1.2, 0.05, 1.2], rotation: [0, 0, 0], type: 'square' },
  { id: 2, position: [2, 0.5, -2], size: [1.5, 0.05, 1.5], rotation: [0, 0, 0], type: 'round' },
  { id: 3, position: [0, 0.5, 2], size: [2.5, 0.05, 1], rotation: [0, 0, 0], type: 'rectangle' },
  { id: 4, position: [4, 0.5, 3], size: [1.2, 0.05, 1.2], rotation: [0, 0, 0], type: 'round' },
  { id: 5, position: [-3, 0.5, 4], size: [3, 0.05, 1], rotation: [0, Math.PI / 4, 0], type: 'rectangle' },
];

export function VisualEditorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tables] = useState(initialTables);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[1000] flex bg-[#1a1510]/95 backdrop-blur-xl font-sans"
      >
        {/* Sidebar Tools */}
        <div className="w-full md:w-[350px] shrink-0 border-r border-[#c8924a]/20 bg-[#120e0a] text-[#e8e0d0] flex flex-col shadow-2xl relative z-10 transition-transform">
          <div className="p-6 md:p-8 border-b border-[#c8924a]/20 flex justify-between items-center bg-[#0a0806]/50">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-[#c8924a] mb-1">Studio Layout</h2>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#7a7060]">Interactive Floor Plan</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#c8924a]/50 text-[#c8924a] hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">
            {/* Toolbar Section */}
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#c8924a] mb-5 border-b border-[#c8924a]/20 pb-2">Tools</p>
              <div className="grid grid-cols-2 gap-4">
                <button className="group flex flex-col items-center justify-center p-5 bg-gradient-to-b from-[#c8924a]/10 to-transparent border border-[#c8924a]/30 rounded-xl hover:border-[#c8924a]/80 transition-all hover:scale-[1.02]">
                  <MousePointer2 size={24} className="mb-3 text-[#c8924a] group-hover:-translate-y-1 transition-transform" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Select</span>
                </button>
                <button className="group flex flex-col items-center justify-center p-5 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/30 transition-all">
                  <Plus size={24} className="mb-3 text-white/50 group-hover:text-white transition-colors" />
                  <span className="text-xs uppercase tracking-wider text-white/50 group-hover:text-white transition-colors">Add Item</span>
                </button>
              </div>
            </div>

            {/* Properties Section */}
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#c8924a] mb-5 border-b border-[#c8924a]/20 pb-2">Properties</p>
              {selectedTable ? (
                <div className="bg-[#1a1510] rounded-xl border border-white/10 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                    <span className="text-xs text-white/50 uppercase tracking-widest">Item Selected</span>
                    <span className="text-[10px] font-mono bg-[#c8924a]/20 text-[#c8924a] px-2 py-1 rounded">ID: #{selectedTable}</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#7a7060]">Type</span>
                      <span className="text-white capitalize">{tables.find(t => t.id === selectedTable)?.type} Table</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#7a7060]">Status</span>
                      <span className="flex items-center text-green-500 text-xs">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Active
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[150px] rounded-xl border border-white/5 border-dashed flex flex-col items-center justify-center text-center p-6 bg-white/[0.02]">
                  <MousePointer2 size={24} className="text-white/20 mb-3" />
                  <p className="text-xs text-white/40 leading-relaxed">Select an item on the interactive canvas to view and modify its properties.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 border-t border-[#c8924a]/20 bg-[#0a0806]/80">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-4 bg-gradient-to-r from-[#C8924A] to-[#e4ad61] text-[#120e0a] font-bold uppercase tracking-[0.2em] text-[11px] rounded flex items-center justify-center hover:shadow-[0_0_20px_rgba(200,146,74,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSaving ? (
                <span className="flex items-center"><span className="animate-spin mr-3 border-2 border-[#120e0a]/20 border-t-[#120e0a] rounded-full w-4 h-4"></span> Applying Layout...</span>
              ) : (
                <span className="flex items-center"><Save size={16} className="mr-3" /> Save Architecture</span>
              )}
            </button>
          </div>
        </div>

        {/* 3D Canvas Area */}
        <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1510] via-[#0a0806] to-[#000]">
          {/* Overlay UI inside Canvas area */}
          <div className="absolute top-6 left-6 z-10 flex gap-3 pointer-events-none">
            <div className="px-4 py-2.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white/70 text-[11px] uppercase tracking-widest flex items-center shadow-lg">
              <ZoomIn size={14} className="mr-3 text-[#c8924a]" /> Scroll to Zoom
            </div>
            <div className="px-4 py-2.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white/70 text-[11px] uppercase tracking-widest flex items-center shadow-lg">
              <MousePointer2 size={14} className="mr-3 text-[#c8924a]" /> Drag to Orbit
            </div>
          </div>
          
          <div className="absolute bottom-6 right-6 z-10 text-white/30 text-xs tracking-[0.3em] uppercase pointer-events-none font-bold">
            Live Preview
          </div>

          <Canvas shadows camera={{ position: [0, 10, 10], fov: 40 }}>
            <color attach="background" args={['transparent']} />
            <fog attach="fog" args={['#0a0806', 15, 30]} />
            
            <ambientLight intensity={0.5} />
            <directionalLight 
              castShadow 
              position={[8, 15, 8]} 
              intensity={1.5} 
              shadow-mapSize-width={2048} 
              shadow-mapSize-height={2048} 
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
              shadow-bias={-0.0001}
            />
            <pointLight position={[-5, 5, -5]} intensity={0.5} color="#c8924a" />

            {/* Premium Floor */}
            <Plane 
              args={[30, 30]} 
              rotation={[-Math.PI / 2, 0, 0]} 
              receiveShadow
              onClick={() => setSelectedTable(null)}
            >
              <meshStandardMaterial color="#1f1a14" roughness={0.8} />
            </Plane>

            {/* Custom Grid */}
            <Grid 
              renderOrder={-1} 
              position={[0, 0.05, 0]} 
              infiniteGrid 
              cellSize={1} 
              cellThickness={0.5} 
              sectionSize={5} 
              sectionThickness={1.5} 
              sectionColor={[0.78, 0.57, 0.29, 0.3]} // Hex to RGB matching #c8924a roughly
              cellColor={[0.78, 0.57, 0.29, 0.1]} 
              fadeDistance={25} 
              fadeStrength={1}
            />

            {/* Interactive Tables */}
            <Suspense fallback={null}>
              {tables.map((table) => {
                const isSelected = selectedTable === table.id;
                const highlightColor = isSelected ? '#e4ad61' : '#c8924a';
                const baseColor = isSelected ? '#5a4630' : '#2a221b';
                
                return (
                  <group 
                    key={table.id} 
                    position={table.position as any} 
                    rotation={table.rotation as any}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTable(table.id);
                    }}
                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                    onPointerOut={() => document.body.style.cursor = 'auto'}
                  >
                    {/* Selection Ring/Aura */}
                    {isSelected && (
                      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[table.size[0]/2 + 0.3, table.size[0]/2 + 0.4, 64]} />
                        <meshBasicMaterial color="#c8924a" transparent opacity={0.5} />
                      </mesh>
                    )}

                    {/* Table Base Structure */}
                    <Box args={[0.3, 0.8, 0.3]} position={[0, 0.4, 0]} castShadow receiveShadow>
                      <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
                    </Box>

                    {/* Table Top */}
                    <mesh castShadow receiveShadow position={[0, 0.82, 0]}>
                      {table.type === 'round' ? (
                        <cylinderGeometry args={[table.size[0] / 2, table.size[0] / 2, table.size[1], 64]} />
                      ) : (
                        <boxGeometry args={table.size as any} />
                      )}
                      
                      {/* Premium Material */}
                      <meshPhysicalMaterial 
                        color={baseColor} 
                        roughness={0.4} 
                        metalness={isSelected ? 0.3 : 0.1}
                        clearcoat={isSelected ? 1 : 0}
                        clearcoatRoughness={0.1}
                      />
                    </mesh>

                    {/* Glowing Edge Indicator for Selected */}
                    {isSelected && (
                      <mesh position={[0, 0.85, 0]}>
                         {table.type === 'round' ? (
                          <cylinderGeometry args={[table.size[0] / 2 + 0.05, table.size[0] / 2 + 0.05, table.size[1] + 0.01, 64]} />
                        ) : (
                          <boxGeometry args={[table.size[0] + 0.1, table.size[1] + 0.02, table.size[2] + 0.1] as any} />
                        )}
                        <meshBasicMaterial color={highlightColor} transparent opacity={0.3} wireframe />
                      </mesh>
                    )}

                    {/* UI Floating Label */}
                    <Html position={[0, 2, 0]} center zIndexRange={[100, 0]}>
                      <div 
                        className={cn(
                          "transition-all duration-300 transform",
                          isSelected ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"
                        )}
                      >
                        <div className="bg-[#120e0a]/90 backdrop-blur border border-[#c8924a]/50 text-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] rounded shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col items-center">
                          <span className="text-[#c8924a] font-bold mb-1">TABLE {table.id}</span>
                          <span className="text-white/50 text-[8px]">{table.type} Area</span>
                        </div>
                        {/* Little triangle pointer */}
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#c8924a]/50 mx-auto mt-[1px]"></div>
                      </div>
                    </Html>
                  </group>
                );
              })}
            </Suspense>

            <OrbitControls 
              makeDefault 
              minPolarAngle={0} 
              maxPolarAngle={Math.PI / 2.1} 
              enableDamping 
              dampingFactor={0.05} 
              minDistance={5}
              maxDistance={25}
            />
          </Canvas>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
