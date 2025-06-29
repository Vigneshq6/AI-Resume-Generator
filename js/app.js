/**
 * Main Application Controller
 * Initializes the application and handles global functionality
 */

class App {
    constructor() {
        this.isInitialized = false;
        this.autosaveInterval = null;
        this.currentTheme = 'modern';
    }

    /**
     * Initialize the application
     */
    init() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing AI Resume Generator...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApplication());
        } else {
            this.setupApplication();
        }
    }

    /**
     * Setup the main application
     */
    setupApplication() {
        try {
            // Initialize event listeners
            this.setupEventListeners();
            
            // Setup auto-save functionality
            this.setupAutosave();
            
            // Generate initial resume (check if ResumeGenerator exists)
            if (typeof ResumeGenerator !== 'undefined') {
                ResumeGenerator.generateResume();
            }
            
            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Setup form validation
            this.setupFormValidation();
            
            // Add import/export functionality
            this.addImportExportButtons();
            
            // Setup auto-suggestions
            this.setupAutoSuggestions();
            
            this.isInitialized = true;
            console.log('✅ Application initialized successfully');
            
            // Show welcome message
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.showErrorMessage('Failed to initialize application. Please refresh the page.');
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Add real-time form updates (check if ResumeGenerator exists)
        if (typeof ResumeGenerator !== 'undefined' && ResumeGenerator.addEventListeners) {
            ResumeGenerator.addEventListeners();
        }
        
        // Job title change handler for auto-suggestions
        const jobTitleInput = document.getElementById('jobTitle');
        if (jobTitleInput) {
            jobTitleInput.addEventListener('input', this.debounce((e) => {
                if (e.target.value.length > 2) {
                    setTimeout(() => {
                        if (typeof AIEngine !== 'undefined') {
                            AIEngine.generateSuggestions();
                        }
                    }, 1000);
                }
            }, 500));
        }
        
        // Form submission prevention
        const form = document.getElementById('resumeForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (typeof ResumeGenerator !== 'undefined') {
                    ResumeGenerator.generateResume();
                }
            });
        }
        
        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Before unload warning
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    /**
     * Setup auto-save functionality
     */
    setupAutosave() {
        // Save to localStorage every 30 seconds
        this.autosaveInterval = setInterval(() => {
            this.saveToLocalStorage();
        }, 30000);
        
        // Load saved data on startup
        this.loadFromLocalStorage();
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveToLocalStorage();
                this.showSuccessMessage('Resume saved locally!');
            }
            
            // Ctrl/Cmd + P to print
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                if (typeof ResumeGenerator !== 'undefined' && ResumeGenerator.downloadPDF) {
                    ResumeGenerator.downloadPDF();
                }
            }
            
            // Ctrl/Cmd + G to generate AI suggestions
            if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
                e.preventDefault();
                if (typeof AIEngine !== 'undefined') {
                    AIEngine.generateSuggestions();
                }
            }
        });
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        const requiredFields = ['fullName', 'email'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
            }
        });
    }

    /**
     * Add import/export buttons
     */
    addImportExportButtons() {
        const buttonContainer = document.querySelector('div[style*="text-align: center"]');
        if (buttonContainer && !document.getElementById('importExportButtons')) {
            const importExportHTML = `
                <div id="importExportButtons" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <button type="button" class="btn" onclick="window.app.exportResume()">💾 Export Data</button>
                    <input type="file" id="importFile" accept=".json" style="display: none;" onchange="window.app.importData(event)">
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('importFile').click()">📁 Import Data</button>
                    <button type="button" class="btn" onclick="window.app.clearForm()" style="background: #e53e3e; color: white;">🗑️ Clear All</button>
                </div>
            `;
            buttonContainer.insertAdjacentHTML('beforeend', importExportHTML);
        }
    }

    /**
     * Setup auto-suggestions
     */
    setupAutoSuggestions() {
        const jobTitleInput = document.getElementById('jobTitle');
        const skillsInput = document.getElementById('skills');
        
        if (jobTitleInput && skillsInput) {
            jobTitleInput.addEventListener('blur', () => {
                if (jobTitleInput.value && !skillsInput.value.trim()) {
                    // Basic skill suggestions based on job title
                    const skillSuggestions = this.getSkillSuggestions(jobTitleInput.value);
                    if (skillSuggestions.length > 0) {
                        skillsInput.value = skillSuggestions.join(', ');
                        if (typeof ResumeGenerator !== 'undefined') {
                            ResumeGenerator.generateResume();
                        }
                        this.showSuccessMessage('Skills auto-filled based on job title!');
                    }
                }
            });
        }
    }

    /**
     * Get skill suggestions based on job title
     */
    getSkillSuggestions(jobTitle) {
        const title = jobTitle.toLowerCase();
        const skillMap = {
            'developer': ['JavaScript', 'HTML', 'CSS', 'Git', 'Problem Solving'],
            'designer': ['Adobe Creative Suite', 'Figma', 'UI/UX Design', 'Typography', 'Color Theory'],
            'manager': ['Leadership', 'Project Management', 'Team Building', 'Strategic Planning', 'Communication'],
            'analyst': ['Data Analysis', 'Excel', 'SQL', 'Critical Thinking', 'Report Writing'],
            'marketing': ['Digital Marketing', 'SEO', 'Social Media', 'Content Creation', 'Analytics'],
            'sales': ['Relationship Building', 'Negotiation', 'CRM', 'Lead Generation', 'Communication']
        };
        
        for (const [key, skills] of Object.entries(skillMap)) {
            if (title.includes(key)) {
                return skills;
            }
        }
        return [];
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.id;
        
        // Remove existing error styling
        field.classList.remove('error');
        this.removeFieldError(field);
        
        switch (fieldName) {
            case 'fullName':
                if (!value) {
                    this.showFieldError(field, 'Full name is required');
                    return false;
                }
                break;
                
            case 'email':
                if (!value) {
                    this.showFieldError(field, 'Email is required');
                    return false;
                } else if (!this.isValidEmail(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    this.showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
        }
        
        return true;
    }

    /**
     * Email validation helper
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Phone validation helper
     */
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
        return phoneRegex.test(cleanPhone);
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#e53e3e';
        
        // Add error message if not exists
        let errorDiv = field.parentNode.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'color: #e53e3e; font-size: 0.875rem; margin-top: 5px;';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        
        // Remove error after 5 seconds
        setTimeout(() => {
            this.removeFieldError(field);
        }, 5000);
    }

    /**
     * Remove field error
     */
    removeFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv && errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
            field.style.borderColor = '';
            field.classList.remove('error');
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const container = document.querySelector('.container');
        if (container) {
            if (window.innerWidth <= 768) {
                container.style.gridTemplateColumns = '1fr';
            } else {
                container.style.gridTemplateColumns = '1fr 1fr';
            }
        }
    }

    /**
     * Collect form data safely
     */
    collectFormData() {
        const formData = {};
        const fields = ['fullName', 'email', 'phone', 'jobTitle', 'professionalSummary', 'skills'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            formData[fieldId] = field ? field.value : '';
        });
        
        return formData;
    }

    /**
     * Collect experiences safely
     */
    collectExperiences() {
        const experiences = [];
        const experienceItems = document.querySelectorAll('#experienceList .experience-item');
        
        experienceItems.forEach(item => {
            const jobTitle = item.querySelector('[name$="JobTitle"]');
            const company = item.querySelector('[name$="Company"]');
            const duration = item.querySelector('[name$="Duration"]');
            const description = item.querySelector('[name$="Description"]');
            
            if (jobTitle && company) {
                experiences.push({
                    jobTitle: jobTitle.value || '',
                    company: company.value || '',
                    duration: duration ? duration.value : '',
                    description: description ? description.value : ''
                });
            }
        });
        
        return experiences;
    }

    /**
     * Collect educations safely
     */
    collectEducations() {
        const educations = [];
        const educationItems = document.querySelectorAll('#educationList .education-item');
        
        educationItems.forEach(item => {
            const degree = item.querySelector('[name$="Degree"]');
            const school = item.querySelector('[name$="School"]');
            const year = item.querySelector('[name$="Year"]');
            
            if (degree && school) {
                educations.push({
                    degree: degree.value || '',
                    school: school.value || '',
                    year: year ? year.value : ''
                });
            }
        });
        
        return educations;
    }

    /**
     * Save to localStorage
     */
    saveToLocalStorage() {
        try {
            const data = {
                personal: this.collectFormData(),
                experiences: this.collectExperiences(),
                educations: this.collectEducations(),
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('resumeData', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    /**
     * Load from localStorage
     */
    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('resumeData');
            if (savedData) {
                const data = JSON.parse(savedData);
                const saveDate = new Date(data.timestamp);
                const now = new Date();
                const daysDiff = (now - saveDate) / (1000 * 60 * 60 * 24);
                
                if (daysDiff < 7) {
                    setTimeout(() => {
                        if (confirm('Found previously saved resume data. Would you like to restore it?')) {
                            this.populateForm(data);
                            if (typeof ResumeGenerator !== 'undefined') {
                                ResumeGenerator.generateResume();
                            }
                            this.showSuccessMessage('Previous data restored!');
                        }
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    /**
     * Populate form with data
     */
    populateForm(data) {
        if (data.personal) {
            Object.entries(data.personal).forEach(([key, value]) => {
                const field = document.getElementById(key);
                if (field) {
                    field.value = value;
                }
            });
        }
    }

    /**
     * Check for unsaved changes
     */
    hasUnsavedChanges() {
        const currentData = {
            personal: this.collectFormData(),
            experiences: this.collectExperiences(),
            educations: this.collectEducations()
        };
        
        try {
            const savedData = localStorage.getItem('resumeData');
            if (!savedData) return true;
            
            const parsed = JSON.parse(savedData);
            return JSON.stringify(currentData) !== JSON.stringify({
                personal: parsed.personal,
                experiences: parsed.experiences,
                educations: parsed.educations
            });
        } catch {
            return true;
        }
    }

    /**
     * Debounce utility function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#48bb78',
            error: '#e53e3e',
            info: '#667eea',
            warning: '#ed8936'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        setTimeout(() => {
            const welcomeMessage = `
                🎉 Welcome to AI Resume Generator!
                
                Quick tips:
                • Use Ctrl+S to save your progress
                • Use Ctrl+G to generate AI suggestions
                • Use Ctrl+P to download PDF
                • Your data auto-saves every 30 seconds
            `;
            
            this.showNotification('Welcome! Check console for tips.', 'info');
            console.log(welcomeMessage);
        }, 1000);
    }

    /**
     * Export resume data
     */
    exportResume() {
        try {
            const data = {
                personal: this.collectFormData(),
                experiences: this.collectExperiences(),
                educations: this.collectEducations(),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resume_${data.personal.fullName?.replace(/\s+/g, '_') || 'export'}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showSuccessMessage('Resume data exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            this.showErrorMessage('Failed to export resume data.');
        }
    }

    /**
     * Import resume data
     */
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.populateForm(data);
                if (typeof ResumeGenerator !== 'undefined') {
                    ResumeGenerator.generateResume();
                }
                this.showSuccessMessage('Data imported successfully!');
            } catch (error) {
                console.error('Import error:', error);
                this.showErrorMessage('Failed to import data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    /**
     * Clear all form data
     */
    clearForm() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            // Clear form fields
            const form = document.getElementById('resumeForm');
            if (form) {
                form.reset();
            }
            
            // Clear dynamic sections
            const experienceList = document.getElementById('experienceList');
            const educationList = document.getElementById('educationList');
            
            if (experienceList) experienceList.innerHTML = '';
            if (educationList) educationList.innerHTML = '';
            
            // Clear localStorage
            localStorage.removeItem('resumeData');
            
            // Regenerate empty resume
            if (typeof ResumeGenerator !== 'undefined') {
                ResumeGenerator.generateResume();
            }
            
            this.showSuccessMessage('All data cleared successfully!');
        }
    }

    /**
     * Cleanup on page unload
     */
    cleanup() {
        if (this.autosaveInterval) {
            clearInterval(this.autosaveInterval);
        }
        
        // Final save
        this.saveToLocalStorage();
    }
}

// Initialize application when DOM is ready
const app = new App();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    app.cleanup();
});

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
} else {
    app.init();
}

// Export for global access
window.App = App;
window.app = app;
