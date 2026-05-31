'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CheckCircle, ArrowRight, Cpu, ScanLine } from 'lucide-react';
import DynamicIcon from './DynamicIcon';

/* ═══════════════════════════════════════════════════════════════
   IRON MAN HUD HOTSPOT CONFIG  (per-product)
═══════════════════════════════════════════════════════════════ */

const HUD_HOTSPOTS = {
  panel: [
    { label: 'Output',     value: '440W',  x: '28%', y: '38%', side: 'left'  },
    { label: 'Efficiency', value: '22.8%', x: '62%', y: '55%', side: 'right' },
    { label: 'Warranty',   value: '25 Yr', x: '55%', y: '28%', side: 'right' },
    { label: 'Technology', value: 'PERC',  x: '38%', y: '68%', side: 'left'  },
  ],
  inverter: [
    { label: 'Power',      value: '7kW',   x: '45%', y: '30%', side: 'left'  },
    { label: 'Efficiency', value: '98.4%', x: '60%', y: '55%', side: 'right' },
    { label: 'MPPT',       value: 'Dual',  x: '35%', y: '60%', side: 'left'  },
    { label: 'Protection', value: 'IP65',  x: '65%', y: '40%', side: 'right' },
  ],
  battery: [
    { label: 'Capacity',   value: '10kWh', x: '40%', y: '35%', side: 'left'  },
    { label: 'Cycles',     value: '6000+', x: '62%', y: '52%', side: 'right' },
    { label: 'Chemistry',  value: 'LFP',   x: '35%', y: '65%', side: 'left'  },
    { label: 'Protection', value: 'IP67',  x: '60%', y: '30%', side: 'right' },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   IRON MAN HUD OVERLAY COMPONENT
═══════════════════════════════════════════════════════════════ */

function IronManHUD({ active, product, productName }) {
  const hotspots = HUD_HOTSPOTS[product] || HUD_HOTSPOTS.panel;

  return (
    <div
      className={`hud-overlay${active ? ' hud-overlay--active' : ''}`}
      aria-hidden="true"
    >
      {/* ── Corner brackets ── */}
      <span className="hud-corner hud-corner--tl" />
      <span className="hud-corner hud-corner--tr" />
      <span className="hud-corner hud-corner--bl" />
      <span className="hud-corner hud-corner--br" />

      {/* ── Scan line ── */}
      <div className="hud-scanline" />

      {/* ── Hotspot callouts ── */}
      {hotspots.map((hs, i) => (
        <div
          key={`${product}-${i}`}
          className={`hud-hotspot hud-hotspot--${hs.side}`}
          style={{
            left: hs.x,
            top: hs.y,
            '--hud-delay': `${0.6 + i * 0.22}s`,
          }}
        >
          {/* dot */}
          <span className="hud-dot" />
          {/* line */}
          <span className="hud-line" />
          {/* feature box */}
          <div className="hud-box">
            <span className="hud-box__label">{hs.label}</span>
            <span className="hud-box__value">{hs.value}</span>
          </div>
        </div>
      ))}

      {/* ── Bottom status bar ── */}
      <div className="hud-status">
        <span className="hud-status__text">
          {productName.toUpperCase()} &mdash; SCANNING...
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CANVAS TEXTURE FACTORIES  — identical to original three-scene.js
═══════════════════════════════════════════════════════════════ */

function makePanelTex() {
  const cv = document.createElement('canvas');
  cv.width = 2048; cv.height = 1024;
  const c = cv.getContext('2d');

  c.fillStyle = '#0A1535';
  c.fillRect(0, 0, 2048, 1024);

  const rows = 6, cols = 12;
  const cW = 2048 / cols, cH = 1024 / rows;
  const pad = 7;

  for (let r = 0; r < rows; r++) {
    for (let cl = 0; cl < cols; cl++) {
      const x = cl * cW + pad, y = r * cH + pad;
      const w = cW - pad * 2, h = cH - pad * 2;

      const grd = c.createLinearGradient(x, y, x + w, y + h);
      grd.addColorStop(0,   '#173280');
      grd.addColorStop(0.45,'#1a3d9e');
      grd.addColorStop(0.55,'#173280');
      grd.addColorStop(1,   '#0e2260');
      c.fillStyle = grd;
      c.fillRect(x, y, w, h);

      c.strokeStyle = 'rgba(160,200,240,0.22)';
      c.lineWidth = 0.9;
      for (let f = 1; f < 9; f++) {
        const fx = x + (w / 9) * f;
        c.beginPath(); c.moveTo(fx, y); c.lineTo(fx, y + h); c.stroke();
      }
      c.strokeStyle = 'rgba(220,232,248,0.65)';
      c.lineWidth = 2.2;
      for (let b = 1; b < 4; b++) {
        const by = y + (h / 4) * b;
        c.beginPath(); c.moveTo(x, by); c.lineTo(x + w, by); c.stroke();
      }
      c.strokeStyle = 'rgba(20,60,160,0.9)';
      c.lineWidth = 1.8;
      c.strokeRect(x, y, w, h);
    }
  }

  const sh = c.createLinearGradient(0, 0, 2048, 1024);
  sh.addColorStop(0,    'rgba(80,150,255,0)');
  sh.addColorStop(0.38, 'rgba(255,255,255,0.055)');
  sh.addColorStop(0.5,  'rgba(200,230,255,0.10)');
  sh.addColorStop(0.62, 'rgba(255,255,255,0.055)');
  sh.addColorStop(1,    'rgba(80,150,255,0)');
  c.fillStyle = sh;
  c.fillRect(0, 0, 2048, 1024);

  return new THREE.CanvasTexture(cv);
}

function makeInverterTex() {
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 768;
  const c = cv.getContext('2d');

  const bg = c.createLinearGradient(0, 0, 512, 768);
  bg.addColorStop(0, '#2a2e3e');
  bg.addColorStop(0.5, '#1e2230');
  bg.addColorStop(1, '#252935');
  c.fillStyle = bg;
  c.fillRect(0, 0, 512, 768);

  c.fillStyle = '#0a1520';
  c.beginPath();
  c.roundRect(80, 60, 352, 220, 12);
  c.fill();
  c.strokeStyle = 'rgba(0,212,255,0.5)';
  c.lineWidth = 2;
  c.stroke();

  c.fillStyle = 'rgba(0,212,255,0.15)';
  c.fillRect(90, 70, 332, 200);
  [0.4,0.7,0.55,0.85,0.65,0.9,0.75].forEach((h, i) => {
    const grd = c.createLinearGradient(0, 260 - h*160, 0, 260);
    grd.addColorStop(0, '#00D4FF');
    grd.addColorStop(1, '#0066FF');
    c.fillStyle = grd;
    c.fillRect(110 + i * 46, 260 - h * 160, 32, h * 160);
  });

  c.fillStyle = 'rgba(255,107,0,0.9)';
  c.fillRect(80, 300, 352, 5);
  c.fillStyle = '#ffffff';
  c.font = 'bold 28px sans-serif';
  c.textAlign = 'center';
  c.fillText('FluxCore 7kW', 256, 360);
  c.font = '16px sans-serif';
  c.fillStyle = 'rgba(255,255,255,0.5)';
  c.fillText('SOLAR INVERTER', 256, 390);

  c.strokeStyle = 'rgba(255,255,255,0.08)';
  c.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    c.beginPath(); c.moveTo(80, 430 + i*16); c.lineTo(432, 430 + i*16); c.stroke();
  }

  c.fillStyle = '#00ff88';
  c.beginPath(); c.arc(100, 700, 8, 0, Math.PI*2); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.4)';
  c.font = '14px sans-serif';
  c.textAlign = 'left';
  c.fillText('GRID CONNECTED', 120, 706);

  return new THREE.CanvasTexture(cv);
}

function makeBatteryTex() {
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 896;
  const c = cv.getContext('2d');

  const bg = c.createLinearGradient(0, 0, 512, 896);
  bg.addColorStop(0, '#1a2240');
  bg.addColorStop(0.5, '#141c35');
  bg.addColorStop(1, '#1a2240');
  c.fillStyle = bg;
  c.fillRect(0, 0, 512, 896);

  c.fillStyle = 'rgba(255,107,0,0.12)';
  c.fillRect(0, 0, 512, 100);
  c.fillStyle = '#FF6B00';
  c.font = 'bold 24px sans-serif';
  c.textAlign = 'center';
  c.fillText('SolarNova', 256, 45);
  c.fillStyle = 'rgba(255,255,255,0.5)';
  c.font = '14px sans-serif';
  c.fillText('PowerVault 10kWh', 256, 72);

  c.fillStyle = '#050d1a';
  c.beginPath();
  c.roundRect(60, 120, 392, 260, 10);
  c.fill();
  c.strokeStyle = 'rgba(255,107,0,0.4)';
  c.lineWidth = 1.5;
  c.stroke();

  const barGrd = c.createLinearGradient(80, 0, 472, 0);
  barGrd.addColorStop(0, '#FF6B00');
  barGrd.addColorStop(0.5, '#FFB800');
  barGrd.addColorStop(1, '#00D4FF');
  c.fillStyle = 'rgba(255,255,255,0.08)';
  c.fillRect(80, 200, 352, 28);
  c.fillStyle = barGrd;
  c.fillRect(80, 200, 352 * 0.78, 28);

  c.fillStyle = '#ffffff';
  c.font = 'bold 52px sans-serif';
  c.textAlign = 'center';
  c.fillText('78%', 256, 185);
  c.fillStyle = 'rgba(255,255,255,0.5)';
  c.font = '13px sans-serif';
  c.fillText('STATE OF CHARGE', 256, 248);
  c.fillStyle = '#00ff88';
  c.font = 'bold 16px sans-serif';
  c.fillText('● CHARGING  2.4kW', 256, 290);
  c.fillStyle = 'rgba(255,255,255,0.4)';
  c.font = '13px sans-serif';
  c.fillText('Est. Full: 2h 18m', 256, 364);

  c.strokeStyle = 'rgba(255,255,255,0.07)';
  c.lineWidth = 1.5;
  for (let i = 0; i < 10; i++) {
    c.beginPath();
    c.moveTo(0, 420 + i * 40);
    c.lineTo(512, 420 + i * 40);
    c.stroke();
  }

  c.fillStyle = 'rgba(255,255,255,0.15)';
  c.fillRect(80, 820, 150, 40);
  c.fillRect(280, 820, 150, 40);
  c.fillStyle = 'rgba(255,255,255,0.5)';
  c.font = '14px sans-serif';
  c.fillText('DC+', 155, 847);
  c.fillText('DC-', 355, 847);

  return new THREE.CanvasTexture(cv);
}

/* ═══════════════════════════════════════════════════════════════
   HOTSPOT BUILDER
═══════════════════════════════════════════════════════════════ */

function _addHotspot(group, position, productType, data, allHotspots) {
  const outer = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xFF6B00, transparent: true, opacity: 0.28 })
  );
  const inner = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xFF6B00 })
  );
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.035, 0.05, 32),
    new THREE.MeshBasicMaterial({ color: 0xFF6B00, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
  );
  ring.rotation.x = Math.PI / 2;

  const hs = new THREE.Group();
  hs.add(outer, inner, ring);
  hs.position.copy(position);
  hs.userData = { ...data, productType, isHotspot: true, outer, inner, ring };
  group.add(hs);
  allHotspots.push(hs);
}

