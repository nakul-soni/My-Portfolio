// AngularJS Portfolio Application
angular.module('portfolioApp', ['ngAnimate'])
    .controller('MainController', function($scope, $timeout, $http, PortfolioService) {
        
        // Initialize scope variables
        $scope.isScrolled = false;
        $scope.mobileMenuOpen = false;
        $scope.heroAnimated = false;
        $scope.formSubmitting = false;
        $scope.formData = {
            name: '',
            email: '',
            message: ''
        };

        // Typewriter animation roles
        $scope.roles = [
            "a Web Developer",
            "an Application Developer", 
            "an Ethical Hacker",
            "a UI/UX Designer",
        ];
        $scope.currentRoleIndex = 0;
        $scope.currentText = '';
        $scope.isDeleting = false;

        // Services data
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
                title: 'Vulnerability Assesments',
                description: 'Identifying and fixing security gaps before they become threats.',
                icon: 'fa-solid fa-user-shield',
                features: ['Penetration Testing', 'Detailed Reporting', 'Compliance Checks', 'Kali Linux'],
                hovered: false
            }
        ];

        // Experience data
        $scope.experience = [
            {
                position: 'Computer Science and Engineering Student',
                company: 'Indus University Ahmedabad',
                duration: '2023 - Present',
                description: 'Built strong foundations in programming, software development, and cybersecurity through academic learning and hands-on projects.',
                skills: ['Data Structures & Algorithms', 'Object-Oriented Programming (OOP)', 'Database Management (SQL & NoSQL)', 'OS & Computer Networks', 'Java, Python, C/C++'],
                visible: true
            },
            {
                position: 'Cyber Security Intern',
                company: 'Human Initials',
                duration: 'May 2025 - July 2025',
                description: 'Worked on vulnerability assessment, penetration testing, and implementing security measures to strengthen system protection.',
                skills: ['Kali Linux', 'Web Application Hacking', 'Penetration Testing', 'Vulnerability Assessment'],
                visible: true
            }
        ];

        // Projects data
        $scope.projects = [
            {
                title: 'Chatting Application',
                description: 'A real-time chat application built with Firebase Authentication, enabling secure sign-up/login and seamless group messaging with instant data synchronization.',
                image: './Images/ChatApp thumbnail.jpg',
                githubUrl: 'https://github.com/nakul-soni/ChatApp',
                technologies: ['Java', 'FireBase', 'Firebase Realtime DB', 'Firebase Auth', 'Android'],
                hovered: false
            },
            {
                title: 'Intrusion Detection System',
                description: 'A network-based Intrusion Detection System (IDS) that captures and analyzes suspicious packets and scanning attempts from unknown sources in real time, while generating detailed security logs for threat analysis.',
                image: './Images/IDS thumbnail.jpg',
                liveUrl: null,
                githubUrl: 'https://github.com/nakul-soni/Intrusion-Detection-System',
                technologies: ['Cyber Security', 'Computer Networks', 'Kali Linux', 'Wireshark', 'Python'],
                hovered: false
            },
            {
                title: 'PackPal-A Group Logistics Planner',
                description: 'A responsive and collaborative group logistics planner that streamlines trip preparation with shared checklists, categorized items, and real-time management for seamless travel organization.',
                image: './Images/PackPal Thumbnail.jpg',
                liveUrl: 'https://nakul-soni.github.io/PackPal-Groups-Logistics-Planner-/',
                githubUrl: 'https://github.com/nakul-soni/PackPal-Groups-Logistics-Planner-',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Firebase', 'BootStrap'],
                hovered: false
            }
        ];

        // Skills data
        // Skills data (text + logo mapping will be generated below)
        $scope.skills = [
            {
                name: 'Frontend',
                items: ['React', 'Angular', 'TypeScript', 'HTML5', 'CSS3']
            },
            {
                name: 'Backend',
                items: ['Node.js', 'Express.js', 'Python','Java', 'PHP']
            },
            {
                name: 'Database',
                items: ['MongoDB', 'MySQL', 'Firebase']
            },
            {
                name: 'Tools & Others',
                items: ['Git', 'Figma', 'WireShark', 'Burpsuite']
            }
        ];

        // Helper: resolve skill icons robustly.
        // Strategy:
        // 1) Try several Devicon slug variants (colored icons)
        // 2) Try several Simple Icons slug variants (monochrome)
        // 3) If nothing matches (or CDN blocked), return an inline SVG data-URL fallback so the badge never appears empty
        const iconFor = function(skillName) {
            const raw = String(skillName || '');
            const normalized = raw.toLowerCase().replace(/\s+|\.|#/g, '');

            // Quick explicit URLs for skills that had visibility issues
            const explicitUrls = {
                'angular': 'https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/angular.svg',
                'firebase': 'https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/firebase.svg',
                'kalilinux': 'Images/kali-linux.svg',
                'kali': 'Images/kali-linux.svg',
                'wireshark': 'https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/wireshark.svg',
                'burpsuite': 'Images/burpsuite.svg'
            };

            if (explicitUrls[normalized]) return explicitUrls[normalized];

            // Candidates for Devicon (common slug variants)
            const deviconCandidates = {
                'react': ['react'],
                'angular': ['angular', 'angularjs'],
                'typescript': ['typescript'],
                'html5': ['html5'],
                'css3': ['css3'],
                'nodejs': ['nodejs','node'],
                'node': ['nodejs','node'],
                'expressjs': ['express','expressjs'],
                'express': ['express','expressjs'],
                'python': ['python'],
                'java': ['java'],
                'php': ['php'],
                'mongodb': ['mongodb'],
                'mysql': ['mysql'],
                'firebase': ['firebase'],
                'git': ['git'],
                'figma': ['figma'],
                'wireshark': ['wireshark'],
                'burpsuite': ['burpsuite']
            };

            const deviconVersion = 'v2.15.0';
            const devCandidates = deviconCandidates[normalized] || [];
            for (let i = 0; i < devCandidates.length; i++) {
                const slug = devCandidates[i];
                // Try the canonical -original filename used by Devicon
                const devUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@${deviconVersion}/icons/${slug}/${slug}-original.svg`;
                // We can't reliably test network reachability here, but returning the URL is the correct first attempt
                return devUrl;
            }

            // Simple Icons fallbacks: try a few slug variants commonly used in the package
            const simpleCandidates = [];
            // exact compact form: e.g. 'nodejs', 'mongodb'
            simpleCandidates.push(normalized);
            // hyphenated form: 'kali-linux'
            simpleCandidates.push(raw.toLowerCase().trim().replace(/\s+/g, '-'));
            // dot-to-dash for things like 'node.js' -> 'node-dot-js' (some packs use variants)
            simpleCandidates.push(raw.toLowerCase().trim().replace(/\./g, '-dot-').replace(/\s+/g, '-'));

            for (let j = 0; j < simpleCandidates.length; j++) {
                const slug = simpleCandidates[j].replace(/[^a-z0-9\-]/g, '');
                if (!slug) continue;
                const simpleUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/${slug}.svg`;
                return simpleUrl;
            }

            // Final fallback: inline SVG with initials and themed gradient so the badge never breaks
            const inlineSvgFor = function(name) {
                const parts = String(name).split(/[^A-Za-z0-9]+/).filter(Boolean);
                const initials = (parts.length === 0) ? '?' : (parts.length === 1 ? parts[0].slice(0,2) : (parts[0].slice(0,1) + parts[1].slice(0,1)));
                const label = ('' + initials).toUpperCase();
                const svg = `\n<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>\n  <defs>\n    <linearGradient id='g' x1='0' x2='1'>\n      <stop offset='0' stop-color='%2300d4ff'/>\n      <stop offset='1' stop-color='%23ff00ff'/>\n    </linearGradient>\n  </defs>\n  <rect width='64' height='64' rx='12' fill='transparent'/>\n  <circle cx='32' cy='32' r='28' fill='url(%23g)' fill-opacity='0.12'/>\n  <text x='32' y='38' font-size='20' font-family='Inter, Arial, sans-serif' font-weight='700' fill='%23ffffff' text-anchor='middle'>${label}</text>\n</svg>`;
                return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
            };

            return inlineSvgFor(raw);
        };

        // Augment skills items with logo URLs when available
        $scope.skills = $scope.skills.map(function(group) {
            return {
                name: group.name,
                items: group.items.map(function(item) {
                    return {
                        name: item,
                        logo: iconFor(item) // may be null if not in mapping
                    };
                })
            };
        });

        // Typewriter animation function
        $scope.typeWriter = function() {
            const currentRole = $scope.roles[$scope.currentRoleIndex];
            const speed = $scope.isDeleting ? 50 : 100; // Faster when deleting

            if ($scope.isDeleting) {
                $scope.currentText = currentRole.substring(0, $scope.currentText.length - 1);
            } else {
                $scope.currentText = currentRole.substring(0, $scope.currentText.length + 1);
            }

            if (!$scope.isDeleting && $scope.currentText === currentRole) {
                // Finished typing, wait before starting to delete
                $timeout(function() {
                    $scope.isDeleting = true;
                    $scope.typeWriter();
                }, 2000);
            } else if ($scope.isDeleting && $scope.currentText === '') {
                // Finished deleting, move to next role
                $scope.isDeleting = false;
                $scope.currentRoleIndex = ($scope.currentRoleIndex + 1) % $scope.roles.length;
                $timeout(function() {
                    $scope.typeWriter();
                }, 500);
            } else {
                // Continue typing or deleting
                $timeout(function() {
                    $scope.typeWriter();
                }, speed);
            }
        };

        // Initialize animations
        $scope.initAnimations = function() {
            $timeout(function() {
                $scope.heroAnimated = true;
                // Start typewriter animation after hero animation
                $timeout(function() {
                    $scope.typeWriter();
                }, 1000);
            }, 500);

            // Initialize scroll animations
            $scope.initScrollAnimations();
        };

        // Scroll animations
        $scope.initScrollAnimations = function() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        if (entry.target.classList.contains('timeline-item')) {
                            $scope.$apply(function() {
                                const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                                $scope.experience[index].visible = true;
                            });
                        }
                    }
                });
            }, observerOptions);

            // Observe timeline items
            $timeout(function() {
                const timelineItems = document.querySelectorAll('.timeline-item');
                timelineItems.forEach(function(item) {
                    observer.observe(item);
                });
            }, 1000);
        };

        // Scroll handling
        $scope.handleScroll = function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            $scope.isScrolled = scrollTop > 100;
        };

        // Smooth scroll to section
        $scope.scrollToSection = function(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                const offsetTop = element.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            $scope.mobileMenuOpen = false;
        };

        // Toggle mobile menu
        $scope.toggleMobileMenu = function() {
            $scope.mobileMenuOpen = !$scope.mobileMenuOpen;
        };

        // Contact form submission
        $scope.submitForm = function() {
            if ($scope.contactForm.$valid) {
                $scope.formSubmitting = true;
                
                PortfolioService.submitContactForm($scope.formData)
                    .then(function(response) {
                        // Success
                        $scope.showNotification('Message sent successfully!', 'success');
                        $scope.formData = { name: '', email: '', message: '' };
                        $scope.contactForm.$setPristine();
                    })
                    .catch(function(error) {
                        // Error
                        $scope.showNotification('Failed to send message. Please try again.', 'error');
                        console.error('Contact form error:', error);
                    })
                    .finally(function() {
                        $scope.formSubmitting = false;
                    });
            }
        };

        // Show notification
        $scope.showNotification = function(message, type) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? '#00d4ff' : '#ff4444'};
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            $timeout(function() {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after 3 seconds
            $timeout(function() {
                notification.style.transform = 'translateX(400px)';
                $timeout(function() {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        };

        // Initialize on load
        $scope.initAnimations();

        // Add scroll event listener
        angular.element(window).on('scroll', $scope.handleScroll);
    })

    .service('PortfolioService', function($http, $q) {
        const backendURL = 'https://my-portfolio-cig5.onrender.com/api/contact'
        return {
            submitContactForm: function(formData) {
                return $http.post(backendURL, formData)
                    .then(function(response) {
                        return response.data;
                    })
                    .catch(function(error) {
                        throw error;
                    });
            }
        };
    })

    .directive('scrollAnimation', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate');
                        }
                    });
                }, {
                    threshold: 0.1
                });
                
                observer.observe(element[0]);
            }
        };
    });
