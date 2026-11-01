import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Wrench,
  Layers,
  Eye,
  RotateCcw,
  Maximize2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calculator,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export interface ComponentPartData {
  id: string;
  name: string;
  category: string;
  difficulty: 'Easy DIY' | 'Moderate DIY' | 'Specialist Only';
  estimatedCostInr: number;
  repairTime: string;
  teardownNotes: string;
  toolsNeeded: string[];
  explodedOffsetZ: number;
  explodedOffsetY: number;
}

const PARTS_DATA: Record<string, ComponentPartData> = {
  frontGlass: {
    id: 'frontGlass',
    name: 'Gorilla Glass Victus Front Panel',
    category: 'Display Glass',
    difficulty: 'Specialist Only',
    estimatedCostInr: 2800,
    repairTime: '60 - 90 mins',
    teardownNotes: 'Fused with digitizer. Requires heat separation at 85°C and vacuum laminator or complete display unit replacement.',
    toolsNeeded: ['Heat Gun / Hot Plate', 'Suction Cup', '0.04mm Molybdenum Wire'],
    explodedOffsetZ: 2.8,
    explodedOffsetY: 0.1,
  },
  amoledDisplay: {
    id: 'amoledDisplay',
    name: '120Hz LTPO OLED Display Module',
    category: 'Display',
    difficulty: 'Moderate DIY',
    estimatedCostInr: 6800,
    repairTime: '45 - 60 mins',
    teardownNotes: 'Direct drop-in display assembly. Pre-attached flex cable routes through midframe aperture.',
    toolsNeeded: ['Phillips #00 Screwdriver', 'Plastic Spudger', 'Adhesive Strips'],
    explodedOffsetZ: 2.0,
    explodedOffsetY: 0.05,
  },
  aluminumChassis: {
    id: 'aluminumChassis',
    name: 'Anodized Aluminum Midframe Chassis',
    category: 'Chassis',
    difficulty: 'Specialist Only',
    estimatedCostInr: 4500,
    repairTime: '90 - 120 mins',
    teardownNotes: 'Central structural spine housing antenna bands and motherboard mounting standoffs.',
    toolsNeeded: ['Torx T3', 'Standoff Driver', 'Precision Tweezers'],
    explodedOffsetZ: 0.0,
    explodedOffsetY: 0.0,
  },
  batteryPack: {
    id: 'batteryPack',
    name: '4,700mAh Lithium-Ion Battery with Pull-Tabs',
    category: 'Battery',
    difficulty: 'Easy DIY',
    estimatedCostInr: 2200,
    repairTime: '25 - 40 mins',
    teardownNotes: 'Equipped with dual stretch-release adhesive pull tabs. No isopropyl alcohol soak needed.',
    toolsNeeded: ['Nylon Spudger', 'Replacement Pull-Tabs'],
    explodedOffsetZ: -0.6,
    explodedOffsetY: -0.15,
  },
  logicBoard: {
    id: 'logicBoard',
    name: 'Main Motherboard & Copper Vapor Chamber',
    category: 'Motherboard',
    difficulty: 'Specialist Only',
    estimatedCostInr: 16500,
    repairTime: '60 - 80 mins',
    teardownNotes: 'Includes Snapdragon SoC, RAM, and graphite thermal heat spreader. Handles power management IC.',
    toolsNeeded: ['ESD Anti-static Mat', 'Torx T4', 'Thermal Paste Syringe'],
    explodedOffsetZ: -0.7,
    explodedOffsetY: 0.9,
  },
  cameraModule: {
    id: 'cameraModule',
    name: 'Triple Camera Array (50MP OIS + Ultrawide)',
    category: 'Camera',
    difficulty: 'Moderate DIY',
    estimatedCostInr: 3200,
    repairTime: '30 - 45 mins',
    teardownNotes: 'Modular press-fit Lego style connectors. Easy to unseat once motherboard shield is removed.',
    toolsNeeded: ['Plastic Spudger', 'Magnification Loupe'],
    explodedOffsetZ: -1.4,
    explodedOffsetY: 1.0,
  },
  usbSubBoard: {
    id: 'usbSubBoard',
    name: 'USB-C Fast Charging Daughterboard & Mic',
    category: 'Charging Port',
    difficulty: 'Easy DIY',
    estimatedCostInr: 950,
    repairTime: '20 - 30 mins',
    teardownNotes: 'Independent bottom PCB. Houses USB 3.0 Type-C port, voice mic, and RF interconnect bridge.',
    toolsNeeded: ['Phillips #00', 'Plastic Pry Pick'],
    explodedOffsetZ: -0.7,
    explodedOffsetY: -1.3,
  },
  rearGlass: {
    id: 'rearGlass',
    name: 'Transparent Rear Panel with Wireless Qi Coil',
    category: 'Back Panel',
    difficulty: 'Moderate DIY',
    estimatedCostInr: 1850,
    repairTime: '30 - 45 mins',
    teardownNotes: 'Adhered with perimeter water-resistant gasket. Gentle heating releases back cover cleanly.',
    toolsNeeded: ['iOpener / Heat Pad', 'Guitar Picks', 'Pre-cut Perimeter Tape'],
    explodedOffsetZ: -2.6,
    explodedOffsetY: -0.05,
  },
};

