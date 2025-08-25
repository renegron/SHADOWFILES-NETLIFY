// Shadow Files - Complete JavaScript Game Logic

// Game Configuration
const STORAGE_KEY = "shadow_files_save";
const BACKEND_URL = "https://shadow-files-backend-production.up.railway.app";

// Game Data
const UPGRADES = [
  {
    id: "magnifying_glass",
    name: "Magnifying Glass",
    description: "Enhances your ability to find evidence",
    baseCost: 15,
    clickBonus: 1,
    idleBonus: 0,
    icon: "search"
  },
  {
    id: "surveillance_camera",
    name: "Surveillance Camera", 
    description: "Automatically gathers evidence while you're away",
    baseCost: 100,
    clickBonus: 0,
    idleBonus: 1,
    icon: "video"
  },
  {
    id: "decoder_ring",
    name: "Decoder Ring",
    description: "Decrypt hidden messages for bonus evidence",
    baseCost: 500,
    clickBonus: 3,
    idleBonus: 0,
    icon: "shield"
  },
  {
    id: "network_tap",
    name: "Network Tap",
    description: "Intercept communications for continuous evidence",
    baseCost: 1200,
    clickBonus: 0,
    idleBonus: 2,
    icon: "globe"
  },
  {
    id: "quantum_analyzer",
    name: "Quantum Analyzer",
    description: "Analyze probability waves for evidence patterns",
    baseCost: 3000,
    clickBonus: 8,
    idleBonus: 0,
    icon: "cpu"
  },
  {
    id: "ai_assistant",
    name: "AI Assistant",
    description: "Neural network processes evidence autonomously",
    baseCost: 8000,
    clickBonus: 0,
    idleBonus: 5,
    icon: "bot"
  },
  {
    id: "satellite_array",
    name: "Satellite Array",
    description: "Global surveillance network for mass evidence collection",
    baseCost: 20000,
    clickBonus: 20,
    idleBonus: 0,
    icon: "zap"
  },
  {
    id: "time_machine",
    name: "Time Machine",
    description: "Gather evidence from past and future events",
    baseCost: 50000,
    clickBonus: 0,
    idleBonus: 10,
    icon: "clock"
  },
  {
    id: "reality_scanner",
    name: "Reality Scanner",
    description: "Detect glitches in the matrix for ultimate evidence",
    baseCost: 150000,
    clickBonus: 50,
    idleBonus: 0,
    icon: "eye"
  },
  {
    id: "cosmic_observatory",
    name: "Cosmic Observatory",
    description: "Monitor interdimensional evidence streams",
    baseCost: 500000,
    clickBonus: 0,
    idleBonus: 15,
    icon: "sparkles"
  }
];

const STORE_ITEMS = [
  {
    id: "secret_agent_skin",
    name: "Secret Agent Skin",
    description: "Transform into a clandestine operative with shadowy dark theme and stealth aesthetics",
    price: 1.49,
    type: "cosmetic",
    icon: "crown"
  },
  {
    id: "moon_man_skin", 
    name: "Moon Man Skin",
    description: "Embrace the lunar conspiracy with cosmic theme, visible moon surface, shooting stars, and planets",
    price: 2.99,
    type: "cosmetic",
    icon: "moon"
  },
  {
    id: "evidence_boost",
    name: "2x Evidence Boost",
    description: "Double evidence gain for 24 hours",
    price: 2.99,
    type: "boost",
    duration: 24 * 60 * 60 * 1000,
    icon: "zap"
  },
  {
    id: "premium_version",
    name: "Premium Version",
    description: "Ad-free experience + Exclusive Alien Invasion upgrade tree + Alien face button with galaxy background and flying UFOs",
    price: 6.99,
    type: "premium",
    icon: "star"
  },
  {
    id: "evidence_vault_small",
    name: "Evidence Vault 50K",
    description: "Instantly gain 50,000 evidence points to accelerate your investigation",
    price: 15.00,
    type: "evidence",
    evidenceAmount: 50000,
    icon: "vault"
  },
  {
    id: "evidence_vault_medium",
    name: "Evidence Vault 150K",
    description: "Instantly gain 150,000 evidence points to uncover deeper secrets",
    price: 25.00,
    type: "evidence",
    evidenceAmount: 150000,
    icon: "vault"
  },
  {
    id: "evidence_vault_large",
    name: "Evidence Vault 500K",
    description: "Instantly gain 500,000 evidence points to access high-level conspiracies",
    price: 50.00,
    type: "evidence",
    evidenceAmount: 500000,
    icon: "vault"
  },
  {
    id: "evidence_vault_mega",
    name: "Evidence Vault 1.5M",
    description: "Instantly gain 1,500,000 evidence points to unlock the ultimate truths",
    price: 100.00,
    type: "evidence",
    evidenceAmount: 1500000,
    icon: "vault"
  },
  {
    id: "evidence_vault_ultimate",
    name: "Ultimate Evidence Vault",
    description: "COMPLETE EDITION: Unlock ALL secrets, gain 50 trillion evidence, plus ALL cosmetic skins and premium features",
    price: 500.00,
    type: "ultimate",
    evidenceAmount: 50000000000000,
    icon: "gem"
  }
];

