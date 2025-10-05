        document.addEventListener("DOMContentLoaded", function() {
            // --- LIVE ANIMATIONS (Matrix + Typing) ---
            const canvas = document.getElementById('matrix-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const alphabet = 'アァカサタナハマヤャラワガザダバパイキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const fontSize = 16;
            const columns = canvas.width / fontSize;
            const rainDrops = Array.from({ length: columns }).fill(1);
            const drawMatrix = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#0F0';
                ctx.font = fontSize + 'px monospace';
                rainDrops.forEach((y, ind) => {
                    const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                    ctx.fillText(text, ind * fontSize, y * fontSize);
                    if (y * fontSize > canvas.height && Math.random() > 0.975) rainDrops[ind] = 0;
                    rainDrops[ind]++;
                });
            };
            const matrixInterval = setInterval(drawMatrix, 30);
            const typingElement = document.getElementById('typing-effect');
            const words = ["Cybersecurity Student", "Aspiring SOC Analyst", "Bug Bounty Hunter"];
            let wordIndex = 0, charIndex = 0, isDeleting = false;
            function type() {
                const currentWord = words[wordIndex];
                let displayText = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);
                typingElement.innerHTML = `${displayText}<span class="cursor">&nbsp;</span>`;
                charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
                if (!isDeleting && charIndex === currentWord.length) setTimeout(() => isDeleting = true, 2000);
                else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; }
                setTimeout(type, isDeleting ? 50 : 120);
            }
            if (typingElement) type();

            // --- CERTIFICATION SLIDER SCRIPT ---
            const sliderWrapper = document.querySelector('.slider-wrapper');
            const slides = document.querySelectorAll('.cert-slide');
            const prevBtn = document.querySelector('.slider-btn.prev');
            const nextBtn = document.querySelector('.slider-btn.next');
            let currentIndex = 0;
            let isDragging = false, startPos = 0, currentTranslate = 0, prevTranslate = 0, animationID;
            
            function updateSliderPosition() {
                sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            }

            function nextSlide() {
                if (currentIndex < slides.length - 1) currentIndex++;
                else currentIndex = 0; // Loop back to start
                updateSliderPosition();
            }

            function prevSlide() {
                if (currentIndex > 0) currentIndex--;
                else currentIndex = slides.length - 1; // Loop to end
                updateSliderPosition();
            }

            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);

            // Touch & Mouse Drag functionality
            slides.forEach((slide, index) => {
                slide.addEventListener('dragstart', (e) => e.preventDefault());
                // Touch events
                slide.addEventListener('touchstart', touchStart(index));
                slide.addEventListener('touchend', touchEnd);
                slide.addEventListener('touchmove', touchMove);
                // Mouse events
                slide.addEventListener('mousedown', touchStart(index));
                slide.addEventListener('mouseup', touchEnd);
                slide.addEventListener('mouseleave', touchEnd);
                slide.addEventListener('mousemove', touchMove);
            });

            function touchStart(index) {
                return function(event) {
                    currentIndex = index;
                    startPos = getPositionX(event);
                    isDragging = true;
                    animationID = requestAnimationFrame(animation);
                    sliderWrapper.style.transition = 'none';
                }
            }
            function touchEnd() {
                isDragging = false;
                cancelAnimationFrame(animationID);
                const movedBy = currentTranslate - prevTranslate;
                if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex++;
                if (movedBy > 100 && currentIndex > 0) currentIndex--;
                sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
                currentTranslate = currentIndex * -sliderWrapper.offsetWidth / slides.length;
                sliderWrapper.style.transform = `translateX(${currentTranslate}px)`;
                prevTranslate = currentTranslate;
            }
            function touchMove(event) {
                if (isDragging) {
                    const currentPosition = getPositionX(event);
                    currentTranslate = prevTranslate + currentPosition - startPos;
                }
            }
            function getPositionX(event) {
                return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            }
            function animation() {
                sliderWrapper.style.transform = `translateX(${currentTranslate}px)`;
                if (isDragging) requestAnimationFrame(animation);
            }
            window.addEventListener('resize', () => { // Recalculate on resize
                currentTranslate = currentIndex * -sliderWrapper.offsetWidth / slides.length;
                prevTranslate = currentTranslate;
                sliderWrapper.style.transform = `translateX(${currentTranslate}px)`;
            });

            // --- ALL OTHER SCRIPTS ---
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));
            const hamburger = document.getElementById('hamburger');
            const navLinks = document.getElementById('nav-links');
            hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
            navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('active')));
            const themeToggle = document.getElementById('theme-toggle');
            const currentTheme = localStorage.getItem('theme');
            if (currentTheme) document.body.classList.add(currentTheme);
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-mode');
                let theme = document.body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode';
                localStorage.setItem('theme', theme);
            });
            const revealElements = document.querySelectorAll('.reveal');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
            }, { threshold: 0.1 });
            revealElements.forEach(el => observer.observe(el));
        });