interface ThreeDeviceLabProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  productName?: string;
}

export const ThreeDeviceLab: React.FC<ThreeDeviceLabProps> = ({
  onNavigate,
  productName = 'RevTech Flagship Modular Phone',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI States
  const [explodedAmount, setExplodedAmount] = useState<number>(0.45);
  const [selectedPartKey, setSelectedPartKey] = useState<string>('batteryPack');
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  // References for render loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const componentMeshesRef = useRef<Record<string, THREE.Object3D>>({});
  const explodedTargetRef = useRef<number>(0.45);
  const currentExplodedRef = useRef<number>(0.45);
  const selectedPartRef = useRef<string>('batteryPack');
  const isXRayRef = useRef<boolean>(false);

  useEffect(() => {
    explodedTargetRef.current = explodedAmount;
  }, [explodedAmount]);

  useEffect(() => {
    selectedPartRef.current = selectedPartKey;
  }, [selectedPartKey]);

  useEffect(() => {
    isXRayRef.current = isXRayMode;
  }, [isXRayMode]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL per Three.js skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#F0F4F1');
    scene.fog = new THREE.Fog('#F0F4F1', 12, 28);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.5, 3.2, 5.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 3;
    controls.maxDistance = 14;
    controls.autoRotate = isAutoRotate;
    controls.autoRotateSpeed = 1.0;

    // 3. Studio PBR Environment Map via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig
    const keyLight = new THREE.DirectionalLight('#FFF8F0', 2.8);
    keyLight.position.set(5, 8, 4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight('#E2EFE5', '#7F8F85', 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#A3D9B1', 1.5);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    // 5. Contact Shadow Disk on Floor (Prevents floating)
    const shadowGeo = new THREE.PlaneGeometry(5.5, 7.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
      grad.addColorStop(0, 'rgba(16, 56, 45, 0.45)');
      grad.addColorStop(0.6, 'rgba(23, 76, 60, 0.20)');
      grad.addColorStop(1, 'rgba(240, 244, 241, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.8;
    scene.add(shadowMesh);

    // 6. BUILD 10-PART COMPOSITE PROCEDURAL SMARTPHONE
    const phoneRoot = new THREE.Group();
    scene.add(phoneRoot);

    const W = 1.9; // phone width
    const H = 3.9; // phone height
    const D = 0.18; // thickness

    // Helper: Rounded Box Shape
    const createRoundedShape = (w: number, h: number, r: number) => {
      const shape = new THREE.Shape();
      const x = -w / 2;
      const y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      return shape;
    };

    // PART A: Front Glass (Beveled glass)
    const glassShape = createRoundedShape(W, H, 0.25);
    const glassGeo = new THREE.ExtrudeGeometry(glassShape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#FFFFFF',
      metalness: 0.1,
      roughness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: isSoftwareGl ? 0.45 : 0.9,
      ior: 1.52,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const frontGlass = new THREE.Mesh(glassGeo, glassMat);
    frontGlass.name = 'frontGlass';
    frontGlass.castShadow = !isSoftwareGl;
    phoneRoot.add(frontGlass);
    componentMeshesRef.current.frontGlass = frontGlass;

    // PART B: AMOLED Display Panel
    const dispShape = createRoundedShape(W - 0.08, H - 0.08, 0.22);
    const dispGeo = new THREE.ExtrudeGeometry(dispShape, {
      depth: 0.015,
      bevelEnabled: false,
    });
    // Procedural screen texture with RevTech wallpaper
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 1024;
    const sctx = screenCanvas.getContext('2d');
    if (sctx) {
      sctx.fillStyle = '#0E241D';
      sctx.fillRect(0, 0, 512, 1024);
      // Subtle circuit lines
      sctx.strokeStyle = '#23734D';
      sctx.lineWidth = 4;
      sctx.beginPath();
      sctx.arc(256, 512, 180, 0, Math.PI * 2);
      sctx.stroke();
      sctx.font = 'bold 36px sans-serif';
      sctx.fillStyle = '#FFFFFF';
      sctx.textAlign = 'center';
      sctx.fillText('RevTech OS 2.6', 256, 480);
      sctx.font = '24px sans-serif';
      sctx.fillStyle = '#48C78E';
      sctx.fillText('Circular Repair Engine', 256, 530);
    }
    const screenTex = new THREE.CanvasTexture(screenCanvas);
    screenTex.colorSpace = THREE.SRGBColorSpace;
    const dispMat = new THREE.MeshStandardMaterial({
      map: screenTex,
      metalness: 0.2,
      roughness: 0.25,
      emissive: '#10382D',
      emissiveIntensity: 0.35,
    });
    const amoledDisplay = new THREE.Mesh(dispGeo, dispMat);
    amoledDisplay.name = 'amoledDisplay';
    phoneRoot.add(amoledDisplay);
    componentMeshesRef.current.amoledDisplay = amoledDisplay;

    // PART C: Aluminum Midframe Chassis
    const frameShape = createRoundedShape(W, H, 0.25);
    const frameGeo = new THREE.ExtrudeGeometry(frameShape, {
      depth: D,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    });
    const frameMat = new THREE.MeshStandardMaterial({
      color: '#2C3E35', // dark titanium green
      metalness: 0.88,
      roughness: 0.3,
    });
    const aluminumChassis = new THREE.Mesh(frameGeo, frameMat);
    aluminumChassis.name = 'aluminumChassis';
    aluminumChassis.castShadow = !isSoftwareGl;
    aluminumChassis.receiveShadow = !isSoftwareGl;
    phoneRoot.add(aluminumChassis);
    componentMeshesRef.current.aluminumChassis = aluminumChassis;

    // PART D: Battery Pack with Warning Label
    const batGeo = new THREE.BoxGeometry(1.25, 2.1, 0.09);
    const batCanvas = document.createElement('canvas');
    batCanvas.width = 256;
    batCanvas.height = 512;
    const bCtx = batCanvas.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = '#1B2320';
      bCtx.fillRect(0, 0, 256, 512);
      bCtx.fillStyle = '#23734D';
      bCtx.fillRect(20, 20, 216, 40);
      bCtx.fillStyle = '#FFFFFF';
      bCtx.font = 'bold 22px sans-serif';
      bCtx.fillText('REVTECH 4700mAh', 30, 48);
      bCtx.fillStyle = '#9BB8A2';
      bCtx.font = '16px monospace';
      bCtx.fillText('Li-ion 3.88V 18.23Wh', 30, 95);
      bCtx.fillText('PULL TABS RELEASE', 30, 130);
      bCtx.fillStyle = '#E57373';
      bCtx.fillText('DO NOT PUNCTURE', 30, 170);
    }
    const batTex = new THREE.CanvasTexture(batCanvas);
    batTex.colorSpace = THREE.SRGBColorSpace;
    const batMat = new THREE.MeshStandardMaterial({
      map: batTex,
      metalness: 0.1,
      roughness: 0.6,
    });
    const batteryPack = new THREE.Mesh(batGeo, batMat);
    batteryPack.name = 'batteryPack';
    phoneRoot.add(batteryPack);
    componentMeshesRef.current.batteryPack = batteryPack;

    // PART E: Motherboard Logic Board with Copper Heatpipe
    const logicGroup = new THREE.Group();
    logicGroup.name = 'logicBoard';
    const boardGeo = new THREE.BoxGeometry(1.5, 1.2, 0.06);
    const boardMat = new THREE.MeshStandardMaterial({
      color: '#153128',
      metalness: 0.3,
      roughness: 0.5,
    });
    const boardMesh = new THREE.Mesh(boardGeo, boardMat);
    logicGroup.add(boardMesh);

    // Copper Heatpipe on SoC
    const pipeGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 12);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: '#D97706', // Copper
      metalness: 0.95,
      roughness: 0.15,
    });
    const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
    pipeMesh.rotation.z = Math.PI / 4;
    pipeMesh.position.z = 0.04;
    logicGroup.add(pipeMesh);

    // EMI Shield Cans
    const shieldGeo = new THREE.BoxGeometry(0.5, 0.5, 0.04);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: '#D1D5DB',
      metalness: 0.9,
      roughness: 0.2,
    });
    const shield1 = new THREE.Mesh(shieldGeo, shieldMat);
    shield1.position.set(-0.35, 0.2, 0.04);
    logicGroup.add(shield1);

    phoneRoot.add(logicGroup);
    componentMeshesRef.current.logicBoard = logicGroup;

    // PART F: Triple Camera Module
    const cameraGroup = new THREE.Group();
    cameraGroup.name = 'cameraModule';
    const camBaseGeo = new THREE.BoxGeometry(0.75, 0.85, 0.12);
    const camBaseMat = new THREE.MeshStandardMaterial({ color: '#1B2722', metalness: 0.7, roughness: 0.3 });
    const camBase = new THREE.Mesh(camBaseGeo, camBaseMat);
    cameraGroup.add(camBase);

    // 3 Lenses
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16);
      const ringMat = new THREE.MeshStandardMaterial({ color: '#3DD598', metalness: 0.9, roughness: 0.2 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(i === 2 ? 0.18 : -0.18, i === 0 ? 0.22 : i === 1 ? -0.22 : 0, 0.07);

      const lensGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const lensMat = new THREE.MeshPhysicalMaterial({ color: '#102A45', transmission: 0.9, roughness: 0.05, clearcoat: 1 });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.position.z = 0.03;
      ring.add(lens);
      cameraGroup.add(ring);
    }
    phoneRoot.add(cameraGroup);
    componentMeshesRef.current.cameraModule = cameraGroup;

    // PART G: USB-C Sub-board & Vibrator
    const subGroup = new THREE.Group();
    subGroup.name = 'usbSubBoard';
    const subGeo = new THREE.BoxGeometry(1.4, 0.5, 0.05);
    const subMat = new THREE.MeshStandardMaterial({ color: '#1E3A2F', metalness: 0.4, roughness: 0.4 });
    const subMesh = new THREE.Mesh(subGeo, subMat);
    subGroup.add(subMesh);

    // Type-C Port Block
    const portGeo = new THREE.BoxGeometry(0.35, 0.12, 0.09);
    const portMat = new THREE.MeshStandardMaterial({ color: '#E5E7EB', metalness: 0.95, roughness: 0.1 });
    const portMesh = new THREE.Mesh(portGeo, portMat);
    portMesh.position.set(0, -0.22, 0);
    subGroup.add(portMesh);

    phoneRoot.add(subGroup);
    componentMeshesRef.current.usbSubBoard = subGroup;

    // PART H: Rear Glass Panel with Qi Coil
    const backShape = createRoundedShape(W, H, 0.25);
    const backGeo = new THREE.ExtrudeGeometry(backShape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    // Frosted glass with inductive coil
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 512;
    backCanvas.height = 1024;
    const bkCtx = backCanvas.getContext('2d');
    if (bkCtx) {
      bkCtx.fillStyle = '#1A2E26';
      bkCtx.fillRect(0, 0, 512, 1024);
      // Wireless charging coil rings
      bkCtx.strokeStyle = '#D97706';
      bkCtx.lineWidth = 6;
      for (let r = 50; r <= 150; r += 18) {
        bkCtx.beginPath();
        bkCtx.arc(256, 560, r, 0, Math.PI * 2);
        bkCtx.stroke();
      }
      // RevTech Glyph Lines
      bkCtx.strokeStyle = '#FFFFFF';
      bkCtx.lineWidth = 5;
      bkCtx.beginPath();
      bkCtx.arc(256, 260, 90, Math.PI * 0.2, Math.PI * 1.8);
      bkCtx.stroke();
    }
    const backTex = new THREE.CanvasTexture(backCanvas);
    backTex.colorSpace = THREE.SRGBColorSpace;

    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTex,
      metalness: 0.2,
      roughness: 0.15,
      transmission: isSoftwareGl ? 0 : 0.6,
      transparent: true,
      opacity: 0.92,
      clearcoat: 1.0,
    });
    const rearGlass = new THREE.Mesh(backGeo, backMat);
    rearGlass.name = 'rearGlass';
    rearGlass.castShadow = !isSoftwareGl;
    phoneRoot.add(rearGlass);
    componentMeshesRef.current.rearGlass = rearGlass;

    // 7. Raycaster for clicking components
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(phoneRoot.children, true);

      if (intersects.length > 0) {
        let hitObj: THREE.Object3D | null = intersects[0].object;
        while (hitObj && hitObj !== phoneRoot) {
          if (hitObj.name && PARTS_DATA[hitObj.name]) {
            setSelectedPartKey(hitObj.name);
            break;
          }
          hitObj = hitObj.parent;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 8. Damped Render Loop (60 FPS with exponential damping per skill)
    let animationFrameId = 0;
    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Exponential damping on exploded slider
      currentExplodedRef.current = THREE.MathUtils.damp(
        currentExplodedRef.current,
        explodedTargetRef.current,
        8.0,
        dt
      );
      const factor = currentExplodedRef.current;

      // Update positions of each component along Z & Y axes based on exploded factor
      Object.keys(PARTS_DATA).forEach((key) => {
        const mesh = componentMeshesRef.current[key];
        const data = PARTS_DATA[key];
        if (mesh && data) {
          const targetZ = data.explodedOffsetZ * factor;
          const targetY = data.explodedOffsetY * factor;
          mesh.position.z = THREE.MathUtils.damp(mesh.position.z, targetZ, 10, dt);
          mesh.position.y = THREE.MathUtils.damp(mesh.position.y, targetY, 10, dt);

          // Highlight selected part
          const isSelected = selectedPartRef.current === key;
          mesh.scale.setScalar(isSelected ? 1.03 : 1.0);
        }
      });

      controls.update();
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const selectedPart = PARTS_DATA[selectedPartKey] || PARTS_DATA.batteryPack;

  const setViewPreset = (preset: 'assembled' | 'exploded' | 'battery' | 'screen' | 'camera') => {
    if (!controlsRef.current || !cameraRef.current) return;
    setIsAutoRotate(false);
    switch (preset) {
      case 'assembled':
        setExplodedAmount(0.0);
        cameraRef.current.position.set(4, 2, 5);
        break;
      case 'exploded':
        setExplodedAmount(1.0);
        cameraRef.current.position.set(5.5, 3.5, 6);
        break;
      case 'battery':
        setExplodedAmount(0.6);
        setSelectedPartKey('batteryPack');
        cameraRef.current.position.set(1.5, 0.5, 4.5);
        break;
      case 'screen':
        setExplodedAmount(0.7);
        setSelectedPartKey('amoledDisplay');
        cameraRef.current.position.set(2, 2, 4.5);
        break;
      case 'camera':
        setExplodedAmount(0.8);
        setSelectedPartKey('cameraModule');
        cameraRef.current.position.set(-2, 2, -4);
        break;
    }
  };

  return (
    <div className="relative w-full h-[750px] bg-[#F0F4F1] rounded-3xl overflow-hidden border border-[#DCE4DC] shadow-sm select-none">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none z-10">
        <div className="bg-white/95 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-[#DCE4DC] shadow-xs pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#23734D]"></span>
            <h2 className="text-sm font-bold text-[#10382D]">
              3D Teardown Lab & Exploded Parts Viewer
            </h2>
          </div>
          <p className="text-[11px] text-[#5D6B63] mt-0.5">
            Click any component or use slider to explode layers. High-fidelity procedural PBR model.
          </p>
        </div>

        {/* View Presets Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1.5 rounded-2xl border border-[#DCE4DC] shadow-xs pointer-events-auto text-xs font-semibold">
          <button
            onClick={() => setViewPreset('assembled')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              explodedAmount === 0 ? 'bg-[#174C3C] text-white' : 'text-[#5D6B63] hover:text-[#10382D]'
            }`}
          >
            Assembled
          </button>
          <button
            onClick={() => setViewPreset('exploded')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              explodedAmount === 1 ? 'bg-[#174C3C] text-white' : 'text-[#5D6B63] hover:text-[#10382D]'
            }`}
          >
            100% Exploded
          </button>
          <button
            onClick={() => setViewPreset('battery')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              selectedPartKey === 'batteryPack' ? 'bg-[#23734D] text-white' : 'text-[#5D6B63] hover:text-[#10382D]'
            }`}
          >
            Battery Swap
          </button>
          <button
            onClick={() => setViewPreset('screen')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              selectedPartKey === 'amoledDisplay' ? 'bg-[#23734D] text-white' : 'text-[#5D6B63] hover:text-[#10382D]'
            }`}
          >
            Display Swap
          </button>
          <button
            onClick={() => setViewPreset('camera')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              selectedPartKey === 'cameraModule' ? 'bg-[#23734D] text-white' : 'text-[#5D6B63] hover:text-[#10382D]'
            }`}
          >
            Camera Unit
          </button>
        </div>
      </div>

      {/* Selected Component Floating Inspection Card (Top Right) */}
      <div className="absolute top-20 right-4 w-80 max-w-[90vw] bg-white rounded-2xl border border-[#DCE4DC] p-5 shadow-lg pointer-events-auto z-10 animate-fadeIn">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EEF5EF] text-[#174C3C] border border-[#DCE4DC]">
            {selectedPart.category}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              selectedPart.difficulty === 'Easy DIY'
                ? 'bg-emerald-100 text-emerald-800'
                : selectedPart.difficulty === 'Moderate DIY'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {selectedPart.difficulty}
          </span>
        </div>

        <h3 className="text-sm font-bold text-[#10382D] leading-snug mb-1">
          {selectedPart.name}
        </h3>

        <div className="flex items-baseline justify-between mb-3 bg-[#F8FAF7] p-2.5 rounded-xl border border-[#DCE4DC]">
          <div>
            <span className="text-[10px] text-[#78857D] block">Est. Part Cost</span>
            <span className="text-base font-black text-[#1B2722]">
              ₹{selectedPart.estimatedCostInr.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#78857D] block">Typical Repair Time</span>
            <span className="text-xs font-semibold text-[#10382D]">{selectedPart.repairTime}</span>
          </div>
        </div>

        <p className="text-[11px] text-[#5D6B63] leading-relaxed mb-3">
          {selectedPart.teardownNotes}
        </p>

        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#78857D] block mb-1">
            Required Tools:
          </span>
          <div className="flex flex-wrap gap-1">
            {selectedPart.toolsNeeded.map((t) => (
              <span key={t} className="text-[10px] bg-[#EFF3EE] text-[#174C3C] px-2 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Link Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DCE4DC]">
          <button
            onClick={() => onNavigate('spare-parts', { search: selectedPart.name })}
            className="py-1.5 px-2 rounded-lg bg-[#174C3C] hover:bg-[#10382D] text-white text-[11px] font-semibold flex items-center justify-center gap-1 shadow-xs"
          >
            <Wrench className="w-3 h-3 text-emerald-300" />
            <span>Find Part</span>
          </button>
          <button
            onClick={() => onNavigate('find-nearby', { category: selectedPart.category })}
            className="py-1.5 px-2 rounded-lg bg-[#EEF5EF] hover:bg-[#DCE9DF] text-[#174C3C] text-[11px] font-semibold flex items-center justify-center gap-1 border border-[#DCE4DC]"
          >
            <MapPin className="w-3 h-3 text-[#23734D]" />
            <span>Service Providers</span>
          </button>
        </div>
      </div>

      {/* Ergonomic Collapsible Bottom Control Dock (Three.js Skill Section 5) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[min(900px,94vw)] z-20 pointer-events-auto">
        <div className="bg-white/95 rounded-2xl border border-[#DCE4DC] shadow-xl overflow-hidden transition-all duration-300">
          {/* Header Bar with Collapse Toggle */}
          <div className="px-4 py-2 bg-[#EEF5EF] border-b border-[#DCE4DC] flex items-center justify-between text-xs">
            <span className="font-bold text-[#10382D] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#23734D]" />
              <span>Teardown Stage & Precision Controls</span>
            </span>
            <button
              onClick={() => setIsDockCollapsed(!isDockCollapsed)}
              className="text-[#5D6B63] hover:text-[#10382D] flex items-center gap-1 font-semibold"
            >
              <span>{isDockCollapsed ? 'Show Controls' : 'Hide Controls'}</span>
              {isDockCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {!isDockCollapsed && (
            <div className="p-4 space-y-4">
              {/* Exploded View Slider */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#10382D] whitespace-nowrap">
                    Exploded Separation:
                  </span>
                  <span className="text-xs font-black text-[#23734D] bg-[#EEF5EF] px-2 py-0.5 rounded">
                    {Math.round(explodedAmount * 100)}%
                  </span>
                </div>

                <div className="flex-1 w-full flex items-center gap-3">
                  <span className="text-[10px] text-[#78857D] font-bold">Closed</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={explodedAmount}
                    onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-[#DCE4DC] rounded-lg appearance-none cursor-pointer accent-[#23734D]"
                  />
                  <span className="text-[10px] text-[#78857D] font-bold">Fully Exploded</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAutoRotate(!isAutoRotate)}
                    className={`py-1 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                      isAutoRotate
                        ? 'bg-[#174C3C] text-white border-[#174C3C]'
                        : 'bg-[#F8FAF7] text-[#5D6B63] border-[#DCE4DC]'
                    }`}
                  >
                    Auto-Rotate: {isAutoRotate ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* Direct Component Quick Selector Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#DCE4DC]">
                <span className="text-[11px] font-bold text-[#5D6B63] mr-1">Select Component:</span>
                {Object.keys(PARTS_DATA).map((key) => {
                  const part = PARTS_DATA[key];
                  const isSelected = selectedPartKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedPartKey(key)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all font-medium ${
                        isSelected
                          ? 'bg-[#10382D] text-white border-[#10382D] shadow-xs font-bold'
                          : 'bg-[#F8FAF7] text-[#1B2722] border-[#DCE4DC] hover:bg-[#EEF5EF]'
                      }`}
                    >
                      {part.name.split(' ')[0]} ({part.category})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
