// mock-firebase.js

// Mock Firebase for demonstration (no actual Firebase dependency)
export const mockFirebase = {
    auth: {
        currentUser: null,
        async signInAnonymously() {
            const user = { uid: 'user-' + Math.random().toString(36).substr(2, 9) };
            this.currentUser = user;
            return { user };
        },
        async signInWithCustomToken(token) {
            const user = { uid: 'user-' + token.substring(0, 8) };
            this.currentUser = user;
            return { user };
        },
        async signOut() {
            this.currentUser = null;
        },
        onAuthStateChanged(callback) {
            // Simulate auth state change
            setTimeout(() => {
                if (Math.random() > 0.3) { // 70% chance of being logged in
                    const user = { 
                        uid: 'demo-user-12345',
                        displayName: 'Demo Student',
                        email: 'student@example.edu'
                    };
                    this.currentUser = user;
                    callback(user);
                } else {
                    this.currentUser = null;
                    callback(null);
                }
            }, 1000);
        }
    },
    
    firestore: {
        data: {
            courses: [
                { id: "se-101", title: "Software Requirements Engineering", instructor: "Dr. A. Smith", description: "Fundamentals of requirements gathering and analysis. Learn how to elicit, analyze, and document software requirements.", duration: "8 weeks", level: "Beginner", enrolled: 245, rating: 4.7, lectures: 12, quizzes: 4 },
                { id: "se-102", title: "Object-Oriented Design Patterns", instructor: "Prof. B. Jones", description: "Applying SOLID principles and common design patterns in software development.", duration: "10 weeks", level: "Intermediate", enrolled: 189, rating: 4.9, lectures: 16, quizzes: 5 },
                { id: "db-201", title: "Database Systems and SQL", instructor: "Ms. C. Lee", description: "Design, implementation, and querying of relational databases. Includes normalization, indexing, and optimization.", duration: "12 weeks", level: "Beginner", enrolled: 312, rating: 4.5, lectures: 20, quizzes: 6 },
                { id: "web-301", title: "Full-Stack Web Development", instructor: "Dr. D. Kumar", description: "Building modern web applications with React, Node.js, and MongoDB.", duration: "14 weeks", level: "Advanced", enrolled: 156, rating: 4.8, lectures: 24, quizzes: 8 },
                { id: "ml-401", title: "Machine Learning Fundamentals", instructor: "Prof. E. Rodriguez", description: "Introduction to ML algorithms, data preprocessing, and model evaluation.", duration: "16 weeks", level: "Intermediate", enrolled: 98, rating: 4.6, lectures: 18, quizzes: 6 },
                { id: "pm-501", title: "Agile Project Management", instructor: "Mr. F. Wilson", description: "Learn Scrum, Kanban, and agile methodologies for software projects.", duration: "6 weeks", level: "Beginner", enrolled: 210, rating: 4.4, lectures: 10, quizzes: 3 }
            ],
            
            progress: {
                "demo-user-12345": {
                    "se-101": { completed: true, score: 85, completedAt: "2025-01-15", lastAccessed: "2025-01-20" },
                    "se-102": { completed: true, score: 92, completedAt: "2025-02-10", lastAccessed: "2025-02-15" },
                    "db-201": { completed: false, score: 65, completedAt: null, lastAccessed: "2025-03-01" },
                    "web-301": { completed: false, score: 0, completedAt: null, lastAccessed: "2025-02-28" },
                    "ml-401": { completed: false, score: 0, completedAt: null, lastAccessed: null },
                    "pm-501": { completed: false, score: 0, completedAt: null, lastAccessed: null }
                }
            },
            
            quizzes: [
                { id: "quiz-1", courseId: "se-101", title: "Requirements Gathering Quiz", questions: 10, dueDate: "2025-04-01", completed: true, score: 85 },
                { id: "quiz-2", courseId: "se-101", title: "Use Cases & User Stories", questions: 8, dueDate: "2025-04-15", completed: false, score: 0 },
                { id: "quiz-3", courseId: "se-102", title: "SOLID Principles", questions: 12, dueDate: "2025-03-20", completed: true, score: 95 },
                { id: "quiz-4", courseId: "db-201", title: "SQL Basics", questions: 15, dueDate: "2025-04-10", completed: false, score: 0 }
            ],
            
            forumPosts: [
                { id: "post-1", courseId: "se-101", title: "Clarification on Use Cases", author: "Jane D.", date: "2025-03-10", replies: 5, resolved: true },
                { id: "post-2", courseId: "se-102", title: "Factory Pattern Example Needed", author: "Mike T.", date: "2025-03-12", replies: 3, resolved: false },
                { id: "post-3", courseId: "db-201", title: "Help with Normalization", author: "Sarah L.", date: "2025-03-08", replies: 8, resolved: true },
                { id: "post-4", courseId: "web-301", title: "React Hooks Question", author: "Alex R.", date: "2025-03-15", replies: 2, resolved: false }
            ]
        },
        
        async getCourses() {
            return this.data.courses;
        },
        
        async getProgress(userId) {
            return this.data.progress[userId] || {};
        },
        
        async updateProgress(userId, courseId, data) {
            if (!this.data.progress[userId]) {
                this.data.progress[userId] = {};
            }
            this.data.progress[userId][courseId] = { 
                ...this.data.progress[userId][courseId], 
                ...data,
                lastUpdated: new Date().toISOString()
            };
            return true;
        },
        
        async getQuizzes(courseId) {
            if (courseId) {
                return this.data.quizzes.filter(q => q.courseId === courseId);
            }
            return this.data.quizzes;
        },
        
        async getForumPosts(courseId) {
            if (courseId) {
                return this.data.forumPosts.filter(p => p.courseId === courseId);
            }
            return this.data.forumPosts;
        }
    }
};

