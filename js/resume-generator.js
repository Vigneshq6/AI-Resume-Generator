/**
 * Resume Generator Class
 * Handles resume generation, template management, and PDF export
 */

class ResumeGenerator {
    constructor() {
        this.experienceCount = 1;
        this.educationCount = 1;
        this.templates = {
            modern: 'modern',
            classic: 'classic',
            creative: 'creative'
        };
        this.currentTemplate = 'modern';
    }

    /**
     * Add new experience section
     */
    static addExperience() {
        const generator = new ResumeGenerator();
        generator.experienceCount++;
        const container = document.getElementById('experienceContainer');
        const newExp = document.createElement('div');
        newExp.className = 'dynamic-section';
        newExp.innerHTML = `
            <div class="section-header">
                <strong>Experience #${generator.experienceCount}</strong>
                <button type="button" class="remove-btn" onclick="ResumeGenerator.removeSection(this)">Remove</button>
            </div>
            <input type="text" placeholder="Job Title" class="exp-title">
            <input type="text" placeholder="Company Name" class="exp-company">
            <input type="text" placeholder="Duration (e.g., Jan 2020 - Present)" class="exp-duration">
            <textarea placeholder="Job responsibilities and achievements..." class="exp-description"></textarea>
            <button type="button" class="btn" style="font-size: 12px; padding: 6px 12px;" onclick="ResumeGenerator.getAIJobDescription(this)">🤖 Get AI Suggestions</button>
        `;
        container.appendChild(newExp);
        ResumeGenerator.addEventListeners();
    }

    /**
     * Add new education section
     */
    static addEducation() {
        const generator = new ResumeGenerator();
        generator.educationCount++;
        const container = document.getElementById('educationContainer');
        const newEdu = document.createElement('div');
        newEdu.className = 'dynamic-section';
        newEdu.innerHTML = `
            <div class="section-header">
                <strong>Education #${generator.educationCount}</strong>
                <button type="button" class="remove-btn" onclick="ResumeGenerator.removeSection(this)">Remove</button>
            </div>
            <input type="text" placeholder="Degree" class="edu-degree">
            <input type="text" placeholder="Institution" class="edu-school">
            <input type="text" placeholder="Year (e.g., 2020)" class="edu-year">
            <textarea placeholder="Relevant coursework, achievements, GPA (optional)..." class="edu-description"></textarea>
        `;
        container.appendChild(newEdu);
        ResumeGenerator.addEventListeners();
    }

    /**
     * Remove dynamic section
     */
    static removeSection(button) {
        button.closest('.dynamic-section').remove();
        ResumeGenerator.generateResume();
    }

    /**
     * Get AI job description suggestions
     */
    static getAIJobDescription(button) {
        const section = button.closest('.dynamic-section');
        const jobTitle = section.querySelector('.exp-title').value;
        const company = section.querySelector('.exp-company').value;
        
        if (!jobTitle) {
            alert('Please enter a job title first!');
            return;
        }

        const aiEngine = new AIEngine();
        const suggestions = aiEngine.getJobDescriptionSuggestions(jobTitle, company);
        
        if (suggestions.length > 0) {
            const descriptionTextarea = section.querySelector('.exp-description');
            const currentText = descriptionTextarea.value;
            const newText = suggestions.join('\n• ');
            descriptionTextarea.value = currentText ? currentText + '\n• ' + newText : '• ' + newText;
            ResumeGenerator.generateResume();
            
            // Show success message
            aiEngine.showSuccessMessage('Job description suggestions added!');
        }
    }

    /**
     * Generate resume preview
     */
    static generateResume() {
        const formData = ResumeGenerator.collectFormData();
        const experiences = ResumeGenerator.collectExperiences();
        const educations = ResumeGenerator.collectEducations();
        
        const resumeHTML = ResumeGenerator.generateResumeHTML(formData, experiences, educations);
        document.getElementById('resumePreview').innerHTML = resumeHTML;
    }

    /**
     * Collect form data
     */
    static collectFormData() {
        return {
            fullName: document.getElementById('fullName').value || 'Your Name Here',
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            linkedin: document.getElementById('linkedin').value,
            jobTitle: document.getElementById('jobTitle').value,
            summary: document.getElementById('summary').value || 'Your professional summary will appear here...',
            skills: document.getElementById('skills').value || 'Your skills will appear here...'
        };
    }

