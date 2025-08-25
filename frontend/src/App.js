import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Eye, Zap, Clock, TrendingUp, Shield, Globe, Cpu, Brain, Star, Crown, ShoppingCart, Sparkles, Bot, Moon, Scroll, Palette, Vault } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

const STORAGE_KEY = "shadow_files_save";

const UPGRADES = [
  {
    id: "magnifying_glass",
    name: "Magnifying Glass",
    description: "Basic investigation tool (+1 evidence per click)",
    baseCost: 15,
    clickBonus: 1,
    idleBonus: 0,
    icon: Eye,
    unlocked: true
  },
  {
    id: "surveillance_camera",
    name: "Surveillance Camera",
    description: "Passive evidence gathering (+0.5 evidence/sec)",
    baseCost: 100,
    clickBonus: 0,
    idleBonus: 0.5,
    icon: Shield,
    unlocked: true
  },
  {
    id: "hacker_tools",
    name: "Hacker Tools",
    description: "Digital evidence extraction (+3 evidence per click)",
    baseCost: 500,
    clickBonus: 3,
    idleBonus: 0,
    icon: Cpu,
    unlocked: false,
    unlockRequirement: 200
  },
  {
    id: "insider_network",
    name: "Insider Network",
    description: "Network of informants (+2 evidence/sec)",
    baseCost: 2000,
    clickBonus: 0,
    idleBonus: 2,
    icon: Globe,
    unlocked: false,
    unlockRequirement: 1000
  },
  {
    id: "mind_reader",
    name: "Mind Reader",
    description: "Psychic investigation powers (+10 evidence per click)",
    baseCost: 10000,
    clickBonus: 10,
    idleBonus: 0,
    icon: Brain,
    unlocked: false,
    unlockRequirement: 5000
  },
  {
    id: "time_machine",
    name: "Time Machine",
    description: "Access to past and future evidence (+5 evidence/sec)",
    baseCost: 50000,
    clickBonus: 0,
    idleBonus: 5,
    icon: Clock,
    unlocked: false,
    unlockRequirement: 25000
  },
  // Premium upgrades
  {
    id: "alien_probe",
    name: "Alien Probe",
    description: "PREMIUM: Extraterrestrial evidence scanner (+25 evidence per click)",
    baseCost: 100000,
    clickBonus: 25,
    idleBonus: 0,
    icon: Bot,
    unlocked: false,
    unlockRequirement: 50000,
    premium: true
  },
  {
    id: "ufo_network",
    name: "UFO Network", 
    description: "PREMIUM: Galactic surveillance system (+15 evidence/sec)",
    baseCost: 500000,
    clickBonus: 0,
    idleBonus: 15,
    icon: Sparkles,
    unlocked: false,
    unlockRequirement: 200000,
    premium: true
  }
];