/* ═══════════════════════════════════════════════════════════════
   MODEL BUILDERS — identical to original three-scene.js
═══════════════════════════════════════════════════════════════ */

function _buildPanel(allHotspots) {
  const G = new THREE.Group();
  const panelTex = makePanelTex();

  const panelGeo = new THREE.BoxGeometry(2.8, 1.4, 0.038);
  const panelMats = [
    new THREE.MeshStandardMaterial({ color: 0xAAB4C0, roughness: 0.2, metalness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0xAAB4C0, roughness: 0.2, metalness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0xAAB4C0, roughness: 0.2, metalness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0xAAB4C0, roughness: 0.2, metalness: 0.85 }),
    new THREE.MeshStandardMaterial({ map: panelTex, roughness: 0.06, metalness: 0.15, envMapIntensity: 0.8 }),
    new THREE.MeshStandardMaterial({ color: 0xe0e4e8, roughness: 0.8 }),
  ];
  const panel = new THREE.Mesh(panelGeo, panelMats);
  panel.castShadow = true;
  panel.receiveShadow = true;
  G.add(panel);

  const frameMat = new THREE.MeshStandardMaterial({ color: 0xC8D0D8, roughness: 0.15, metalness: 0.92 });
  const fw = 0.06, fd = 0.048;
  [
    { g: new THREE.BoxGeometry(2.92, fw, fd), p: [0,  0.73, 0.004] },
    { g: new THREE.BoxGeometry(2.92, fw, fd), p: [0, -0.73, 0.004] },
    { g: new THREE.BoxGeometry(fw, 1.4, fd),  p: [-1.43, 0, 0.004] },
    { g: new THREE.BoxGeometry(fw, 1.4, fd),  p: [ 1.43, 0, 0.004] },
  ].forEach(f => {
    const m = new THREE.Mesh(f.g, frameMat);
    m.position.set(...f.p);
    m.castShadow = true;
    G.add(m);
  });

  const jbMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.75 });
  const jb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.045), jbMat);
  jb.position.set(0.3, -0.2, -0.042);
  G.add(jb);
  [[-0.14], [0.14]].forEach(([ox]) => {
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.3), jbMat);
    wire.rotation.z = Math.PI / 2;
    wire.position.set(0.3 + ox * 2.2, -0.2, -0.042);
    G.add(wire);
  });

  [
    { pos: [-1.0,  0.5,  0.06], data: { icon:'🔬', title:'Anti-Reflective Glass', desc:'Tempered low-iron glass with nano-AR coating — 95.6% light transmittance, UV/hail resistant.' }},
    { pos: [ 0.2,  0.0,  0.06], data: { icon:'⚡', title:'Mono PERC Cells',       desc:'Half-cut monocrystalline PERC — 22.8% conversion efficiency, lower hot-spot temperature.' }},
    { pos: [ 1.3, -0.2,  0.0 ], data: { icon:'🏗️', title:'Anodized Frame',        desc:'6063-T5 aluminium alloy — corrosion-proof, rated for 5400 Pa snow & 2400 Pa wind load.' }},
    { pos: [ 0.3, -0.2, -0.07], data: { icon:'🔌', title:'Smart Junction Box',    desc:'IP68-rated, 3 bypass diodes with 30A Schottky technology, 600V rated.' }},
    { pos: [-0.8, -0.5,  0.06], data: { icon:'🛡️', title:'EVA Encapsulant',       desc:'Dual-layer EVA encapsulation — high PID resistance, UV stability guaranteed >25 years.' }},
  ].forEach(h => _addHotspot(G, new THREE.Vector3(...h.pos), 'panel', h.data, allHotspots));

  return G;
}

