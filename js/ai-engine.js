/**
 * AI Engine for Resume Generation
 * Handles all AI-powered suggestions and content generation
 */

class AIEngine {
    constructor() {
        this.suggestions = {
            summaries: {
                'software engineer': [
                    "Experienced software engineer with 5+ years developing scalable web applications using modern technologies. Proven track record of leading cross-functional teams and delivering high-quality solutions.",
                    "Full-stack developer passionate about creating efficient, user-friendly applications. Strong background in agile methodologies and collaborative problem-solving.",
                    "Results-driven software engineer specializing in backend systems and API development. Experienced in cloud technologies and microservices architecture.",
                    "Innovative software engineer with expertise in modern JavaScript frameworks and cloud-native development. Committed to writing clean, maintainable code and following best practices."
                ],
                'data scientist': [
                    "Data scientist with expertise in machine learning and statistical analysis. Proven ability to extract actionable insights from complex datasets to drive business decisions.",
                    "Analytical professional with strong background in Python, R, and SQL. Experience building predictive models and data visualization dashboards.",
                    "Machine learning engineer focused on developing scalable ML solutions. Strong foundation in statistics and experience with cloud-based ML platforms.",
                    "Results-oriented data scientist specializing in deep learning and natural language processing. Experience deploying ML models in production environments."
                ],
                'project manager': [
                    "Certified Project Manager with 7+ years experience leading complex technical projects. Proven track record of delivering projects on time and within budget.",
                    "Agile project manager skilled in cross-functional team leadership and stakeholder management. Strong background in software development lifecycle.",
                    "Results-oriented project manager with expertise in risk management and process optimization. Experience managing teams of 10+ developers.",
                    "Strategic project manager with PMP certification and experience in digital transformation initiatives. Proven ability to align technical projects with business objectives."
                ],
                'marketing manager': [
                    "Creative marketing manager with 6+ years experience developing integrated marketing campaigns. Proven track record of increasing brand awareness and driving customer acquisition.",
                    "Digital marketing specialist with expertise in SEO, SEM, and social media marketing. Strong analytical skills and experience with marketing automation platforms.",
                    "Results-driven marketing manager focused on data-driven strategies and ROI optimization. Experience managing multi-channel campaigns and cross-functional teams."
                ],
                'sales representative': [
                    "Dynamic sales professional with 5+ years experience exceeding sales targets. Proven ability to build strong client relationships and identify new business opportunities.",
                    "Results-oriented sales representative with expertise in consultative selling and account management. Strong track record of revenue growth and customer retention.",
                    "Motivated sales professional specializing in B2B sales and relationship building. Experience with CRM systems and sales process optimization."
                ],
                'designer': [
                    "Creative designer with 4+ years experience in digital and print design. Proficient in Adobe Creative Suite and skilled in user-centered design principles.",
                    "UI/UX designer passionate about creating intuitive and engaging user experiences. Strong background in design thinking and prototyping methodologies.",
                    "Visual designer with expertise in branding and marketing collateral. Experience collaborating with cross-functional teams to deliver compelling design solutions."
                ],
                'teacher': [
                    "Dedicated educator with 8+ years experience inspiring students and fostering academic growth. Skilled in curriculum development and differentiated instruction techniques.",
                    "Passionate teacher committed to creating inclusive learning environments. Strong background in educational technology and student-centered pedagogy.",
                    "Innovative educator with expertise in project-based learning and assessment strategies. Proven ability to improve student outcomes and engagement."
                ],
                'nurse': [
                    "Compassionate registered nurse with 6+ years experience in acute care settings. Skilled in patient assessment, medication administration, and family education.",
                    "Dedicated healthcare professional with expertise in critical care nursing. Strong advocate for patient safety and quality improvement initiatives.",
                    "Experienced nurse with specialization in pediatric care. Committed to providing evidence-based nursing practice and compassionate patient care."
                ],
                'default': [
                    "Dedicated professional with strong analytical and problem-solving skills. Proven ability to work effectively in team environments and adapt to new challenges.",
                    "Results-driven individual with excellent communication skills and a passion for continuous learning. Experience collaborating with diverse teams to achieve common goals.",
                    "Motivated professional with a track record of delivering high-quality work. Strong attention to detail and commitment to professional growth.",
                    "Adaptable team player with strong organizational skills and ability to manage multiple priorities. Committed to excellence and continuous improvement."
                ]
            },
            
            jobDescriptions: {
                'software engineer': [
                    "Developed and maintained web applications using React, Node.js, and MongoDB, serving 10,000+ daily active users",
                    "Collaborated with cross-functional teams to design and implement new features, improving user engagement by 25%",
                    "Optimized application performance through code refactoring and database optimization, resulting in 30% faster load times",
                    "Implemented automated testing procedures using Jest and Cypress, reducing production bugs by 40%",
                    "Mentored junior developers and conducted code reviews, fostering a culture of continuous learning",
                    "Built RESTful APIs and microservices architecture, improving system scalability and maintainability",
                    "Integrated third-party services and payment gateways, enabling new revenue streams"
                ],
                'data scientist': [
                    "Built predictive models using Python and scikit-learn to forecast customer behavior, improving retention by 20%",
                    "Created interactive dashboards using Tableau and Power BI for stakeholder reporting and data visualization",
                    "Processed and analyzed large datasets (100GB+) using SQL, Apache Spark, and cloud computing platforms",
                    "Collaborated with business teams to identify opportunities for data-driven insights and strategic decision-making",
                    "Implemented A/B testing frameworks to measure feature performance and optimize user experience",
                    "Developed machine learning pipelines for automated model training and deployment",
                    "Presented findings to executive leadership, influencing key business strategies and investments"
                ],
                'project manager': [
                    "Led cross-functional teams of 8-12 members to deliver software projects on schedule and within budget",
                    "Managed project budgets ranging from $100K to $500K, ensuring optimal resource allocation",
                    "Implemented Agile methodologies and Scrum practices, increasing team productivity by 40%",
                    "Facilitated stakeholder meetings and maintained comprehensive project documentation",
                    "Identified and mitigated project risks, ensuring 95% on-time delivery rate across all projects",
                    "Coordinated with vendors and external partners to ensure seamless project execution",
                    "Established project KPIs and reporting mechanisms to track progress and performance"
                ],
                'marketing manager': [
                    "Developed and executed integrated marketing campaigns that increased brand awareness by 35%",
                    "Managed social media presence across multiple platforms, growing follower base by 50%",
                    "Collaborated with sales team to create lead generation strategies, resulting in 25% increase in qualified leads",
                    "Analyzed marketing metrics and ROI to optimize campaign performance and budget allocation",
                    "Coordinated with creative teams to produce compelling marketing collateral and content",
                    "Managed relationships with external agencies and vendors to ensure quality deliverables"
                ]
            },
            
            skills: {
                'software engineer': [
                    'JavaScript', 'Python', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'Git', 'AWS', 'Docker', 'MongoDB', 'Express.js', 'TypeScript', 'RESTful APIs', 'Agile/Scrum'
                ],
                'data scientist': [
                    'Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Statistics', 'Data Visualization', 'Apache Spark', 'Jupyter'
                ],
                'project manager': [
                    'Project Management', 'Agile/Scrum', 'Risk Management', 'Stakeholder Management', 'Budget Management', 'JIRA', 'Microsoft Project', 'Team Leadership'
                ],
                'marketing manager': [
                    'Digital Marketing', 'SEO/SEM', 'Social Media Marketing', 'Content Marketing', 'Google Analytics', 'Email Marketing', 'Brand Management', 'Market Research'
                ],
                'designer': [
                    'Adobe Creative Suite', 'Figma', 'Sketch', 'UI/UX Design', 'Prototyping', 'HTML/CSS', 'Typography', 'Color Theory', 'User Research'
                ]
            }
        };
    }