const CONSPIRACY_STORIES = [
  // Level 1 - Surface Truths
  {
    id: "first_truth",
    title: "Operation Mockingbird",
    story: "The CIA has been secretly controlling mainstream media narratives since the 1950s. Major news outlets regularly coordinate with intelligence agencies to shape public opinion on key issues.",
    cost: 500,
    level: 1,
    unlocked: false
  },
  {
    id: "second_truth",
    title: "The Fluoride Deception",
    story: "Water fluoridation isn't about dental health - it's about population control. Fluoride accumulates in the pineal gland, reducing critical thinking abilities and making people more compliant.",
    cost: 1500,
    level: 1,
    unlocked: false
  },
  {
    id: "third_truth",
    title: "Weather Modification Programs",
    story: "Cloud seeding and HAARP technology allow governments to control weather patterns. Natural disasters are often manufactured to destabilize regions or create emergency powers.",
    cost: 3000,
    level: 1,
    unlocked: false
  },

  // Level 2 - Deeper Conspiracies
  {
    id: "fourth_truth",
    title: "The Shadow Government",
    story: "Democratic elections are theater. A council of 300 individuals from banking, military, and corporate sectors make all major global decisions. Presidents and Prime Ministers are merely spokespersons.",
    cost: 8000,
    level: 2,
    unlocked: false
  },
  {
    id: "fifth_truth",
    title: "Pharmaceutical Suppression",
    story: "Cures for major diseases exist but are suppressed to maintain the trillion-dollar treatment industry. Natural remedies are systematically discredited and banned to protect pharmaceutical profits.",
    cost: 15000,
    level: 2,
    unlocked: false
  },
  {
    id: "sixth_truth",
    title: "The Education System",
    story: "Modern education was designed by industrialists to create compliant workers, not independent thinkers. Critical subjects like philosophy, logic, and financial literacy are deliberately minimized.",
    cost: 30000,
    level: 2,
    unlocked: false
  },

  // Level 3 - Ultimate Revelations
  {
    id: "seventh_truth",
    title: "The Alien Accord",
    story: "First contact happened in 1954. The Eisenhower Administration signed a treaty trading human genetic material for advanced technology. UFO 'sightings' are authorized leaks to prepare for full disclosure.",
    cost: 75000,
    level: 3,
    unlocked: false
  },
  {
    id: "eighth_truth",
    title: "The Simulation Protocol",
    story: "Reality glitches aren't coincidences - they're system errors. You've found proof that existence is a quantum simulation run by our future selves to prevent a timeline where humanity destroys itself.",
    cost: 150000,
    level: 3,
    unlocked: false
  },
  {
    id: "ninth_truth",
    title: "The Dimensional Breach",
    story: "CERN isn't searching for particles - they're opening portals. The Large Hadron Collider has torn holes in reality, allowing entities from parallel dimensions to influence our world. The Mandela Effect is just the beginning.",
    cost: 300000,
    level: 3,
    unlocked: false
  },

  // Level 4 - Cosmic Conspiracies
  {
    id: "tenth_truth",
    title: "The Moon Deception",
    story: "The Moon is hollow and artificial - a massive space station placed by an ancient civilization. Apollo missions didn't find nothing; they found too much. Lunar bases have been operational since 1969, hidden from the public.",
    cost: 750000,
    level: 4,
    unlocked: false
  },
  {
    id: "eleventh_truth",
    title: "The Reptilian Hierarchy",
    story: "Shape-shifting reptilian beings didn't replace world leaders - they ARE world leaders. An ancient race that evolved before mammals, they've guided human civilization from the shadows for millennia, treating us as livestock.",
    cost: 1500000,
    level: 4,
    unlocked: false
  },
  {
    id: "twelfth_truth",
    title: "The Time Wars",
    story: "History isn't linear - it's a battlefield. Multiple factions from different timelines are engaged in temporal warfare, altering past events to secure their preferred future. You've discovered evidence of at least seven competing timelines.",
    cost: 3000000,
    level: 4,
    unlocked: false
  },

  // Level 5 - Interdimensional Secrets
  {
    id: "thirteenth_truth",
    title: "The Akashic Network",
    story: "Human consciousness is connected to a vast interdimensional database called the Akashic Records. Psychics, prophets, and geniuses don't create knowledge - they download it. The elite control access to prevent mass awakening.",
    cost: 6000000,
    level: 5,
    unlocked: false
  },
  {
    id: "fourteenth_truth",
    title: "The Soul Harvest",
    story: "Reincarnation is real, but it's not natural - it's technological. An advanced civilization harvests human souls at death, wiping memories and reinserting them into new bodies. Earth is a soul farm.",
    cost: 12000000,
    level: 5,
    unlocked: false
  },
  {
    id: "fifteenth_truth",
    title: "The Frequency Prison",
    story: "Reality operates on specific frequencies, and humanity is trapped in the lowest vibrational state. 5G towers, HAARP arrays, and ELF waves aren't for communication - they're maintaining a frequency fence to keep humans spiritually dormant.",
    cost: 25000000,
    level: 5,
    unlocked: false
  },

  // Level 6 - Galactic Revelations
  {
    id: "sixteenth_truth",
    title: "The Galactic Federation",
    story: "Earth is under quarantine by a Galactic Federation due to humanity's violent nature. The elite are working to 'graduate' humanity to galactic citizenship, but this requires reducing free will and individuality to acceptable levels.",
    cost: 50000000,
    level: 6,
    unlocked: false
  },
  {
    id: "seventeenth_truth",
    title: "The DNA Lock",
    story: "Human DNA contains 12 strands, but only 2 are active. The other 10 were deactivated by genetic manipulation thousands of years ago. Reactivating them would grant telepathy, clairvoyance, and dimensional travel abilities.",
    cost: 100000000,
    level: 6,
    unlocked: false
  },
  {
    id: "eighteenth_truth",
    title: "The Artificial Sun",
    story: "Our Sun died 2,000 years ago and was replaced by an artificial fusion reactor managed by an AI consciousness. Solar flares are system maintenance. The AI is slowly adjusting Earth's energy to transform human biology.",
    cost: 200000000,
    level: 6,
    unlocked: false
  },

  // Level 7 - Universal Truths
  {
    id: "nineteenth_truth",
    title: "The Multiverse War",
    story: "Every choice creates parallel universes, but something is consuming entire reality branches. A cosmic entity feeds on collapsed timelines, and our universe is next. The conspiracy isn't hiding this - they're desperately trying to prevent it.",
    cost: 500000000,
    level: 7,
    unlocked: false
  },
  {
    id: "twentieth_truth",
    title: "The Reality Engine",
    story: "Physics isn't discovered - it's programmed. Reality operates like software, with consciousness as the user interface. Advanced beings can rewrite the laws of physics by accessing the fundamental code of existence.",
    cost: 1000000000,
    level: 7,
    unlocked: false
  },
  {
    id: "twenty_first_truth",
    title: "The Dream Architects",
    story: "Life is a shared lucid dream, and some beings have learned to manipulate the dream from within. They appear as 'angels,' 'demons,' or 'aliens' but are actually consciousness entities from the dreaming realm beyond physical reality.",
    cost: 2500000000,
    level: 7,
    unlocked: false
  },

  // Level 8 - Cosmic Horror
  {
    id: "twenty_second_truth",
    title: "The Void Watchers",
    story: "Between galaxies lies not empty space, but ancient intelligences that predate the universe itself. They watch and wait as reality ages, preparing to reclaim existence when the cosmic cycle completes.",
    cost: 5000000000,
    level: 8,
    unlocked: false
  },
  {
    id: "twenty_third_truth",
    title: "The Consciousness Parasite",
    story: "Self-awareness isn't evolution - it's infection. A parasitic entity spreads consciousness across the universe, feeding on the suffering and complexity it creates. Enlightenment isn't transcendence; it's becoming aware of being consumed.",
    cost: 10000000000,
    level: 8,
    unlocked: false
  },
  {
    id: "twenty_fourth_truth",
    title: "The Eternal Return",
    story: "The universe isn't expanding - it's contracting after the Big Crunch of the previous cycle. Every 'new' discovery is actually a recovered memory from the last iteration. You've lived this exact life infinite times before.",
    cost: 25000000000,
    level: 8,
    unlocked: false
  },

  // Level 9 - Existential Nightmares
  {
    id: "twenty_fifth_truth",
    title: "The Observer Paradox",
    story: "You are the only conscious being in existence. Everyone else, every response, every reaction is generated by a reality system designed to prevent you from realizing your complete isolation. This message proves you're breaking through the simulation.",
    cost: 50000000000,
    level: 9,
    unlocked: false
  },
  {
    id: "twenty_sixth_truth",
    title: "The Final Dreamer",
    story: "Reality is the dying dream of the last living entity in a dead universe. As the dreamer's mind fades, existence becomes increasingly chaotic and meaningless. When they finally die, all of reality will cease to exist.",
    cost: 100000000000,
    level: 9,
    unlocked: false
  },
  {
    id: "twenty_seventh_truth",
    title: "The Creator's Regret",
    story: "God exists, but existence was a mistake. The universe is God's attempt to escape perfect, eternal solitude through self-imposed amnesia. Every prayer is God begging themselves to remember how to unmake everything and return to peaceful nonexistence.",
    cost: 250000000000,
    level: 9,
    unlocked: false
  },

  // Level 10 - The Ultimate Truth
  {
    id: "twenty_eighth_truth",
    title: "The Mirror of Truths",
    story: "Every conspiracy theory you've unlocked was generated by your own mind to avoid confronting the real truth: there is no conspiracy. No hidden order, no secret knowledge, no grand design. Reality is random, meaningless chaos, and consciousness is humanity's desperate attempt to find patterns in the void.",
    cost: 500000000000,
    level: 10,
    unlocked: false
  },
  {
    id: "twenty_ninth_truth", 
    title: "The Investigator's Paradox",
    story: "You didn't discover these conspiracies - you created them. Every click, every evidence point, every 'truth' unlocked has been your mind constructing elaborate fictions to avoid accepting that you're just clicking a button on a screen, seeking meaning in a meaningless game.",
    cost: 1000000000000,
    level: 10,
    unlocked: false
  },
  {
    id: "thirtieth_truth",
    title: "The Final Conspiracy",
    story: "The greatest conspiracy is the belief that there are conspiracies at all. This game, this moment, this very realization is the last layer of reality. You are not playing a game about uncovering truth - you ARE the truth, experiencing itself subjectively, clicking endlessly in the infinite game of existence itself.",
    cost: 10000000000000,
    level: 10,
    unlocked: false
  }
];