function _buildInverter(allHotspots) {
  const G = new THREE.Group();
  const invTex = makeInverterTex();

  const body = new THREE.BoxGeometry(0.7, 1.1, 0.22);
  const mat = [
    new THREE.MeshStandardMaterial({ color: 0x2a2e3e, roughness: 0.5, metalness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: 0x2a2e3e, roughness: 0.5, metalness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: 0x2a2e3e, roughness: 0.5, metalness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: 0x1e2230, roughness: 0.6, metalness: 0.3 }),
    new THREE.MeshStandardMaterial({ map: invTex,    roughness: 0.3, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x252935, roughness: 0.6, metalness: 0.3 }),
  ];
  const mesh = new THREE.Mesh(body, mat);
  mesh.castShadow = true;
  G.add(mesh);

  const ventMat = new THREE.MeshStandardMaterial({ color: 0x111520, roughness: 0.9 });
  for (let i = 0; i < 6; i++) {
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.018, 0.04), ventMat);
    v.position.set(0, -0.25 + i * 0.07, 0.13);
    G.add(v);
  }

  const brkt = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.06, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x888e99, roughness: 0.3, metalness: 0.8 })
  );
  brkt.position.set(0, -0.62, -0.05);
  G.add(brkt);

  const connMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.5 });
  [-0.12, 0.12].forEach(ox => {
    const conn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.06), connMat);
    conn.position.set(ox, -0.58, 0.04);
    G.add(conn);
  });

  [
    { pos: [ 0,     0.38, 0.13], data: { icon:'📱', title:'LCD Display',     desc:'Real-time power generation, yield, and grid status — readable in direct sunlight.' }},
    { pos: [ 0,     0.10, 0.13], data: { icon:'🔁', title:'Dual MPPT',       desc:'Independent trackers for 2 string arrays — ideal for complex roofs or shading.' }},
    { pos: [ 0.42,  0.0,  0.0 ], data: { icon:'❄️', title:'Passive Cooling', desc:'Finned aluminium heatsink eliminates the fan — zero noise, zero moving parts.' }},
    { pos: [-0.12, -0.58, 0.04], data: { icon:'🔌', title:'DC Input',        desc:'Wide MPPT voltage range 200–800V DC, compatible with all major panel brands.' }},
    { pos: [ 0.12, -0.58, 0.04], data: { icon:'⚡', title:'AC Output',       desc:'Pure sine wave 240V AC, 98.4% peak efficiency, anti-islanding protection built-in.' }},
  ].forEach(h => _addHotspot(G, new THREE.Vector3(...h.pos), 'inverter', h.data, allHotspots));

  return G;
}