    /**
     * Generate AI suggestions based on job title
     */
    static generateSuggestions() {
        const aiEngine = new AIEngine();
        const jobTitle = document.getElementById('jobTitle').value.toLowerCase().trim();
        
        if (!jobTitle) {
            alert('Please enter a job title first to get AI suggestions!');
            return;
        }

        aiEngine.showLoading();
        
        // Simulate AI processing time
        setTimeout(() => {
            aiEngine.hideLoading();
            aiEngine.displaySuggestions(jobTitle);
        }, 1500);
    }

    /**
     * Display suggestions in the UI
     */
    displaySuggestions(jobTitle) {
        const suggestions = this.getSuggestions(jobTitle);
        const container = document.getElementById('summarySuggestions');
        container.innerHTML = '';
        
        suggestions.forEach((suggestion, index) => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                <strong>Option ${index + 1}:</strong><br>
                ${suggestion}
            `;
            div.onclick = () => {
                document.getElementById('summary').value = suggestion;
                ResumeGenerator.generateResume();
                this.showSuccessMessage('Professional summary updated!');
            };
            container.appendChild(div);
        });

        // Add skills suggestions
        this.addSkillsSuggestions(jobTitle);
    }

    /**
     * Get suggestions based on job title
     */
    getSuggestions(jobTitle) {
        const normalizedTitle = this.normalizeJobTitle(jobTitle);
        return this.suggestions.summaries[normalizedTitle] || this.suggestions.summaries['default'];
    }

    /**
     * Add skills suggestions
     */
    addSkillsSuggestions(jobTitle) {
        const normalizedTitle = this.normalizeJobTitle(jobTitle);
        const skillsSuggestions = this.suggestions.skills[normalizedTitle];
        
        if (skillsSuggestions) {
            const skillsInput = document.getElementById('skills');
            if (!skillsInput.value.trim()) {
                skillsInput.value = skillsSuggestions.join(', ');
                ResumeGenerator.generateResume();
            }
        }
    }

    /**
     * Normalize job title for matching
     */
    normalizeJobTitle(title) {
        const titleLower = title.toLowerCase();
        
        // Map variations to standard titles
        const titleMap = {
            'software developer': 'software engineer',
            'web developer': 'software engineer',
            'frontend developer': 'software engineer',
            'backend developer': 'software engineer',
            'full stack developer': 'software engineer',
            'programmer': 'software engineer',
            'data analyst': 'data scientist',
            'ml engineer': 'data scientist',
            'machine learning engineer': 'data scientist',
            'business analyst': 'data scientist',
            'scrum master': 'project manager',
            'product manager': 'project manager',
            'program manager': 'project manager',
            'marketing specialist': 'marketing manager',
            'digital marketer': 'marketing manager',
            'brand manager': 'marketing manager',
            'ux designer': 'designer',
            'ui designer': 'designer',
            'graphic designer': 'designer',
            'web designer': 'designer',
            'educator': 'teacher',
            'instructor': 'teacher',
            'rn': 'nurse',
            'registered nurse': 'nurse'
        };

        return titleMap[titleLower] || titleLower;
    }

    /**
     * Get job description suggestions
     */
    getJobDescriptionSuggestions(jobTitle, company = '') {
        const normalizedTitle = this.normalizeJobTitle(jobTitle);
        const descriptions = this.suggestions.jobDescriptions[normalizedTitle] || [];
        
        // Randomize and return subset
        return this.shuffleArray(descriptions).slice(0, 3);
    }

    /**
     * Shuffle array utility
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Show loading animation
     */
    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    /**
     * Hide loading animation
     */
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 3000);
    }

    /**
     * Analyze resume content and provide improvement suggestions
     */
    static analyzeResume() {
        const aiEngine = new AIEngine();
        const summary = document.getElementById('summary').value;
        const jobTitle = document.getElementById('jobTitle').value;
        
        const suggestions = [];
        
        if (summary.length < 100) {
            suggestions.push("Consider expanding your professional summary to 2-3 sentences for better impact.");
        }
        
        if (!summary.includes('years') && !summary.includes('experience')) {
            suggestions.push("Include years of experience in your summary to show your level of expertise.");
        }
        
        if (jobTitle && !summary.toLowerCase().includes(jobTitle.toLowerCase())) {
            suggestions.push(`Consider mentioning "${jobTitle}" in your professional summary to align with your target role.`);
        }
        
        return suggestions;
    }
}

// Export for use in other files
window.AIEngine = AIEngine;
