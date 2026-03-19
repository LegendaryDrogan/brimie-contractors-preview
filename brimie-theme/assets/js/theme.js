/**
 * Brimie Contractors Theme JavaScript
 */
(function() {
    'use strict';

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navWrapper = document.getElementById('nav-menu-wrapper');

    if (menuToggle && navWrapper) {
        menuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            this.classList.toggle('active');
            navWrapper.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
        navWrapper.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                navWrapper.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Sticky Header
    const header = document.getElementById('site-header');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        });
    }

    // Hero Slider
    const heroSlider = document.getElementById('hero-slider');
    if (heroSlider) {
        const slides = heroSlider.querySelectorAll('.hero-slide');
        if (slides.length > 1) {
            let current = 0;
            setInterval(function() {
                slides[current].classList.remove('active');
                current = (current + 1) % slides.length;
                slides[current].classList.add('active');
            }, 5000);
        }
    }

    // Project Gallery Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid--gallery .project-card');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;

                filterButtons.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                projectCards.forEach(function(card) {
                    if (filter === 'all' || card.dataset.category.indexOf(filter) !== -1) {
                        card.style.display = '';
                        card.classList.remove('hidden');
                    } else {
                        card.style.display = 'none';
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // AJAX Form Handler - Inspection Form
    const inspectionForm = document.getElementById('brimie-inspection-form');
    if (inspectionForm) {
        inspectionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this, 'inspection-form-message');
        });
    }

    // AJAX Form Handler - Contact Form
    const contactForm = document.getElementById('brimie-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this, 'contact-form-message');
        });
    }

    function submitForm(form, messageId) {
        const messageEl = document.getElementById(messageId);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        messageEl.className = 'form-message';
        messageEl.textContent = '';

        const formData = new FormData(form);

        fetch(brimieAjax.ajaxurl, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                messageEl.className = 'form-message form-message--success';
                messageEl.textContent = data.data;
                form.reset();
            } else {
                messageEl.className = 'form-message form-message--error';
                messageEl.textContent = data.data || 'Something went wrong. Please try again.';
            }
        })
        .catch(function() {
            messageEl.className = 'form-message form-message--error';
            messageEl.textContent = 'Something went wrong. Please try again or call us directly.';
        })
        .finally(function() {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href*="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const hash = this.getAttribute('href').split('#')[1];
            if (!hash) return;

            const target = document.getElementById(hash);
            if (target && this.pathname === window.location.pathname) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, '#' + hash);
            }
        });
    });

})();
