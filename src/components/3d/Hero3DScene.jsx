import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { sound } from "../../services/audioService";
import { Sparkles, Compass, Wind } from "lucide-react";

export default function Hero3DScene() {
  const mountRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [speedBoost, setSpeedBoost] = useState(false);
  const copterSpeedRef = useRef(0.25);
  const flightBobRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 4.2);

    // 2. Realistic Natural Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    sunLight.position.set(4, 6, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const skyHemisphereLight = new THREE.HemisphereLight(0xbae6fd, 0xdcfce7, 0.5);
    scene.add(skyHemisphereLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // 4. Construct Doraemon 3D Hierarchical Model
    const doraemonGroup = new THREE.Group();
    doraemonGroup.position.set(0, 0.1, 0);

    // Materials
    const blueMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.35,
      metalness: 0.05
    });
    const whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.02
    });
    const redMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.25,
      metalness: 0.08
    });
    const yellowMaterial = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.2,
      metalness: 0.4
    });
    const blackMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8
    });
    const metalAxleMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.8
    });

    // Body (slightly flattened sphere)
    const bodyGeo = new THREE.SphereGeometry(0.85, 32, 32);
    bodyGeo.scale(1, 1.05, 0.95);
    const body = new THREE.Mesh(bodyGeo, blueMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    doraemonGroup.add(body);

    // Head (spherical, slightly larger)
    const headGeo = new THREE.SphereGeometry(0.95, 32, 32);
    const head = new THREE.Mesh(headGeo, blueMaterial);
    head.position.set(0, 1.25, 0.15);
    head.castShadow = true;
    doraemonGroup.add(head);

    // Face plate (white round front face)
    const faceGeo = new THREE.SphereGeometry(0.84, 32, 32);
    faceGeo.scale(0.96, 0.88, 0.6);
    const face = new THREE.Mesh(faceGeo, whiteMaterial);
    face.position.set(0, 1.18, 0.55);
    doraemonGroup.add(face);

    // Belly (white circular pouch base)
    const bellyGeo = new THREE.SphereGeometry(0.72, 32, 32);
    bellyGeo.scale(0.92, 0.95, 0.5);
    const belly = new THREE.Mesh(bellyGeo, whiteMaterial);
    belly.position.set(0, -0.05, 0.55);
    doraemonGroup.add(belly);

    // 4D Pocket (D-shaped pouch)
    const pocketGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.04, 32, 1, false, 0, Math.PI);
    pocketGeo.rotateX(Math.PI / 2);
    pocketGeo.rotateZ(Math.PI);
    const pocketMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const pocket = new THREE.Mesh(pocketGeo, pocketMat);
    pocket.position.set(0, -0.15, 0.82);
    doraemonGroup.add(pocket);

    // Pocket rim line
    const pocketRimGeo = new THREE.TorusGeometry(0.42, 0.015, 8, 32, Math.PI);
    pocketRimGeo.rotateX(Math.PI / 2);
    pocketRimGeo.rotateZ(Math.PI);
    const pocketRim = new THREE.Mesh(pocketRimGeo, blackMaterial);
    pocketRim.position.set(0, -0.15, 0.825);
    doraemonGroup.add(pocketRim);

    // Red Collar
    const collarGeo = new THREE.TorusGeometry(0.76, 0.07, 16, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collar = new THREE.Mesh(collarGeo, redMaterial);
    collar.position.set(0, 0.56, 0.12);
    collar.castShadow = true;
    doraemonGroup.add(collar);

    // Golden Bell
    const bellGroup = new THREE.Group();
    bellGroup.position.set(0, 0.42, 0.82);
    const bellBallGeo = new THREE.SphereGeometry(0.14, 24, 24);
    const bellBall = new THREE.Mesh(bellBallGeo, yellowMaterial);
    bellBall.castShadow = true;
    bellGroup.add(bellBall);

    // Bell ring slit
    const bellRingGeo = new THREE.TorusGeometry(0.14, 0.015, 8, 24);
    bellRingGeo.rotateX(Math.PI / 2);
    const bellRing = new THREE.Mesh(bellRingGeo, new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3 }));
    bellRing.position.set(0, 0.02, 0);
    bellGroup.add(bellRing);

    // Bell hole
    const bellHoleGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.06, 12);
    bellHoleGeo.rotateX(Math.PI / 2);
    const bellHole = new THREE.Mesh(bellHoleGeo, blackMaterial);
    bellHole.position.set(0, -0.04, 0.12);
    bellGroup.add(bellHole);
    doraemonGroup.add(bellGroup);

    // Red Nose
    const noseGeo = new THREE.SphereGeometry(0.13, 24, 24);
    const nose = new THREE.Mesh(noseGeo, redMaterial);
    nose.position.set(0, 1.42, 1.05);
    nose.castShadow = true;
    doraemonGroup.add(nose);

    // Nose highlight reflection
    const noseHighlightGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const noseHighlight = new THREE.Mesh(noseHighlightGeo, whiteMaterial);
    noseHighlight.position.set(0.035, 1.47, 1.15);
    doraemonGroup.add(noseHighlight);

    // Nose-to-mouth seam line
    const seamGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.28, 8);
    const seam = new THREE.Mesh(seamGeo, blackMaterial);
    seam.position.set(0, 1.22, 1.02);
    doraemonGroup.add(seam);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.19, 24, 24);
    eyeGeo.scale(0.85, 1.15, 0.5);

    const leftEye = new THREE.Mesh(eyeGeo, whiteMaterial);
    leftEye.position.set(-0.16, 1.62, 0.96);
    doraemonGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, whiteMaterial);
    rightEye.position.set(0.16, 1.62, 0.96);
    doraemonGroup.add(rightEye);

    // Pupils
    const pupilGeo = new THREE.SphereGeometry(0.07, 16, 16);
    pupilGeo.scale(1, 1.25, 0.3);

    const leftPupil = new THREE.Mesh(pupilGeo, blackMaterial);
    leftPupil.position.set(-0.12, 1.62, 1.12);
    doraemonGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeo, blackMaterial);
    rightPupil.position.set(0.12, 1.62, 1.12);
    doraemonGroup.add(rightPupil);

    // Whiskers (3 on each cheek)
    const whiskerGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.36, 6);
    whiskerGeo.rotateZ(Math.PI / 2);

    const createWhisker = (x, y, z, rotZ, rotY) => {
      const w = new THREE.Mesh(whiskerGeo, blackMaterial);
      w.position.set(x, y, z);
      w.rotation.z = rotZ;
      w.rotation.y = rotY;
      return w;
    };

    // Left Whiskers
    doraemonGroup.add(createWhisker(-0.45, 1.34, 0.92, 0.15, 0.3));
    doraemonGroup.add(createWhisker(-0.48, 1.24, 0.92, 0, 0.3));
    doraemonGroup.add(createWhisker(-0.45, 1.14, 0.92, -0.15, 0.3));

    // Right Whiskers
    doraemonGroup.add(createWhisker(0.45, 1.34, 0.92, -0.15, -0.3));
    doraemonGroup.add(createWhisker(0.48, 1.24, 0.92, 0, -0.3));
    doraemonGroup.add(createWhisker(0.45, 1.14, 0.92, 0.15, -0.3));

    // Big Cheerful Smile
    const smileCurve = new THREE.EllipseCurve(
      0, 0,
      0.38, 0.28,
      Math.PI * 1.1, Math.PI * 1.9,
      false,
      0
    );
    const smilePoints = smileCurve.getPoints(24);
    const smileGeo = new THREE.BufferGeometry().setFromPoints(smilePoints.map(p => new THREE.Vector3(p.x, p.y, 0)));
    const smileLineMat = new THREE.LineBasicMaterial({ color: 0x0f172a, linewidth: 3 });
    const smile = new THREE.Line(smileGeo, smileLineMat);
    smile.position.set(0, 1.25, 1.01);
    doraemonGroup.add(smile);

    // Arms in aerodynamic flight pose (angled backwards)
    const armGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.7, 16);
    const handGeo = new THREE.SphereGeometry(0.24, 20, 20);

    // Left Arm Group
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.85, 0.2, 0);
    const leftArm = new THREE.Mesh(armGeo, blueMaterial);
    leftArm.position.set(-0.25, -0.15, -0.1);
    leftArm.rotation.set(-0.4, 0.2, 0.8);
    const leftHand = new THREE.Mesh(handGeo, whiteMaterial);
    leftHand.position.set(-0.48, -0.38, -0.22);
    leftArmGroup.add(leftArm);
    leftArmGroup.add(leftHand);
    doraemonGroup.add(leftArmGroup);

    // Right Arm Group
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.85, 0.2, 0);
    const rightArm = new THREE.Mesh(armGeo, blueMaterial);
    rightArm.position.set(0.25, -0.15, -0.1);
    rightArm.rotation.set(-0.4, -0.2, -0.8);
    const rightHand = new THREE.Mesh(handGeo, whiteMaterial);
    rightHand.position.set(0.48, -0.38, -0.22);
    rightArmGroup.add(rightArm);
    rightArmGroup.add(rightHand);
    doraemonGroup.add(rightArmGroup);

    // Feet in aerodynamic flight trail (extended back)
    const footGeo = new THREE.SphereGeometry(0.32, 20, 20);
    footGeo.scale(0.8, 0.6, 1.4);

    const leftFoot = new THREE.Mesh(footGeo, whiteMaterial);
    leftFoot.position.set(-0.4, -0.95, -0.25);
    leftFoot.rotation.x = -0.5;
    leftFoot.castShadow = true;
    doraemonGroup.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeo, whiteMaterial);
    rightFoot.position.set(0.4, -0.95, -0.25);
    rightFoot.rotation.x = -0.5;
    rightFoot.castShadow = true;
    doraemonGroup.add(rightFoot);

    // Red Tail
    const tailGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const tail = new THREE.Mesh(tailGeo, redMaterial);
    tail.position.set(0, -0.55, -0.85);
    doraemonGroup.add(tail);

    // 5. Take-Copter (Bamboo-Copter) System
    const copterGroup = new THREE.Group();
    copterGroup.position.set(0, 2.2, 0.15); // Mount on top of Doraemon's head

    // Suction mount base (Yellow)
    const baseGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.08, 20);
    const copterBase = new THREE.Mesh(baseGeo, yellowMaterial);
    copterGroup.add(copterBase);

    // Vertical metal spindle shaft
    const spindleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.28, 12);
    const spindle = new THREE.Mesh(spindleGeo, metalAxleMat);
    spindle.position.y = 0.16;
    copterGroup.add(spindle);

    // Rotor hub
    const hubGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.06, 16);
    const hub = new THREE.Mesh(hubGeo, yellowMaterial);
    hub.position.y = 0.3;
    copterGroup.add(hub);

    // Rotor Blades (Spinning part)
    const rotorSpinGroup = new THREE.Group();
    rotorSpinGroup.position.y = 0.31;

    // Dual aerodynamic blades with slight tilt
    const bladeGeo = new THREE.BoxGeometry(1.5, 0.02, 0.14);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.1,
      metalness: 0.15,
      transparent: true,
      opacity: 0.95
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.castShadow = true;
    rotorSpinGroup.add(blade);

    // Rotor blur disc for high-speed flight realism
    const blurDiscGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.005, 32);
    const blurDiscMat = new THREE.MeshBasicMaterial({
      color: 0xfef9c3,
      transparent: true,
      opacity: 0.25,
      depthWrite: false
    });
    const blurDisc = new THREE.Mesh(blurDiscGeo, blurDiscMat);
    rotorSpinGroup.add(blurDisc);

    copterGroup.add(rotorSpinGroup);
    doraemonGroup.add(copterGroup);

    // 6. Natural Soft Ground/Contact Shadow Receiver
    const shadowPlaneGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.2 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.8;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 7. Drifting Soft Clouds in the Sky
    const cloudGroup = new THREE.Group();
    const cloudGeo = new THREE.DodecahedronGeometry(0.6, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.0,
      transparent: true,
      opacity: 0.65
    });

    const clouds = [];
    for (let i = 0; i < 5; i++) {
      const c = new THREE.Mesh(cloudGeo, cloudMat);
      const scale = 0.8 + Math.random() * 0.8;
      c.scale.set(scale * 1.6, scale * 0.8, scale);
      c.position.set(
        (Math.random() - 0.5) * 8,
        -0.5 + (Math.random() - 0.5) * 3,
        -2.5 - Math.random() * 3
      );
      c.userData = { speed: 0.003 + Math.random() * 0.004 };
      cloudGroup.add(c);
      clouds.push(c);
    }
    scene.add(cloudGroup);

    // Position & Aerodynamic Flight Tilt
    // Tilts Doraemon forward in real flight posture!
    doraemonGroup.rotation.x = 0.22; // Aerodynamic forward flight lean
    doraemonGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(doraemonGroup);

    // 8. Mouse & Pointer Parallax Tracking
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current.targetX = x * 0.35;
      mousePosRef.current.targetY = y * 0.25;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 9. Interactive Click Action (Barrel roll & bell jingle)
    const handleCanvasClick = () => {
      sound.playBellChime();
      sound.playCopterHum();
      copterSpeedRef.current = 0.85; // High speed spin burst
      setIsInteracting(true);
      setSpeedBoost(true);
      setTimeout(() => {
        copterSpeedRef.current = 0.25;
        setIsInteracting(false);
        setSpeedBoost(false);
      }, 1500);
    };

    container.addEventListener("click", handleCanvasClick);

    // 10. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Spin Take-copter rotor
      rotorSpinGroup.rotation.y += copterSpeedRef.current;

      // Drifting clouds
      clouds.forEach((c) => {
        c.position.x += c.userData.speed;
        if (c.position.x > 5) c.position.x = -5;
      });

      // Smooth mouse interpolation
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.05;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.05;

      // Flight bobbing motion (natural buoyancy of Take-copter)
      flightBobRef.current = Math.sin(elapsedTime * 2.2) * 0.08;

      doraemonGroup.position.y = 0.1 + flightBobRef.current + mousePosRef.current.y * 0.5;
      doraemonGroup.position.x = mousePosRef.current.x * 0.8;

      // Realistic flight posture: bank and pitch dynamically towards flight direction
      doraemonGroup.rotation.y = mousePosRef.current.x * 0.6;
      doraemonGroup.rotation.z = -mousePosRef.current.x * 0.4;
      doraemonGroup.rotation.x = 0.22 - mousePosRef.current.y * 0.3;

      // Subtle arm and bell sway in the breeze
      leftArmGroup.rotation.z = Math.sin(elapsedTime * 2.5) * 0.06;
      rightArmGroup.rotation.z = -Math.sin(elapsedTime * 2.5) * 0.06;
      bellGroup.rotation.z = Math.sin(elapsedTime * 4.0) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("click", handleCanvasClick);
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] md:h-[540px] flex items-center justify-center select-none overflow-hidden cursor-pointer group">
      {/* 3D WebGL Canvas mount container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Floating Status / Interactive Pill */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-sky-100 shadow-sm text-xs font-medium text-slate-700 pointer-events-none transition-all duration-300 group-hover:bg-white group-hover:shadow-md">
        <Wind className={`w-3.5 h-3.5 text-sky-500 ${speedBoost ? "animate-spin" : "animate-pulse"}`} />
        <span>{speedBoost ? "Turbo Boost Active!" : "Interactive 3D • Tap Doraemon"}</span>
      </div>

      {/* Flight Altitude indicator pill */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-sky-900/60 backdrop-blur-md text-white text-[11px] font-mono tracking-wider pointer-events-none">
        <Compass className="w-3 h-3 text-amber-300" />
        <span>ALT: 129.3M • COPTER ACTIVE</span>
      </div>

      {/* Subtle Hint */}
      <div className="absolute bottom-4 right-4 z-10 hidden sm:block text-slate-500 text-[11px] bg-white/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-200/60 pointer-events-none">
        Move cursor to steer • Click for chime & turbo
      </div>
    </div>
  );
}
