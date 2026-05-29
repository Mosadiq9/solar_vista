document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('product-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Setup Scene
  const scene = new THREE.Scene();
  
  // Setup Camera
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(2, 2, 4);

  // Setup Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  // Photorealistic Environment Lighting
  if (typeof THREE.RoomEnvironment !== 'undefined') {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
  }

  // Setup CSS2DRenderer for labels
  let labelRenderer;
  if (typeof THREE.CSS2DRenderer !== 'undefined') {
    labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(container.clientWidth, container.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);
  }

  // Controls
  let controls;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controls.enablePan = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 6;
    controls.maxPolarAngle = Math.PI * 0.65;
    controls.minPolarAngle = Math.PI * 0.2;
  }

  // Lighting Fallbacks (if environment map fails)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(5, 5, 2);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  scene.add(dirLight);

  // Loaders
  const gltfLoader = typeof THREE.GLTFLoader !== 'undefined' ? new THREE.GLTFLoader() : null;

  // --- Helper to create Hotspots ---
  function createLabel(text, position) {
    if (typeof THREE.CSS2DObject === 'undefined') return null;
    const div = document.createElement('div');
    div.className = 'hotspot-label';
    div.textContent = text;
    const label = new THREE.CSS2DObject(div);
    label.position.copy(position);
    return label;
  }

  // Fallback Procedural Generators (Hyper-Realistic, Photorealistic Models)
  function buildProceduralPanel() {
    const group = new THREE.Group();

    // 1. Black Anodized Aluminum Outer Frame (Beveled Outer Border)
    const frameColor = 0x111111;
    const frameMetal = 0.9;
    const frameRough = 0.25;
    const frameMat = new THREE.MeshStandardMaterial({ color: frameColor, metalness: frameMetal, roughness: frameRough });

    // Top & Bottom struts
    const horizontalGeo = new THREE.BoxGeometry(3.08, 0.06, 0.09);
    const topFrame = new THREE.Mesh(horizontalGeo, frameMat);
    topFrame.position.set(0, 1.03, 0);
    topFrame.castShadow = true;
    group.add(topFrame);

    const bottomFrame = topFrame.clone();
    bottomFrame.position.set(0, -1.03, 0);
    group.add(bottomFrame);

    // Left & Right struts
    const verticalGeo = new THREE.BoxGeometry(0.06, 2.12, 0.09);
    const leftFrame = new THREE.Mesh(verticalGeo, frameMat);
    leftFrame.position.set(-1.54, 0, 0);
    leftFrame.castShadow = true;
    group.add(leftFrame);

    const rightFrame = leftFrame.clone();
    rightFrame.position.set(1.54, 0, 0);
    group.add(rightFrame);

    // 2. Solar Backsheet Layer (Background behind cells)
    const backsheetGeo = new THREE.BoxGeometry(3.0, 2.0, 0.02);
    const backsheetMat = new THREE.MeshStandardMaterial({ color: 0x0c0e14, roughness: 0.9 });
    const backsheet = new THREE.Mesh(backsheetGeo, backsheetMat);
    backsheet.position.set(0, 0, -0.015);
    backsheet.receiveShadow = true;
    group.add(backsheet);

    // 3. Grid of 72 Monocrystalline Silicon Cells (6 columns, 12 rows)
    const cellWidth = 0.44;
    const cellHeight = 0.145;
    const cellGeo = new THREE.BoxGeometry(cellWidth, cellHeight, 0.005);
    
    // Deep blue/black crystalline silicon material with rich sheen
    const cellMat = new THREE.MeshStandardMaterial({
      color: 0x060c1d,
      metalness: 0.95,
      roughness: 0.12,
      bumpScale: 0.02
    });

    const startX = -1.5 + (0.5 * cellWidth) + 0.03;
    const startY = 1.0 - (0.5 * cellHeight) - 0.035;
    const gapX = 0.485;
    const gapY = 0.162;

    for (let c = 0; c < 6; c++) {
      for (let r = 0; r < 12; r++) {
        const cell = new THREE.Mesh(cellGeo, cellMat);
        cell.position.set(startX + (c * gapX), startY - (r * gapY), 0.005);
        cell.castShadow = true;
        group.add(cell);
        
        // Add tiny silver busbar grid lines crossing individual cells
        const wireGeo = new THREE.BoxGeometry(0.003, cellHeight + 0.005, 0.002);
        const wireMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 1.0, roughness: 0.1 });
        
        const w1 = new THREE.Mesh(wireGeo, wireMat);
        w1.position.set(cell.position.x - 0.11, cell.position.y, 0.008);
        group.add(w1);

        const w2 = w1.clone();
        w2.position.set(cell.position.x + 0.11, cell.position.y, 0.008);
        group.add(w2);
      }
    }

    // 4. Photovoltaic Anti-Reflective Front Glass Cover
    const glassGeo = new THREE.BoxGeometry(3.0, 2.0, 0.02);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e3a8a,      // Anti-reflective blue tint
      transparent: true,
      opacity: 0.28,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.92,
      ior: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, 0, 0.015);
    group.add(glass);

    // 5. Junction Box & Sticker on the Rear
    const jBoxGeo = new THREE.BoxGeometry(0.3, 0.2, 0.08);
    const jBoxMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const jBox = new THREE.Mesh(jBoxGeo, jBoxMat);
    jBox.position.set(0, 0.5, -0.05);
    group.add(jBox);

    const label = createLabel('SunPower Maxeon 6 PV Module', new THREE.Vector3(0, 0, 0.08));
    if (label) group.add(label);

    group.rotation.x = -Math.PI / 4;
    return group;
  }

  function buildProceduralInverter() {
    const group = new THREE.Group();

    // 1. Main Premium Chassis with Curved Backing
    const bodyGeo = new THREE.BoxGeometry(1.2, 1.6, 0.32);
    // Matte premium silver-white metallic alloy
    const bodyMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xf3f4f6, 
      metalness: 0.55, 
      roughness: 0.38, 
      clearcoat: 0.4, 
      clearcoatRoughness: 0.1 
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // 2. Rear Heavy Duty Aluminum Cooling Fins (Dark Grey Plates)
    const finMat = new THREE.MeshStandardMaterial({ color: 0x262626, metalness: 0.85, roughness: 0.5 });
    for (let i = 0; i < 9; i++) {
      const finGeo = new THREE.BoxGeometry(0.02, 1.5, 0.12);
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(-0.52 + (i * 0.13), 0, -0.21);
      group.add(fin);
    }

    // 3. Black Premium Glass User-Interface Screen
    const screenGeo = new THREE.BoxGeometry(0.7, 0.45, 0.015);
    const screenMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x09090b, 
      metalness: 0.9, 
      roughness: 0.03, 
      clearcoat: 1.0, 
      clearcoatRoughness: 0.02 
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.32, 0.165);
    group.add(screen);

    // 4. Interactive Live System Chart (Inside the screen display)
    // Draw columns to look like a live OLED power generation curve
    const barValues = [0.15, 0.25, 0.32, 0.42, 0.38, 0.28, 0.12];
    const displayMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    barValues.forEach((val, idx) => {
      const barGeo = new THREE.BoxGeometry(0.04, val, 0.002);
      const bar = new THREE.Mesh(barGeo, displayMat);
      bar.position.set(-0.2 + (idx * 0.066), 0.32 - (0.5 * (0.45 - val)) + 0.15, 0.174);
      group.add(bar);
    });

    // 5. Glowing Emissive Status LED Indicators
    const ledRadius = 0.018;
    const ledGeo = new THREE.SphereGeometry(ledRadius, 16, 16);
    
    // LED 1: Active Power (Glowing Green)
    const ledGreenMat = new THREE.MeshStandardMaterial({ 
      color: 0x10b981, 
      emissive: 0x10b981, 
      emissiveIntensity: 2.2 
    });
    const ledPower = new THREE.Mesh(ledGeo, ledGreenMat);
    ledPower.position.set(-0.25, -0.15, 0.168);
    group.add(ledPower);

    // LED 2: Comm Status (Glowing Cyan-Blue)
    const ledBlueMat = new THREE.MeshStandardMaterial({ 
      color: 0x06b6d4, 
      emissive: 0x06b6d4, 
      emissiveIntensity: 1.8 
    });
    const ledComm = new THREE.Mesh(ledGeo, ledBlueMat);
    ledComm.position.set(-0.15, -0.15, 0.168);
    group.add(ledComm);

    // LED 3: Grid State (Glowing Green)
    const ledGrid = ledPower.clone();
    ledGrid.position.set(-0.05, -0.15, 0.168);
    group.add(ledGrid);

    // 6. Heavy Duty Red Safety Isolator Rotary Switch on the right side
    const isolatorBaseGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 32);
    const isolatorBaseMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 });
    const isolatorBase = new THREE.Mesh(isolatorBaseGeo, isolatorBaseMat);
    isolatorBase.rotation.z = Math.PI / 2;
    isolatorBase.position.set(0.61, -0.3, 0);
    group.add(isolatorBase);

    const knobGeo = new THREE.BoxGeometry(0.05, 0.14, 0.06);
    const knobMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.2, roughness: 0.4 });
    const knob = new THREE.Mesh(knobGeo, knobMat);
    knob.position.set(0.64, -0.3, 0);
    knob.rotation.x = Math.PI / 6; // Angled status
    group.add(knob);

    // 7. Metallic Connection Port Ducts on the Bottom
    const ductMat = new THREE.MeshStandardMaterial({ color: 0x737373, metalness: 0.9, roughness: 0.2 });
    for (let i = 0; i < 3; i++) {
      const ductGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.12, 16);
      const duct = new THREE.Mesh(ductGeo, ductMat);
      duct.position.set(-0.35 + (i * 0.35), -0.85, 0);
      group.add(duct);
    }

    const label = createLabel('SolarEdge Hybrid Inverter Hub', new THREE.Vector3(0, 0.88, 0.2));
    if (label) group.add(label);

    group.position.y = -0.1;
    return group;
  }

  function buildProceduralBattery() {
    const group = new THREE.Group();

    // 1. Sleek Monolithic Face Shell (Matte Designer White)
    const shellGeo = new THREE.BoxGeometry(1.36, 1.96, 0.32);
    const shellMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xfbfbfb, 
      metalness: 0.2, 
      roughness: 0.45, 
      clearcoat: 0.35, 
      clearcoatRoughness: 0.08 
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.castShadow = true;
    shell.receiveShadow = true;
    group.add(shell);

    // 2. Dark Contrasting Metallic Side Armor Panels
    const sideArmorMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.85, roughness: 0.25 });
    
    const leftArmorGeo = new THREE.BoxGeometry(0.03, 1.96, 0.326);
    const leftArmor = new THREE.Mesh(leftArmorGeo, sideArmorMat);
    leftArmor.position.set(-0.685, 0, 0);
    leftArmor.castShadow = true;
    group.add(leftArmor);

    const rightArmor = leftArmor.clone();
    rightArmor.position.set(0.685, 0, 0);
    group.add(rightArmor);

    // 3. Iconic Glowing Pulse status LED Light Bar (Split LED Segment Design)
    const segmentCount = 10;
    const segmentHeight = 0.09;
    const segmentGap = 0.015;
    const startSegmentY = -0.55;

    const ledOnMat = new THREE.MeshStandardMaterial({ 
      color: 0x10b981, 
      emissive: 0x10b981, 
      emissiveIntensity: 2.5 
    });
    const ledOffMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 });

    for (let i = 0; i < segmentCount; i++) {
      const segGeo = new THREE.BoxGeometry(0.024, segmentHeight, 0.005);
      // Charge level animation (80% full, top two bars off)
      const isActive = i < 8;
      const seg = new THREE.Mesh(segGeo, isActive ? ledOnMat : ledOffMat);
      seg.position.set(0, startSegmentY + (i * (segmentHeight + segmentGap)), 0.163);
      group.add(seg);
    }

    // 4. Side Power Switch with Circular Emissive Green Light Ring
    const switchBaseGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.01, 32);
    const switchBaseMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    const switchBase = new THREE.Mesh(switchBaseGeo, switchBaseMat);
    switchBase.rotation.z = Math.PI / 2;
    switchBase.position.set(0.702, 0.4, 0.05);
    group.add(switchBase);

    const lightRingGeo = new THREE.RingGeometry(0.024, 0.03, 32);
    const lightRingMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide });
    const lightRing = new THREE.Mesh(lightRingGeo, lightRingMat);
    lightRing.rotation.y = Math.PI / 2;
    lightRing.position.set(0.708, 0.4, 0.05);
    group.add(lightRing);

    // 5. Heavy Duty Wall-Mount Backplate Bracket
    const bracketGeo = new THREE.BoxGeometry(1.18, 0.2, 0.08);
    const bracketMat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.8, roughness: 0.3 });
    const bracket = new THREE.Mesh(bracketGeo, bracketMat);
    bracket.position.set(0, 0.75, -0.2);
    group.add(bracket);

    const label = createLabel('Tesla Powerwall 3 Storage', new THREE.Vector3(0, 1.15, 0.2));
    if (label) group.add(label);

    group.position.y = -0.1;
    return group;
  }

  // --- Fetch Data ---
  let products = [];
  const models = {};
  let currentModelId = null;

  try {
    if (window.supabaseClient) {
      const { data, error } = await window.supabaseClient.from('products').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        products = data;
      }
    }
  } catch (err) { console.error('Error fetching products:', err); }

  // Fallback if no database products
  if (products.length === 0) {
    products = [
      { id: '1', name: 'SolarVista Pro Panel', category: 'panel', icon: 'sun', specs: [{value: '440W', label: 'Output'}], features: ['PERC Cells'], description: 'High-efficiency solar panel.' },
      { id: '2', name: 'Smart Inverter', category: 'inverter', icon: 'cpu', specs: [{value: '10kW', label: 'Capacity'}], features: ['Dual MPPT'], description: 'Hybrid smart inverter.' },
      { id: '3', name: 'PowerVault Battery', category: 'battery', icon: 'battery-charging', specs: [{value: '13.5kWh', label: 'Capacity'}], features: ['LiFePO4 Cells'], description: 'Home energy storage.' }
    ];
  }

  // Build UI Tabs
  const tabsContainer = document.querySelector('.products-tabs');
  if (tabsContainer) {
    tabsContainer.innerHTML = '';
    products.forEach((p, index) => {
      const btn = document.createElement('button');
      btn.className = `product-tab ${index === 0 ? 'active' : ''}`;
      btn.dataset.id = p.id;
      btn.innerHTML = `<i data-lucide="${p.icon || 'box'}"></i> ${p.name.split(' ')[0]} ${p.category}`;
      tabsContainer.appendChild(btn);
    });
    if (window.lucide) window.lucide.createIcons({ root: tabsContainer });
  }

  // Load Models into Scene
  const loadingManager = new THREE.LoadingManager();
  
  products.forEach(p => {
    if (p.model_url && gltfLoader) {
      // Create a placeholder group while loading
      models[p.id] = new THREE.Group();
      gltfLoader.load(p.model_url, (gltf) => {
        const model = gltf.scene;
        // Center and scale model roughly
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.0 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        models[p.id].add(model);
      });
    } else {
      // Procedural Fallback
      if(p.category.includes('inverter')) models[p.id] = buildProceduralInverter();
      else if(p.category.includes('battery')) models[p.id] = buildProceduralBattery();
      else models[p.id] = buildProceduralPanel();
    }
  });

  // Init first model
  currentModelId = products[0].id;
  scene.add(models[currentModelId]);

  // Tab Switching Logic
  const tabs = document.querySelectorAll('.product-tab');
  const infoPanel = document.getElementById('product-info');

  function updateInfoPanel(p) {
    if (!infoPanel) return;
    
    let specsHtml = '';
    let featuresHtml = '';
    
    try {
      const specs = typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs;
      if (Array.isArray(specs)) {
        specs.forEach(s => {
          specsHtml += `<div class="spec-item"><div class="spec-value">${s.value}</div><div class="spec-label">${s.label}</div></div>`;
        });
      }
      const features = typeof p.features === 'string' ? JSON.parse(p.features) : p.features;
      if (Array.isArray(features)) {
        features.forEach(f => {
          featuresHtml += `<div class="feature-item"><i data-lucide="check-circle"></i><span>${f}</span></div>`;
        });
      }
    } catch(e) {}

    const html = `
      <h3 class="product-name">${p.name}</h3>
      <p class="product-description">${p.description}</p>
      <div class="product-specs">${specsHtml}</div>
      <div class="product-features">${featuresHtml}</div>
      <a href="products.html" class="btn btn-secondary" style="margin-right:12px;">View All Products</a>
      <a href="#contact" class="btn btn-primary">Request Quote <i data-lucide="arrow-right"></i></a>
    `;
    
    if (typeof gsap !== 'undefined') {
      gsap.to(infoPanel, {
        opacity: 0, x: 20, duration: 0.3,
        onComplete: () => {
          infoPanel.innerHTML = html;
          if (typeof lucide !== 'undefined') lucide.createIcons();
          gsap.to(infoPanel, { opacity: 1, x: 0, duration: 0.4 });
        }
      });
    } else {
      infoPanel.innerHTML = html;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

  // Init panel
  updateInfoPanel(products[0]);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.dataset.id;
      if (targetId === currentModelId) return;

      scene.remove(models[currentModelId]);
      scene.add(models[targetId]);
      currentModelId = targetId;

      if (typeof gsap !== 'undefined') {
        gsap.to(camera.position, { x: 2, y: 2, z: 4, duration: 1, ease: "power2.inOut" });
      } else {
        camera.position.set(2, 2, 4);
      }
      if (controls) controls.target.set(0,0,0);

      const prod = products.find(p => p.id === targetId);
      updateInfoPanel(prod);
    });
  });

  // Animation Loop
  let animationId;
  let isVisible = true;

  function animate() {
    if (isVisible) { animationId = requestAnimationFrame(animate); }
    if (controls) controls.update();
    renderer.render(scene, camera);
    if (labelRenderer) labelRenderer.render(scene, camera);
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) { if (!animationId) animate(); } 
      else { if (animationId) { cancelAnimationFrame(animationId); animationId = null; } }
    });
  });
  
  const productsSection = document.getElementById('products');
  if (productsSection) observer.observe(productsSection);

  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    if (labelRenderer) labelRenderer.setSize(container.clientWidth, container.clientHeight);
  });
});
