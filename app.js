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
                position: 'Computer Science and Engineering Student',
                company: 'Indus University Ahmedabad',
                duration: '2023 - Present',
                description: 'Built strong foundations in programming, software development, and cybersecurity through academic learning and hands-on projects.',
                skills: ['Data Structures & Algorithms', 'OOP', 'Database Management (SQL & NoSQL)', 'OS & Networks', 'Java, Python, C/C++'],
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
                'angular': 'https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/angular.svg',
                'firebase': 'https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/firebase.svg',
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
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);

            $timeout(() => { notification.classList.add('show'); }, 100);
            $timeout(() => {
                notification.classList.remove('show');
                $timeout(() => { document.body.removeChild(notification); }, 300);
            }, 3000);
        };

        // ========================
        // Init
        // ========================
        $scope.initAnimations();
    })

    // ========================
    // Backend Service
    // ========================
    .constant('API_CONFIG', {
        backendURL: 'https://my-portfolio-n4o8.onrender.com/api/contact'
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
