// AngularJS Portfolio Application
angular.module('portfolioApp', ['ngAnimate'])

    // Main Controller
    .controller('MainController', function($scope, $timeout, PortfolioService) {
        
        // ========================
        // Initialize scope variables
        // ========================
        $scope.isScrolled = false;
        $scope.mobileMenuOpen = false;
        $scope.heroAnimated = false;
        $scope.formSubmitting = false;
        $scope.formData = { name: '', email: '', message: '' };
        
        // Loading screen state - initialize immediately to prevent flash
        $scope.isLoading = true;
        $scope.loadingProgress = 0;
        
        // Ensure loading screen is visible after Angular processes
        $timeout(function() {
            const loadingScreen = document.querySelector('.loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'flex';
            }
        }, 0);

        // ========================
        // Typewriter animation roles
        // ========================
        $scope.roles = [
            "a Web Developer",
            "an Application Developer", 
            "an Ethical Hacker",
            "a UI/UX Designer",
        ];
        $scope.currentRoleIndex = 0;
        $scope.currentText = '';
        $scope.isDeleting = false;

        // ========================
        // Services data
        // ========================
        $scope.services = [
            {
                title: 'Web Development',
                description: 'Custom web applications built with modern technologies',
                icon: 'fas fa-code',
                features: ['React/Angular', 'Node.js', 'MongoDB', 'RESTful APIs'],
                hovered: false
            },
            {
                title: 'UI/UX Design',
                description: 'Beautiful and intuitive user interfaces',
                icon: 'fas fa-palette',
                features: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
                hovered: false
            },
            {
                title: 'Mobile Apps',
                description: 'Cross-platform mobile applications',
                icon: 'fas fa-mobile-alt',
                features: ['Java', 'Flutter', 'iOS/Android', 'App Store'],
                hovered: false
            },
            {
                title: 'Vulnerability Assessments',
                description: 'Identifying and fixing security gaps before they become threats.',
                icon: 'fas fa-user-shield',
                features: ['Penetration Testing', 'Detailed Reporting', 'Compliance Checks', 'Kali Linux'],
                hovered: false
            }
        ];

        // ========================
        // Experience data
        // ========================
        $scope.experience = [
            {
                position: 'Cyber Security Intern',
                company: 'Human Initials',
                duration: 'May 2025 - July 2025',
                description: 'Worked on vulnerability assessment, penetration testing, and implementing security measures to strengthen system protection.',
                skills: ['Kali Linux', 'Web Application Hacking', 'Penetration Testing', 'Vulnerability Assessment'],
                visible: true
            }
        ];

        // ========================
        // Certifications data
        // ========================
        $scope.certifications = [
            {
                title: 'Certified Ethical Hacker (Practical)',
                issuer: 'EC-Council',
                date: 'In Progress',
                description: 'Hands-on training focused on real-world penetration testing, attack vectors, and defensive strategies.',
                link: 'https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/'
            },
            {
                title: 'Google Cybersecurity Professional Certificate',
                issuer: 'Google / Coursera',
                date: '2025',
                description: 'Completed industry-level labs in security operations, incident response, and threat analysis.',
                link: 'https://www.coursera.org/professional-certificates/google-cybersecurity'
            },
            {
                title: 'Introduction to Cyber Security',
                issuer: 'Cisco Networking Academy',
                date: '2024',
                description: 'Covered security fundamentals, common attack surfaces, and best practices for securing networks.',
                link: 'https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity'
            },
            {
                title: 'Java Programming Essentials',
                issuer: 'Udemy',
                date: '2024',
                description: 'Built strong foundations in Java OOP, collections, exception handling, and real-world application patterns.',
                link: 'https://www.udemy.com/courses/search/?q=java%20programming'
            }
        ];

        // ========================
        // Events data
        // ========================
        $scope.events = [
            {
                title: 'Cyber Security Summit - Ahmedabad',
                date: 'March 2025',
                location: 'Ahmedabad, Gujarat',
                image: './Images/event-cyber-summit.jpg',
                description: 'Attended talks and live demos from industry experts on modern attack surfaces, red teaming, and blue team collaboration. It was inspiring to interact with professionals and understand how security is handled at scale.'
            },
            {
                title: 'Hackathon: Secure App Build Challenge',
                date: 'January 2025',
                location: 'Indus University',
                image: './Images/event-hackathon.jpg',
                description: 'Collaborated with a small team to design and build a secure web application under time pressure. I focused on authentication, input validation, and encrypting sensitive data, which gave me hands-on experience with secure-by-design thinking.'
            },
            {
                title: 'Tech Talk: Modern Web & Mobile Development',
                date: 'November 2024',
                location: 'Indus University',
                image: './Images/event-tech-talk.jpg',
                description: 'Joined a series of sessions on frontend architectures, Android patterns, and UI/UX best practices. The event helped me connect my classroom knowledge with real-world development workflows.'
            }
        ];

        // ========================
        // Education data
        // ========================
        $scope.education = [
            {
                degree: 'Bachelor of Technology (Computer Science & Engineering)',
                institution: 'Indus University, Ahmedabad',
                duration: '2023 - Present',
                description: 'Pursuing B.Tech in Computer Science and Engineering with a focus on web development, application security, and modern software engineering practices.'
            },
            {
                degree: 'Higher Secondary Education (Science Stream)',
                institution: 'Ahmedabad, Gujarat',
                duration: '2021 - 2023',
                description: 'Completed higher secondary education with Physics, Chemistry, and Mathematics, building a strong foundation in logical thinking and problem solving.'
            }
        ];

        // ========================
        // Projects data
        // ========================
        $scope.projects = [
            {
                title: 'Chatting Application',
                description: 'A real-time chat application built with Firebase Authentication, enabling secure sign-up/login and seamless group messaging.',
                image: "./Images/ChatApp thumbnail.jpg",
                githubUrl: 'https://github.com/nakul-soni/ChatApp',
                technologies: ['Java', 'Firebase', 'Realtime DB', 'Firebase Auth', 'Android'],
                hovered: false
            },
            {
                title: 'Intrusion Detection System',
                description: 'A network-based IDS that captures and analyzes suspicious packets and scanning attempts, while generating detailed logs.',
                image: './Images/IDS thumbnail.jpg',
                githubUrl: 'https://github.com/nakul-soni/Intrusion-Detection-System',
                technologies: ['Cyber Security', 'Networks', 'Kali Linux', 'Wireshark', 'Python'],
                hovered: false
            },
            {
                title: 'PackPal - Group Logistics Planner',
                description: 'A responsive logistics planner with shared checklists, categorized items, and real-time management.',
                image: './Images/PackPal Thumbnail.jpg',
                liveUrl: 'https://nakul-soni.github.io/PackPal-Groups-Logistics-Planner-/',
                githubUrl: 'https://github.com/nakul-soni/PackPal-Groups-Logistics-Planner-',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Firebase', 'Bootstrap'],
                hovered: false
            }
        ];

        // ========================
        // Skills data
        // ========================
        $scope.skills = [
            { name: 'Frontend', items: ['React', 'Angular', 'TypeScript', 'HTML5', 'CSS3'] },
            { name: 'Backend', items: ['Node.js', 'Express.js', 'Python', 'Java', 'PHP'] },
            { name: 'Database', items: ['MongoDB', 'MySQL', 'Firebase'] },
            { name: 'Tools & Others', items: ['Git', 'Figma', 'WireShark', 'Burpsuite'] }
        ];

        // Skill icon resolver
        const iconFor = function(skillName) {
            const raw = String(skillName || '');
            const normalized = raw.toLowerCase().replace(/\s+|\.|#/g, '');
            const explicitUrls = {
                // Prefer colored Devicon logos for popular tech
                'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
                'angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
                'typescript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
                'html5': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
                'css3': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
                'nodejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
                'expressjs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
                'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
                'java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
                'php': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
                'mongodb': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
                'mysql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
                'firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
                'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
                'figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',

                // Keep local or simple-icons for items not in Devicon
                'kalilinux': 'Images/kali-linux.svg',
                'wireshark': 'https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/wireshark.svg',
                'burpsuite': 'Images/burpsuite.svg'
            };
            if (explicitUrls[normalized]) return explicitUrls[normalized];
            return `https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/${normalized}.svg`;
        };

        $scope.skills = $scope.skills.map(group => ({
            name: group.name,
            items: group.items.map(item => ({ name: item, logo: iconFor(item) }))
        }));

        // ========================
        // Typewriter animation
        // ========================
        $scope.typeWriter = function() {
            const currentRole = $scope.roles[$scope.currentRoleIndex];
            const speed = $scope.isDeleting ? 50 : 100;

            if ($scope.isDeleting) {
                $scope.currentText = currentRole.substring(0, $scope.currentText.length - 1);
            } else {
                $scope.currentText = currentRole.substring(0, $scope.currentText.length + 1);
            }

            if (!$scope.isDeleting && $scope.currentText === currentRole) {
                $timeout(() => { $scope.isDeleting = true; $scope.typeWriter(); }, 2000);
            } else if ($scope.isDeleting && $scope.currentText === '') {
                $scope.isDeleting = false;
                $scope.currentRoleIndex = ($scope.currentRoleIndex + 1) % $scope.roles.length;
                $timeout(() => { $scope.typeWriter(); }, 500);
            } else {
                $timeout(() => { $scope.typeWriter(); }, speed);
            }
        };

        // ========================
        // Animations
        // ========================
        $scope.initAnimations = function() {
            $timeout(() => {
                $scope.heroAnimated = true;
                $timeout(() => { $scope.typeWriter(); }, 1000);
            }, 500);
            $scope.initScrollAnimations();
        };

        $scope.initScrollAnimations = function() {
            const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.classList.contains('timeline-item')) {
                        $scope.$apply(() => {
                            const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                            $scope.experience[index].visible = true;
                        });
                    }
                });
            }, observerOptions);

            $timeout(() => {
                document.querySelectorAll('.timeline-item').forEach(item => observer.observe(item));
            }, 1000);
        };

        // ========================
        // Scroll handling
        // ========================
        $scope.handleScroll = function() {
            $scope.isScrolled = (window.pageYOffset || document.documentElement.scrollTop) > 100;
        };

        $scope.$on('$destroy', function() {
            angular.element(window).off('scroll', $scope.handleScroll);
        });

        angular.element(window).on('scroll', $scope.handleScroll);

        // ========================
        // Navigation
        // ========================
        $scope.scrollToSection = function(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                const offsetTop = element.offsetTop - 70;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
            $scope.mobileMenuOpen = false;
        };

        $scope.toggleMobileMenu = function() {
            $scope.mobileMenuOpen = !$scope.mobileMenuOpen;
        };

        // ========================
        // Contact form submission
        // ========================
        $scope.submitForm = function() {
            if ($scope.contactForm && $scope.contactForm.$valid) {
                $scope.formSubmitting = true;
                
                PortfolioService.submitContactForm($scope.formData)
                    .then(() => {
                        $scope.showNotification('Message sent successfully!', 'success');
                        $scope.formData = { name: '', email: '', message: '' };
                        $scope.contactForm.$setPristine();
                    })
                    .catch(error => {
                        $scope.showNotification('Failed to send message. Please try again.', 'error');
                        console.error('Contact form error:', error);
                    })
                    .finally(() => { $scope.formSubmitting = false; });
            }
        };

        // ========================
        // Notifications
        // ========================
        $scope.showNotification = function(message, type) {
            let container = document.querySelector('.notification-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'notification-container';
                document.body.appendChild(container);
            }

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            container.appendChild(notification);

            $timeout(() => { notification.classList.add('show'); }, 50);
            $timeout(() => {
                notification.classList.remove('show');
                $timeout(() => { container.removeChild(notification); }, 300);
            }, 3200);
        };

        // ========================
        // Loading Screen Logic
        // ========================
        $scope.initLoadingScreen = function() {
            // Simulate loading progress
            const duration = 2000; // 2 seconds total
            const steps = 100;
            const interval = duration / steps;
            let currentStep = 0;

            const progressInterval = setInterval(() => {
                currentStep++;
                $scope.loadingProgress = Math.min(currentStep, 100);
                $scope.$apply();

                if (currentStep >= steps) {
                    clearInterval(progressInterval);
                    // Wait for images and assets to load
                    $timeout(() => {
                        // Check if all critical assets are loaded
                        const images = document.querySelectorAll('img');
                        let loadedImages = 0;
                        const totalImages = images.length;

                        if (totalImages === 0) {
                            $scope.finishLoading();
                            return;
                        }

                        images.forEach(img => {
                            if (img.complete) {
                                loadedImages++;
                            } else {
                                img.onload = () => {
                                    loadedImages++;
                                    if (loadedImages === totalImages) {
                                        $scope.finishLoading();
                                    }
                                };
                                img.onerror = () => {
                                    loadedImages++;
                                    if (loadedImages === totalImages) {
                                        $scope.finishLoading();
                                    }
                                };
                            }
                        });

                        // Fallback timeout if images take too long
                        $timeout(() => {
                            $scope.finishLoading();
                        }, 3000);
                    }, 300);
                }
            }, interval);
        };

        $scope.finishLoading = function() {
            $scope.loadingProgress = 100;
            $scope.$apply();
            
            // Wait a moment to show 100%, then start fade-out
            $timeout(() => {
                // Trigger fade-out class
                $scope.isLoading = false;
                $scope.$apply();
                
                // Wait for fade-out animation to complete, then start main animations
                $timeout(() => {
                    $scope.initAnimations();
                }, 900); // Wait for fade-out transition (800ms) + small buffer
            }, 300); // Brief pause at 100%
        };

        // ========================
        // Init
        // ========================
        // Start loading screen on page load
        $timeout(() => {
            $scope.initLoadingScreen();
        }, 100);
    })

    // ========================
    // Backend Service
    // ========================
    .constant('API_CONFIG', {
        backendURL: '/api/contact'
    })
    .service('PortfolioService', function($http, API_CONFIG) {
        return {
            submitContactForm: function(formData) {
                return $http.post(API_CONFIG.backendURL, formData)
                    .then(response => response.data)
                    .catch(error => { throw error; });
            }
        };
    })

    // ========================
    // Scroll Animation Directive
    // ========================
    .directive('scrollAnimation', function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate');
                        }
                    });
                }, { threshold: 0.1 });
                observer.observe(element[0]);
            }
        };
    });