const CONSPIRACY_STORIES = [
  // Level 1 - Basic Truths
  {
    id: "first_truth",
    title: "The Watchers",
    story: "Your investigation reveals a network of surveillance systems monitoring every citizen. Hidden cameras in street lights, microphones in smart devices, and AI algorithms tracking behavior patterns. The evidence is overwhelming - privacy is an illusion.",
    cost: 500,
    level: 1,
    unlocked: false
  },
  {
    id: "second_truth", 
    title: "The Memory Holes",
    story: "Documents disappear from archives, news articles vanish from websites, and historical records are altered. You've discovered the Ministry of Truth - a shadow organization rewriting history in real-time to control the narrative.",
    cost: 1500,
    level: 1,
    unlocked: false
  },
  {
    id: "third_truth",
    title: "The Puppet Masters",
    story: "Elections are theater. Behind closed doors, a council of twelve families controls world governments through financial manipulation, blackmail, and strategic assassinations. Democracy is their greatest lie.",
    cost: 3000,
    level: 1,
    unlocked: false
  },
  
  // Level 2 - Deeper Conspiracies
  {
    id: "fourth_truth",
    title: "The Mind Harvest",
    story: "Social media platforms aren't connecting people - they're harvesting thoughts. Advanced AI processes every post, comment, and reaction to map human consciousness and predict behavior with 99.7% accuracy.",
    cost: 8000,
    level: 2,
    unlocked: false
  },
  {
    id: "fifth_truth",
    title: "The Great Reset",
    story: "Climate change is real, but the solution isn't green energy - it's population control. The elite have underground cities ready while they engineer a 'natural' disaster to reduce Earth's population by 80%.",
    cost: 15000,
    level: 2,
    unlocked: false
  },
  {
    id: "sixth_truth",
    title: "The Digital Prison",
    story: "Cryptocurrency and digital IDs aren't freedom - they're the ultimate control system. Every transaction tracked, every movement monitored, every dissenter silenced with the flip of a switch.",
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

const STORE_ITEMS = [
  {
    id: "secret_agent_skin",
    name: "Secret Agent Skin",
    description: "Transform into a clandestine operative with shadowy dark theme and stealth aesthetics",
    price: 1.49,
    type: "cosmetic",
    icon: Crown
  },
  {
    id: "moon_man_skin",
    name: "Moon Man Skin", 
    description: "Embrace the lunar conspiracy with cosmic theme, visible moon surface, shooting stars, and planets",
    price: 2.99,
    type: "cosmetic",
    icon: Moon
  },
  {
    id: "evidence_boost",
    name: "2x Evidence Boost",
    description: "Double evidence gain for 24 hours",
    price: 2.99,
    type: "boost",
    duration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    icon: Zap
  },
  {
    id: "premium_version",
    name: "Premium Version",
    description: "Ad-free experience + Exclusive Alien Invasion upgrade tree + Alien face button with galaxy background and flying UFOs",
    price: 6.99,
    type: "premium",
    icon: Star
  },
  {
    id: "evidence_vault_small",
    name: "Evidence Vault 50K",
    description: "Instantly gain 50,000 evidence points to accelerate your investigation",
    price: 15.00,
    type: "evidence",
    evidenceAmount: 50000,
    icon: Vault
  },
  {
    id: "evidence_vault_medium",
    name: "Evidence Vault 150K",
    description: "Instantly gain 150,000 evidence points to uncover deeper secrets",
    price: 25.00,
    type: "evidence",
    evidenceAmount: 150000,
    icon: Vault
  },
  {
    id: "evidence_vault_large",
    name: "Evidence Vault 500K",
    description: "Instantly gain 500,000 evidence points to access high-level conspiracies",
    price: 50.00,
    type: "evidence",
    evidenceAmount: 500000,
    icon: Vault
  },
  {
    id: "evidence_vault_mega",
    name: "Evidence Vault 1.5M",
    description: "Instantly gain 1,500,000 evidence points to unlock the ultimate truths",
    price: 100.00,
    type: "evidence",
    evidenceAmount: 1500000,
    icon: Vault
  }
];

function App() {
  const [evidence, setEvidence] = useState(0);
  const [totalEvidence, setTotalEvidence] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [idleIncome, setIdleIncome] = useState(0);
  const [upgrades, setUpgrades] = useState({});
  const [achievements, setAchievements] = useState({});
  const [lastSave, setLastSave] = useState(Date.now());
  const [clickAnimation, setClickAnimation] = useState(false);
  const [secretsUnlocked, setSecretsUnlocked] = useState(0);
  const [unlockedStories, setUnlockedStories] = useState({});
  
  // Monetization states
  const [purchases, setPurchases] = useState({});
  const [activeBoosts, setActiveBoosts] = useState({});
  const [currentSkin, setCurrentSkin] = useState("default");

  // Helper function to calculate idle income
  const calculateIdleIncome = (upgradeState) => {
    let income = 0;
    UPGRADES.forEach(upgrade => {
      const owned = upgradeState[upgrade.id] || 0;
      income += upgrade.idleBonus * owned;
    });
    return income;
  };

  // Load game state
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    console.log("Loading save data:", savedData);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        console.log("Parsed save data:", data);
        setEvidence(data.evidence || 0);
        setTotalEvidence(data.totalEvidence || 0);
        setClickCount(data.clickCount || 0);
        setUpgrades(data.upgrades || {});
        setAchievements(data.achievements || {});
        setPurchases(data.purchases || {});
        setActiveBoosts(data.activeBoosts || {});
        setCurrentSkin(data.currentSkin || "default");
        setUnlockedStories(data.unlockedStories || {});
        setLastSave(data.lastSave || Date.now());
        
        // Calculate offline progress
        const offlineTime = Math.min((Date.now() - (data.lastSave || Date.now())) / 1000, 3600); // Max 1 hour
        if (offlineTime > 60) {
          const offlineEvidence = Math.floor(offlineTime * calculateIdleIncome(data.upgrades || {}));
          if (offlineEvidence > 0) {
            setEvidence(prev => prev + offlineEvidence);
            setTotalEvidence(prev => prev + offlineEvidence);
            toast(`Welcome back! You earned ${offlineEvidence} evidence while away!`);
          }
        }
      } catch (e) {
        console.error("Failed to load save data:", e);
      }
    } else {
      console.log("No saved data found");
    }
  }, []);

  // Calculate click power and idle income
  useEffect(() => {
    let newClickPower = 1;
    let newIdleIncome = 0;
    
    UPGRADES.forEach(upgrade => {
      const owned = upgrades[upgrade.id] || 0;
      newClickPower += upgrade.clickBonus * owned;
      newIdleIncome += upgrade.idleBonus * owned;
    });
    
    // Apply boost multiplier
    if (activeBoosts.evidence_boost && activeBoosts.evidence_boost > Date.now()) {
      newClickPower *= 2;
      newIdleIncome *= 2;
    }
    
    setClickPower(newClickPower);
    setIdleIncome(newIdleIncome);
  }, [upgrades, activeBoosts]);

  // Update secrets unlocked based on available stories
  useEffect(() => {
    const unlockedCount = Object.keys(unlockedStories).length;
    setSecretsUnlocked(unlockedCount);
  }, [unlockedStories]);

  // Save game state with debouncing to prevent excessive saves
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const saveData = {
        evidence,
        totalEvidence,
        clickCount,
        upgrades,
        achievements,
        purchases,
        activeBoosts,
        currentSkin,
        unlockedStories,
        lastSave: Date.now()
      };
      console.log("Saving game data:", saveData);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
        console.log("Save successful");
      } catch (error) {
        console.error("Save failed:", error);
      }
    }, 500); // Debounce saves by 500ms
    
    return () => clearTimeout(timeoutId);
  }, [evidence, totalEvidence, clickCount, upgrades, achievements, purchases, activeBoosts, currentSkin, unlockedStories]);

  // Idle income loop
  useEffect(() => {
    if (idleIncome > 0) {
      const interval = setInterval(() => {
        const gain = idleIncome / 10; // Update every 100ms for smooth progression
        setEvidence(prev => prev + gain);
        setTotalEvidence(prev => prev + gain);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [idleIncome]);

  // Check achievements
  useEffect(() => {
    ACHIEVEMENTS.forEach(achievement => {
      if (!achievements[achievement.id]) {
        let progress = 0;
        switch (achievement.type) {
          case "clicks":
            progress = clickCount;
            break;
          case "evidence":
            progress = totalEvidence;
            break;
          case "upgrades":
            progress = Object.values(upgrades).reduce((sum, count) => sum + count, 0);
            break;
          case "premium":
            progress = purchases.premium_version ? 1 : 0;
            break;
          case "secrets":
            progress = Object.keys(unlockedStories).length;
            break;
          case "level2_secrets":
            progress = Object.keys(unlockedStories).filter(id => {
              const story = CONSPIRACY_STORIES.find(s => s.id === id);
              return story && story.level === 2;
            }).length;
            break;
          case "level3_secrets":
            progress = Object.keys(unlockedStories).filter(id => {
              const story = CONSPIRACY_STORIES.find(s => s.id === id);
              return story && story.level === 3;
            }).length;
            break;
          case "level4_secrets":
            progress = Object.keys(unlockedStories).filter(id => {
              const story = CONSPIRACY_STORIES.find(s => s.id === id);
              return story && story.level === 4;
            }).length;
            break;
          case "level5_secrets":
            progress = Object.keys(unlockedStories).filter(id => {
              const story = CONSPIRACY_STORIES.find(s => s.id === id);
              return story && story.level === 5;
            }).length;
            break;
          case "level6_secrets":
            progress = Object.keys(unlockedStories).filter(id => {
              const story = CONSPIRACY_STORIES.find(s => s.id === id);
              return story && story.level === 6;
            }).length;
            break;
          case "level7_secrets":
            progress = Object.keys(unlockedStories).filter(id => {
              const story = CONSPIRACY_STORIES.find(s => s.id === id);
              return story && story.level === 7;
            }).length;
            break;
          case "level8_secrets":
            progress = Object.keys(unlockedStories).filter(id => {
              const story = CONSPIRACY_STORIES.find(s => s.id === id);
              return story && story.level === 8;
            }).length;
            break;
          case "level9_secrets":
            progress = Object.keys(unlockedStories).filter(id => {
              const story = CONSPIRACY_STORIES.find(s => s.id === id);
              return story && story.level === 9;
            }).length;
            break;
          case "level10_secrets":
            progress = Object.keys(unlockedStories).filter(id => {
              const story = CONSPIRACY_STORIES.find(s => s.id === id);
              return story && story.level === 10;
            }).length;
            break;
        }
        
        if (progress >= achievement.requirement) {
          setAchievements(prev => ({ ...prev, [achievement.id]: true }));
          toast(`🏆 Achievement Unlocked: ${achievement.name}!`);
        }
      }
    });
  }, [clickCount, totalEvidence, upgrades, achievements, purchases, unlockedStories]);

  // Clean up expired boosts
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveBoosts(prev => {
        const newBoosts = { ...prev };
        Object.keys(newBoosts).forEach(key => {
          if (newBoosts[key] <= now) {
            delete newBoosts[key];
            toast(`${key.replace('_', ' ')} has expired!`);
          }
        });
        return newBoosts;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClick = useCallback(() => {
    setEvidence(prev => prev + clickPower);
    setTotalEvidence(prev => prev + clickPower);
    setClickCount(prev => prev + 1);
    setClickAnimation(true);
    setTimeout(() => setClickAnimation(false), 200);
  }, [clickPower]);

  const buyUpgrade = (upgradeId) => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    const owned = upgrades[upgradeId] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, owned));
    
    // Check if premium upgrade requires premium version
    if (upgrade.premium && !purchases.premium_version) {
      toast("This upgrade requires Premium Version!");
      return;
    }
    
    console.log(`Attempting to buy ${upgrade.name}, cost: ${cost}, current evidence: ${evidence}`);
    
    if (evidence >= cost) {
      setEvidence(prev => {
        const newEvidence = prev - cost;
        console.log(`Evidence after purchase: ${newEvidence}`);
        return newEvidence;
      });
      setUpgrades(prev => {
        const newUpgrades = { ...prev, [upgradeId]: owned + 1 };
        console.log(`New upgrades:`, newUpgrades);
        return newUpgrades;
      });
      toast(`Purchased ${upgrade.name}!`);
    } else {
      console.log(`Cannot afford ${upgrade.name}. Need ${cost}, have ${evidence}`);
      toast(`Not enough evidence! Need ${formatNumber(cost)} evidence.`);
    }
  };

  const unlockSecret = (secretId) => {
    const secret = CONSPIRACY_STORIES.find(s => s.id === secretId);
    
    if (evidence >= secret.cost) {
      setEvidence(prev => prev - secret.cost);
      setUnlockedStories(prev => ({ ...prev, [secretId]: true }));
      toast(`🔍 Truth Revealed: ${secret.title}`);
    } else {
      toast(`Not enough evidence! Need ${formatNumber(secret.cost)} evidence.`);
    }
  };

  const mockPurchase = (itemId) => {
    const item = STORE_ITEMS.find(i => i.id === itemId);
    
    // Simulate payment processing
    toast("Processing payment...");
    
    setTimeout(() => {
      setPurchases(prev => ({ ...prev, [itemId]: true }));
      
      switch (item.type) {
        case "cosmetic":
          if (itemId === "secret_agent_skin") {
            setCurrentSkin("secret_agent");
            toast(`🎨 ${item.name} purchased! Clandestine operative mode activated!`);
          } else if (itemId === "moon_man_skin") {
            setCurrentSkin("moon_man");
            toast(`🌙 ${item.name} purchased! Lunar conspiracy mode activated!`);
          }
          break;
        case "boost":
          setActiveBoosts(prev => ({ 
            ...prev, 
            [itemId]: Date.now() + item.duration 
          }));
          toast(`⚡ ${item.name} activated! Double evidence for 24 hours!`);
          break;
        case "premium":
          // Premium also activates alien theme
          setCurrentSkin("alien");
          toast(`⭐ Welcome to Premium! Enjoy ad-free experience, exclusive upgrades, and alien theme!`);
          break;
        case "evidence":
          // Add evidence directly to the player's total
          setEvidence(prev => prev + item.evidenceAmount);
          setTotalEvidence(prev => prev + item.evidenceAmount);
          toast(`💰 ${item.name} purchased! +${formatNumber(item.evidenceAmount)} evidence added to your investigation!`);
          break;
      }
    }, 1500);
  };

  const changeSkin = (skinId) => {
    setCurrentSkin(skinId);
    toast(`Theme changed to ${skinId === "default" ? "Default" : 
           skinId === "secret_agent" ? "Secret Agent" :
           skinId === "moon_man" ? "Moon Man" : "Alien Commander"}!`);
  };

  const getUpgradeCost = (upgradeId) => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    const owned = upgrades[upgradeId] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(1.15, owned));
  };

  const isUpgradeUnlocked = (upgrade) => {
    return upgrade.unlocked || (upgrade.unlockRequirement && totalEvidence >= upgrade.unlockRequirement);
  };

  const formatNumber = (num) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return Math.floor(num).toString();
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getSkinClass = () => {
    switch (currentSkin) {
      case "secret_agent":
        return "secret-agent-theme";
      case "moon_man":
        return "moon-man-theme";
      case "alien":
        return "alien-theme";
      default:
        return "";
    }
  };

  const getStoriesByLevel = (level) => {
    return CONSPIRACY_STORIES.filter(story => story.level === level);
  };

  // Get available skins for selector
  const getAvailableSkins = () => {
    let skins = [{ value: "default", label: "Default Theme", icon: "🔍" }];
    
    if (purchases.secret_agent_skin) {
      skins.push({ value: "secret_agent", label: "Secret Agent", icon: "🕵️" });
    }
    
    if (purchases.moon_man_skin) {
      skins.push({ value: "moon_man", label: "Moon Man", icon: "🌙" });
    }
    
    if (purchases.premium_version) {
      skins.push({ value: "alien", label: "Alien Commander", icon: "👽" });
    }
    
    return skins;
  };

  return (
    <div className={`conspiracy-game ${getSkinClass()}`}>
      <div className="background-effects">
        {/* Moon Man background effects */}
        {currentSkin === "moon_man" && (
          <>
            <div className="shooting-star"></div>
            <div className="shooting-star shooting-star-2"></div>
            <div className="planet planet-1"></div>
            <div className="planet planet-2"></div>
            <div className="planet planet-3"></div>
          </>
        )}
        
        {/* Alien background effects */}
        {currentSkin === "alien" && (
          <>
            <div className="galaxy-spiral"></div>
            <div className="galaxy-arms"></div>
            <div className="nebula-cloud nebula-cloud-1"></div>
            <div className="nebula-cloud nebula-cloud-2"></div>
            <div className="nebula-cloud nebula-cloud-3"></div>
            <div className="flying-ufo"></div>
          </>
        )}
      </div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(26, 26, 46, 0.9)',
            color: '#ffffff',
            border: '1px solid rgba(120, 119, 198, 0.3)',
          }
        }}
      />
      <div className="game-container">
        <header className="game-header">
          <div className="header-content">
            <div className="title-section">
              <h1 className="game-title">
                <Eye className="title-icon" />
                SHADOW FILES
                {purchases.premium_version && <Crown className="premium-crown" />}
              </h1>
              <p className="game-subtitle">Uncover the truth, one click at a time</p>
              {currentSkin !== "default" && (
                <Badge className={`skin-badge ${currentSkin}-badge`}>
                  {currentSkin === "secret_agent" ? "Secret Agent Mode" : 
                   currentSkin === "moon_man" ? "Moon Man Mode" :
                   currentSkin === "alien" ? "Alien Commander Mode" : ""}
                </Badge>
              )}
              
              {/* Skin Selector */}
              {getAvailableSkins().length > 1 && (
                <div className="skin-selector">
                  <Select value={currentSkin} onValueChange={changeSkin}>
                    <SelectTrigger className="skin-select-trigger">
                      <Palette className="palette-icon" />
                      <SelectValue placeholder="Choose Theme" />
                    </SelectTrigger>
                    <SelectContent className="skin-select-content">
                      {getAvailableSkins().map(skin => (
                        <SelectItem key={skin.value} value={skin.value} className="skin-select-item">
                          <span className="skin-option">
                            <span className="skin-emoji">{skin.icon}</span>
                            <span className="skin-label">{skin.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Evidence</span>
                <span className="stat-value">{formatNumber(evidence)}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Per Click</span>
                <span className="stat-value">{formatNumber(clickPower)}</span>
                {activeBoosts.evidence_boost && activeBoosts.evidence_boost > Date.now() && (
                  <Badge className="boost-badge">2x Boost</Badge>
                )}
              </div>
              <div className="stat-card">
                <span className="stat-label">Per Second</span>
                <span className="stat-value">{formatNumber(idleIncome)}</span>
              </div>
              <div className="stat-card secrets-card">
                <span className="stat-label">Secrets</span>
                <span className="stat-value">{secretsUnlocked}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="secrets-button" size="sm">
                      <Scroll className="secrets-icon" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="secrets-dialog">
                    <DialogHeader>
                      <DialogTitle>Conspiracy Archive</DialogTitle>
                      <DialogDescription>
                        Unlock dark secrets by spending evidence. Each level requires more evidence to access deeper truths.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="secrets-list">
                      {/* Level 1 Secrets */}
                      <div className="secrets-level">
                        <h3 className="level-title">Level 1 - Surface Truths</h3>
                        {getStoriesByLevel(1).map(secret => {
                          const isUnlocked = unlockedStories[secret.id];
                          const canAfford = evidence >= secret.cost;
                          
                          return (
                            <div key={secret.id} className={`secret-item level-1 ${isUnlocked ? 'unlocked' : ''}`}>
                              <div className="secret-header">
                                <h4>{isUnlocked ? secret.title : "???"}</h4>
                                <span className="secret-cost">{formatNumber(secret.cost)} evidence</span>
                              </div>
                              {isUnlocked ? (
                                <p className="secret-story">{secret.story}</p>
                              ) : (
                                <div className="secret-locked">
                                  <p>A basic conspiracy truth awaits revelation...</p>
                                  <Button 
                                    onClick={() => unlockSecret(secret.id)}
                                    disabled={!canAfford}
                                    className="unlock-button level-1-button"
                                  >
                                    {canAfford ? "Unlock Truth" : "Insufficient Evidence"}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Level 2 Secrets */}
                      <div className="secrets-level">
                        <h3 className="level-title">Level 2 - Deeper Conspiracies</h3>
                        {getStoriesByLevel(2).map(secret => {
                          const isUnlocked = unlockedStories[secret.id];
                          const canAfford = evidence >= secret.cost;
                          
                          return (
                            <div key={secret.id} className={`secret-item level-2 ${isUnlocked ? 'unlocked' : ''}`}>
                              <div className="secret-header">
                                <h4>{isUnlocked ? secret.title : "???"}</h4>
                                <span className="secret-cost">{formatNumber(secret.cost)} evidence</span>
                              </div>
                              {isUnlocked ? (
                                <p className="secret-story">{secret.story}</p>
                              ) : (
                                <div className="secret-locked">
                                  <p>Advanced conspiracy knowledge requires significant evidence...</p>
                                  <Button 
                                    onClick={() => unlockSecret(secret.id)}
                                    disabled={!canAfford}
                                    className="unlock-button level-2-button"
                                  >
                                    {canAfford ? "Unlock Deep Truth" : "Insufficient Evidence"}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Level 3 Secrets */}
                      <div className="secrets-level">
                        <h3 className="level-title">Level 3 - Ultimate Revelations</h3>
                        {getStoriesByLevel(3).map(secret => {
                          const isUnlocked = unlockedStories[secret.id];
                          const canAfford = evidence >= secret.cost;
                          
                          return (
                            <div key={secret.id} className={`secret-item level-3 ${isUnlocked ? 'unlocked' : ''}`}>
                              <div className="secret-header">
                                <h4>{isUnlocked ? secret.title : "???"}</h4>
                                <span className="secret-cost">{formatNumber(secret.cost)} evidence</span>
                              </div>
                              {isUnlocked ? (
                                <p className="secret-story">{secret.story}</p>
                              ) : (
                                <div className="secret-locked">
                                  <p>The ultimate truths demand enormous evidence to unlock...</p>
                                  <Button 
                                    onClick={() => unlockSecret(secret.id)}
                                    disabled={!canAfford}
                                    className="unlock-button level-3-button"
                                  >
                                    {canAfford ? "Unlock Ultimate Truth" : "Insufficient Evidence"}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Level 4 Secrets */}
                      <div className="secrets-level">
                        <h3 className="level-title">Level 4 - Cosmic Conspiracies</h3>
                        {getStoriesByLevel(4).map(secret => {
                          const isUnlocked = unlockedStories[secret.id];
                          const canAfford = evidence >= secret.cost;
                          
                          return (
                            <div key={secret.id} className={`secret-item level-4 ${isUnlocked ? 'unlocked' : ''}`}>
                              <div className="secret-header">
                                <h4>{isUnlocked ? secret.title : "???"}</h4>
                                <span className="secret-cost">{formatNumber(secret.cost)} evidence</span>
                              </div>
                              {isUnlocked ? (
                                <p className="secret-story">{secret.story}</p>
                              ) : (
                                <div className="secret-locked">
                                  <p>Cosmic truths beyond earthly comprehension await...</p>
                                  <Button 
                                    onClick={() => unlockSecret(secret.id)}
                                    disabled={!canAfford}
                                    className="unlock-button level-4-button"
                                  >
                                    {canAfford ? "Unlock Cosmic Truth" : "Insufficient Evidence"}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Level 5 Secrets */}
                      <div className="secrets-level">
                        <h3 className="level-title">Level 5 - Interdimensional Secrets</h3>
                        {getStoriesByLevel(5).map(secret => {
                          const isUnlocked = unlockedStories[secret.id];
                          const canAfford = evidence >= secret.cost;
                          
                          return (
                            <div key={secret.id} className={`secret-item level-5 ${isUnlocked ? 'unlocked' : ''}`}>
                              <div className="secret-header">
                                <h4>{isUnlocked ? secret.title : "???"}</h4>
                                <span className="secret-cost">{formatNumber(secret.cost)} evidence</span>
                              </div>
                              {isUnlocked ? (
                                <p className="secret-story">{secret.story}</p>
                              ) : (
                                <div className="secret-locked">
                                  <p>Interdimensional knowledge transcends reality itself...</p>
                                  <Button 
                                    onClick={() => unlockSecret(secret.id)}
                                    disabled={!canAfford}
                                    className="unlock-button level-5-button"
                                  >
                                    {canAfford ? "Unlock Dimensional Truth" : "Insufficient Evidence"}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Level 6 Secrets */}
                      <div className="secrets-level">
                        <h3 className="level-title">Level 6 - Galactic Revelations</h3>
                        {getStoriesByLevel(6).map(secret => {
                          const isUnlocked = unlockedStories[secret.id];
                          const canAfford = evidence >= secret.cost;
                          
                          return (
                            <div key={secret.id} className={`secret-item level-6 ${isUnlocked ? 'unlocked' : ''}`}>
                              <div className="secret-header">
                                <h4>{isUnlocked ? secret.title : "???"}</h4>
                                <span className="secret-cost">{formatNumber(secret.cost)} evidence</span>
                              </div>
                              {isUnlocked ? (
                                <p className="secret-story">{secret.story}</p>
                              ) : (
                                <div className="secret-locked">
                                  <p>Galactic secrets span civilizations across the cosmos...</p>
                                  <Button 
                                    onClick={() => unlockSecret(secret.id)}
                                    disabled={!canAfford}
                                    className="unlock-button level-6-button"
                                  >
                                    {canAfford ? "Unlock Galactic Truth" : "Insufficient Evidence"}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Level 7 Secrets */}
                      <div className="secrets-level">
                        <h3 className="level-title">Level 7 - Universal Truths</h3>
                        {getStoriesByLevel(7).map(secret => {
                          const isUnlocked = unlockedStories[secret.id];
                          const canAfford = evidence >= secret.cost;
                          
                          return (
                            <div key={secret.id} className={`secret-item level-7 ${isUnlocked ? 'unlocked' : ''}`}>
                              <div className="secret-header">
                                <h4>{isUnlocked ? secret.title : "???"}</h4>
                                <span className="secret-cost">{formatNumber(secret.cost)} evidence</span>
                              </div>
                              {isUnlocked ? (
                                <p className="secret-story">{secret.story}</p>
                              ) : (
                                <div className="secret-locked">
                                  <p>Universal truths challenge the very nature of existence...</p>
                                  <Button 
                                    onClick={() => unlockSecret(secret.id)}
                                    disabled={!canAfford}
                                    className="unlock-button level-7-button"
                                  >
                                    {canAfford ? "Unlock Universal Truth" : "Insufficient Evidence"}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Level 8 Secrets */}
                      <div className="secrets-level">
                        <h3 className="level-title">Level 8 - Cosmic Horror</h3>
                        {getStoriesByLevel(8).map(secret => {
                          const isUnlocked = unlockedStories[secret.id];
                          const canAfford = evidence >= secret.cost;
                          
                          return (
                            <div key={secret.id} className={`secret-item level-8 ${isUnlocked ? 'unlocked' : ''}`}>
                              <div className="secret-header">
                                <h4>{isUnlocked ? secret.title : "???"}</h4>
                                <span className="secret-cost">{formatNumber(secret.cost)} evidence</span>
                              </div>
                              {isUnlocked ? (
                                <p className="secret-story">{secret.story}</p>
                              ) : (
                                <div className="secret-locked">
                                  <p>Cosmic horrors lurk beyond the boundaries of comprehension...</p>
                                  <Button 
                                    onClick={() => unlockSecret(secret.id)}
                                    disabled={!canAfford}
                                    className="unlock-button level-8-button"
                                  >
                                    {canAfford ? "Unlock Horrific Truth" : "Insufficient Evidence"}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Level 9 Secrets */}
                      <div className="secrets-level">
                        <h3 className="level-title">Level 9 - Existential Nightmares</h3>
                        {getStoriesByLevel(9).map(secret => {
                          const isUnlocked = unlockedStories[secret.id];
                          const canAfford = evidence >= secret.cost;
                          
                          return (
                            <div key={secret.id} className={`secret-item level-9 ${isUnlocked ? 'unlocked' : ''}`}>
                              <div className="secret-header">
                                <h4>{isUnlocked ? secret.title : "???"}</h4>
                                <span className="secret-cost">{formatNumber(secret.cost)} evidence</span>
                              </div>
                              {isUnlocked ? (
                                <p className="secret-story">{secret.story}</p>
                              ) : (
                                <div className="secret-locked">
                                  <p>Existential truths that shatter the foundations of reality...</p>
                                  <Button 
                                    onClick={() => unlockSecret(secret.id)}
                                    disabled={!canAfford}
                                    className="unlock-button level-9-button"
                                  >
                                    {canAfford ? "Unlock Nightmare Truth" : "Insufficient Evidence"}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Level 10 Secrets */}
                      <div className="secrets-level">
                        <h3 className="level-title">Level 10 - The Final Truth</h3>
                        {getStoriesByLevel(10).map(secret => {
                          const isUnlocked = unlockedStories[secret.id];
                          const canAfford = evidence >= secret.cost;
                          
                          return (
                            <div key={secret.id} className={`secret-item level-10 ${isUnlocked ? 'unlocked' : ''}`}>
                              <div className="secret-header">
                                <h4>{isUnlocked ? secret.title : "???"}</h4>
                                <span className="secret-cost">{formatNumber(secret.cost)} evidence</span>
                              </div>
                              {isUnlocked ? (
                                <p className="secret-story">{secret.story}</p>
                              ) : (
                                <div className="secret-locked">
                                  <p>The ultimate truth that ends all truths awaits the worthy...</p>
                                  <Button 
                                    onClick={() => unlockSecret(secret.id)}
                                    disabled={!canAfford}
                                    className="unlock-button level-10-button"
                                  >
                                    {canAfford ? "Unlock The Final Truth" : "Insufficient Evidence"}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Active Boosts Display */}
            {Object.keys(activeBoosts).length > 0 && (
              <div className="active-boosts">
                {Object.entries(activeBoosts).map(([boostId, expiry]) => (
                  <Badge key={boostId} className="active-boost">
                    <Zap className="boost-icon" />
                    2x Boost: {formatTime(expiry - Date.now())}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        <main className="game-main">
          <div className="click-section">
            <div className="click-area">
              <Button
                className={`main-click-button ${clickAnimation ? 'clicked' : ''}`}
                onClick={handleClick}
              >
                <div className="button-content">
                  <Eye className="click-icon" />
                  <span className="click-text">INVESTIGATE</span>
                  <div className="click-ripple"></div>
                  
                  {/* Theme-specific decorations */}
                  {currentSkin === "secret_agent" && (
                    <>
                      <div className="clandestine-overlay"></div>
                      <div className="stealth-scanner"></div>
                      <div className="shadow-grid"></div>
                    </>
                  )}
                  
                  {currentSkin === "moon_man" && (
                    <>
                      <div className="moon-surface"></div>
                      <div className="moon-craters"></div>
                    </>
                  )}
                  
                  {currentSkin === "alien" && (
                    <>
                      <div className="alien-face"></div>
                      <div className="alien-eyes"></div>
                      <div className="alien-glow"></div>
                    </>
                  )}
                </div>
              </Button>
              
              <div className="click-feedback">
                <p>Click to gather evidence of hidden truths!</p>
                <Progress value={Math.min((evidence / 1000) * 100, 100)} className="progress-bar" />
                <p className="progress-text">
                  {formatNumber(evidence)} evidence collected
                </p>
              </div>
            </div>
          </div>

          <div className="game-tabs">
            <Tabs defaultValue="upgrades" className="tabs-container">
              <TabsList className="tabs-list">
                <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
                <TabsTrigger value="store">
                  <ShoppingCart className="tab-icon" />
                  Store
                </TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="upgrades" className="upgrades-grid">
                {UPGRADES.map(upgrade => {
                  const owned = upgrades[upgrade.id] || 0;
                  const cost = getUpgradeCost(upgrade.id);
                  const canAfford = evidence >= cost;
                  const unlocked = isUpgradeUnlocked(upgrade);
                  const Icon = upgrade.icon;
                  const isPremiumLocked = upgrade.premium && !purchases.premium_version;

                  if (!unlocked) {
                    return (
                      <Card key={upgrade.id} className="upgrade-card locked">
                        <CardContent className="upgrade-content">
                          <div className="upgrade-icon-locked">
                            <Shield className="lock-icon" />
                          </div>
                          <div className="upgrade-info">
                            <h3>???</h3>
                            <p>Requires {formatNumber(upgrade.unlockRequirement)} total evidence</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }

                  return (
                    <Card key={upgrade.id} className={`upgrade-card ${canAfford && !isPremiumLocked ? 'affordable' : ''} ${upgrade.premium ? 'premium-upgrade' : ''}`}>
                      <CardContent className="upgrade-content">
                        <div className="upgrade-icon">
                          <Icon />
                          {owned > 0 && <Badge className="owned-badge">{owned}</Badge>}
                          {upgrade.premium && <Crown className="premium-icon" />}
                        </div>
                        <div className="upgrade-info">
                          <h3>{upgrade.name}</h3>
                          <p>{upgrade.description}</p>
                          <Button
                            onClick={() => buyUpgrade(upgrade.id)}
                            disabled={!canAfford || isPremiumLocked}
                            className="upgrade-button"
                          >
                            {isPremiumLocked ? "Requires Premium" : `Buy - ${formatNumber(cost)} evidence`}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="store" className="store-grid">
                {STORE_ITEMS.map(item => {
                  const Icon = item.icon;
                  const purchased = purchases[item.id];
                  const isActive = item.type === "boost" && activeBoosts[item.id] && activeBoosts[item.id] > Date.now();

                  return (
                    <Card key={item.id} className={`store-card ${purchased ? 'purchased' : ''} ${item.type === 'evidence' ? 'evidence-vault' : ''}`}>
                      <CardContent className="store-content">
                        <div className="store-icon">
                          <Icon />
                          {item.type === "premium" && <Crown className="premium-icon" />}
                        </div>
                        <div className="store-info">
                          <h3>{item.name}</h3>
                          <p>{item.description}</p>
                          <div className="price">${item.price}</div>
                          
                          {purchased ? (
                            <div className="purchased-status">
                              {item.type === "boost" && isActive ? (
                                <Badge className="active-boost">
                                  Active: {formatTime(activeBoosts[item.id] - Date.now())}
                                </Badge>
                              ) : (item.type === "boost" || item.type === "evidence") ? (
                                <Button 
                                  onClick={() => mockPurchase(item.id)}
                                  className="store-button"
                                >
                                  Buy {item.type === "evidence" ? "Again" : "Again"} - ${item.price}
                                </Button>
                              ) : (
                                <Badge className="purchased-badge">Owned</Badge>
                              )}
                            </div>
                          ) : (
                            <Button
                              onClick={() => mockPurchase(item.id)}
                              className="store-button"
                            >
                              Buy - ${item.price}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                <Card className="demo-notice">
                  <CardContent className="demo-content">
                    <h3>🚀 Demo Mode</h3>
                    <p>This is a demonstration of the monetization features. In the live version, these purchases will use real PayPal payments.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="achievements-grid">
                {ACHIEVEMENTS.map(achievement => {
                  const earned = achievements[achievement.id];
                  return (
                    <Card key={achievement.id} className={`achievement-card ${earned ? 'earned' : ''}`}>
                      <CardContent className="achievement-content">
                        <div className="achievement-icon">
                          {earned ? <Star className="star-earned" /> : <Star className="star-locked" />}
                        </div>
                        <div className="achievement-info">
                          <h3>{achievement.name}</h3>
                          <p>{achievement.description}</p>
                          {earned && <Badge className="earned-badge">Earned!</Badge>}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="stats" className="stats-panel">
                <div className="stats-details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investigation Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="stats-content">
                      <div className="stat-row">
                        <span>Total Evidence Gathered:</span>
                        <span>{formatNumber(totalEvidence)}</span>
                      </div>
                      <div className="stat-row">
                        <span>Total Clicks:</span>
                        <span>{formatNumber(clickCount)}</span>
                      </div>
                      <div className="stat-row">
                        <span>Evidence per Click:</span>
                        <span>{formatNumber(clickPower)}</span>
                      </div>
                      <div className="stat-row">
                        <span>Evidence per Second:</span>
                        <span>{formatNumber(idleIncome)}</span>
                      </div>
                      <div className="stat-row">
                        <span>Secrets Uncovered:</span>
                        <span>{secretsUnlocked}</span>
                      </div>
                      <div className="stat-row">
                        <span>Achievements Earned:</span>
                        <span>{Object.keys(achievements).length} / {ACHIEVEMENTS.length}</span>
                      </div>
                      <div className="stat-row">
                        <span>Premium Status:</span>
                        <span>{purchases.premium_version ? "Premium User" : "Free User"}</span>
                      </div>
                      <div className="stat-row">
                        <span>Current Theme:</span>
                        <span>{
                          currentSkin === "secret_agent" ? "Secret Agent" : 
                          currentSkin === "moon_man" ? "Moon Man" :
                          currentSkin === "alien" ? "Alien Commander" :
                          "Default"
                        }</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Footer */}
        <footer className="game-footer">
          <div className="footer-content">
            <p>&copy; 2025 Shadow Files. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;