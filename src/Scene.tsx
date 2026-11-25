import React from 'react';
import { Composition, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { ThreeCanvas } from '@remotion/three';

const CreepyFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slowly walks closer in the second half of the video
  const zPos = interpolate(frame, [0, 250, durationInFrames], [-14, -14, -3.2], {
    extrapolateRight: 'clamp',
  });

  // Subtle eerie head tilt
  const headTilt = Math.sin(frame * 0.08) * 0.12;

  return (
    <group position={[0, 0, zPos]}>
      {/* Torso */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.4, 1.6, 0.7]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Left Arm */}
      <mesh position={[-1.05, 1.5, 0]}>
        <boxGeometry args={[0.6, 1.6, 0.6]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>
      {/* Right Arm */}
      <mesh position={[1.05, 1.5, 0]}>
        <boxGeometry args={[0.6, 1.6, 0.6]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>
      {/* Left Leg */}
      <mesh position={[-0.38, 0.4, 0]}>
        <boxGeometry args={[0.65, 0.8, 0.65]} />
        <meshStandardMaterial color="#080808" />
      </mesh>
      {/* Right Leg */}
      <mesh position={[0.38, 0.4, 0]}>
        <boxGeometry args={[0.65, 0.8, 0.65]} />
        <meshStandardMaterial color="#080808" />
      </mesh>
      {/* Head + Glowing Red Eyes */}
      <group position={[0, 2.75, 0]} rotation={[0, 0, headTilt]}>
        <mesh>
          <boxGeometry args={[0.95, 0.95, 0.95]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[-0.2, 0.08, 0.49]}>
          <boxGeometry args={[0.16, 0.12, 0.05]} />
          <meshBasicMaterial color="#ff1e00" />
        </mesh>
        <mesh position={[0.2, 0.08, 0.49]}>
          <boxGeometry args={[0.16, 0.12, 0.05]} />
          <meshBasicMaterial color="#ff1e00" />
        </mesh>
      </group>
    </group>
  );
};

const HorrorWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slow cinematic camera sway & zoom
  const camX = Math.sin(frame * 0.03) * 0.6;
  const camZ = interpolate(frame, [0, durationInFrames], [5.5, 2.8]);

  return (
    <>
      <Audio src={staticFile('voice.mp3')} />
      <ThreeCanvas
        width={1080}
        height={1920}
        camera={{ position: [camX, 2.4, camZ], fov: 55 }}
      >
        <color attach="background" args={['#050508']} />
        <fog attach="fog" args={['#050508', 3, 18]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 5, 3]} intensity={1.5} color="#4a6fa5" />
        <pointLight position={[0, 2.5, -2]} intensity={2} color="#ff2a00" />

        {/* Classic Dark Baseplate */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#181c20" />
        </mesh>

        {/* Spawn Pad */}
        <mesh position={[0, 0.05, 1.5]}>
          <boxGeometry args={[2.5, 0.1, 2.5]} />
          <meshStandardMaterial color="#2b303a" />
        </mesh>

        <CreepyFigure />
      </ThreeCanvas>
    </>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MainVideo"
      component={HorrorWorld}
      durationInFrames={560}
      fps={20}
      width={1080}
      height={1920}
    />
  );
};
