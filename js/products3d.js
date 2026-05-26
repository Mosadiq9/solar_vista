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

  // Fallback Procedural Generators (Much Higher Quality)
  function buildProceduralPanel() {
    const group = new THREE.Group();
    // Frame
    const frameGeo = new THREE.BoxGeometry(3, 2, 0.08);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.2 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.castShadow = true;
    group.add(frame);

    // Glass
    const glassGeo = new THREE.BoxGeometry(2.9, 1.9, 0.09);
    const glassMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x050a1f, metalness: 0.1, roughness: 0.05, 
      clearcoat: 1.0, clearcoatRoughness: 0.02, transmission: 0.1
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    group.add(glass);

    // Grid lines for realism
    const gridMat = new THREE.LineBasicMaterial({ color: 0xdddddd, transparent: true, opacity: 0.1 });
    for(let i=1; i<6; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.45, 1 - (2/6)*i, 0.046), new THREE.Vector3(1.45, 1 - (2/6)*i, 0.046)]);
      group.add(new THREE.Line(geo, gridMat));
    }
    for(let i=1; i<10; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.45 + (2.9/10)*i, -0.95, 0.046), new THREE.Vector3(-1.45 + (2.9/10)*i, 0.95, 0.046)]);
      group.add(new THREE.Line(geo, gridMat));
    }

    const l1 = createLabel('Anti-reflective Glass', new THREE.Vector3(0, 0, 0.2));
    if(l1) group.add(l1);
    group.rotation.x = -Math.PI / 4;
    return group;
  }

  function buildProceduralInverter() {
    const group = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(1.2, 1.6, 0.35);
    const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.3, roughness: 0.4, clearcoat: 0.5 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    group.add(body);

    const screenGeo = new THREE.BoxGeometry(0.5, 0.3, 0.37);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x0a2a3a, roughness: 0.2 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.2, 0);
    group.add(screen);

    const l1 = createLabel('Hybrid Smart Hub', new THREE.Vector3(0, 0.8, 0.2));
    if(l1) group.add(l1);
    group.position.y = -0.2;
    return group;
  }

  function buildProceduralBattery() {
    const group = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(1.4, 2.0, 0.4);
    const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.6, roughness: 0.5, clearcoat: 0.8 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    group.add(body);

    const ledGeo = new THREE.BoxGeometry(0.05, 0.8, 0.42);
    const ledMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 2.0 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, 0, 0);
    group.add(led);

    const l1 = createLabel('13.5kWh Capacity', new THREE.Vector3(0, 1.0, 0.2));
    if(l1) group.add(l1);
    group.position.y = -0.2;
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