// --- APP STATE ---
export const state = {
    currentView: 'home',
    user: null,
    courses: [],
    progress: {},
    quizzes: [],
    forumPosts: [],
    notifications: [
        { id: 1, title: "New Assignment Posted", message: "Database Systems Assignment 2 is now available", time: "2 hours ago", read: false },
        { id: 2, title: "Forum Reply", message: "Dr. Smith replied to your question in SE-101", time: "1 day ago", read: false },
        { id: 3, title: "Course Update", message: "New lecture videos added to Web Development course", time: "3 days ago", read: true },
        { id: 4, title: "Quiz Results", message: "Your Object-Oriented Design quiz is graded", time: "1 week ago", read: true }
    ]
};

// --- UTILITY FUNCTIONS ---

export function showModal(title, message, actionText = "Close", actionCallback = null) {
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalAction = document.getElementById('modal-action');
    const modalClose = document.getElementById('modal-close');
    const modal = document.getElementById('modal-overlay');
    
    if (!modalTitle || !modalMessage || !modalAction || !modalClose || !modal) {
        console.error('Modal elements not found');
        return;
    }
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalAction.textContent = actionText;
    
    modal.classList.remove('hidden');
    
    // Set up close button
    modalClose.onclick = () => {
        modal.classList.add('hidden');
    };
    
    // Set up action button
    modalAction.onclick = () => {
        if (actionCallback) actionCallback();
        modal.classList.add('hidden');
    };
    
    // Close when clicking outside modal
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    };
}

export function showVideoModal(courseTitle, description) {
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const videoClose = document.getElementById('video-close');
    const modal = document.getElementById('video-modal');
    
    if (!videoTitle || !videoDescription || !videoClose || !modal) {
        console.error('Video modal elements not found');
        return;
    }
    
    videoTitle.textContent = courseTitle + " - Lecture 1";
    videoDescription.textContent = description;
    
    modal.classList.remove('hidden');
    
    videoClose.onclick = () => {
        modal.classList.add('hidden');
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    };
}

export function getScoreColor(score) {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score >= 50) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
}

export function getLevelBadge(level) {
    const badges = {
        'Beginner': 'bg-blue-100 text-blue-800',
        'Intermediate': 'bg-purple-100 text-purple-800',
        'Advanced': 'bg-pink-100 text-pink-800'
    };
    return badges[level] || 'bg-gray-100 text-gray-800';
}