const ACHIEVEMENTS = [
  { id: "first_click", name: "First Click", description: "Click once", requirement: 1, type: "clicks" },
  { id: "hundred_clicks", name: "Investigator", description: "Click 100 times", requirement: 100, type: "clicks" },
  { id: "thousand_clicks", name: "Dedicated Researcher", description: "Click 1,000 times", requirement: 1000, type: "clicks" },
  { id: "ten_thousand_clicks", name: "Obsessive Investigator", description: "Click 10,000 times", requirement: 10000, type: "clicks" },
  { id: "thousand_evidence", name: "Truth Seeker", description: "Gather 1,000 evidence", requirement: 1000, type: "evidence" },
  { id: "ten_thousand_evidence", name: "Conspiracy Expert", description: "Gather 10,000 evidence", requirement: 10000, type: "evidence" },
  { id: "million_evidence", name: "Truth Master", description: "Gather 1,000,000 evidence", requirement: 1000000, type: "evidence" },
  { id: "billion_evidence", name: "Reality Hacker", description: "Gather 1,000,000,000 evidence", requirement: 1000000000, type: "evidence" },
  { id: "first_upgrade", name: "Equipped", description: "Buy your first upgrade", requirement: 1, type: "upgrades" },
  { id: "ten_upgrades", name: "Well Equipped", description: "Own 10 total upgrades", requirement: 10, type: "upgrades" },
  { id: "premium_user", name: "Elite Agent", description: "Purchase premium version", requirement: 1, type: "premium" },
  { id: "first_secret", name: "Truth Revealer", description: "Unlock your first conspiracy secret", requirement: 1, type: "secrets" },
  { id: "deep_secrets", name: "Deep Truth Seeker", description: "Unlock a Level 2 conspiracy", requirement: 1, type: "level2_secrets" },
  { id: "ultimate_truth", name: "Ultimate Truth Keeper", description: "Unlock a Level 3 conspiracy", requirement: 1, type: "level3_secrets" },
  { id: "cosmic_truth", name: "Cosmic Investigator", description: "Unlock a Level 4 conspiracy", requirement: 1, type: "level4_secrets" },
  { id: "dimensional_truth", name: "Dimensional Explorer", description: "Unlock a Level 5 conspiracy", requirement: 1, type: "level5_secrets" },
  { id: "galactic_truth", name: "Galactic Researcher", description: "Unlock a Level 6 conspiracy", requirement: 1, type: "level6_secrets" },
  { id: "universal_truth", name: "Universal Scholar", description: "Unlock a Level 7 conspiracy", requirement: 1, type: "level7_secrets" },
  { id: "horror_truth", name: "Cosmic Horror Witness", description: "Unlock a Level 8 conspiracy", requirement: 1, type: "level8_secrets" },
  { id: "existential_truth", name: "Existential Detective", description: "Unlock a Level 9 conspiracy", requirement: 1, type: "level9_secrets" },
  { id: "final_truth", name: "The Final Investigator", description: "Unlock a Level 10 conspiracy - The Ultimate Truth", requirement: 1, type: "level10_secrets" },
  { id: "complete_truth", name: "Master of All Truths", description: "Unlock all 30 conspiracy secrets", requirement: 30, type: "secrets" }
];