function _buildBattery(allHotspots) {
  const G = new THREE.Group();
  const batTex = makeBatteryTex();

  const body = new THREE.BoxGeometry(0.76, 1.3, 0.18);
  const mat = [
    new THREE.MeshStandardMaterial({ color: 0x1a2240, roughness: 0.4, metalness: 0.5 }),
    new THREE.MeshStandardMaterial({ color: 0x1a2240, roughness: 0.4, metalness: 0.5 }),
    new THREE.MeshStandardMaterial({ color: 0x1e2855, roughness: 0.4, metalness: 0.5 }),
    new THREE.MeshStandardMaterial({ color: 0x111a33, roughness: 0.5, metalness: 0.4 }),
    new THREE.MeshStandardMaterial({ map: batTex,    roughness: 0.2, metalness: 0.15 }),
    new THREE.MeshStandardMaterial({ color: 0x151e38, roughness: 0.5, metalness: 0.4 }),
  ];
  const mesh = new THREE.Mesh(body, mat);
  mesh.castShadow = true;
  G.add(mesh);

  const strip = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 0.045, 0.185),
    new THREE.MeshStandardMaterial({ color: 0xFF6B00, emissive: 0xFF3300, emissiveIntensity: 0.3, roughness: 0.3 })
  );
  strip.position.set(0, 0.672, 0);
  G.add(strip);

  const termMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.2, metalness: 0.9 });
  [-0.14, 0.14].forEach(ox => {
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.06), termMat);
    cyl.position.set(ox, -0.70, 0.0);
    G.add(cyl);
  });

  [
    { pos: [ 0,     0.3,  0.10], data: { icon:'🔋', title:'LFP Cell Stack',      desc:'LiFePO₄ chemistry — non-flammable, 6,000+ cycles at 80% DoD, no thermal runaway.' }},
    { pos: [ 0,     0.67, 0.10], data: { icon:'🧠', title:'Smart BMS',           desc:'Battery Management System balances all cells in real-time, prevents over/under-charge.' }},
    { pos: [ 0.45,  0.0,  0.0 ], data: { icon:'🌡️', title:'Thermal Management', desc:'Liquid-cooled cell modules maintain optimal 20–30°C operating temperature in all climates.' }},
    { pos: [ 0,    -0.1,  0.10], data: { icon:'📊', title:'Smart Monitor',      desc:'Built-in WiFi + CAN bus — integrates with SolarNova app, Modbus, and any major inverter.' }},
    { pos: [-0.14, -0.70, 0.0 ], data: { icon:'🔌', title:'DC Connection',      desc:'Reinforced IP67 terminals, supports charge/discharge rates up to 5kW continuous.' }},
  ].forEach(h => _addHotspot(G, new THREE.Vector3(...h.pos), 'battery', h.data, allHotspots));

  return G;
}

