/* ═══════════════════════════════════════════════════════════════
   SOLARNOVA — THREE.JS PRODUCT VIEWER
   Solar Panel · Inverter · Battery Storage — with Hotspot System
═══════════════════════════════════════════════════════════════ */

class SolarProductViewer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.container = this.canvas.parentElement;
    this.currentProduct = 'panel';
    this.hotspots = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-9999, -9999);
    this.hoveredHotspot = null;
    this.clock = new THREE.Clock();
    this.autoRotate = true;

    this.init();
    this.buildPanel();
    this.buildInverter();
    this.buildBattery();
    this.updateTabIndicator();
    this.switchProduct('panel');
    this.bindEvents();
    this.animate();
  }

  /* ── SCENE INIT ─────────────────────────────────────────── */
  init() {
    this.scene = new THREE.Scene();

    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.05, 200);
    this.camera.position.set(0, 0.4, 3.8);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxDistance = 7;
    this.controls.minDistance = 1.8;
    this.controls.enablePan = false;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.6;

    /* Lights */
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const sun = new THREE.DirectionalLight(0xfff8e7, 1.8);
    sun.position.set(6, 10, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0005;
    this.scene.add(sun);

    const fill = new THREE.DirectionalLight(0x4466bb, 0.4);
    fill.position.set(-8, -4, -6);
    this.scene.add(fill);

    const rim = new THREE.PointLight(0xFF6B00, 1.2, 14);
    rim.position.set(3, 3, 1);
    this.scene.add(rim);
    this.rimLight = rim;

    /* Product groups */
    this.panelGroup   = new THREE.Group();
    this.inverterGroup = new THREE.Group();
    this.batteryGroup  = new THREE.Group();
    this.scene.add(this.panelGroup);
    this.scene.add(this.inverterGroup);
    this.scene.add(this.batteryGroup);
  }

  /* ── CANVAS TEXTURES ────────────────────────────────────── */
  makePanelTex() {
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

        /* finger lines */
        c.strokeStyle = 'rgba(160,200,240,0.22)';
        c.lineWidth = 0.9;
        for (let f = 1; f < 9; f++) {
          const fx = x + (w / 9) * f;
          c.beginPath(); c.moveTo(fx, y); c.lineTo(fx, y + h); c.stroke();
        }
        /* busbars */
        c.strokeStyle = 'rgba(220,232,248,0.65)';
        c.lineWidth = 2.2;
        for (let b = 1; b < 4; b++) {
          const by = y + (h / 4) * b;
          c.beginPath(); c.moveTo(x, by); c.lineTo(x + w, by); c.stroke();
        }
        /* cell border */
        c.strokeStyle = 'rgba(20,60,160,0.9)';
        c.lineWidth = 1.8;
        c.strokeRect(x, y, w, h);
      }
    }

    /* shimmer */
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

  makeInverterTex() {
    const cv = document.createElement('canvas');
    cv.width = 512; cv.height = 768;
    const c = cv.getContext('2d');

    /* body */
    const bg = c.createLinearGradient(0, 0, 512, 768);
    bg.addColorStop(0, '#2a2e3e');
    bg.addColorStop(0.5, '#1e2230');
    bg.addColorStop(1, '#252935');
    c.fillStyle = bg;
    c.fillRect(0, 0, 512, 768);

    /* display screen */
    c.fillStyle = '#0a1520';
    c.beginPath();
    c.roundRect(80, 60, 352, 220, 12);
    c.fill();
    c.strokeStyle = 'rgba(0,212,255,0.5)';
    c.lineWidth = 2;
    c.stroke();

    /* display content - green bar graph */
    c.fillStyle = 'rgba(0,212,255,0.15)';
    c.fillRect(90, 70, 332, 200);
    [0.4,0.7,0.55,0.85,0.65,0.9,0.75].forEach((h, i) => {
      const grd = c.createLinearGradient(0, 260 - h*160, 0, 260);
      grd.addColorStop(0, '#00D4FF');
      grd.addColorStop(1, '#0066FF');
      c.fillStyle = grd;
      c.fillRect(110 + i * 46, 260 - h * 160, 32, h * 160);
    });

    /* brand label */
    c.fillStyle = 'rgba(255,107,0,0.9)';
    c.fillRect(80, 300, 352, 5);
    c.fillStyle = '#ffffff';
    c.font = 'bold 28px sans-serif';
    c.textAlign = 'center';
    c.fillText('FluxCore 7kW', 256, 360);
    c.font = '16px sans-serif';
    c.fillStyle = 'rgba(255,255,255,0.5)';
    c.fillText('SOLAR INVERTER', 256, 390);

    /* vents */
    c.strokeStyle = 'rgba(255,255,255,0.08)';
    c.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      c.beginPath(); c.moveTo(80, 430 + i*16); c.lineTo(432, 430 + i*16); c.stroke();
    }

    /* LED status */
    c.fillStyle = '#00ff88';
    c.beginPath(); c.arc(100, 700, 8, 0, Math.PI*2); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.4)';
    c.font = '14px sans-serif';
    c.textAlign = 'left';
    c.fillText('GRID CONNECTED', 120, 706);

    return new THREE.CanvasTexture(cv);
  }

  makeBatteryTex() {
    const cv = document.createElement('canvas');
    cv.width = 512; cv.height = 896;
    const c = cv.getContext('2d');

    const bg = c.createLinearGradient(0, 0, 512, 896);
    bg.addColorStop(0, '#1a2240');
    bg.addColorStop(0.5, '#141c35');
    bg.addColorStop(1, '#1a2240');
    c.fillStyle = bg;
    c.fillRect(0, 0, 512, 896);

    /* SolarNova logo area */
    c.fillStyle = 'rgba(255,107,0,0.12)';
    c.fillRect(0, 0, 512, 100);
    c.fillStyle = '#FF6B00';
    c.font = 'bold 24px sans-serif';
    c.textAlign = 'center';
    c.fillText('SolarNova', 256, 45);
    c.fillStyle = 'rgba(255,255,255,0.5)';
    c.font = '14px sans-serif';
    c.fillText('PowerVault 10kWh', 256, 72);

    /* Battery display */
    c.fillStyle = '#050d1a';
    c.beginPath();
    c.roundRect(60, 120, 392, 260, 10);
    c.fill();
    c.strokeStyle = 'rgba(255,107,0,0.4)';
    c.lineWidth = 1.5;
    c.stroke();

    /* Battery level bar */
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

    /* cell rows */
    c.strokeStyle = 'rgba(255,255,255,0.07)';
    c.lineWidth = 1.5;
    for (let i = 0; i < 10; i++) {
      c.beginPath();
      c.moveTo(0, 420 + i * 40);
      c.lineTo(512, 420 + i * 40);
      c.stroke();
    }

    /* bottom terminals */
    c.fillStyle = 'rgba(255,255,255,0.15)';
    c.fillRect(80, 820, 150, 40);
    c.fillRect(280, 820, 150, 40);
    c.fillStyle = 'rgba(255,255,255,0.5)';
    c.font = '14px sans-serif';
    c.fillText('DC+', 155, 847);
    c.fillText('DC-', 355, 847);

    return new THREE.CanvasTexture(cv);
  }

  /* ── PRODUCT BUILDERS ───────────────────────────────────── */
  buildPanel() {
    const G = this.panelGroup;
    const panelTex = this.makePanelTex();

    /* main panel body */
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

    /* frame */
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xC8D0D8, roughness: 0.15, metalness: 0.92 });
    const fw = 0.06, fd = 0.048;
    const frames = [
      { g: new THREE.BoxGeometry(2.92, fw, fd), p: [0,  0.73, 0.004] },
      { g: new THREE.BoxGeometry(2.92, fw, fd), p: [0, -0.73, 0.004] },
      { g: new THREE.BoxGeometry(fw, 1.4, fd),  p: [-1.43, 0, 0.004] },
      { g: new THREE.BoxGeometry(fw, 1.4, fd),  p: [ 1.43, 0, 0.004] },
    ];
    frames.forEach(f => {
      const m = new THREE.Mesh(f.g, frameMat);
      m.position.set(...f.p);
      m.castShadow = true;
      G.add(m);
    });

    /* junction box */
    const jbMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.75 });
    const jb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.045), jbMat);
    jb.position.set(0.3, -0.2, -0.042);
    G.add(jb);
    /* wire stubs */
    [[-0.14, 0], [0.14, 0]].forEach(([ox]) => {
      const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.3), jbMat);
      wire.rotation.z = Math.PI / 2;
      wire.position.set(0.3 + ox * 2.2, -0.2, -0.042);
      G.add(wire);
    });

    /* hotspots */
    const hs = [
      { pos: [-1.0, 0.5, 0.06], data: { icon:'🔬', title:'Anti-Reflective Glass', desc:'Tempered low-iron glass with nano-AR coating — 95.6% light transmittance, UV/hail resistant.' }},
      { pos: [ 0.2, 0.0, 0.06], data: { icon:'⚡', title:'Mono PERC Cells', desc:'Half-cut monocrystalline PERC — 22.8% conversion efficiency, lower hot-spot temperature.' }},
      { pos: [ 1.3, -0.2, 0.0], data: { icon:'🏗️', title:'Anodized Frame', desc:'6063-T5 aluminium alloy — corrosion-proof, rated for 5400 Pa snow & 2400 Pa wind load.' }},
      { pos: [ 0.3, -0.2,-0.07], data: { icon:'🔌', title:'Smart Junction Box', desc:'IP68-rated, 3 bypass diodes with 30A Schottky technology, 600V rated.' }},
      { pos: [-0.8, -0.5, 0.06], data: { icon:'🛡️', title:'EVA Encapsulant', desc:'Dual-layer EVA encapsulation — high PID resistance, UV stability guaranteed >25 years.' }},
    ];
    hs.forEach(h => this.addHotspot(G, new THREE.Vector3(...h.pos), 'panel', h.data));
  }

  buildInverter() {
    const G = this.inverterGroup;
    const invTex = this.makeInverterTex();

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

    /* vent slots */
    const ventMat = new THREE.MeshStandardMaterial({ color: 0x111520, roughness: 0.9 });
    for (let i = 0; i < 6; i++) {
      const v = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.018, 0.04), ventMat);
      v.position.set(0, -0.25 + i * 0.07, 0.13);
      G.add(v);
    }

    /* mounting bracket */
    const brkt = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.06, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x888e99, roughness: 0.3, metalness: 0.8 })
    );
    brkt.position.set(0, -0.62, -0.05);
    G.add(brkt);

    /* DC connectors bottom */
    const connMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.5 });
    [-0.12, 0.12].forEach(ox => {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.06), connMat);
      c.position.set(ox, -0.58, 0.04);
      G.add(c);
    });

    const hs = [
      { pos: [0,  0.38, 0.13], data: { icon:'📱', title:'LCD Display',     desc:'Real-time power generation, yield, and grid status — readable in direct sunlight.' }},
      { pos: [0,  0.10, 0.13], data: { icon:'🔁', title:'Dual MPPT',       desc:'Independent trackers for 2 string arrays — ideal for complex roofs or shading.' }},
      { pos: [0.42, 0, 0.0],   data: { icon:'❄️', title:'Passive Cooling', desc:'Finned aluminium heatsink eliminates the fan — zero noise, zero moving parts.' }},
      { pos: [-0.12,-0.58,0.04],data: { icon:'🔌', title:'DC Input',        desc:'Wide MPPT voltage range 200–800V DC, compatible with all major panel brands.' }},
      { pos: [ 0.12,-0.58,0.04],data: { icon:'⚡', title:'AC Output',       desc:'Pure sine wave 240V AC, 98.4% peak efficiency, anti-islanding protection built-in.' }},
    ];
    hs.forEach(h => this.addHotspot(G, new THREE.Vector3(...h.pos), 'inverter', h.data));
  }

  buildBattery() {
    const G = this.batteryGroup;
    const batTex = this.makeBatteryTex();

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

    /* accent strip top */
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(0.76, 0.045, 0.185),
      new THREE.MeshStandardMaterial({ color: 0xFF6B00, emissive: 0xFF3300, emissiveIntensity: 0.3, roughness: 0.3 })
    );
    strip.position.set(0, 0.672, 0);
    G.add(strip);

    /* terminal posts */
    const termMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.2, metalness: 0.9 });
    [-0.14, 0.14].forEach(ox => {
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.06), termMat);
      cyl.position.set(ox, -0.70, 0.0);
      G.add(cyl);
    });

    const hs = [
      { pos: [0,    0.3,  0.10], data: { icon:'🔋', title:'LFP Cell Stack',       desc:'LiFePO₄ chemistry — non-flammable, 6,000+ cycles at 80% DoD, no thermal runaway.' }},
      { pos: [0,    0.67, 0.10], data: { icon:'🧠', title:'Smart BMS',            desc:'Battery Management System balances all cells in real-time, prevents over/under-charge.' }},
      { pos: [0.45, 0.0,  0.0 ], data: { icon:'🌡️', title:'Thermal Management',  desc:'Liquid-cooled cell modules maintain optimal 20–30°C operating temperature in all climates.' }},
      { pos: [0,   -0.1,  0.10], data: { icon:'📊', title:'Smart Monitor',       desc:'Built-in WiFi + CAN bus — integrates with SolarNova app, Modbus, and any major inverter.' }},
      { pos: [-0.14,-0.70, 0.0 ], data: { icon:'🔌', title:'DC Connection',       desc:'Reinforced IP67 terminals, supports charge/discharge rates up to 5kW continuous.' }},
    ];
    hs.forEach(h => this.addHotspot(G, new THREE.Vector3(...h.pos), 'battery', h.data));
  }

  /* ── HOTSPOT SYSTEM ─────────────────────────────────────── */
  addHotspot(group, position, productType, data) {
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
    hs.add(outer); hs.add(inner); hs.add(ring);
    hs.position.copy(position);
    hs.userData = { ...data, productType, isHotspot: true, outer, inner, ring };

    group.add(hs);
    this.hotspots.push(hs);
    return hs;
  }

  /* ── PRODUCT SWITCHING ──────────────────────────────────── */
  switchProduct(name) {
    this.currentProduct = name;

    /* hide all groups + filter hotspots */
    [this.panelGroup, this.inverterGroup, this.batteryGroup].forEach(g => { g.visible = false; });
    this.hotspots.forEach(h => { h.visible = h.userData.productType === name; });

    const target = { panel: this.panelGroup, inverter: this.inverterGroup, battery: this.batteryGroup }[name];
    target.visible = true;
    target.rotation.set(0, 0, 0);

    /* camera position per product */
    const camTargets = {
      panel:    { x: 0, y: 0.3, z: 4.0 },
      inverter: { x: 0, y: 0,   z: 2.4 },
      battery:  { x: 0, y: 0,   z: 2.6 },
    };
    const ct = camTargets[name];

    /* smooth camera transition */
    const startPos = this.camera.position.clone();
    const endPos = new THREE.Vector3(ct.x, ct.y, ct.z);
    let t = 0;
    const dur = 0.7;
    const animCam = () => {
      t += 0.016 / dur;
      if (t > 1) t = 1;
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      this.camera.position.lerpVectors(startPos, endPos, ease);
      if (t < 1) requestAnimationFrame(animCam);
    };
    requestAnimationFrame(animCam);

    this.hideTooltip();
  }

  /* ── TOOLTIP ────────────────────────────────────────────── */
  showTooltip(hs) {
    const tt = document.getElementById('hotspotTooltip');
    document.getElementById('htIcon').textContent  = hs.userData.icon;
    document.getElementById('htTitle').textContent = hs.userData.title;
    document.getElementById('htDesc').textContent  = hs.userData.desc;
    tt.classList.add('visible');
  }
  hideTooltip() {
    document.getElementById('hotspotTooltip')?.classList.remove('visible');
  }

  /* ── TAB INDICATOR ──────────────────────────────────────── */
  updateTabIndicator() {
    const switcher = document.querySelector('.product-switcher');
    const active   = switcher?.querySelector('.prod-tab.active');
    const ind      = switcher?.querySelector('.prod-tab-indicator');
    if (!active || !ind) return;
    ind.style.left  = active.offsetLeft + 'px';
    ind.style.width = active.offsetWidth + 'px';
  }

  /* ── EVENT BINDING ──────────────────────────────────────── */
  bindEvents() {
    /* product tabs */
    document.querySelectorAll('.prod-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.prod-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateTabIndicator();

        const prod = btn.dataset.product;
        this.switchProduct(prod);

        /* info panels */
        document.querySelectorAll('.prod-info-panel').forEach(p => p.classList.remove('active'));
        const info = document.getElementById(`info-${prod}`);
        if (info) {
          info.style.opacity = 0;
          info.style.transform = 'translateY(20px)';
          info.classList.add('active');
          requestAnimationFrame(() => {
            info.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            info.style.opacity = 1;
            info.style.transform = 'translateY(0)';
          });
        }
      });
    });

    /* mouse tracking for hotspot hover */
    this.renderer.domElement.addEventListener('mousemove', e => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      this.controls.autoRotate = false;
    });
    this.renderer.domElement.addEventListener('mouseleave', () => {
      this.mouse.set(-9999, -9999);
      this.controls.autoRotate = true;
      this.hideTooltip();
      this.hoveredHotspot = null;
    });
    this.renderer.domElement.addEventListener('mouseenter', () => {
      this.controls.autoRotate = false;
    });

    /* touch */
    this.renderer.domElement.addEventListener('touchmove', e => {
      const t = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((t.clientX - rect.left) / rect.width)  * 2 - 1;
      this.mouse.y = -((t.clientY - rect.top)  / rect.height) * 2 + 1;
    }, { passive: true });

    /* resize */
    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  /* ── ANIMATE ────────────────────────────────────────────── */
  animate() {
    requestAnimationFrame(() => this.animate());
    const t = this.clock.getElapsedTime();

    /* pulsing hotspots */
    this.hotspots.forEach(h => {
      if (!h.visible) return;
      const { outer, ring } = h.userData;
      outer.material.opacity = 0.18 + 0.14 * Math.sin(t * 3 + h.position.x);
      const s = 1 + 0.22 * Math.sin(t * 2.5 + h.position.y);
      ring.scale.set(s, s, s);
      ring.material.opacity = 0.5 - 0.4 * ((s - 1) / 0.22);
    });

    /* rim light warmth flicker */
    this.rimLight.intensity = 1.1 + 0.15 * Math.sin(t * 0.8);

    /* hotspot raycasting */
    const activeGroup = {
      panel: this.panelGroup, inverter: this.inverterGroup, battery: this.batteryGroup
    }[this.currentProduct];

    const visibleHotspots = this.hotspots.filter(h => h.userData.productType === this.currentProduct);
    const innerMeshes = visibleHotspots.map(h => h.userData.inner);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(innerMeshes);

    if (hits.length > 0) {
      const hitInner = hits[0].object;
      const hs = visibleHotspots.find(h => h.userData.inner === hitInner);
      if (hs && hs !== this.hoveredHotspot) {
        this.hoveredHotspot = hs;
        this.showTooltip(hs);
        this.canvas.style.cursor = 'pointer';
      }
    } else {
      if (this.hoveredHotspot) {
        this.hoveredHotspot = null;
        this.hideTooltip();
        this.canvas.style.cursor = 'grab';
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

/* ── INIT ON DOM READY ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productCanvas')) {
    window._solarViewer = new SolarProductViewer('productCanvas');
  }
});