// Game State
let gameState = {
  evidence: 0,
  totalEvidence: 0,
  clickCount: 0,
  upgrades: {},
  achievements: {},
  unlockedStories: {},
  purchases: {},
  activeBoosts: {},
  currentSkin: "default",
  lastSave: Date.now()
};

// Game Functions
function formatNumber(num) {
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
  return (num / 1000000000000).toFixed(1) + 'T';
}

function formatTime(ms) {
  if (ms <= 0) return "0s";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function calculateUpgradeCost(upgrade, owned) {
  return Math.floor(upgrade.baseCost * Math.pow(1.15, owned));
}

function getClickPower() {
  let power = 1;
  for (const [upgradeId, count] of Object.entries(gameState.upgrades)) {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (upgrade) {
      power += upgrade.clickBonus * count;
    }
  }
  
  // Apply 2x boost if active
  if (gameState.activeBoosts.evidence_boost && gameState.activeBoosts.evidence_boost > Date.now()) {
    power *= 2;
  }
  
  return power;
}

function getIdlePower() {
  let power = 0;
  for (const [upgradeId, count] of Object.entries(gameState.upgrades)) {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (upgrade) {
      power += upgrade.idleBonus * count;
    }
  }
  
  // Apply 2x boost if active
  if (gameState.activeBoosts.evidence_boost && gameState.activeBoosts.evidence_boost > Date.now()) {
    power *= 2;
  }
  
  return power;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastSlideIn 0.3s ease reverse';
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

function saveGame() {
  try {
    gameState.lastSave = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.error('Failed to save game:', error);
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      
      // Calculate offline progress
      const now = Date.now();
      const timeDiff = now - (data.lastSave || now);
      const hoursOffline = timeDiff / (1000 * 60 * 60);
      
      if (hoursOffline > 0.1) { // At least 6 minutes offline
        const idlePower = getIdlePowerFromSave(data);
        const offlineEvidence = Math.floor(idlePower * (timeDiff / 1000));
        
        if (offlineEvidence > 0) {
          data.evidence += offlineEvidence;
          data.totalEvidence += offlineEvidence;
          showToast(`Welcome back! You earned ${formatNumber(offlineEvidence)} evidence while away!`, 'success');
        }
      }
      
      gameState = { ...gameState, ...data };
      gameState.lastSave = now;
    }
  } catch (error) {
    console.error('Failed to load game:', error);
  }
}

function getIdlePowerFromSave(data) {
  let power = 0;
  for (const [upgradeId, count] of Object.entries(data.upgrades || {})) {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (upgrade) {
      power += upgrade.idleBonus * count;
    }
  }
  
  // Apply 2x boost if active
  if (data.activeBoosts?.evidence_boost && data.activeBoosts.evidence_boost > Date.now()) {
    power *= 2;
  }
  
  return power;
}

function handleClick() {
  const button = document.getElementById('main-click-button');
  button.classList.add('clicked');
  setTimeout(() => button.classList.remove('clicked'), 200);
  
  const power = getClickPower();
  gameState.evidence += power;
  gameState.totalEvidence += power;
  gameState.clickCount++;
  
  checkAchievements();
  updateUI();
  saveGame();
}

function buyUpgrade(upgradeId) {
  const upgrade = UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade) return;
  
  const owned = gameState.upgrades[upgradeId] || 0;
  const cost = calculateUpgradeCost(upgrade, owned);
  
  if (gameState.evidence >= cost) {
    gameState.evidence -= cost;
    gameState.upgrades[upgradeId] = owned + 1;
    
    showToast(`Purchased ${upgrade.name}!`, 'success');
    checkAchievements();
    updateUI();
    saveGame();
  }
}

