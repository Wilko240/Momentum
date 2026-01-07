/* ========================================
   MORNING RITUAL - ADDITIONAL FEATURES
   JavaScript pour: Badges, XP, Niveaux, Thème
   ======================================== */

// ========== USER DATA ==========
let userData = {
    xp: 60,
    level: 5,
    totalDays: 6,
    currentStreak: 12,
    badges: [
        {id: 'fire', unlocked: true},
        {id: 'warrior', unlocked: true},
        {id: 'star', unlocked: true},
        {id: 'champion', unlocked: false},
        {id: 'diamond', unlocked: false},
        {id: 'master', unlocked: false}
    ],
    history: []
};

// ========== BADGE SYSTEM ==========
const badgesData = [
    {
        id: 'fire',
        name: 'Série de Feu',
        icon: '🔥',
        description: '7 jours consécutifs',
        condition: (data) => data.currentStreak >= 7
    },
    {
        id: 'warrior',
        name: 'Guerrier',
        icon: '💪',
        description: '30 jours total',
        condition: (data) => data.totalDays >= 30
    },
    {
        id: 'star',
        name: 'Étoile du Matin',
        icon: '🌟',
        description: 'Semaine parfaite',
        condition: (data) => data.currentStreak >= 7
    },
    {
        id: 'champion',
        name: 'Champion',
        icon: '🏆',
        description: '100 jours total',
        condition: (data) => data.totalDays >= 100
    },
    {
        id: 'diamond',
        name: 'Diamant',
        icon: '💎',
        description: '30 jours consécutifs',
        condition: (data) => data.currentStreak >= 30
    },
    {
        id: 'master',
        name: 'Maître',
        icon: '👑',
        description: '365 jours total',
        condition: (data) => data.totalDays >= 365
    }
];

// ========== LEVEL SYSTEM ==========
const levelNames = {
    1: 'Débutant',
    2: 'Apprenti',
    3: 'Pratiquant',
    4: 'Pratiquant Assidu',
    5: 'Pratiquant Dévoué',
    6: 'Expert Débutant',
    7: 'Expert',
    8: 'Expert Confirmé',
    9: 'Maître Débutant',
    10: 'Maître',
    11: 'Maître Éclairé',
    12: 'Sage',
    13: 'Grand Sage',
    14: 'Légende Vivante',
    15: 'Légende Éternelle'
};

function getXPForLevel(level) {
    // XP needed to reach next level
    return Math.floor(50 * Math.pow(1.5, level - 1));
}

function getLevelFromXP(xp) {
    let level = 1;
    let totalXP = 0;
    
    while (totalXP + getXPForLevel(level) <= xp) {
        totalXP += getXPForLevel(level);
        level++;
    }
    
    return {
        level: level,
        currentLevelXP: xp - totalXP,
        xpForNextLevel: getXPForLevel(level)
    };
}

function updateLevelDisplay() {
    const levelInfo = getLevelFromXP(userData.xp);
    const levelNumber = document.getElementById('levelNumber');
    const levelName = document.getElementById('levelName');
    const xpFill = document.getElementById('xpFill');
    const xpText = document.getElementById('xpText');
    
    if (levelNumber) {
        levelNumber.textContent = levelInfo.level;
        levelName.textContent = levelNames[levelInfo.level] || 'Légende';
        
        const percentage = (levelInfo.currentLevelXP / levelInfo.xpForNextLevel) * 100;
        xpFill.style.width = percentage + '%';
        xpText.textContent = `${levelInfo.currentLevelXP} / ${levelInfo.xpForNextLevel} XP jusqu'au niveau ${levelInfo.level + 1}`;
    }
}

// ========== BADGE FUNCTIONS ==========
function checkAndUnlockBadges() {
    let newBadges = [];
    
    badgesData.forEach(badge => {
        const userBadge = userData.badges.find(b => b.id === badge.id);
        if (userBadge && !userBadge.unlocked && badge.condition(userData)) {
            userBadge.unlocked = true;
            newBadges.push(badge);
        }
    });
    
    return newBadges;
}

function renderBadges() {
    const container = document.querySelector('.badges-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    badgesData.forEach(badge => {
        const userBadge = userData.badges.find(b => b.id === badge.id);
        const isUnlocked = userBadge && userBadge.unlocked;
        
        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card ${isUnlocked ? '' : 'locked'}`;
        badgeCard.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-desc">${badge.description}</div>
        `;
        
        if (isUnlocked) {
            badgeCard.addEventListener('click', () => {
                alert(`🎉 ${badge.name}\n\n${badge.description}\n\nVous avez débloqué ce badge !`);
            });
        }
        
        container.appendChild(badgeCard);
    });
}