/* ═══════════════════════════════════════════════════════════════
   CAMERA TARGETS — identical to original
═══════════════════════════════════════════════════════════════ */

const CAM_TARGETS = {
  panel:    { x: 0, y: 0.3, z: 4.0 },
  inverter: { x: 0, y: 0,   z: 2.4 },
  battery:  { x: 0, y: 0,   z: 2.6 },
};

/* ═══════════════════════════════════════════════════════════════
   INNER SCENE COMPONENT  (runs inside <Canvas>)
═══════════════════════════════════════════════════════════════ */

function SolarScene({ currentProduct, onTooltip }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  // Use ref so useFrame always reads the latest value (no stale closure)
  const currentProductRef = useRef(currentProduct);
  useEffect(() => { currentProductRef.current = currentProduct; }, [currentProduct]);

  const clock      = useRef(new THREE.Clock());
  const raycaster  = useRef(new THREE.Raycaster());
  const mouse      = useRef(new THREE.Vector2(-9999, -9999));
  const hoveredHs  = useRef(null);
  const rimLight   = useRef();
  const camAnim    = useRef({ active: false, startPos: new THREE.Vector3(), endPos: new THREE.Vector3(), t: 0 });
  const prevProd   = useRef(currentProduct);

  // Build models exactly once
  const allHotspots    = useRef(null);
  const panelGroup     = useRef(null);
  const inverterGroup  = useRef(null);
  const batteryGroup   = useRef(null);

  if (allHotspots.current === null) {
    allHotspots.current = [];
    panelGroup.current    = _buildPanel(allHotspots.current);
    inverterGroup.current = _buildInverter(allHotspots.current);
    batteryGroup.current  = _buildBattery(allHotspots.current);
  }

  // Product switch → smooth camera transition (identical to original)
  useEffect(() => {
    if (prevProd.current === currentProduct) return;
    prevProd.current = currentProduct;

    const ct = CAM_TARGETS[currentProduct];
    camAnim.current = {
      active: true,
      startPos: camera.position.clone(),
      endPos: new THREE.Vector3(ct.x, ct.y, ct.z),
      t: 0,
    };

    // Reset group rotation on switch
    const groups = { panel: panelGroup.current, inverter: inverterGroup.current, battery: batteryGroup.current };
    groups[currentProduct]?.rotation.set(0, 0, 0);
  }, [currentProduct, camera]);

  // Mouse / touch events — identical to original
  useEffect(() => {
    const canvas = gl.domElement;

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      if (controlsRef.current) controlsRef.current.autoRotate = false;
    };
    const onLeave = () => {
      mouse.current.set(-9999, -9999);
      if (controlsRef.current) controlsRef.current.autoRotate = true;
      onTooltip(null);
      hoveredHs.current = null;
    };
    const onEnter = () => {
      if (controlsRef.current) controlsRef.current.autoRotate = false;
    };
    const onTouch = (e) => {
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((t.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse.current.y = -((t.clientY - rect.top)  / rect.height) * 2 + 1;
    };

    canvas.addEventListener('mousemove',  onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('mouseenter', onEnter);
    canvas.addEventListener('touchmove',  onTouch, { passive: true });
    return () => {
      canvas.removeEventListener('mousemove',  onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('mouseenter', onEnter);
      canvas.removeEventListener('touchmove',  onTouch);
    };
  }, [gl, onTooltip]);

  // Animation loop — identical to original animate()
  useFrame((state, delta) => {
    const t    = clock.current.getElapsedTime();
    const prod = currentProductRef.current;

    /* smooth camera transition */
    const ca = camAnim.current;
    if (ca.active) {
      ca.t += delta / 0.7;
      if (ca.t >= 1) { ca.t = 1; ca.active = false; }
      const ease = ca.t < 0.5 ? 2 * ca.t * ca.t : -1 + (4 - 2 * ca.t) * ca.t;
      camera.position.lerpVectors(ca.startPos, ca.endPos, ease);
    }

    /* pulsing hotspots */
    allHotspots.current.forEach(hs => {
      if (!hs.visible) return;
      const { outer, ring } = hs.userData;
      outer.material.opacity = 0.18 + 0.14 * Math.sin(t * 3 + hs.position.x);
      const s = 1 + 0.22 * Math.sin(t * 2.5 + hs.position.y);
      ring.scale.set(s, s, s);
      ring.material.opacity = 0.5 - 0.4 * ((s - 1) / 0.22);
    });

    /* rim light warmth flicker */
    if (rimLight.current) {
      rimLight.current.intensity = 1.1 + 0.15 * Math.sin(t * 0.8);
    }

    /* hotspot raycasting */
    const visibleHotspots = allHotspots.current.filter(h => h.userData.productType === prod);
    const innerMeshes = visibleHotspots.map(h => h.userData.inner);
    raycaster.current.setFromCamera(mouse.current, camera);
    const hits = raycaster.current.intersectObjects(innerMeshes);

    if (hits.length > 0) {
      const hitInner = hits[0].object;
      const hs = visibleHotspots.find(h => h.userData.inner === hitInner);
      if (hs && hs !== hoveredHs.current) {
        hoveredHs.current = hs;
        onTooltip(hs.userData);
        gl.domElement.style.cursor = 'pointer';
      }
    } else if (hoveredHs.current) {
      hoveredHs.current = null;
      onTooltip(null);
      gl.domElement.style.cursor = 'grab';
    }
  });

  return (
    <>
      {/* ── Lights — identical to original ── */}
      <ambientLight intensity={0.5} />
      <directionalLight
        color="#fff8e7"
        intensity={1.8}
        position={[6, 10, 8]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />
      <directionalLight color="#4466bb" intensity={0.4} position={[-8, -4, -6]} />
      <pointLight ref={rimLight} color="#FF6B00" intensity={1.2} distance={14} position={[3, 3, 1]} />

      {/* ── Product groups ── */}
      <primitive object={panelGroup.current}    visible={currentProduct === 'panel'}    />
      <primitive object={inverterGroup.current}  visible={currentProduct === 'inverter'} />
      <primitive object={batteryGroup.current}   visible={currentProduct === 'battery'}  />

      {/* ── Controls ── */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        maxDistance={7}
        minDistance={1.8}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT DATA
═══════════════════════════════════════════════════════════════ */

const DEFAULT_PRODUCTS = [
  {
    id: 'panel',
    name: 'SolarVista Pro Panel',
    category: 'panel',
    icon: 'sun',
    specs: [
      { value: '440W',  label: 'Output'     },
      { value: '22.8%', label: 'Efficiency' },
      { value: '25 Yr', label: 'Warranty'   },
      { value: 'IP68',  label: 'Protection' },
    ],
    features: [
      'Premium Monocrystalline PERC Cells',
      'Anti-Reflective Tempered Glass',
      'Anodized Aluminum Frame',
      'Smart Junction Box IP68',
    ],
    description: 'Our flagship monocrystalline solar panel delivers industry-leading efficiency with cutting-edge PERC cell technology.',
  },
  {
    id: 'inverter',
    name: 'FluxCore Inverter',
    category: 'inverter',
    icon: 'cpu',
    specs: [
      { value: '7kW',   label: 'Power'      },
      { value: '98.4%', label: 'Efficiency' },
      { value: 'Dual',  label: 'MPPT'       },
      { value: 'IP65',  label: 'Protection' },
    ],
    features: [
      'Real-time LCD Display',
      'Dual MPPT Trackers',
      'Passive Cooling Design',
      'Anti-Islanding Protection',
    ],
    description: 'Advanced hybrid inverter with dual MPPT technology for maximum energy harvest from your solar array.',
  },
  {
    id: 'battery',
    name: 'PowerVault Battery',
    category: 'battery',
    icon: 'battery-charging',
    specs: [
      { value: '10kWh', label: 'Capacity'   },
      { value: '6000+', label: 'Cycles'     },
      { value: '80%',   label: 'Max DoD'    },
      { value: 'IP67',  label: 'Protection' },
    ],
    features: [
      'LiFePO₄ Chemistry',
      'Smart BMS System',
      'Liquid Thermal Management',
      'WiFi + CAN Bus Monitor',
    ],
    description: 'Long-life LFP battery storage with advanced BMS for safe, reliable home energy independence.',
  },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */

export default function Products({ initialProducts = [] }) {
  const products      = initialProducts.length > 0 ? initialProducts : DEFAULT_PRODUCTS;
  const [activeProduct, setActiveProduct] = useState(products[0]);
  const [tooltip, setTooltip]             = useState(null);
  const [hudActive, setHudActive]         = useState(false);

  const handleTooltip = useCallback((data) => setTooltip(data), []);

  const handleTabClick = (p) => {
    setActiveProduct(p);
    setTooltip(null);
    setHudActive(false);   // reset HUD when switching products
  };

  let parsedSpecs    = [];
  let parsedFeatures = [];
  try { parsedSpecs    = typeof activeProduct.specs    === 'string' ? JSON.parse(activeProduct.specs)    : activeProduct.specs;    } catch (e) {}
  try { parsedFeatures = typeof activeProduct.features === 'string' ? JSON.parse(activeProduct.features) : activeProduct.features; } catch (e) {}

  // Safely extract the product category for the 3D viewer (panel, inverter, battery)
  let currentCategory = 'panel';
  const cat = activeProduct?.category?.toLowerCase() || '';
  if (cat.includes('inverter')) currentCategory = 'inverter';
  else if (cat.includes('battery')) currentCategory = 'battery';

  return (
    <section id="products" className="products-section" aria-label="Solar products showcase">
      <div className="container">
        <div className="section-header" data-animate>
          <span className="section-badge"><Cpu /> Our Technology</span>
          <h2>Explore Our <span>Solar Products</span></h2>
          <p className="section-subtitle">
            Discover our premium lineup of solar technology engineered for maximum performance,
            durability, and aesthetic integration with your property.
          </p>
        </div>

        <div className="products-tabs" data-animate>
          {products.map((p) => (
            <button
              key={p.id}
              className={`product-tab ${activeProduct.id === p.id ? 'active' : ''}`}
              onClick={() => handleTabClick(p)}
            >
              <DynamicIcon name={p.icon || 'box'} /> {p.name.split(' ')[0]} {p.category}
            </button>
          ))}
        </div>

        <div className="products-showcase">
          {/* ── 3-D Viewer ── */}
          <div className="product-viewer" data-animate>
            {/* #product-canvas-container has position:absolute inset:0 — gives R3F a definite height */}
            <div id="product-canvas-container">
              <Canvas
                shadows
                camera={{ fov: 42, near: 0.05, far: 200, position: [0, 0.4, 3.8] }}
                gl={{ antialias: true, alpha: true }}
                onCreated={({ gl }) => {
                  gl.toneMapping = THREE.ACESFilmicToneMapping;
                  gl.toneMappingExposure = 1.25;
                }}
                style={{ background: 'transparent' }}
              >
                <SolarScene
                  currentProduct={currentCategory}
                  onTooltip={handleTooltip}
                />
              </Canvas>
            </div>

            {/* ── Iron Man HUD overlay ── */}
            <IronManHUD
              active={hudActive}
              product={currentCategory}
              productName={activeProduct.name}
            />

            {/* ── Scan / HUD toggle button ── */}
            <button
              id="hud-scan-btn"
              className={`hud-scan-btn${hudActive ? ' hud-scan-btn--active' : ''}`}
              onClick={() => setHudActive(v => !v)}
              aria-label={hudActive ? 'Close HUD scan' : 'Activate HUD scan'}
              title={hudActive ? 'Close HUD' : 'Scan Product'}
            >
              {hudActive
                ? <span className="hud-scan-btn__x">✕</span>
                : <ScanLine size={20} />
              }
            </button>

            {/* Hotspot tooltip — same content structure as original */}
            <div id="hotspotTooltip" className={`hotspot-tooltip${tooltip ? ' visible' : ''}`}>
              <span className="ht-icon">{tooltip?.icon}</span>
              <div className="ht-body">
                <strong id="htTitle">{tooltip?.title}</strong>
                <p id="htDesc">{tooltip?.desc}</p>
              </div>
            </div>
          </div>

          {/* ── Product Info Panel ── */}
          <div className="product-info-panel" id="product-info" data-animate>
            <h3 className="product-name">{activeProduct.name}</h3>
            <p className="product-description">{activeProduct.description}</p>

            <div className="product-specs">
              {Array.isArray(parsedSpecs) && parsedSpecs.map((s, idx) => (
                <div key={idx} className="spec-item">
                  <div className="spec-value">{s.value}</div>
                  <div className="spec-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="product-features">
              {Array.isArray(parsedFeatures) && parsedFeatures.map((f, idx) => (
                <div key={idx} className="feature-item">
                  <CheckCircle /><span>{f}</span>
                </div>
              ))}
            </div>

            <a href="/products" className="btn btn-secondary" style={{ marginRight: '12px' }}>View All Products</a>
            <a href="#contact"  className="btn btn-primary">Request Quote <ArrowRight /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