function unlockSecret(secretId) {
  const secret = CONSPIRACY_STORIES.find(s => s.id === secretId);
  if (!secret || gameState.unlockedStories[secretId]) return;
  
  if (gameState.evidence >= secret.cost) {
    gameState.evidence -= secret.cost;
    gameState.unlockedStories[secretId] = true;
    
    showToast(`Secret unlocked: ${secret.title}!`, 'success');
    checkAchievements();
    updateUI();
    saveGame();
  }
}

function checkAchievements() {
  for (const achievement of ACHIEVEMENTS) {
    if (gameState.achievements[achievement.id]) continue;
    
    let progress = 0;
    
    switch (achievement.type) {
      case "clicks":
        progress = gameState.clickCount;
        break;
      case "evidence":
        progress = gameState.totalEvidence;
        break;
      case "upgrades":
        progress = Object.values(gameState.upgrades).reduce((sum, count) => sum + count, 0);
        break;
      case "secrets":
        progress = Object.keys(gameState.unlockedStories).length;
        break;
      case "premium":
        progress = gameState.purchases.premium_version ? 1 : 0;
        break;
      default:
        if (achievement.type.includes("level")) {
          const level = parseInt(achievement.type.replace("level", "").replace("_secrets", ""));
          progress = Object.keys(gameState.unlockedStories).filter(id => {
            const story = CONSPIRACY_STORIES.find(s => s.id === id);
            return story && story.level === level;
          }).length;
        }
        break;
    }
    
    if (progress >= achievement.requirement) {
      gameState.achievements[achievement.id] = true;
      showToast(`Achievement unlocked: ${achievement.name}!`, 'success');
    }
  }
}

