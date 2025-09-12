// Navigation Functions
function showDashboard() {
    hideAllSections();
    document.getElementById('dashboard').classList.remove('hidden');
    setActiveNav('dashboard');
}

function showCropRecommendation() {
    hideAllSections();
    document.getElementById('crop-recommendation').classList.remove('hidden');
    document.getElementById('crop-initial').classList.remove('hidden');
    document.getElementById('crop-results').classList.add('hidden');
    setActiveNav('crop-recommendation');
}

function showFertilizer() {
    alert('Fertilizer Advisor feature coming soon!');
}

function showScanner() {
    alert('Pest Detection feature coming soon!');
}

function showPrices() {
    alert('Market Prices feature coming soon!');
}

function openAI() {
    alert('AI Assistant feature coming soon!');
}

// Helper Functions
function hideAllSections() {
    const sections = ['dashboard', 'crop-recommendation'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.classList.add('hidden');
        }
    });
}

function setActiveNav(activeView) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current nav item based on view
    if (activeView === 'dashboard' || activeView === 'crop-recommendation') {
        document.querySelector('.nav-item[onclick="showDashboard()"]').classList.add('active');
    }
}

// Crop Recommendation Functions
function showRecommendations() {
    document.getElementById('crop-initial').classList.add('hidden');
    document.getElementById('crop-results').classList.remove('hidden');
    document.getElementById('crop-results').style.animation = 'fadeIn 0.6s ease-out';
}

function hideRecommendations() {
    document.getElementById('crop-results').classList.add('hidden');
    document.getElementById('crop-initial').classList.remove('hidden');
    document.getElementById('crop-initial').style.animation = 'fadeIn 0.6s ease-out';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    showDashboard();
    
    // Add fade-in animation to all cards
    const cards = document.querySelectorAll('.dashboard-card, .card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
});