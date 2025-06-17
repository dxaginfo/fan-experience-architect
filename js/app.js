// Fan Experience Architect - Main Application

// Initialize Vue.js Application
const app = Vue.createApp({
    data() {
        return {
            // Application State
            activePage: 'welcome',
            analyticsTimeframe: 'month',
            
            // Journey Mapping Data
            journeyStages: [
                'Awareness',
                'Consideration',
                'Purchase',
                'Experience',
                'Advocacy'
            ],
            journeys: [],
            currentJourney: {
                id: '',
                name: '',
                description: '',
                personaId: '',
                stages: [],
                touchpoints: []
            },
            
            // Touchpoint Data
            currentTouchpoint: {
                id: '',
                name: '',
                stage: '',
                channel: '',
                description: '',
                emotionScore: 5,
                painPoints: [],
                opportunities: []
            },
            editingExistingTouchpoint: false,
            editingTouchpointIndex: -1,
            
            // Persona Data
            personas: [],
            currentPersona: null,
            contentTypes: [
                'Live Game Content',
                'Player Interviews',
                'Behind-the-Scenes',
                'Stats & Analysis',
                'Highlights',
                'Fan-Created Content',
                'Promotional Content',
                'Educational Content'
            ],
            channels: [
                'Website',
                'Mobile App',
                'Email',
                'Social Media',
                'SMS/Push Notifications',
                'In-Venue',
                'Print',
                'TV/Broadcast',
                'AR/VR'
            ],
            interests: [
                'Team History',
                'Player Stats',
                'Game Analysis',
                'Fan Community',
                'Merchandise',
                'Fantasy Sports',
                'Youth Development',
                'Social Impact'
            ],
            
            // AR/VR Integration Data
            arvrTemplates: [
                {
                    id: 'arvr1',
                    name: 'Virtual Venue Tour',
                    type: 'VR',
                    description: 'A virtual reality tour of the venue to help fans plan their visit or experience the venue remotely.',
                    complexity: 'Medium',
                    developmentTime: '2-3 months',
                    estimatedCost: '$15,000 - $30,000',
                    benefits: [
                        'Helps first-time visitors plan their experience',
                        'Provides access to fans who cannot attend in person',
                        'Can highlight premium areas to drive upgrades',
                        'Useful for corporate/group sales pitches'
                    ],
                    requirements: [
                        { name: 'Hardware', description: 'VR headsets for on-site demos, web-based version for broader access' },
                        { name: '360° Photography', description: 'High-quality 360° photos of the venue' },
                        { name: 'Interactivity', description: 'Interactive hotspots with information about facilities' },
                        { name: 'Integration', description: 'Optional integration with ticketing to show views from specific seats' }
                    ]
                },
                {
                    id: 'arvr2',
                    name: 'AR Wayfinding',
                    type: 'AR',
                    description: 'Augmented reality navigation system to help fans find their seats, amenities, and points of interest inside the venue.',
                    complexity: 'High',
                    developmentTime: '3-4 months',
                    estimatedCost: '$30,000 - $50,000',
                    benefits: [
                        'Reduces staff needed for wayfinding assistance',
                        'Improves fan experience by reducing frustration',
                        'Can highlight sponsored areas and promotions',
                        'Collects valuable movement data'
                    ],
                    requirements: [
                        { name: 'Mobile App', description: 'Integration with existing app or standalone app' },
                        { name: 'Indoor Mapping', description: 'Detailed indoor maps of the venue' },
                        { name: 'Positioning', description: 'Beacon network or computer vision-based positioning' },
                        { name: 'Real-time Updates', description: 'System for real-time updates on closures or changes' }
                    ]
                },
                {
                    id: 'arvr3',
                    name: 'AR Player Stats',
                    type: 'AR',
                    description: 'Augmented reality experience that displays player statistics and information when fans point their device at players on the field/court.',
                    complexity: 'Medium',
                    developmentTime: '2-3 months',
                    estimatedCost: '$20,000 - $35,000',
                    benefits: [
                        'Enhances in-venue experience with real-time information',
                        'Appeals to data-focused fans',
                        'Creates shareable moments for social media',
                        'Provides additional sponsor integration opportunities'
                    ],
                    requirements: [
                        { name: 'Computer Vision', description: 'Player recognition system' },
                        { name: 'Stats Integration', description: 'Real-time stats feed integration' },
                        { name: 'Mobile App', description: 'Integration with existing app' },
                        { name: 'Network Infrastructure', description: 'Robust in-venue WiFi/5G for real-time data' }
                    ]
                }
            ],
            currentARVRTemplate: null,
            
            // Charts and Analytics Data
            charts: {
                engagement: null,
                persona: null
            }
        }
    },
    
    // Computed Properties
    computed: {
        // Methods to calculate derived data
    },
    
    // Methods
    methods: {
        // Navigation
        setActivePage(page) {
            this.activePage = page;
            
            // Initialize charts if navigating to analytics page
            if (page === 'analytics') {
                this.$nextTick(() => {
                    this.initCharts();
                });
            }
        },
        
        // Journey Mapping Methods
        createNewJourney() {
            this.currentJourney = {
                id: uuid.v4(),
                name: 'New Journey Map',
                description: 'Map the complete fan experience',
                personaId: this.personas.length > 0 ? this.personas[0].id : '',
                stages: this.journeyStages.slice(),
                touchpoints: []
            };
        },
        
        saveJourney() {
            // Find if journey already exists
            const existingIndex = this.journeys.findIndex(j => j.id === this.currentJourney.id);
            
            if (existingIndex >= 0) {
                // Update existing journey
                this.journeys[existingIndex] = JSON.parse(JSON.stringify(this.currentJourney));
            } else {
                // Add new journey
                this.journeys.push(JSON.parse(JSON.stringify(this.currentJourney)));
            }
            
            // Save to localStorage
            this.saveToLocalStorage('journeys', this.journeys);
            
            // Show success message
            alert('Journey saved successfully!');
        },
        
        getTouchpointsForStage(stage) {
            return this.currentJourney.touchpoints.filter(tp => tp.stage === stage);
        },
        
        addTouchpoint(stage) {
            // Set up new touchpoint
            this.currentTouchpoint = {
                id: uuid.v4(),
                name: '',
                stage: stage,
                channel: this.channels[0],
                description: '',
                emotionScore: 5,
                painPoints: [],
                opportunities: []
            };
            
            this.editingExistingTouchpoint = false;
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('touchpointModal'));
            modal.show();
        },
        
        editTouchpoint(touchpoint) {
            // Clone the touchpoint to edit
            this.currentTouchpoint = JSON.parse(JSON.stringify(touchpoint));
            this.editingExistingTouchpoint = true;
            this.editingTouchpointIndex = this.currentJourney.touchpoints.findIndex(tp => tp.id === touchpoint.id);
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('touchpointModal'));
            modal.show();
        },
        
        removeTouchpoint(touchpoint) {
            if (confirm('Are you sure you want to remove this touchpoint?')) {
                const index = this.currentJourney.touchpoints.findIndex(tp => tp.id === touchpoint.id);
                if (index >= 0) {
                    this.currentJourney.touchpoints.splice(index, 1);
                }
            }
        },
        
        saveTouchpoint() {
            if (this.editingExistingTouchpoint) {
                // Update existing touchpoint
                this.currentJourney.touchpoints[this.editingTouchpointIndex] = JSON.parse(JSON.stringify(this.currentTouchpoint));
            } else {
                // Add new touchpoint
                this.currentJourney.touchpoints.push(JSON.parse(JSON.stringify(this.currentTouchpoint)));
            }
            
            // Close modal
            const modalElement = document.getElementById('touchpointModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        },
        
        addPainPoint() {
            this.currentTouchpoint.painPoints.push('');
        },
        
        removePainPoint(index) {
            this.currentTouchpoint.painPoints.splice(index, 1);
        },
        
        addOpportunity() {
            this.currentTouchpoint.opportunities.push('');
        },
        
        removeOpportunity(index) {
            this.currentTouchpoint.opportunities.splice(index, 1);
        },
        
        // Persona Methods
        createNewPersona() {
            this.currentPersona = {
                id: uuid.v4(),
                name: 'New Persona',
                demographics: {
                    age: 30,
                    gender: 'male',
                    location: 'Urban'
                },
                behaviors: {
                    attendanceFrequency: 'regular',
                    digitalEngagement: 'medium',
                    spendingLevel: 'mid-tier'
                },
                preferences: {
                    contentTypes: ['Live Game Content', 'Highlights'],
                    channels: ['Mobile App', 'Social Media'],
                    interests: ['Player Stats', 'Game Analysis']
                },
                goals: ['Enjoy high-quality entertainment', 'Feel connected to the team']
            };
        },
        
        selectPersona(persona) {
            this.currentPersona = JSON.parse(JSON.stringify(persona));
        },
        
        savePersona() {
            // Find if persona already exists
            const existingIndex = this.personas.findIndex(p => p.id === this.currentPersona.id);
            
            if (existingIndex >= 0) {
                // Update existing persona
                this.personas[existingIndex] = JSON.parse(JSON.stringify(this.currentPersona));
            } else {
                // Add new persona
                this.personas.push(JSON.parse(JSON.stringify(this.currentPersona)));
            }
            
            // Save to localStorage
            this.saveToLocalStorage('personas', this.personas);
            
            // Show success message
            alert('Persona saved successfully!');
        },
        
        deletePersona() {
            if (confirm('Are you sure you want to delete this persona?')) {
                const index = this.personas.findIndex(p => p.id === this.currentPersona.id);
                if (index >= 0) {
                    this.personas.splice(index, 1);
                    
                    // Save to localStorage
                    this.saveToLocalStorage('personas', this.personas);
                    
                    // Clear current persona
                    this.currentPersona = null;
                }
            }
        },
        
        getPersonaSummary(persona) {
            return `${persona.demographics.age}, ${persona.demographics.gender}, ${persona.behaviors.attendanceFrequency} attendance`;
        },
        
        addGoal() {
            this.currentPersona.goals.push('');
        },
        
        removeGoal(index) {
            this.currentPersona.goals.splice(index, 1);
        },
        
        // AR/VR Integration Methods
        createNewARVRExperience() {
            // TBD - Implement creation of new AR/VR experiences
        },
        
        selectARVRTemplate(template) {
            this.currentARVRTemplate = template;
        },
        
        getARVRIcon(type) {
            return type === 'AR' ? 'fas fa-mobile-alt' : 'fas fa-vr-cardboard';
        },
        
        getComplexityPercentage(complexity) {
            switch (complexity) {
                case 'Low': return '33%';
                case 'Medium': return '66%';
                case 'High': return '100%';
                default: return '50%';
            }
        },
        
        getComplexityClass(complexity) {
            switch (complexity) {
                case 'Low': return 'bg-success';
                case 'Medium': return 'bg-warning';
                case 'High': return 'bg-danger';
                default: return 'bg-primary';
            }
        },
        
        // Analytics Methods
        setAnalyticsTimeframe(timeframe) {
            this.analyticsTimeframe = timeframe;
            
            // Update charts with new timeframe
            this.updateCharts();
        },
        
        initCharts() {
            // Initialize Engagement Chart
            const engagementCtx = document.getElementById('engagementChart').getContext('2d');
            this.charts.engagement = new Chart(engagementCtx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                    datasets: [{
                        label: 'Overall Engagement',
                        data: [7.2, 7.4, 7.8, 8.1, 8.3, 8.4],
                        borderColor: 'rgb(13, 110, 253)',
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 5,
                            max: 10,
                            title: {
                                display: true,
                                text: 'Engagement Score (1-10)'
                            }
                        }
                    }
                }
            });
            
            // Initialize Persona Chart
            const personaCtx = document.getElementById('personaChart').getContext('2d');
            this.charts.persona = new Chart(personaCtx, {
                type: 'radar',
                data: {
                    labels: ['Casual Fan', 'Die-hard Fan', 'Family Fan', 'Digital Fan', 'VIP Fan'],
                    datasets: [{
                        label: 'Engagement Score',
                        data: [6.8, 9.2, 7.5, 8.4, 9.0],
                        backgroundColor: 'rgba(13, 110, 253, 0.2)',
                        borderColor: 'rgb(13, 110, 253)',
                        pointBackgroundColor: 'rgb(13, 110, 253)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(13, 110, 253)'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            },
                            suggestedMin: 0,
                            suggestedMax: 10
                        }
                    }
                }
            });
        },
        
        updateCharts() {
            // Update chart data based on timeframe
            if (this.charts.engagement) {
                let labels, data;
                
                switch (this.analyticsTimeframe) {
                    case 'week':
                        labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                        data = [8.1, 7.9, 8.2, 8.5, 8.7, 9.0, 8.8];
                        break;
                    case 'month':
                        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                        data = [8.1, 8.3, 8.4, 8.6];
                        break;
                    case 'year':
                        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        data = [7.2, 7.4, 7.8, 8.1, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9.0];
                        break;
                }
                
                this.charts.engagement.data.labels = labels;
                this.charts.engagement.data.datasets[0].data = data;
                this.charts.engagement.update();
            }
        },
        
        // Demo Data
        loadDemo() {
            // Sample Personas
            this.personas = [
                {
                    id: 'p1',
                    name: 'Casual Fan',
                    demographics: {
                        age: 28,
                        gender: 'female',
                        location: 'Suburban'
                    },
                    behaviors: {
                        attendanceFrequency: 'occasional',
                        digitalEngagement: 'medium',
                        spendingLevel: 'budget'
                    },
                    preferences: {
                        contentTypes: ['Live Game Content', 'Highlights'],
                        channels: ['Social Media', 'TV/Broadcast'],
                        interests: ['Game Analysis', 'Social Impact']
                    },
                    goals: ['Enjoy entertainment with friends', 'Stay updated on major team news']
                },
                {
                    id: 'p2',
                    name: 'Die-hard Fan',
                    demographics: {
                        age: 42,
                        gender: 'male',
                        location: 'Urban'
                    },
                    behaviors: {
                        attendanceFrequency: 'frequent',
                        digitalEngagement: 'high',
                        spendingLevel: 'premium'
                    },
                    preferences: {
                        contentTypes: ['Live Game Content', 'Player Interviews', 'Behind-the-Scenes', 'Stats & Analysis'],
                        channels: ['Website', 'Mobile App', 'Email', 'In-Venue'],
                        interests: ['Team History', 'Player Stats', 'Game Analysis', 'Fantasy Sports']
                    },
                    goals: ['Feel connected to team history and culture', 'Get insider access and information', 'Connect with other passionate fans']
                },
                {
                    id: 'p3',
                    name: 'Family Fan',
                    demographics: {
                        age: 37,
                        gender: 'female',
                        location: 'Suburban'
                    },
                    behaviors: {
                        attendanceFrequency: 'regular',
                        digitalEngagement: 'low',
                        spendingLevel: 'mid-tier'
                    },
                    preferences: {
                        contentTypes: ['Live Game Content', 'Educational Content'],
                        channels: ['Mobile App', 'In-Venue', 'Email'],
                        interests: ['Youth Development', 'Social Impact', 'Fan Community']
                    },
                    goals: ['Create family memories', 'Find family-friendly experiences', 'Teach children about the sport']
                }
            ];
            
            // Sample Journey
            this.currentJourney = {
                id: 'j1',
                name: 'Arena Game Experience',
                description: 'The complete journey for in-person arena attendance',
                personaId: 'p2',
                stages: this.journeyStages.slice(),
                touchpoints: [
                    {
                        id: 'tp1',
                        name: 'Season Schedule Release',
                        stage: 'Awareness',
                        channel: 'Website',
                        description: 'Fan learns about upcoming games when season schedule is released',
                        emotionScore: 8,
                        painPoints: ['Too many clicks to find specific game information'],
                        opportunities: ['Personalized game recommendations based on past attendance']
                    },
                    {
                        id: 'tp2',
                        name: 'Ticket Purchase',
                        stage: 'Purchase',
                        channel: 'Website',
                        description: 'Fan purchases tickets through team website',
                        emotionScore: 7,
                        painPoints: ['Seat selection tool is difficult to use', 'Limited payment options'],
                        opportunities: ['Simplified checkout process', 'Virtual seat preview']
                    },
                    {
                        id: 'tp3',
                        name: 'Pre-Game Email',
                        stage: 'Consideration',
                        channel: 'Email',
                        description: 'Fan receives email with game day information',
                        emotionScore: 6,
                        painPoints: ['Too much information to digest', 'Not mobile-friendly'],
                        opportunities: ['Personalized content based on seat location', 'Interactive parking map']
                    },
                    {
                        id: 'tp4',
                        name: 'Arena Entry',
                        stage: 'Experience',
                        channel: 'In-Venue',
                        description: 'Fan enters the arena through security and ticket scanning',
                        emotionScore: 4,
                        painPoints: ['Long lines', 'Confusing entry points', 'Staff not knowledgeable'],
                        opportunities: ['Express entry for season ticket holders', 'Digital queue management']
                    },
                    {
                        id: 'tp5',
                        name: 'In-Game AR Experience',
                        stage: 'Experience',
                        channel: 'AR/VR',
                        description: 'Fan uses team app for AR player stats during the game',
                        emotionScore: 9,
                        painPoints: ['Requires good cell reception', 'Battery drain'],
                        opportunities: ['Offline mode', 'Integration with venue WiFi']
                    },
                    {
                        id: 'tp6',
                        name: 'Post-Game Survey',
                        stage: 'Advocacy',
                        channel: 'Email',
                        description: 'Fan receives and completes post-game satisfaction survey',
                        emotionScore: 5,
                        painPoints: ['Too long', 'Not optimized for mobile', 'No clear benefit to fan'],
                        opportunities: ['Shorter, more engaging format', 'Incentives for completion']
                    }
                ]
            };
            
            this.journeys = [this.currentJourney];
            
            // Save to localStorage
            this.saveToLocalStorage('personas', this.personas);
            this.saveToLocalStorage('journeys', this.journeys);
            
            // Show success message
            alert('Demo data loaded successfully!');
            
            // Navigate to journey page
            this.setActivePage('journey');
        },
        
        // LocalStorage Management
        saveToLocalStorage(key, data) {
            try {
                localStorage.setItem('fanExp_' + key, JSON.stringify(data));
            } catch (e) {
                console.error('Error saving to localStorage', e);
            }
        },
        
        loadFromLocalStorage(key, defaultValue = []) {
            try {
                const data = localStorage.getItem('fanExp_' + key);
                return data ? JSON.parse(data) : defaultValue;
            } catch (e) {
                console.error('Error loading from localStorage', e);
                return defaultValue;
            }
        }
    },
    
    // Lifecycle Hooks
    mounted() {
        // Load data from localStorage
        this.personas = this.loadFromLocalStorage('personas', []);
        this.journeys = this.loadFromLocalStorage('journeys', []);
        
        // Set current journey if available
        if (this.journeys.length > 0) {
            this.currentJourney = JSON.parse(JSON.stringify(this.journeys[0]));
        }
    }
});

// Mount the Vue application
app.mount('#app');