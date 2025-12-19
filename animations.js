// Interactive Hero 3D Element - Futuristic Abstract Composition
class Hero3DElement {
    constructor(canvasId) {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mainGroup = null;
        this.centralShape = null;
        this.orbitingShapes = [];
        this.particles = null;
        this.wireframe = null;
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        this.canvasId = canvasId;
        this.time = 0;

        this.init();
        this.bindEvents();
        this.start();
    }

    init() {
        const canvas = document.getElementById(this.canvasId);
        if (!canvas) return;

        const isMobile = window.innerWidth < 768;

        // Scene
        this.scene = new THREE.Scene();

        // Camera - closer for hero element
        this.camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 12);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true, 
            antialias: !isMobile,
            powerPreference: "high-performance"
        });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

        // Create futuristic abstract composition
        this.createAbstractComposition();

        // Create particle system around the object
        this.createParticles();

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0x00d4ff, 0.8);
        directionalLight1.position.set(5, 5, 5);
        this.scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xff00ff, 0.6);
        directionalLight2.position.set(-5, -5, 5);
        this.scene.add(directionalLight2);

        const pointLight = new THREE.PointLight(0x00d4ff, 1.2, 100);
        pointLight.position.set(0, 2, 8);
        this.scene.add(pointLight);

        // Handle resize
        const updateSize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            if (width > 0 && height > 0) {
                this.renderer.setSize(width, height);
                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();
            }
        };

        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(updateSize);
            resizeObserver.observe(canvas);
        } else {
            window.addEventListener('resize', updateSize);
        }
    }

    createAbstractComposition() {
        // Main group to hold all elements
        this.mainGroup = new THREE.Group();

        // Central shape - Octahedron (diamond-like)
        const centralGeometry = new THREE.OctahedronGeometry(1.8, 0);
        const centralMaterial = new THREE.MeshPhongMaterial({
            color: 0x00d4ff,
            emissive: 0x003366,
            shininess: 100,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide
        });
        this.centralShape = new THREE.Mesh(centralGeometry, centralMaterial);
        this.mainGroup.add(this.centralShape);

        // Wireframe overlay for tech aesthetic
        const wireframeGeometry = new THREE.OctahedronGeometry(1.8, 0);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        this.wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        this.mainGroup.add(this.wireframe);

        // Inner glowing core
        const coreGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            transparent: true,
            opacity: 0.7
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.mainGroup.add(core);

        // Orbiting shapes - smaller geometric elements
        const orbitCount = 6;
        const orbitRadius = 2.5;
        
        for (let i = 0; i < orbitCount; i++) {
            const angle = (i / orbitCount) * Math.PI * 2;
            const shapeGroup = new THREE.Group();
            
            // Create a small tetrahedron
            const orbitGeometry = new THREE.TetrahedronGeometry(0.4, 0);
            const orbitMaterial = new THREE.MeshPhongMaterial({
                color: i % 2 === 0 ? 0x00d4ff : 0xff00ff,
                emissive: i % 2 === 0 ? 0x002244 : 0x440022,
                shininess: 80,
                transparent: true,
                opacity: 0.9
            });
            const orbitShape = new THREE.Mesh(orbitGeometry, orbitMaterial);
            shapeGroup.add(orbitShape);

            // Add wireframe to orbiting shapes
            const orbitWireGeometry = new THREE.TetrahedronGeometry(0.4, 0);
            const orbitWireMaterial = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x00d4ff : 0xff00ff,
                wireframe: true,
                transparent: true,
                opacity: 0.5
            });
            const orbitWire = new THREE.Mesh(orbitWireGeometry, orbitWireMaterial);
            shapeGroup.add(orbitWire);

            // Position in orbit
            shapeGroup.position.x = Math.cos(angle) * orbitRadius;
            shapeGroup.position.y = Math.sin(angle * 0.5) * 1.5;
            shapeGroup.position.z = Math.sin(angle) * orbitRadius;
            
            // Store orbit properties
            shapeGroup.userData = {
                angle: angle,
                radius: orbitRadius,
                speed: 0.5 + Math.random() * 0.3,
                verticalSpeed: 0.3 + Math.random() * 0.2
            };
            
            this.orbitingShapes.push(shapeGroup);
            this.mainGroup.add(shapeGroup);
        }

        // Add ring structure around the composition
        const ringGeometry = new THREE.TorusGeometry(2.2, 0.05, 8, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            emissive: 0x00d4ff,
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        this.mainGroup.add(ring);

        // Add second ring rotated differently
        const ring2Geometry = new THREE.TorusGeometry(2.2, 0.05, 8, 32);
        const ring2Material = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            transparent: true,
            opacity: 0.6
        });
        const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
        ring2.rotation.z = Math.PI / 2;
        ring2.rotation.y = Math.PI / 4;
        this.mainGroup.add(ring2);

        // Add to scene
        this.scene.add(this.mainGroup);
    }

    createParticles() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = 3 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Alternate between cyan and magenta colors
            const color = new THREE.Color();
            if (i % 2 === 0) {
                color.setRGB(0, 0.83, 1); // Cyan #00d4ff
            } else {
                color.setRGB(1, 0, 1); // Magenta #ff00ff
            }
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        this.time += 0.01;

        // Animate main composition
        if (this.mainGroup) {
            // Floating animation
            this.mainGroup.position.y = Math.sin(this.time * 0.4) * 0.15;
            
            // Rotation based on mouse and time
            this.mainGroup.rotation.x = Math.sin(this.time * 0.2) * 0.1 + this.mouse.y * 0.3;
            this.mainGroup.rotation.y = this.time * 0.3 + this.mouse.x * 0.5;
            this.mainGroup.rotation.z = Math.sin(this.time * 0.15) * 0.05;
        }

        // Animate central shape
        if (this.centralShape) {
            this.centralShape.rotation.x += 0.005;
            this.centralShape.rotation.y += 0.008;
        }

        // Animate wireframe
        if (this.wireframe) {
            this.wireframe.rotation.x -= 0.003;
            this.wireframe.rotation.y -= 0.005;
        }

        // Animate orbiting shapes
        this.orbitingShapes.forEach((shapeGroup, index) => {
            const userData = shapeGroup.userData;
            if (userData) {
                // Update orbit angle
                userData.angle += userData.speed * 0.01;
                
                // Calculate new position
                const angle = userData.angle;
                const verticalOffset = Math.sin(this.time * userData.verticalSpeed + index) * 1.5;
                
                shapeGroup.position.x = Math.cos(angle) * userData.radius;
                shapeGroup.position.y = verticalOffset;
                shapeGroup.position.z = Math.sin(angle) * userData.radius;
                
                // Rotate the shape itself
                shapeGroup.rotation.x += 0.01;
                shapeGroup.rotation.y += 0.015;
            }
        });

        // Rotate particles
        if (this.particles) {
            this.particles.rotation.x = this.time * 0.08;
            this.particles.rotation.y = this.time * 0.12;
        }

        // Interactive camera movement
        this.camera.position.x += (this.mouse.x * 0.4 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouse.y * 0.4 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }

    bindEvents() {
        const canvas = document.getElementById(this.canvasId);
        if (!canvas) return;

        const onMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            this.mouse.x = (event.clientX - cx) / rect.width;
            this.mouse.y = (event.clientY - cy) / rect.height;
        };

        canvas.addEventListener('mousemove', onMouseMove);

        // Reset on mouse leave
        canvas.addEventListener('mouseleave', () => {
            this.mouse.x = 0;
            this.mouse.y = 0;
        });
    }

    start() {
        this.animate();
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Three.js 3D Background and Animations
class ThreeJSBackground {
    constructor(canvasId) {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        this.windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.canvasId = canvasId;

        this.init();
        // Do not auto-run animation for every canvas to save CPU/GPU.
        this.isActive = false;
        this._boundAnimate = this.animate.bind(this);
        this.bindEvents();
        // Use IntersectionObserver to start/stop animation when section is visible
        try {
            const canvas = document.getElementById(this.canvasId);
            if (canvas && 'IntersectionObserver' in window) {
                this._io = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            // keep main hero active by default
                            if (this.canvasId === 'three-canvas' || entry.intersectionRatio > 0.05) {
                                this.start();
                            }
                        } else {
                            // Stop non-main canvases when off-screen
                            if (this.canvasId !== 'three-canvas') this.stop();
                        }
                    });
                }, { threshold: [0, 0.05, 0.25] });
                this._io.observe(canvas);
            } else {
                // If no IO support, start main immediately
                if (this.canvasId === 'three-canvas') this.start();
            }
        } catch (e) {
            if (this.canvasId === 'three-canvas') this.start();
        }
    }

    init() {
        const canvas = document.getElementById(this.canvasId);
        if (!canvas) return;

        // Check if device is mobile for performance optimization
        const isMobile = window.innerWidth < 768;
        const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 100;

        // Renderer with performance optimizations
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true, 
            antialias: !isMobile && !isLowEnd,
            powerPreference: "high-performance"
        });
        // Ensure transparent background so overlay gradient shows
        this.renderer.setClearColor(0x000000, 0);
        // Size renderer to the canvas' displayed size (parent section)
        const updateRendererSize = () => {
            const width = canvas.clientWidth || window.innerWidth;
            const height = canvas.clientHeight || window.innerHeight;
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        };

    updateRendererSize();
    const isMain = this.canvasId === 'three-canvas';
    // Use lower pixel ratio for non-main canvases to reduce GPU usage
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : (isMain ? 2 : 1.25)));
        
        // Performance settings
        if (isMobile || isLowEnd) {
            this.renderer.shadowMap.enabled = false;
            this.renderer.physicallyCorrectLights = false;
        }

    // Create particles with reduced count on mobile and for non-main canvases
    const isMainCanvas = this.canvasId === 'three-canvas';
    const particleCount = isMainCanvas ? (isMobile ? 75 : 150) : (isMobile ? 20 : 40);
    this.createParticles(particleCount);
        
        // Create floating geometric shapes
        this.createGeometricShapes();

        // If the canvas has no size yet (e.g. not laid out), observe for size changes
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            this._waitingForSize = true;
            if (window.ResizeObserver) {
                this._resizeObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        const w = entry.contentRect.width;
                        const h = entry.contentRect.height;
                        if (w > 0 && h > 0) {
                            updateRendererSize();
                            this._waitingForSize = false;
                            if (this._resizeObserver) {
                                this._resizeObserver.disconnect();
                                this._resizeObserver = null;
                            }
                        }
                    }
                });
                this._resizeObserver.observe(canvas);
            } else {
                // Fallback: try again after a short delay
                const trySize = () => {
                    const r = canvas.getBoundingClientRect();
                    if (r.width > 0 && r.height > 0) {
                        updateRendererSize();
                        this._waitingForSize = false;
                    } else {
                        setTimeout(trySize, 250);
                    }
                };
                trySize();
            }
        }
    }

    createParticles(particleCount = 150) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Create a more organized particle field
            const radius = 120;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Subtle blue gradient
            const color = new THREE.Color();
            const hue = 0.55 + Math.random() * 0.1; // Blue range
            const saturation = 0.3 + Math.random() * 0.2; // Lower saturation
            const lightness = 0.4 + Math.random() * 0.3; // Moderate lightness
            color.setHSL(hue, saturation, lightness);
            
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Vary particle sizes
            sizes[i] = 1 + Math.random() * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createGeometricShapes() {
        // Create subtle floating elements
        this.createFloatingElements();
        this.createGrid();
    }

    createFloatingElements() {
        // Create minimal floating orbs
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.SphereGeometry(0.8, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.6, 0.3, 0.4),
                transparent: true,
                opacity: 0.15,
                wireframe: false
            });
            
            const orb = new THREE.Mesh(geometry, material);
            orb.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80
            );
            
            // Store original position for floating animation
            orb.userData = {
                originalY: orb.position.y,
                speed: 0.5 + Math.random() * 0.5
            };
            
            this.scene.add(orb);
        }

        // Create subtle wireframe cubes
        for (let i = 0; i < 2; i++) {
            const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.55, 0.4, 0.5),
                transparent: true,
                opacity: 0.1,
                wireframe: true
            });
            
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60
            );
            
            cube.userData = {
                rotationSpeed: 0.01 + Math.random() * 0.01
            };
            
            this.scene.add(cube);
        }
    }

    createGrid() {
        // Create a subtle grid pattern
        const gridSize = 100;
        const divisions = 20;
        const gridHelper = new THREE.GridHelper(gridSize, divisions, 0x00d4ff, 0x00d4ff);
        gridHelper.material.opacity = 0.1;
        gridHelper.material.transparent = true;
        gridHelper.position.y = -50;
        this.scene.add(gridHelper);
    }

    animate() {
        if (!this.isActive) return;
        this.animationId = requestAnimationFrame(this._boundAnimate);

        if (!this.scene || !this.camera || !this.renderer) return;

        const time = Date.now() * 0.001;

        // Gentle particle rotation
        if (this.particles) {
            this.particles.rotation.x = time * 0.05;
            this.particles.rotation.y = time * 0.08;
        }

        // Animate floating elements
        this.scene.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
                if (child.geometry.type === 'SphereGeometry' && child.userData.originalY !== undefined) {
                    // Floating orbs
                    child.position.y = child.userData.originalY + Math.sin(time * child.userData.speed) * 2;
                } else if (child.geometry.type === 'BoxGeometry' && child.userData.rotationSpeed) {
                    // Rotating cubes
                    child.rotation.x += child.userData.rotationSpeed;
                    child.rotation.y += child.userData.rotationSpeed * 0.7;
                }
            }
        });

    // Subtle mouse interaction (parallax) per-canvas
    this.camera.position.x += (this.mouse.x * 0.2 - this.camera.position.x) * 0.02;
    this.camera.position.y += (-this.mouse.y * 0.2 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        this._boundAnimate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    bindEvents() {
        // Mouse move
        const canvas = document.getElementById(this.canvasId);
        this._onMouseMove = (event) => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            this.mouse.x = (event.clientX - cx) / rect.width * 2; // normalized -1..1
            this.mouse.y = (event.clientY - cy) / rect.height * 2; // normalized -1..1
        };

        document.addEventListener('mousemove', this._onMouseMove);

        // Window resize -> update renderer size based on canvas
        this._onResize = () => {
            this.windowHalf.x = window.innerWidth / 2;
            this.windowHalf.y = window.innerHeight / 2;
            const canvas = document.getElementById(this.canvasId);
            if (canvas && this.camera && this.renderer) {
                const width = canvas.clientWidth || window.innerWidth;
                const height = canvas.clientHeight || window.innerHeight;
                this.renderer.setSize(width, height);
                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();
            }
        };

        window.addEventListener('resize', this._onResize);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this._onMouseMove) {
            document.removeEventListener('mousemove', this._onMouseMove);
        }
        if (this._onResize) {
            window.removeEventListener('resize', this._onResize);
        }
        if (this.renderer) {
            try {
                this.renderer.dispose();
            } catch (e) {
                // ignore
            }
        }
        // Null out references
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
    }
}

