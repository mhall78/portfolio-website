/* ============================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ============================================ */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all project cards and other elements
document.querySelectorAll('.project-card, .about-text, .contact-card').forEach(el => {
    observer.observe(el);
});

/* ============================================
   ACTIVE NAV LINK HIGHLIGHTING
   ============================================ */

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary-blue)';
        } else {
            link.style.color = '';
        }
    });
});

/* ============================================
   THEME TOGGLE
   ============================================ */

const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('light-mode');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.slice(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

/* ============================================
   RESUME UPLOAD FUNCTIONALITY
   ============================================ */

const resumeFileInput = document.getElementById('resume-file');
const resumePreview = document.getElementById('resume-preview');
const resumeUploadLabel = document.querySelector('.resume-upload span');

if (resumeFileInput) {
    resumeFileInput.addEventListener('change', function(e) {
        const file = this.files[0];
        
        if (!file) return;

        const validTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (!validTypes.includes(file.type)) {
            alert('Please upload a PDF or Word document');
            return;
        }

        // Store file in localStorage or handle upload
        const reader = new FileReader();
        
        reader.onload = function(event) {
            // Update UI to show file uploaded
            resumeUploadLabel.textContent = `✓ ${file.name}`;
            
            // For PDF files, you can embed them
            if (file.type === 'application/pdf') {
                const pdfUrl = event.target.result;
                resumePreview.innerHTML = `
                    <iframe src="${pdfUrl}" style="width: 100%; height: 600px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);"></iframe>
                    <div style="margin-top: 1rem; text-align: center;">
                        <a href="${pdfUrl}" download="${file.name}" class="btn btn-primary" style="text-decoration: none;">Download Resume</a>
                    </div>
                `;
            } else {
                // For Word documents, show a message
                resumePreview.innerHTML = `
                    <div style="text-align: center; padding: 2rem; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
                        <p style="font-size: 1.1rem; margin-bottom: 1rem;">✓ Resume uploaded successfully!</p>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">File: ${file.name}</p>
                        <a href="javascript:void(0)" class="btn btn-primary" onclick="downloadResume('${file.name}')">Download Resume</a>
                    </div>
                `;
                
                // Store the file data
                window.resumeData = {
                    name: file.name,
                    type: file.type,
                    size: file.size
                };
            }
        };
        
        reader.readAsDataURL(file);
    });
}

function downloadResume(fileName) {
    // This function would handle resume download
    alert(`Resume "${fileName}" download would be handled here`);
}

/* ============================================
   PROJECT LINK HANDLERS
   ============================================ */

document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const isGithub = this.classList.contains('github-link');
        const projectTitle = this.closest('.project-card').querySelector('h3').textContent;
        
        if (isGithub) {
            // GitHub link - update with actual GitHub profile
            const githubUrl = 'https://github.com/yourusername';
            console.log(`Linking to GitHub for: ${projectTitle}`);
            // window.open(githubUrl, '_blank');
        } else {
            // Project link
            console.log(`Viewing project: ${projectTitle}`);
        }
    });
});

/* ============================================
   PARALLAX EFFECT
   ============================================ */

window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.hero-background');
    
    parallaxElements.forEach(element => {
        const scrollPosition = window.pageYOffset;
        element.style.transform = `translate(0, ${scrollPosition * 0.5}px)`;
    });
});

/* ============================================
   DYNAMICALLY ADD MORE PROJECTS
   ============================================ */

function addProjectCard(title, description, tags, githubUrl) {
    const projectsGrid = document.querySelector('.projects-grid');
    
    const tagsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
        <div class="project-image" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"></div>
        <div class="project-content">
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="project-tags">
                ${tagsHTML}
            </div>
            <div class="project-links">
                <a href="#" class="project-link">View Project</a>
                <a href="${githubUrl}" target="_blank" class="project-link github-link">GitHub</a>
            </div>
        </div>
    `;
    
    projectsGrid.appendChild(projectCard);
    observer.observe(projectCard);
}

/* ============================================
   FORM VALIDATION (For future contact form)
   ============================================ */

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ============================================
   DOCUMENT READY
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize any needed functionality
    initTheme();
    console.log('Portfolio loaded successfully!');
    
    // Add animation to hero buttons on hover
    document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

/* ============================================
   CONTACT FORM HANDLING
   ============================================ */

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const service = document.getElementById('service').value;

        // Validate email
        if (!validateEmail(email)) {
            showFormStatus('Please enter a valid email address', 'error');
            return;
        }

        // In a real application, you would send this data to a server
        // For now, we'll just show a success message and store it locally
        const formData = {
            name,
            email,
            subject,
            message,
            service,
            timestamp: new Date().toISOString()
        };

        // Store in localStorage
        let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

        // Show success message
        showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    });
}

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
}

/* ============================================
   CUSTOM FUNCTIONS FOR PORTFOLIO UPDATES
   ============================================ */

// Update GitHub link
function updateGitHubLink(githubUrl) {
    document.querySelectorAll('.contact-links a.github').forEach(link => {
        link.href = githubUrl;
    });
}

// Update email
function updateEmailLink(email) {
    document.querySelectorAll('.contact-links a.email').forEach(link => {
        link.href = `mailto:${email}`;
    });
}

// Update LinkedIn
function updateLinkedInLink(linkedInUrl) {
    document.querySelectorAll('.contact-links a.linkedin').forEach(link => {
        link.href = linkedInUrl;
    });
}

// Export functions for external use
window.portfolioUtils = {
    addProjectCard,
    updateGitHubLink,
    updateEmailLink,
    updateLinkedInLink,
    validateEmail
};