// ========== XP & ROUTINE COMPLETION ==========
function completeRoutineWithXP() {
    const sportChecked = document.getElementById('sportCheckbox').classList.contains('checked');
    const meditationChecked = document.getElementById('meditationCheckbox').classList.contains('checked');
    const journalText = document.getElementById('journalText').value.trim();
    
    let xpGained = 0;
    let message = '🎉 Bravo ! Routine validée pour aujourd\'hui.\n\n';
    
    // Calculate XP
    if (sportChecked) {
        xpGained += 10;
        message += '✓ Exercice complété (+10 XP)\n';
    } else {
        message += '○ Exercice non fait\n';
    }
    
    if (meditationChecked) {
        xpGained += 10;
        message += '✓ Méditation complétée (+10 XP)\n';
    } else {
        message += '○ Méditation non faite\n';
    }
    
    if (journalText) {
        xpGained += 5;
        message += '✓ Journal écrit (+5 XP)\n';
    }
    
    // Update user data
    const previousLevel = getLevelFromXP(userData.xp).level;
    userData.xp += xpGained;
    userData.totalDays++;
    userData.currentStreak++;
    const newLevel = getLevelFromXP(userData.xp).level;
    
    message += `\n💫 ${xpGained} XP gagnés !\n`;
    
    // Check for level up
    if (newLevel > previousLevel) {
        message += `\n🎊 NIVEAU SUPÉRIEUR !\nVous êtes maintenant niveau ${newLevel} : ${levelNames[newLevel]}`;
    }
    
    // Check for new badges
    const newBadges = checkAndUnlockBadges();
    if (newBadges.length > 0) {
        message += '\n\n🏆 NOUVEAU BADGE !\n';
        newBadges.forEach(badge => {
            message += `${badge.icon} ${badge.name}\n`;
        });
    }
    
    // Add to history
    userData.history.unshift({
        date: new Date(),
        sport: sportChecked,
        meditation: meditationChecked,
        journal: !!journalText,
        xp: xpGained
    });
    
    alert(message);
    
    // Update displays
    updateLevelDisplay();
    renderBadges();
    saveUserData();
    
    // Visual feedback
    const btn = event.currentTarget;
    btn.textContent = '✓ Validé !';
    btn.style.background = '#10B981';
    setTimeout(() => {
        btn.textContent = '✓ Routine terminée';
        btn.style.background = '';
    }, 2000);
}

// ========== THEME TOGGLE ==========
function toggleTheme() {
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = root.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        root.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.classList.add('active');
        localStorage.setItem('theme', 'dark');
    } else {
        root.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.classList.remove('active');
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    
    root.setAttribute('data-theme', savedTheme);
    if (themeToggle) {
        if (savedTheme === 'dark') {
            themeToggle.classList.add('active');
        } else {
            themeToggle.classList.remove('active');
        }
    }
}

// ========== HISTORY RENDERING ==========
function renderHistory() {
    const historyList = document.querySelector('.history-list');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    // Sample history data (in production, this would come from userData.history)
    const sampleHistory = [
        {date: new Date(2026, 0, 6), sport: true, meditation: true, journal: true},
        {date: new Date(2026, 0, 5), sport: true, meditation: true, journal: false},
        {date: new Date(2026, 0, 4), sport: true, meditation: true, journal: true},
        {date: new Date(2026, 0, 3), sport: true, meditation: false, journal: false},
        {date: new Date(2026, 0, 2), sport: true, meditation: true, journal: true},
        {date: new Date(2026, 0, 1), sport: true, meditation: true, journal: false}
    ];
    
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    sampleHistory.forEach(item => {
        const day = item.date.getDate();
        const month = months[item.date.getMonth()];
        const isComplete = item.sport && item.meditation;
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        let activities = '';
        activities += item.sport ? '✓ Exercice' : '○ Exercice';
        activities += ' • ';
        activities += item.meditation ? '✓ Méditation' : '○ Méditation';
        if (item.journal) {
            activities += ' • 📝 Journal';
        }
        
        historyItem.innerHTML = `
            <div class="history-date">
                <div class="history-day">${day}</div>
                <div class="history-month">${month}</div>
            </div>
            <div class="history-details">
                <div class="history-status">${isComplete ? 'Routine complétée' : 'Routine partielle'}</div>
                <div class="history-activities">${activities}</div>
            </div>
            <span class="history-icon">${isComplete ? '✅' : '⚠️'}</span>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// ========== CHARACTER COUNT FOR JOURNAL ==========
function updateCharCount() {
    const textarea = document.getElementById('journalText');
    const charCount = document.getElementById('charCount');
    if (textarea && charCount) {
        const count = textarea.value.length;
        charCount.textContent = `${count} / 500`;
    }
}

// ========== DATA PERSISTENCE ==========
function saveUserData() {
    localStorage.setItem('morningRitualUserData', JSON.stringify(userData));
}

function loadUserData() {
    const saved = localStorage.getItem('morningRitualUserData');
    if (saved) {
        userData = JSON.parse(saved);
    }
}

// ========== ENHANCED SCREEN SWITCHING ==========
function switchScreenEnhanced(screen) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    // Show selected screen
    const screenMap = {
        'home': 'homeScreen',
        'dashboard': 'dashboardScreen',
        'comparison': 'comparisonScreen',
        'history': 'historyScreen',
        'settings': 'settingsScreen'
    };
    
    const screenId = screenMap[screen];
    if (screenId) {
        document.getElementById(screenId).classList.add('active');
    }
    
    // Render content based on screen
    if (screen === 'dashboard') {
        updateLevelDisplay();
        renderBadges();
    } else if (screen === 'history') {
        renderHistory();
    } else if (screen === 'settings') {
        loadTheme();
    }
    
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// ========== INITIALIZATION ==========
function initializeNewFeatures() {
    loadUserData();
    loadTheme();
    updateLevelDisplay();
    renderBadges();
    
    // Setup journal character counter
    const journalText = document.getElementById('journalText');
    if (journalText) {
        journalText.addEventListener('input', updateCharCount);
    }
    
    // Replace original completeRoutine with XP version
    window.completeRoutine = completeRoutineWithXP;
    
    // Replace original switchScreen with enhanced version
    window.switchScreen = switchScreenEnhanced;
    
    console.log('✅ Morning Ritual - Nouvelles fonctionnalités chargées !');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNewFeatures);
} else {
    initializeNewFeatures();
}