// GSAP Animations
class GSAPAnimations {
    constructor() {
        this.initScrollAnimations();
        this.initHoverAnimations();
    }

    initScrollAnimations() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Hero section animations
        gsap.timeline()
            .from('.hero-title .name', {
                duration: 1,
                y: 100,
                opacity: 0,
                ease: 'power3.out'
            })
            .from('.hero-title .role', {
                duration: 0.8,
                y: 50,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.hero-tagline', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.3')
            .from('.hero-buttons', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            }, '-=0.3');

        // Section titles animation
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power3.out'
            });
        });

        // Service cards animation
        gsap.utils.toArray('.service-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                ease: 'power3.out',
                delay: index * 0.1
            });
        });

        // Project cards animation
        gsap.utils.toArray('.project-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                ease: 'power3.out',
                delay: index * 0.15
            });
        });

        // Certification cards animation
        gsap.utils.toArray('.cert-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 40,
                opacity: 0,
                ease: 'power3.out',
                delay: index * 0.12
            });
        });

        // Events cards animation
        gsap.utils.toArray('.event-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 40,
                opacity: 0,
                ease: 'power3.out',
                delay: index * 0.12
            });
        });

        // Education timeline animation
        gsap.utils.toArray('.education-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                x: -40,
                opacity: 0,
                ease: 'power3.out',
                delay: index * 0.12
            });
        });

        // Timeline items animation
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                x: index % 2 === 0 ? -50 : 50,
                opacity: 0,
                ease: 'power3.out'
            });
        });

        // About section animation
        gsap.from('.about-text', {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            x: -50,
            opacity: 0,
            ease: 'power3.out'
        });

        gsap.from('.about-image', {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            x: 50,
            opacity: 0,
            ease: 'power3.out'
        });

        // Contact form animation
        gsap.from('.contact-form', {
            scrollTrigger: {
                trigger: '.contact-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            x: 50,
            opacity: 0,
            ease: 'power3.out'
        });

        gsap.from('.contact-info', {
            scrollTrigger: {
                trigger: '.contact-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            x: -50,
            opacity: 0,
            ease: 'power3.out'
        });
    }

    initHoverAnimations() {
        // Service card hover effects
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    scale: 1.05,
                    y: -10,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.3,
                    scale: 1,
                    y: 0,
                    ease: 'power2.out'
                });
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    duration: 0.3,
                    scale: 1.05,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    duration: 0.3,
                    scale: 1,
                    ease: 'power2.out'
                });
            });
        });

        // Social link hover effects
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    duration: 0.3,
                    scale: 1.2,
                    rotation: 360,
                    ease: 'power2.out'
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    duration: 0.3,
                    scale: 1,
                    rotation: 0,
                    ease: 'power2.out'
                });
            });
        });

        // Project card hover effects
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    scale: 1.02,
                    y: -5,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.3,
                    scale: 1,
                    y: 0,
                    ease: 'power2.out'
                });
            });
        });

        // Tech tag hover effects
        document.querySelectorAll('.tech-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                gsap.to(tag, {
                    duration: 0.2,
                    scale: 1.1,
                    y: -2,
                    ease: 'power2.out'
                });
            });

            tag.addEventListener('mouseleave', () => {
                gsap.to(tag, {
                    duration: 0.2,
                    scale: 1,
                    y: 0,
                    ease: 'power2.out'
                });
            });
        });
    }
}

// Smooth scrolling utility
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Hero 3D Element
    if (document.getElementById('hero-3d-canvas')) {
        window.hero3D = new Hero3DElement('hero-3d-canvas');
    }

    // Initialize Three.js backgrounds for all relevant canvases
    const canvasIds = [
        'three-canvas',
        'three-canvas-experience',
        'three-canvas-events',
        'three-canvas-projects',
        'three-canvas-contact'
    ];
    window.threeBackgrounds = [];
    canvasIds.forEach(id => {
        if (document.getElementById(id)) {
            window.threeBackgrounds.push(new ThreeJSBackground(id));
        }
    });

    // Initialize GSAP animations
    window.gsapAnimations = new GSAPAnimations();

    // Initialize smooth scrolling
    window.smoothScroll = new SmoothScroll();
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (window.hero3D) {
        window.hero3D.destroy();
    }
    if (window.threeBackgrounds && window.threeBackgrounds.length) {
        window.threeBackgrounds.forEach(bg => bg.destroy());
    }
});
