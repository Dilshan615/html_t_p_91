// Interactive Three.js 3D Scene for Portfolio Hero
(function () {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group for all rotating objects
  const sceneGroup = new THREE.Group();
  scene.add(sceneGroup);

  // 1. Centerpiece: Holographic Torus Knot
  const knotGeometry = new THREE.TorusKnotGeometry(1.6, 0.45, 128, 32, 2, 3);
  const knotMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.85,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x005577,
    emissiveIntensity: 0.4,
  });
  const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
  sceneGroup.add(torusKnot);

  // 2. Inner Glowing Icosahedron Core
  const coreGeometry = new THREE.IcosahedronGeometry(0.9, 1);
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    wireframe: false,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x7e22ce,
    emissiveIntensity: 0.6,
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  sceneGroup.add(coreMesh);

  // 3. Surrounding Cyber Rings
  const ringGeom = new THREE.RingGeometry(2.6, 2.64, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4,
  });
  const cyberRing1 = new THREE.Mesh(ringGeom, ringMat);
  cyberRing1.rotation.x = Math.PI / 2.5;
  sceneGroup.add(cyberRing1);

  const ringGeom2 = new THREE.RingGeometry(3.1, 3.14, 64);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0xec4899,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });
  const cyberRing2 = new THREE.Mesh(ringGeom2, ringMat2);
  cyberRing2.rotation.y = Math.PI / 3;
  sceneGroup.add(cyberRing2);

  // 4. Floating Orbiting Satellites (Low-poly crystals)
  const satellites = [];
  const satelliteGeom = new THREE.OctahedronGeometry(0.18, 0);
  const satelliteColors = [0x00f0ff, 0xa855f7, 0xec4899, 0x38bdf8];

  for (let i = 0; i < 8; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: satelliteColors[i % satelliteColors.length],
      emissive: satelliteColors[i % satelliteColors.length],
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.8,
    });
    const sat = new THREE.Mesh(satelliteGeom, mat);
    const angle = (i / 8) * Math.PI * 2;
    const distance = 3.6 + (i % 3) * 0.4;
    sat.position.set(Math.cos(angle) * distance, (Math.random() - 0.5) * 2, Math.sin(angle) * distance);
    sat.userData = { angle, distance, speed: 0.008 + (i % 4) * 0.003, yOffset: sat.position.y };
    satellites.push(sat);
    sceneGroup.add(sat);
  }

  // 5. Starfield / Floating Particle Cloud
  const particleCount = 1000;
  const particlePositions = new Float32Array(particleCount * 3);
  const originalPositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);
  const particleVelocities = new Float32Array(particleCount * 3);

  let themeColor1 = new THREE.Color(0x00f0ff);
  let themeColor2 = new THREE.Color(0xa855f7);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const x = (Math.random() - 0.5) * 22;
    const y = (Math.random() - 0.5) * 22;
    const z = (Math.random() - 0.5) * 18;

    particlePositions[i] = x;
    particlePositions[i + 1] = y;
    particlePositions[i + 2] = z;

    originalPositions[i] = x;
    originalPositions[i + 1] = y;
    originalPositions[i + 2] = z;

    particleVelocities[i] = 0;
    particleVelocities[i + 1] = 0;
    particleVelocities[i + 2] = 0;

    const mixedColor = themeColor1.clone().lerp(themeColor2, Math.random());
    particleColors[i] = mixedColor.r;
    particleColors[i + 1] = mixedColor.g;
    particleColors[i + 2] = mixedColor.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.048,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // 6. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const pointLightCyan = new THREE.PointLight(0x00f0ff, 2.5, 50);
  pointLightCyan.position.set(5, 5, 5);
  scene.add(pointLightCyan);

  const pointLightPurple = new THREE.PointLight(0xa855f7, 2.5, 50);
  pointLightPurple.position.set(-5, -5, -2);
  scene.add(pointLightPurple);

  // Interactive Particle Burst Trigger
  window.triggerParticleBurst = function () {
    for (let i = 0; i < particleCount * 3; i += 3) {
      particleVelocities[i] = (Math.random() - 0.5) * 0.35;
      particleVelocities[i + 1] = (Math.random() - 0.5) * 0.35;
      particleVelocities[i + 2] = (Math.random() - 0.5) * 0.35;
    }
  };

  // Color Palette Switcher API
  window.set3DTheme = function (theme) {
    if (theme === 'purple') {
      knotMaterial.color.setHex(0xc084fc);
      knotMaterial.emissive.setHex(0x581c87);
      coreMaterial.color.setHex(0xf43f5e);
      coreMaterial.emissive.setHex(0x9f1239);
      pointLightCyan.color.setHex(0xc084fc);
      pointLightPurple.color.setHex(0xf43f5e);
      themeColor1 = new THREE.Color(0xc084fc);
      themeColor2 = new THREE.Color(0xf43f5e);
    } else if (theme === 'emerald') {
      knotMaterial.color.setHex(0x10b981);
      knotMaterial.emissive.setHex(0x064e3b);
      coreMaterial.color.setHex(0x06b6d4);
      coreMaterial.emissive.setHex(0x0e7490);
      pointLightCyan.color.setHex(0x10b981);
      pointLightPurple.color.setHex(0x06b6d4);
      themeColor1 = new THREE.Color(0x10b981);
      themeColor2 = new THREE.Color(0x06b6d4);
    } else {
      // Default Cyan
      knotMaterial.color.setHex(0x00f0ff);
      knotMaterial.emissive.setHex(0x005577);
      coreMaterial.color.setHex(0xa855f7);
      coreMaterial.emissive.setHex(0x7e22ce);
      pointLightCyan.color.setHex(0x00f0ff);
      pointLightPurple.color.setHex(0xa855f7);
      themeColor1 = new THREE.Color(0x00f0ff);
      themeColor2 = new THREE.Color(0xa855f7);
    }

    // Refresh particle colors
    const colors = particleGeometry.attributes.color.array;
    for (let i = 0; i < particleCount * 3; i += 3) {
      const mixed = themeColor1.clone().lerp(themeColor2, Math.random());
      colors[i] = mixed.r;
      colors[i + 1] = mixed.g;
      colors[i + 2] = mixed.b;
    }
    particleGeometry.attributes.color.needsUpdate = true;
    window.triggerParticleBurst();
  };

  // Click on canvas to burst particles
  container.addEventListener('click', () => {
    window.triggerParticleBurst();
  });

  // Mouse Parallax Effect
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.0008;
    mouseY = (event.clientY - windowHalfY) * 0.0008;
  });

  // Scroll reaction
  let scrollProgress = 0;
  window.addEventListener('scroll', () => {
    scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  });

  // Responsive Resize
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth camera mouse follow (lerp)
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    sceneGroup.rotation.y = elapsedTime * 0.35 + targetX * 1.5;
    sceneGroup.rotation.x = targetY * 1.5;

    // Centerpiece rotation
    torusKnot.rotation.x = elapsedTime * 0.2;
    torusKnot.rotation.y = elapsedTime * 0.25;

    coreMesh.rotation.x = -elapsedTime * 0.4;
    coreMesh.rotation.y = -elapsedTime * 0.3;

    cyberRing1.rotation.z = elapsedTime * 0.15;
    cyberRing2.rotation.z = -elapsedTime * 0.18;

    // Satellites orbital motion
    satellites.forEach((sat) => {
      sat.userData.angle += sat.userData.speed;
      sat.position.x = Math.cos(sat.userData.angle) * sat.userData.distance;
      sat.position.z = Math.sin(sat.userData.angle) * sat.userData.distance;
      sat.position.y = sat.userData.yOffset + Math.sin(elapsedTime * 1.8 + sat.userData.angle) * 0.3;
      sat.rotation.x += 0.02;
      sat.rotation.y += 0.03;
    });

    // Particle field physics & burst restoration
    const pos = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] += particleVelocities[i];
      pos[i + 1] += particleVelocities[i + 1];
      pos[i + 2] += particleVelocities[i + 2];

      // Smoothly dampen velocity
      particleVelocities[i] *= 0.92;
      particleVelocities[i + 1] *= 0.92;
      particleVelocities[i + 2] *= 0.92;

      // Gently pull back toward original position
      pos[i] += (originalPositions[i] - pos[i]) * 0.03;
      pos[i + 1] += (originalPositions[i + 1] - pos[i + 1]) * 0.03;
      pos[i + 2] += (originalPositions[i + 2] - pos[i + 2]) * 0.03;
    }
    particleGeometry.attributes.position.needsUpdate = true;

    particleSystem.rotation.y = -elapsedTime * 0.04;
    particleSystem.rotation.x = elapsedTime * 0.02;

    // React to scroll: subtly shift scale and vertical position
    sceneGroup.position.y = -scrollProgress * 2.5;
    sceneGroup.scale.setScalar(1 - scrollProgress * 0.2);

    renderer.render(scene, camera);
  }

  animate();
})();
