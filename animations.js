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
    // Initialize Three.js backgrounds for all relevant canvases
    const canvasIds = [
        'three-canvas',
        'three-canvas-experience',
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
    if (window.threeBackgrounds && window.threeBackgrounds.length) {
        window.threeBackgrounds.forEach(bg => bg.destroy());
    }
});