    /**
     * Collect all experience entries
     */
    static collectExperiences() {
        const experiences = [];
        document.querySelectorAll('#experienceContainer .dynamic-section').forEach(section => {
            const exp = {
                title: section.querySelector('.exp-title').value || 'Job Title',
                company: section.querySelector('.exp-company').value || 'Company Name',
                duration: section.querySelector('.exp-duration').value || 'Duration',
                description: section.querySelector('.exp-description').value || 'Your work experience details will appear here...'
            };
            experiences.push(exp);
        });
        return experiences;
    }

    /**
     * Collect all education entries
     */
    static collectEducations() {
        const educations = [];
        document.querySelectorAll('#educationContainer .dynamic-section').forEach(section => {
            const edu = {
                degree: section.querySelector('.edu-degree').value || 'Degree',
                school: section.querySelector('.edu-school').value || 'Institution',
                year: section.querySelector('.edu-year').value || 'Year',
                description: section.querySelector('.edu-description')?.value || ''
            };
            educations.push(edu);
        });
        return educations;
    }

    /**
     * Generate resume HTML
     */
    static generateResumeHTML(data, experiences, educations) {
        const contactInfo = [data.email, data.phone, data.location].filter(Boolean).join(' • ');
        
        let experienceHTML = '';
        experiences.forEach(exp => {
            const description = exp.description.includes('•') ? 
                exp.description : 
                exp.description.split('\n').filter(line => line.trim()).map(line => `• ${line.trim()}`).join('<br>');
            
            experienceHTML += `
                <div class="resume-item">
                    <div class="resume-item-title">${exp.title}</div>
                    <div class="resume-item-subtitle">${exp.company} | ${exp.duration}</div>
                    <div class="resume-item-description">${description}</div>
                </div>
            `;
        });

        let educationHTML = '';
        educations.forEach(edu => {
            educationHTML += `
                <div class="resume-item">
                    <div class="resume-item-title">${edu.degree}</div>
                    <div class="resume-item-subtitle">${edu.school} | ${edu.year}</div>
                    ${edu.description ? `<div class="resume-item-description">${edu.description}</div>` : ''}
                </div>
            `;
        });

        // Format skills
        const skillsFormatted = data.skills.includes(',') ? 
            data.skills.split(',').map(skill => skill.trim()).join(' • ') : 
            data.skills;

        return `
            <div class="resume-header">
                <div class="resume-name">${data.fullName}</div>
                ${data.jobTitle ? `<div class="resume-contact" style="font-size: 1.1rem; color: #667eea; font-weight: 600;">${data.jobTitle}</div>` : ''}
                <div class="resume-contact">${contactInfo}</div>
                ${data.linkedin ? `<div class="resume-contact">${data.linkedin}</div>` : ''}
            </div>

            ${data.summary && data.summary !== 'Your professional summary will appear here...' ? `
            <div class="resume-section">
                <div class="resume-section-title">Professional Summary</div>
                <p>${data.summary}</p>
            </div>
            ` : ''}

            <div class="resume-section">
                <div class="resume-section-title">Work Experience</div>
                ${experienceHTML}
            </div>

            <div class="resume-section">
                <div class="resume-section-title">Education</div>
                ${educationHTML}
            </div>

            <div class="resume-section">
                <div class="resume-section-title">Skills</div>
                <p>${skillsFormatted}</p>
            </div>
        `;
    }

    /**
     * Download PDF functionality
     */
    static downloadPDF() {
        // Check if all required fields are filled
        const requiredFields = ['fullName', 'email'];
        const missingFields = [];
        
        requiredFields.forEach(field => {
            if (!document.getElementById(field).value.trim()) {
                missingFields.push(field.replace(/([A-Z])/g, ' $1').toLowerCase());
            }
        });

        if (missingFields.length > 0) {
            alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
            return;
        }

        // Show instructions for PDF download
        const modal = ResumeGenerator.createModal();
        document.body.appendChild(modal);
    }

    /**
     * Create PDF download modal
     */
    static createModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;