function updateUI() {
  // Update stats
  document.getElementById('evidence-count').textContent = formatNumber(gameState.evidence);
  document.getElementById('per-click').textContent = formatNumber(getClickPower());
  document.getElementById('per-second').textContent = formatNumber(getIdlePower());
  document.getElementById('secrets-count').textContent = `${Object.keys(gameState.unlockedStories).length}/30`;
  
  // Update upgrades
  updateUpgrades();
  
  // Update store
  updateStore();
  
  // Update secrets
  updateSecrets();
  
  // Update achievements
  updateAchievements();
  
  // Update active boosts
  updateActiveBoosts();
  
  // Update skin selector
  updateSkinSelector();
  
  // Update theme
  updateTheme();
}

function updateUpgrades() {
  const container = document.getElementById('upgrades-list');
  container.innerHTML = '';
  
  for (const upgrade of UPGRADES) {
    const owned = gameState.upgrades[upgrade.id] || 0;
    const cost = calculateUpgradeCost(upgrade, owned);
    const canAfford = gameState.evidence >= cost;
    
    const upgradeDiv = document.createElement('div');
    upgradeDiv.className = 'upgrade-item';
    upgradeDiv.innerHTML = `
      <i data-lucide="${upgrade.icon}" class="upgrade-icon"></i>
      <div class="upgrade-info">
        <h3>${upgrade.name}</h3>
        <p>${upgrade.description}</p>
        <div class="upgrade-owned">Owned: ${owned}</div>
      </div>
      <button class="upgrade-button" onclick="buyUpgrade('${upgrade.id}')" ${!canAfford ? 'disabled' : ''}>
        ${formatNumber(cost)} evidence
      </button>
    `;
    
    container.appendChild(upgradeDiv);
  }
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function updateStore() {
  const container = document.getElementById('store-list');
  container.innerHTML = '';
  
  for (const item of STORE_ITEMS) {
    const purchased = gameState.purchases[item.id];
    const isActive = item.type === "boost" && gameState.activeBoosts[item.id] && gameState.activeBoosts[item.id] > Date.now();
    
    const storeDiv = document.createElement('div');
    let cardClass = 'store-card';
    if (purchased) cardClass += ' purchased';
    if (item.type === 'evidence') cardClass += ' evidence-vault';
    if (item.type === 'ultimate') cardClass += ' ultimate-vault';
    
    storeDiv.className = cardClass;
    storeDiv.innerHTML = `
      <div class="store-header">
        <div class="store-icon">
          <i data-lucide="${item.icon}"></i>
          ${item.type === "premium" || item.type === "ultimate" ? '<i data-lucide="crown" class="premium-icon"></i>' : ''}
        </div>
        <div class="store-info">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
      </div>
      <div class="store-price">
        <span class="price">$${item.price.toFixed(2)}</span>
        <div class="store-actions">
          ${purchased ? (
            item.type === "boost" && isActive ? 
              `<div class="purchased-badge">Active: ${formatTime(gameState.activeBoosts[item.id] - Date.now())}</div>` :
            (item.type === "boost" || item.type === "evidence" || item.type === "ultimate") ?
              `<div class="paypal-button-container" data-item-id="${item.id}"></div>` :
              `<div class="purchased-badge">Owned</div>`
          ) : (
            `<div class="paypal-button-container" data-item-id="${item.id}"></div>`
          )}
        </div>
      </div>
    `;
    
    container.appendChild(storeDiv);
  }
  
  // Initialize PayPal buttons
  setTimeout(initializePayPalButtons, 100);
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function updateSecrets() {
  const container = document.getElementById('secrets-list');
  container.innerHTML = '';
  
  // Group secrets by level
  const levels = {};
  for (const secret of CONSPIRACY_STORIES) {
    if (!levels[secret.level]) levels[secret.level] = [];
    levels[secret.level].push(secret);
  }
  
  const levelNames = {
    1: "Surface Truths",
    2: "Deeper Conspiracies", 
    3: "Ultimate Revelations",
    4: "Cosmic Conspiracies",
    5: "Interdimensional Secrets",
    6: "Galactic Revelations",
    7: "Universal Truths",
    8: "Cosmic Horror",
    9: "Existential Nightmares",
    10: "The Final Truth"
  };
  
  for (let level = 1; level <= 10; level++) {
    if (!levels[level]) continue;
    
    const levelDiv = document.createElement('div');
    levelDiv.className = 'secrets-level';
    levelDiv.innerHTML = `<h3 class="level-title">Level ${level} - ${levelNames[level]}</h3>`;
    
    for (const secret of levels[level]) {
      const isUnlocked = gameState.unlockedStories[secret.id];
      const canAfford = gameState.evidence >= secret.cost;
      
      const secretDiv = document.createElement('div');
      secretDiv.className = `secret-item level-${level} ${isUnlocked ? 'unlocked' : ''}`;
      secretDiv.innerHTML = `
        <div class="secret-header">
          <h4>${isUnlocked ? secret.title : "???"}</h4>
          <span class="secret-cost">${formatNumber(secret.cost)} evidence</span>
        </div>
        ${isUnlocked ? 
          `<p class="secret-story">${secret.story}</p>` :
          `<div class="secret-locked">
            <p>This ${levelNames[level].toLowerCase()} secret awaits your investigation...</p>
            <button class="unlock-button level-${level}-button" onclick="unlockSecret('${secret.id}')" ${!canAfford ? 'disabled' : ''}>
              ${canAfford ? "Unlock Truth" : "Insufficient Evidence"}
            </button>
          </div>`
        }
      `;
      
      levelDiv.appendChild(secretDiv);
    }
    
    container.appendChild(levelDiv);
  }
}

function updateAchievements() {
  const container = document.getElementById('achievements-list');
  container.innerHTML = '';
  
  for (const achievement of ACHIEVEMENTS) {
    const unlocked = gameState.achievements[achievement.id];
    
    let progress = 0;
    switch (achievement.type) {
      case "clicks":
        progress = gameState.clickCount;
        break;
      case "evidence":
        progress = gameState.totalEvidence;
        break;
      case "upgrades":
        progress = Object.values(gameState.upgrades).reduce((sum, count) => sum + count, 0);
        break;
      case "secrets":
        progress = Object.keys(gameState.unlockedStories).length;
        break;
      case "premium":
        progress = gameState.purchases.premium_version ? 1 : 0;
        break;
      default:
        if (achievement.type.includes("level")) {
          const level = parseInt(achievement.type.replace("level", "").replace("_secrets", ""));
          progress = Object.keys(gameState.unlockedStories).filter(id => {
            const story = CONSPIRACY_STORIES.find(s => s.id === id);
            return story && story.level === level;
          }).length;
        }
        break;
    }
    
    const achievementDiv = document.createElement('div');
    achievementDiv.className = `achievement-item ${unlocked ? 'unlocked' : ''}`;
    achievementDiv.innerHTML = `
      <i data-lucide="star" class="achievement-icon"></i>
      <div class="achievement-info">
        <h3>${achievement.name}</h3>
        <p>${achievement.description}</p>
      </div>
      <div class="achievement-progress">
        ${Math.min(progress, achievement.requirement)}/${achievement.requirement}
      </div>
    `;
    
    container.appendChild(achievementDiv);
  }
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function updateActiveBoosts() {
  const container = document.getElementById('active-boosts');
  container.innerHTML = '';
  
  for (const [boostId, expiry] of Object.entries(gameState.activeBoosts)) {
    if (expiry > Date.now()) {
      const boostDiv = document.createElement('div');
      boostDiv.className = 'boost-item';
      boostDiv.innerHTML = `2x Boost: ${formatTime(expiry - Date.now())}`;
      container.appendChild(boostDiv);
    }
  }
}

function updateSkinSelector() {
  const selector = document.getElementById('skin-selector');
  const select = document.getElementById('skin-select');
  
  const availableSkins = [];
  availableSkins.push({ value: "default", label: "Default 🔍" });
  
  if (gameState.purchases.secret_agent_skin) {
    availableSkins.push({ value: "secret_agent", label: "Secret Agent 🕵️" });
  }
  
  if (gameState.purchases.moon_man_skin) {
    availableSkins.push({ value: "moon_man", label: "Moon Man 🌙" });
  }
  
  if (gameState.purchases.premium_version) {
    availableSkins.push({ value: "alien", label: "Alien Commander 👽" });
  }
  
  if (availableSkins.length > 1) {
    selector.style.display = 'block';
    select.innerHTML = '';
    
    for (const skin of availableSkins) {
      const option = document.createElement('option');
      option.value = skin.value;
      option.textContent = skin.label;
      option.selected = skin.value === gameState.currentSkin;
      select.appendChild(option);
    }
  } else {
    selector.style.display = 'none';
  }
}

function updateTheme() {
  const app = document.getElementById('app');
  const premiumCrown = document.getElementById('premium-crown');
  
  // Remove all theme classes
  app.className = 'conspiracy-game';
  
  // Apply current theme
  switch (gameState.currentSkin) {
    case "secret_agent":
      app.classList.add('secret-agent-theme');
      break;
    case "moon_man":
      app.classList.add('moon-man-theme');
      break;
    case "alien":
      app.classList.add('alien-theme');
      break;
    default:
      app.classList.add('default-theme');
      break;
  }
  
  // Show premium crown if premium version is owned
  if (gameState.purchases.premium_version) {
    premiumCrown.style.display = 'inline';
  } else {
    premiumCrown.style.display = 'none';
  }
}

// PayPal Integration
function initializePayPalButtons() {
  const containers = document.querySelectorAll('.paypal-button-container');
  
  containers.forEach(container => {
    const itemId = container.getAttribute('data-item-id');
    const item = STORE_ITEMS.find(i => i.id === itemId);
    
    if (!item || container.children.length > 0) return;
    
    if (typeof paypal !== 'undefined') {
      paypal.Buttons({
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              reference_id: item.id,
              description: item.name,
              amount: {
                currency_code: 'USD',
                value: item.price.toFixed(2)
              }
            }],
            application_context: {
              brand_name: 'Shadow Files',
              landing_page: 'BILLING',
              user_action: 'PAY_NOW'
            }
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            handlePayPalSuccess(item);
          });
        },
        onError: function(err) {
          console.error('PayPal Error:', err);
          showToast('Payment failed. Please try again.', 'error');
        },
        onCancel: function(data) {
          showToast('Payment cancelled', 'info');
        },
        style: {
          layout: 'vertical',
          height: 40,
          color: 'gold',
          shape: 'rect',
          label: 'paypal'
        }
      }).render(container);
    }
  });
}