export function formatDate(dateStr) {
    if (!dateStr) return 'Not started';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// --- PAGE RENDERING FUNCTIONS ---

export function renderHome() {
    return `
        <div class="mb-12">
            <!-- Hero Section -->
            <div class="gradient-bg rounded-2xl shadow-2xl p-8 md:p-12 text-white mb-12">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 class="text-4xl md:text-5xl font-bold mb-4">Welcome to NexusLearn</h1>
                        <p class="text-xl mb-6 text-indigo-100">
                            Your modern, collaborative online learning platform. Access high-quality courses, interact with instructors, and track your learning progress.
                        </p>
                        <div class="flex flex-wrap gap-4">
                            <button onclick="window.nexusLearn.state.currentView='courses'; window.nexusLearn.renderContent()" class="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition duration-300 shadow-lg flex items-center space-x-2">
                                <i class="fas fa-book-open"></i>
                                <span>Browse Courses</span>
                            </button>
                            <button onclick="window.nexusLearn.state.currentView='dashboard'; window.nexusLearn.renderContent()" class="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-indigo-600 transition duration-300 flex items-center space-x-2">
                                <i class="fas fa-chart-line"></i>
                                <span>View Dashboard</span>
                            </button>
                        </div>
                    </div>
                    <div class="hidden lg:flex justify-center">
                        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <i class="fas fa-laptop-code text-8xl text-white opacity-80"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Stats Section -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div class="bg-white p-6 rounded-xl shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Active Courses</p>
                            <p class="text-3xl font-bold text-gray-800">${state.courses.length}</p>
                        </div>
                        <i class="fas fa-book text-3xl text-indigo-500"></i>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Enrolled Students</p>
                            <p class="text-3xl font-bold text-gray-800">1,210</p>
                        </div>
                        <i class="fas fa-users text-3xl text-green-500"></i>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Hours of Content</p>
                            <p class="text-3xl font-bold text-gray-800">320+</p>
                        </div>
                        <i class="fas fa-video text-3xl text-red-500"></i>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Completion Rate</p>
                            <p class="text-3xl font-bold text-gray-800">87%</p>
                        </div>
                        <i class="fas fa-trophy text-3xl text-yellow-500"></i>
                    </div>
                </div>
            </div>
            
            <!-- Featured Courses -->
            <h2 class="text-3xl font-bold text-gray-800 mb-6">Featured Courses</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                ${state.courses.slice(0, 3).map(course => {
                    const progress = state.progress[course.id] || {};
                    const isCompleted = progress.completed === true;
                    
                    return `
                        <div class="course-card bg-white p-6 rounded-xl shadow-lg">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="text-xl font-bold text-gray-800">${course.title}</h3>
                                    <p class="text-sm text-gray-500">${course.instructor}</p>
                                </div>
                                <span class="px-3 py-1 text-xs font-semibold rounded-full ${getLevelBadge(course.level)}">
                                    ${course.level}
                                </span>
                            </div>
                            <p class="text-gray-600 mb-4 text-sm">${course.description.substring(0, 100)}...</p>
                            <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                                <span><i class="fas fa-clock mr-1"></i> ${course.duration}</span>
                                <span><i class="fas fa-users mr-1"></i> ${course.enrolled} students</span>
                                <span><i class="fas fa-star text-yellow-500 mr-1"></i> ${course.rating}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <button data-course-id="${course.id}" class="watch-video-btn text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1">
                                    <i class="fas fa-play-circle"></i>
                                    <span>Preview</span>
                                </button>
                                ${isCompleted ? 
                                    `<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        <i class="fas fa-check mr-1"></i> Completed
                                    </span>` : 
                                    `<button data-course-id="${course.id}" class="enroll-btn bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                                        ${progress.score > 0 ? 'Continue' : 'Enroll Now'}
                                    </button>`
                                }
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <!-- How It Works -->
            <div class="bg-white rounded-2xl shadow-lg p-8">
                <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">How NexusLearn Works</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <div class="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-user-plus text-2xl text-indigo-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">1. Sign Up & Enroll</h3>
                        <p class="text-gray-600">Create your free account and browse our catalog of courses.</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-video text-2xl text-indigo-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">2. Learn with Video Lectures</h3>
                        <p class="text-gray-600">Watch high-quality video lectures and access reading materials.</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-trophy text-2xl text-indigo-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">3. Track Your Progress</h3>
                        <p class="text-gray-600">Complete assignments, take quizzes, and monitor your learning journey.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function renderCourses() {
    const enrolledCourses = state.courses.filter(c => state.progress[c.id]);
    const availableCourses = state.courses.filter(c => !state.progress[c.id]);
    
    return `
        <div class="mb-12">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Course Catalog</h1>
            <p class="text-gray-600 mb-8">Browse and enroll in our selection of software engineering courses.</p>
            
            ${enrolledCourses.length > 0 ? `
                <div class="mb-12">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i class="fas fa-bookmark text-indigo-600 mr-3"></i>
                        My Enrolled Courses
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        ${enrolledCourses.map(course => {
                            const progress = state.progress[course.id] || {};
                            const completionPercentage = progress.score || 0;
                            const isCompleted = progress.completed === true;
                            
                            return `
                                <div class="course-card bg-white p-6 rounded-xl shadow-lg">
                                    <div class="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 class="text-xl font-bold text-gray-800">${course.title}</h3>
                                            <p class="text-sm text-gray-500">${course.instructor}</p>
                                        </div>
                                        <span class="px-3 py-1 text-xs font-semibold rounded-full ${getLevelBadge(course.level)}">
                                            ${course.level}
                                        </span>
                                    </div>
                                    <p class="text-gray-600 mb-4 text-sm">${course.description.substring(0, 120)}...</p>
                                    
                                    <div class="mb-4">
                                        <div class="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Progress</span>
                                            <span>${completionPercentage}%</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-2">
                                            <div class="h-2 rounded-full ${completionPercentage >= 70 ? 'bg-green-600' : 'bg-yellow-500'}" style="width: ${completionPercentage}%"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                                        <span><i class="fas fa-file-alt mr-1"></i> ${course.lectures} lectures</span>
                                        <span><i class="fas fa-question-circle mr-1"></i> ${course.quizzes} quizzes</span>
                                        ${progress.lastAccessed ? 
                                            `<span><i class="fas fa-history mr-1"></i> Last accessed: ${formatDate(progress.lastAccessed)}</span>` : 
                                            ''
                                        }
                                    </div>
                                    
                                    <div class="flex justify-between">
                                        <button data-course-id="${course.id}" class="watch-video-btn text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1">
                                            <i class="fas fa-play-circle"></i>
                                            <span>Resume</span>
                                        </button>
                                        ${isCompleted ? 
                                            `<span class="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                                                <i class="fas fa-check mr-1"></i> Completed
                                            </span>` : 
                                            `<button data-course-id="${course.id}" class="complete-course-btn bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                                                Mark Complete
                                            </button>`
                                        }
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
            
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <i class="fas fa-graduation-cap text-indigo-600 mr-3"></i>
                Available Courses
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${availableCourses.map(course => {
                    return `
                        <div class="course-card bg-white p-6 rounded-xl shadow-lg">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="text-xl font-bold text-gray-800">${course.title}</h3>
                                    <p class="text-sm text-gray-500">${course.instructor}</p>
                                </div>
                                <span class="px-3 py-1 text-xs font-semibold rounded-full ${getLevelBadge(course.level)}">
                                    ${course.level}
                                </span>
                            </div>
                            <p class="text-gray-600 mb-4 text-sm">${course.description.substring(0, 120)}...</p>
                            <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                                <span><i class="fas fa-clock mr-1"></i> ${course.duration}</span>
                                <span><i class="fas fa-users mr-1"></i> ${course.enrolled} students</span>
                                <span><i class="fas fa-star text-yellow-500 mr-1"></i> ${course.rating}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <button data-course-id="${course.id}" class="watch-video-btn text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1">
                                    <i class="fas fa-play-circle"></i>
                                    <span>Preview</span>
                                </button>
                                <button data-course-id="${course.id}" class="enroll-btn bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                                    Enroll Now
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

export function renderForum() {
    return `
        <div class="mb-12">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Discussion Forum</h1>
            <p class="text-gray-600 mb-8">Ask questions, share insights, and collaborate with fellow students and instructors.</p>
            
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Recent Discussions</h2>
                    <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center space-x-2">
                        <i class="fas fa-plus"></i>
                        <span>New Post</span>
                    </button>
                </div>
                
                <div class="space-y-4">
                    ${state.forumPosts.map(post => {
                        return `
                            <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 class="font-bold text-lg text-gray-800">${post.title}</h3>
                                        <p class="text-sm text-gray-500">
                                            <span class="font-medium">${post.author}</span> • 
                                            <span>${post.date}</span> • 
                                            <span class="font-medium">${state.courses.find(c => c.id === post.courseId)?.title || post.courseId}</span>
                                        </p>
                                    </div>
                                    ${post.resolved ? 
                                        `<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            <i class="fas fa-check mr-1"></i> Resolved
                                        </span>` : 
                                        `<span class="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            <i class="fas fa-comments mr-1"></i> Active
                                        </span>`
                                    }
                                </div>
                                <div class="flex justify-between items-center mt-4">
                                    <button class="text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1">
                                        <i class="fas fa-comment-alt"></i>
                                        <span>Join Discussion (${post.replies} replies)</span>
                                    </button>
                                    <button class="text-gray-500 hover:text-gray-700">
                                        <i class="fas fa-bookmark"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <!-- Popular Courses Forum Links -->
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Course-Specific Forums</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${state.courses.slice(0, 6).map(course => {
                    const postCount = state.forumPosts.filter(p => p.courseId === course.id).length;
                    return `
                        <a href="#" data-course-id="${course.id}" class="course-forum-link bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="font-bold text-gray-800">${course.title}</h3>
                                <span class="text-sm font-medium text-gray-500">${postCount}</span>
                            </div>
                            <p class="text-sm text-gray-600 mb-2">${course.instructor}</p>
                            <div class="text-sm text-indigo-600 font-medium">
                                <i class="fas fa-comments mr-1"></i>
                                Visit Forum
                            </div>
                        </a>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

export function renderQuizzes() {
    const upcomingQuizzes = state.quizzes.filter(q => !q.completed);
    const completedQuizzes = state.quizzes.filter(q => q.completed);
    
    return `
        <div class="mb-12">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Quizzes & Assessments</h1>
            <p class="text-gray-600 mb-8">Test your knowledge and track your learning progress with our quizzes.</p>
            
            ${upcomingQuizzes.length > 0 ? `
                <div class="mb-12">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i class="fas fa-calendar-alt text-red-500 mr-3"></i>
                        Upcoming Quizzes
                    </h2>
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="py-3 px-4 text-left text-gray-700 font-semibold">Quiz</th>
                                    <th class="py-3 px-4 text-left text-gray-700 font-semibold">Course</th>
                                    <th class="py-3 px-4 text-left text-gray-700 font-semibold">Questions</th>
                                    <th class="py-3 px-4 text-left text-gray-700 font-semibold">Due Date</th>
                                    <th class="py-3 px-4 text-left text-gray-700 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${upcomingQuizzes.map(quiz => {
                                    const course = state.courses.find(c => c.id === quiz.courseId);
                                    return `
                                        <tr class="border-t border-gray-200 hover:bg-gray-50">
                                            <td class="py-4 px-4">
                                                <div class="font-medium text-gray-800">${quiz.title}</div>
                                            </td>
                                            <td class="py-4 px-4">
                                                <div class="text-gray-700">${course?.title || quiz.courseId}</div>
                                            </td>
                                            <td class="py-4 px-4">
                                                <div class="text-gray-700">${quiz.questions}</div>
                                            </td>
                                            <td class="py-4 px-4">
                                                <div class="text-gray-700 font-medium">${quiz.dueDate}</div>
                                            </td>
                                            <td class="py-4 px-4">
                                                <button class="take-quiz-btn bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition" data-quiz-id="${quiz.id}">
                                                    Take Quiz
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            ` : ''}
            
            ${completedQuizzes.length > 0 ? `
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i class="fas fa-check-circle text-green-500 mr-3"></i>
                        Completed Quizzes
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${completedQuizzes.map(quiz => {
                            const course = state.courses.find(c => c.id === quiz.courseId);
                            const scoreClass = getScoreColor(quiz.score);
                            
                            return `
                                <div class="bg-white rounded-xl shadow-lg p-6">
                                    <div class="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 class="font-bold text-lg text-gray-800">${quiz.title}</h3>
                                            <p class="text-sm text-gray-500">${course?.title || quiz.courseId}</p>
                                        </div>
                                        <span class="px-3 py-1 text-sm font-bold rounded-full ${scoreClass}">
                                            ${quiz.score}%
                                        </span>
                                    </div>
                                    <div class="text-sm text-gray-600 mb-4">
                                        <div class="flex justify-between mb-1">
                                            <span>Questions: ${quiz.questions}</span>
                                            <span>Completed: ${quiz.dueDate}</span>
                                        </div>
                                    </div>
                                    <button class="w-full bg-gray-100 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                                        Review Answers
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : `
                <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                    <i class="fas fa-clipboard-check text-4xl text-yellow-500 mb-4"></i>
                    <h3 class="text-xl font-bold text-yellow-800 mb-2">No Completed Quizzes Yet</h3>
                    <p class="text-yellow-700">Complete your first quiz to see your results here!</p>
                </div>
            `}
        </div>
    `;
}

export function renderDashboard() {
    if (!state.user) {
        return `
            <div class="bg-white rounded-xl shadow-lg p-8 text-center">
                <i class="fas fa-user-lock text-5xl text-gray-400 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
                <p class="text-gray-600 mb-6">You need to be signed in to view your personalized dashboard.</p>
                <button id="dashboard-signin-btn" class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
                    Sign In Now
                </button>
            </div>
        `;
    }

    const enrolledCourses = state.courses.filter(c => state.progress[c.id]);
    const completedCourses = enrolledCourses.filter(c => state.progress[c.id]?.completed === true);
    const inProgressCourses = enrolledCourses.filter(c => state.progress[c.id]?.completed !== true);
    
    const totalScore = enrolledCourses.reduce((sum, course) => sum + (state.progress[course.id]?.score || 0), 0);
    const averageScore = enrolledCourses.length > 0 ? Math.round(totalScore / enrolledCourses.length) : 0;
    
    const completedQuizzes = state.quizzes.filter(q => q.completed).length;
    const totalQuizzes = state.quizzes.length;
    const quizCompletionRate = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;
    
    return `
        <div class="mb-12">
            <!-- Dashboard Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
                <p class="text-gray-600">Welcome back, ${state.user.displayName || 'Student'}! Here's your learning progress.</p>
            </div>
            
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-xl shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Enrolled Courses</p>
                            <p class="text-3xl font-bold text-gray-800">${enrolledCourses.length}</p>
                        </div>
                        <i class="fas fa-book-open text-3xl text-indigo-500"></i>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-xl shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Completed</p>
                            <p class="text-3xl font-bold text-gray-800">${completedCourses.length}</p>
                        </div>
                        <i class="fas fa-check-circle text-3xl text-green-500"></i>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-xl shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Average Score</p>
                            <p class="text-3xl font-bold text-gray-800 ${averageScore >= 70 ? 'text-green-600' : averageScore >= 50 ? 'text-yellow-600' : 'text-red-600'}">${averageScore}%</p>
                        </div>
                        <i class="fas fa-chart-line text-3xl ${averageScore >= 70 ? 'text-green-500' : averageScore >= 50 ? 'text-yellow-500' : 'text-red-500'}"></i>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-xl shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Quiz Completion</p>
                            <p class="text-3xl font-bold text-gray-800">${quizCompletionRate}%</p>
                        </div>
                        <i class="fas fa-clipboard-check text-3xl text-purple-500"></i>
                    </div>
                </div>
            </div>
            
            <!-- Progress Overview -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <!-- Course Progress -->
                <div class="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-6">Course Progress</h2>
                    <div class="space-y-6">
                        ${enrolledCourses.map(course => {
                            const progress = state.progress[course.id] || {};
                            const completionPercentage = progress.score || 0;
                            
                            return `
                                <div>
                                    <div class="flex justify-between mb-1">
                                        <span class="font-medium text-gray-700">${course.title}</span>
                                        <span class="text-sm font-medium text-gray-700">${completionPercentage}%</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                                        <div class="h-2.5 rounded-full ${completionPercentage >= 70 ? 'bg-green-600' : 'bg-yellow-500'}" style="width: ${completionPercentage}%"></div>
                                    </div>
                                    <div class="flex justify-between mt-1">
                                        <span class="text-xs text-gray-500">${progress.completed ? 'Completed' : 'In progress'}</span>
                                        <span class="text-xs text-gray-500">Last activity: ${formatDate(progress.lastAccessed)}</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                        
                        ${enrolledCourses.length === 0 ? `
                            <div class="text-center py-8">
                                <i class="fas fa-book-open text-4xl text-gray-300 mb-4"></i>
                                <p class="text-gray-500">You haven't enrolled in any courses yet.</p>
                                <button onclick="window.nexusLearn.state.currentView='courses'; window.nexusLearn.renderContent()" class="mt-4 text-indigo-600 hover:text-indigo-800 font-medium">
                                    Browse available courses →
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Notifications -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold text-gray-800">Notifications</h2>
                        <span class="text-sm text-indigo-600 font-medium">${state.notifications.filter(n => !n.read).length} unread</span>
                    </div>
                    <div class="space-y-4">
                        ${state.notifications.slice(0, 4).map(notification => {
                            return `
                                <div class="p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'}">
                                    <div class="flex justify-between">
                                        <h4 class="font-medium text-gray-800">${notification.title}</h4>
                                        ${!notification.read ? 
                                            `<span class="h-2 w-2 bg-blue-500 rounded-full"></span>` : 
                                            ''
                                        }
                                    </div>
                                    <p class="text-sm text-gray-600 mt-1">${notification.message}</p>
                                    <p class="text-xs text-gray-500 mt-2">${notification.time}</p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <button class="w-full mt-4 text-center text-indigo-600 hover:text-indigo-800 font-medium">
                        View All Notifications
                    </button>
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
                <div class="space-y-4">
                    ${(() => {
                        const activities = [];
                        
                        // Add course completions
                        completedCourses.forEach(course => {
                            const progress = state.progress[course.id];
                            if (progress.completedAt) {
                                activities.push({
                                    type: 'course',
                                    title: `Completed "${course.title}"`,
                                    description: `Score: ${progress.score}%`,
                                    time: progress.completedAt,
                                    icon: 'fas fa-trophy text-green-500'
                                });
                            }
                        });
                        
                        // Add quiz completions
                        state.quizzes.filter(q => q.completed).forEach(quiz => {
                            const course = state.courses.find(c => c.id === quiz.courseId);
                            activities.push({
                                type: 'quiz',
                                title: `Completed "${quiz.title}"`,
                                description: course ? `Course: ${course.title}` : `Quiz: ${quiz.id}`,
                                time: quiz.dueDate,
                                icon: 'fas fa-clipboard-check text-blue-500'
                            });
                        });
                        
                        // Sort by time (most recent first)
                        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
                        
                        // Return only the 5 most recent activities
                        return activities.slice(0, 5).map(activity => {
                            return `
                                <div class="flex items-start p-3 hover:bg-gray-50 rounded-lg">
                                    <div class="flex-shrink-0 mt-1">
                                        <i class="${activity.icon} text-lg"></i>
                                    </div>
                                    <div class="ml-4 flex-1">
                                        <p class="font-medium text-gray-800">${activity.title}</p>
                                        <p class="text-sm text-gray-600">${activity.description}</p>
                                        <p class="text-xs text-gray-500 mt-1">${formatDate(activity.time)}</p>
                                    </div>
                                </div>
                            `;
                        }).join('');
                    })()}
                    
                    ${completedCourses.length === 0 && state.quizzes.filter(q => q.completed).length === 0 ? `
                        <div class="text-center py-6">
                            <i class="fas fa-history text-4xl text-gray-300 mb-4"></i>
                            <p class="text-gray-500">No recent activity to display.</p>
                            <p class="text-gray-500 text-sm mt-1">Start learning to see your activity here!</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

export function renderContent() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.error('Content area not found');
        return;
    }
    
    let contentHtml = '';

    switch (state.currentView) {
        case 'home':
            contentHtml = renderHome();
            break;
        case 'courses':
            contentHtml = renderCourses();
            break;
        case 'forum':
            contentHtml = renderForum();
            break;
        case 'quizzes':
            contentHtml = renderQuizzes();
            break;
        case 'dashboard':
            contentHtml = renderDashboard();
            break;
        default:
            contentHtml = renderHome();
    }

    contentArea.innerHTML = contentHtml;
    setupEventListeners();
}

// --- EVENT LISTENERS ---

export function setupEventListeners() {
    // Navigation buttons
    const navHome = document.getElementById('nav-home');
    const navCourses = document.getElementById('nav-courses');
    const navForum = document.getElementById('nav-forum');
    const navQuizzes = document.getElementById('nav-quizzes');
    const navDashboard = document.getElementById('nav-dashboard');
    
    if (navHome) navHome.onclick = () => { state.currentView = 'home'; renderContent(); };
    if (navCourses) navCourses.onclick = () => { state.currentView = 'courses'; renderContent(); };
    if (navForum) navForum.onclick = () => { state.currentView = 'forum'; renderContent(); };
    if (navQuizzes) navQuizzes.onclick = () => { state.currentView = 'quizzes'; renderContent(); };
    if (navDashboard) navDashboard.onclick = () => { state.currentView = 'dashboard'; renderContent(); };
    
    // Mobile navigation
    const navHomeMobile = document.getElementById('nav-home-mobile');
    const navCoursesMobile = document.getElementById('nav-courses-mobile');
    const navDashboardMobile = document.getElementById('nav-dashboard-mobile');
    
    if (navHomeMobile) navHomeMobile.onclick = () => { 
        state.currentView = 'home'; 
        renderContent();
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.classList.add('hidden');
    };
    
    if (navCoursesMobile) navCoursesMobile.onclick = () => { 
        state.currentView = 'courses'; 
        renderContent();
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.classList.add('hidden');
    };
    
    if (navDashboardMobile) navDashboardMobile.onclick = () => { 
        state.currentView = 'dashboard'; 
        renderContent();
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.classList.add('hidden');
    };
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.onclick = () => {
            const menu = document.getElementById('mobile-menu');
            if (menu) menu.classList.toggle('hidden');
        };
    }

    // Auth button
    const authButton = document.getElementById('auth-button');
    if (authButton) {
        authButton.onclick = async () => {
            if (state.user) {
                // Sign out
                await mockFirebase.auth.signOut();
                state.user = null;
                showModal("Signed Out", "You have been successfully signed out.");
                const userDisplay = document.getElementById('user-display');
                if (userDisplay) userDisplay.classList.add('hidden');
                authButton.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Sign In</span>';
                const navDashboard = document.getElementById('nav-dashboard');
                if (navDashboard) navDashboard.classList.add('hidden');
                renderContent();
            } else {
                // Sign in
                showModal("Signing In", "Please wait while we sign you in...");
                const result = await mockFirebase.auth.signInAnonymously();
                state.user = {
                    uid: result.user.uid,
                    displayName: "Demo Student",
                    email: "student@example.edu"
                };
                
                // Load user-specific data
                await loadUserData();
                
                const userDisplay = document.getElementById('user-display');
                if (userDisplay) {
                    userDisplay.textContent = state.user.displayName;
                    userDisplay.classList.remove('hidden');
                }
                authButton.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Sign Out</span>';
                const navDashboard = document.getElementById('nav-dashboard');
                if (navDashboard) navDashboard.classList.remove('hidden');
                showModal("Welcome!", `Welcome to NexusLearn, ${state.user.displayName}!`);
                renderContent();
            }
        };
    }
    
    // Dashboard sign in button
    const dashboardSigninBtn = document.getElementById('dashboard-signin-btn');
    if (dashboardSigninBtn) {
        dashboardSigninBtn.onclick = async () => {
            const result = await mockFirebase.auth.signInAnonymously();
            state.user = {
                uid: result.user.uid,
                displayName: "Demo Student",
                email: "student@example.edu"
            };
            await loadUserData();
            renderContent();
        };
    }
    
    // Course enrollment buttons
    document.querySelectorAll('.enroll-btn').forEach(button => {
        button.onclick = async (e) => {
            const courseId = e.currentTarget.getAttribute('data-course-id');
            const course = state.courses.find(c => c.id === courseId);
            
            if (course) {
                if (!state.user) {
                    showModal("Sign In Required", "Please sign in to enroll in courses.");
                    return;
                }
                
                // Initialize progress for this course
                await mockFirebase.firestore.updateProgress(state.user.uid, courseId, {
                    enrolled: true,
                    enrolledAt: new Date().toISOString(),
                    score: 0,
                    completed: false
                });
                
                // Update local state
                if (!state.progress[courseId]) {
                    state.progress[courseId] = {};
                }
                state.progress[courseId] = {
                    ...state.progress[courseId],
                    enrolled: true,
                    enrolledAt: new Date().toISOString(),
                    score: 0,
                    completed: false,
                    lastAccessed: new Date().toISOString()
                };
                
                showModal("Enrollment Successful", `You have successfully enrolled in "${course.title}"!`);
                renderContent();
            }
        };
    });
    
    // Course completion buttons
    document.querySelectorAll('.complete-course-btn').forEach(button => {
        button.onclick = async (e) => {
            const courseId = e.currentTarget.getAttribute('data-course-id');
            const course = state.courses.find(c => c.id === courseId);
            
            if (course && state.user) {
                const progress = state.progress[courseId] || {};
                const isCompleted = progress.completed === true;
                
                await mockFirebase.firestore.updateProgress(state.user.uid, courseId, {
                    completed: !isCompleted,
                    completedAt: !isCompleted ? new Date().toISOString() : null,
                    score: !isCompleted ? (progress.score || 0) + 20 : progress.score // Demo logic
                });
                
                // Update local state
                state.progress[courseId] = {
                    ...state.progress[courseId],
                    completed: !isCompleted,
                    completedAt: !isCompleted ? new Date().toISOString() : null,
                    score: !isCompleted ? (progress.score || 0) + 20 : progress.score
                };
                
                showModal(
                    isCompleted ? "Course Reopened" : "Course Completed",
                    isCompleted ? 
                        `"${course.title}" has been marked as incomplete.` : 
                        `Congratulations! You have completed "${course.title}"!`
                );
                renderContent();
            }
        };
    });
    
    // Watch video buttons
    document.querySelectorAll('.watch-video-btn').forEach(button => {
        button.onclick = (e) => {
            const courseId = e.currentTarget.getAttribute('data-course-id');
            const course = state.courses.find(c => c.id === courseId);
            
            if (course) {
                showVideoModal(course.title, course.description);
                
                // Update last accessed time
                if (state.user && state.progress[courseId]) {
                    state.progress[courseId].lastAccessed = new Date().toISOString();
                }
            }
        };
    });
    
    // Take quiz buttons
    document.querySelectorAll('.take-quiz-btn').forEach(button => {
        button.onclick = async (e) => {
            const quizId = e.currentTarget.getAttribute('data-quiz-id');
            const quiz = state.quizzes.find(q => q.id === quizId);
            
            if (quiz) {
                showModal("Quiz Simulation", "This is a quiz simulation. In a real application, you would take an actual quiz here with multiple-choice questions, coding challenges, etc.", "Start Quiz", () => {
                    // Simulate quiz completion
                    const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
                    
                    // Find and update the quiz
                    const quizIndex = state.quizzes.findIndex(q => q.id === quizId);
                    if (quizIndex !== -1) {
                        state.quizzes[quizIndex].completed = true;
                        state.quizzes[quizIndex].score = score;
                    }
                    
                    // Update course progress if applicable
                    if (state.user && quiz.courseId && state.progress[quiz.courseId]) {
                        state.progress[quiz.courseId].score = Math.max(
                            state.progress[quiz.courseId].score || 0,
                            score
                        );
                    }
                    
                    showModal("Quiz Completed", `You scored ${score}% on "${quiz.title}"!`);
                    renderContent();
                });
            }
        };
    });
    
    // Course forum links
    document.querySelectorAll('.course-forum-link').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const courseId = e.currentTarget.getAttribute('data-course-id');
            state.currentView = 'forum';
            renderContent();
            showModal("Forum Filter Applied", `Now showing discussions for the selected course.`);
        };
    });
}

// --- DATA LOADING ---

export async function loadInitialData() {
    try {
        // Load courses
        state.courses = await mockFirebase.firestore.getCourses();
        
        // Load quizzes
        state.quizzes = await mockFirebase.firestore.getQuizzes();
        
        // Load forum posts
        state.forumPosts = await mockFirebase.firestore.getForumPosts();
        
        console.log("Initial data loaded:", {
            courses: state.courses.length,
            quizzes: state.quizzes.length,
            forumPosts: state.forumPosts.length
        });
        
        // Set up auth state listener
        mockFirebase.auth.onAuthStateChanged(async (user) => {
            if (user) {
                state.user = {
                    uid: user.uid,
                    displayName: user.displayName || "Demo Student",
                    email: user.email || "student@example.edu"
                };
                
                // Load user-specific data
                await loadUserData();
                
                // Update UI
                const userDisplay = document.getElementById('user-display');
                const authButton = document.getElementById('auth-button');
                const navDashboard = document.getElementById('nav-dashboard');
                
                if (userDisplay) {
                    userDisplay.textContent = state.user.displayName;
                    userDisplay.classList.remove('hidden');
                }
                
                if (authButton) {
                    authButton.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Sign Out</span>';
                }
                
                if (navDashboard) {
                    navDashboard.classList.remove('hidden');
                }
            } else {
                state.user = null;
                const userDisplay = document.getElementById('user-display');
                const authButton = document.getElementById('auth-button');
                const navDashboard = document.getElementById('nav-dashboard');
                
                if (userDisplay) userDisplay.classList.add('hidden');
                if (authButton) authButton.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Sign In</span>';
                if (navDashboard) navDashboard.classList.add('hidden');
            }
            
            renderContent();
        });
        
    } catch (error) {
        console.error("Error loading initial data:", error);
        showModal("Error", "Failed to load application data. Please refresh the page.");
    }
}

export async function loadUserData() {
    if (!state.user) return;
    
    try {
        // Load user progress
        state.progress = await mockFirebase.firestore.getProgress(state.user.uid) || {};
        console.log("User progress loaded:", state.progress);
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

// --- INITIALIZATION ---
export async function initializeApp() {
    // Load initial data
    await loadInitialData();
    
    // Render initial content
    renderContent();
    
    // Show welcome message after a short delay
    setTimeout(() => {
        showModal(
            "Welcome to NexusLearn Demo",
            "This is a demonstration of the NexusLearn online learning platform for COSC 369 Software Engineering class. You can sign in as a demo student, browse courses, track progress, and explore all features.",
            "Get Started"
        );
    }, 1000);
}

// Export all functions as a single object for easier use
const nexusLearn = {
    mockFirebase,
    state,
    showModal,
    showVideoModal,
    getScoreColor,
    getLevelBadge,
    formatDate,
    renderHome,
    renderCourses,
    renderForum,
    renderQuizzes,
    renderDashboard,
    renderContent,
    setupEventListeners,
    loadInitialData,
    loadUserData,
    initializeApp
};

// Make it available globally for onclick handlers
if (typeof window !== 'undefined') {
    window.nexusLearn = nexusLearn;
}

export default nexusLearn;