        content.innerHTML = `
            <h2 style="color: #667eea; margin-bottom: 20px;">📄 Download Your Resume</h2>
            <p style="margin-bottom: 20px; line-height: 1.6;">
                To download your resume as a PDF:
            </p>
            <ol style="text-align: left; margin-bottom: 20px; line-height: 1.8;">
                <li>Press <strong>Ctrl+P</strong> (or Cmd+P on Mac)</li>
                <li>Select "Save as PDF" as the destination</li>
                <li>Choose "More settings" and select "Custom" margins</li>
                <li>Set margins to "Minimum" for best formatting</li>
                <li>Click "Save" to download your resume</li>
            </ol>
            <div style="margin-top: 20px;">
                <button class="btn" onclick="window.print(); this.closest('div').parentElement.remove();" style="margin-right: 10px;">
                    🖨️ Print Now
                </button>
                <button class="btn btn-secondary" onclick="this.closest('div').parentElement.remove();">
                    Close
                </button>
            </div>
        `;

        modal.appendChild(content);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        return modal;
    }

    /**
     * Add event listeners for real-time updates
     */
    static addEventListeners() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Remove existing listeners to avoid duplicates
            input.removeEventListener('input', ResumeGenerator.generateResume);
            input.addEventListener('input', ResumeGenerator.generateResume);
        });
    }

    /**
     * Validate resume data
     */
    static validateResume() {
        const errors = [];
        
        // Check required fields
        if (!document.getElementById('fullName').value.trim()) {
            errors.push('Full name is required');
        }
        
        if (!document.getElementById('email').value.trim()) {
            errors.push('Email is required');
        } else if (!ResumeGenerator.isValidEmail(document.getElementById('email').value)) {
            errors.push('Please enter a valid email address');
        }
        
        // Check if at least one experience is filled
        const hasExperience = Array.from(document.querySelectorAll('#experienceContainer .dynamic-section')).some(section => {
            return section.querySelector('.exp-title').value.trim() || 
                   section.querySelector('.exp-company').value.trim();
        });
        
        if (!hasExperience) {
            errors.push('Please add at least one work experience');
        }
        
        return errors;
    }

    /**
     * Email validation helper
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Export resume data as JSON
     */
    static exportData() {
        const data = {
            personal: ResumeGenerator.collectFormData(),
            experiences: ResumeGenerator.collectExperiences(),
            educations: ResumeGenerator.collectEducations(),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-data-${data.personal.fullName.replace(/\s+/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Import resume data from JSON
     */
    static importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                ResumeGenerator.populateForm(data);
                ResumeGenerator.generateResume();
                alert('Resume data imported successfully!');
            } catch (error) {
                alert('Error importing file. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    /**
     * Populate form with imported data
     */
    static populateForm(data) {
        // Populate personal information
        Object.keys(data.personal).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = data.personal[key];
            }
        });
        
        // Clear existing dynamic sections
        document.getElementById('experienceContainer').innerHTML = '';
        document.getElementById('educationContainer').innerHTML = '';
        
        // Populate experiences
        data.experiences.forEach((exp, index) => {
            if (index === 0) {
                ResumeGenerator.addExperience();
            } else {
                ResumeGenerator.addExperience();
            }
            
            const sections = document.querySelectorAll('#experienceContainer .dynamic-section');
            const currentSection = sections[index];
            
            currentSection.querySelector('.exp-title').value = exp.title;
            currentSection.querySelector('.exp-company').value = exp.company;
            currentSection.querySelector('.exp-duration').value = exp.duration;
            currentSection.querySelector('.exp-description').value = exp.description;
        });
        
        // Populate education
        data.educations.forEach((edu, index) => {
            if (index === 0) {
                ResumeGenerator.addEducation();
            } else {
                ResumeGenerator.addEducation();
            }
            
            const sections = document.querySelectorAll('#educationContainer .dynamic-section');
            const currentSection = sections[index];
            
            currentSection.querySelector('.edu-degree').value = edu.degree;
            currentSection.querySelector('.edu-school').value = edu.school;
            currentSection.querySelector('.edu-year').value = edu.year;
            if (currentSection.querySelector('.edu-description')) {
                currentSection.querySelector('.edu-description').value = edu.description || '';
            }
        });
    }
}

// Export for global use
window.ResumeGenerator = ResumeGenerator;