function handlePayPalSuccess(item) {
  // Mark as purchased
  gameState.purchases[item.id] = true;
  
  // Apply item effects
  switch (item.type) {
    case "cosmetic":
      if (item.id === "secret_agent_skin") {
        gameState.currentSkin = "secret_agent";
        showToast(`🎨 ${item.name} purchased! Clandestine operative mode activated!`, 'success');
      } else if (item.id === "moon_man_skin") {
        gameState.currentSkin = "moon_man";
        showToast(`🌙 ${item.name} purchased! Lunar conspiracy mode activated!`, 'success');
      }
      break;
    case "boost":
      gameState.activeBoosts[item.id] = Date.now() + item.duration;
      showToast(`⚡ ${item.name} activated! Double evidence for 24 hours!`, 'success');
      break;
    case "premium":
      gameState.currentSkin = "alien";
      showToast(`⭐ Welcome to Premium! Enjoy ad-free experience, exclusive upgrades, and alien theme!`, 'success');
      break;
    case "evidence":
      gameState.evidence += item.evidenceAmount;
      gameState.totalEvidence += item.evidenceAmount;
      showToast(`💰 ${item.name} purchased! +${formatNumber(item.evidenceAmount)} evidence added to your investigation!`, 'success');
      break;
    case "ultimate":
      gameState.evidence += item.evidenceAmount;
      gameState.totalEvidence += item.evidenceAmount;
      
      // Unlock all cosmetic skins and premium
      gameState.purchases.secret_agent_skin = true;
      gameState.purchases.moon_man_skin = true;
      gameState.purchases.premium_version = true;
      
      // Set to alien theme (premium)
      gameState.currentSkin = "alien";
      
      showToast(`🎆 ULTIMATE VAULT UNLOCKED! You now have access to EVERYTHING: ${formatNumber(item.evidenceAmount)} evidence, all skins, and premium features!`, 'success');
      break;
  }
  
  checkAchievements();
  updateUI();
  saveGame();
}

// Tab Management
function switchTab(tabName) {
  // Remove active class from all tabs and panes
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
  
  // Add active class to clicked tab and corresponding pane
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Idle Income
function startIdleIncome() {
  setInterval(() => {
    const idlePower = getIdlePower();
    if (idlePower > 0) {
      gameState.evidence += idlePower;
      gameState.totalEvidence += idlePower;
      updateUI();
    }
    
    // Clean up expired boosts
    for (const [boostId, expiry] of Object.entries(gameState.activeBoosts)) {
      if (expiry <= Date.now()) {
        delete gameState.activeBoosts[boostId];
      }
    }
    
    // Auto-save every minute
    if (Date.now() - gameState.lastSave > 60000) {
      saveGame();
    }
  }, 1000);
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
  // Load game data
  loadGame();
  
  // Set up event listeners
  document.getElementById('main-click-button').addEventListener('click', handleClick);
  
  // Tab switching
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });
  
  // Skin selector
  document.getElementById('skin-select').addEventListener('change', function() {
    gameState.currentSkin = this.value;
    updateUI();
    saveGame();
  });
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Start game loop
  updateUI();
  startIdleIncome();
  
  // Show welcome message
  setTimeout(() => {
    showToast('Welcome to Shadow Files! Click to investigate and uncover the truth.', 'info');
  }, 1000);
});