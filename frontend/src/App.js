import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Eye, Zap, Clock, TrendingUp, Shield, Globe, Cpu, Brain, Star } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

const STORAGE_KEY = "conspiracy_clicker_save";

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
  }
];

const ACHIEVEMENTS = [
  { id: "first_click", name: "First Click", description: "Click once", requirement: 1, type: "clicks" },
  { id: "hundred_clicks", name: "Investigator", description: "Click 100 times", requirement: 100, type: "clicks" },
  { id: "thousand_evidence", name: "Truth Seeker", description: "Gather 1,000 evidence", requirement: 1000, type: "evidence" },
  { id: "ten_thousand_evidence", name: "Conspiracy Expert", description: "Gather 10,000 evidence", requirement: 10000, type: "evidence" },
  { id: "first_upgrade", name: "Equipped", description: "Buy your first upgrade", requirement: 1, type: "upgrades" }
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
    
    setClickPower(newClickPower);
    setIdleIncome(newIdleIncome);
  }, [upgrades]);

  // Unlock upgrades based on total evidence
  useEffect(() => {
    const secrets = Math.floor(totalEvidence / 1000);
    setSecretsUnlocked(secrets);
  }, [totalEvidence]);

  // Save game state
  useEffect(() => {
    const saveData = {
      evidence,
      totalEvidence,
      clickCount,
      upgrades,
      achievements,
      lastSave: Date.now()
    };
    console.log("Saving game data:", saveData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  }, [evidence, totalEvidence, clickCount, upgrades, achievements]);

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
        }
        
        if (progress >= achievement.requirement) {
          setAchievements(prev => ({ ...prev, [achievement.id]: true }));
          toast(`🏆 Achievement Unlocked: ${achievement.name}!`);
        }
      }
    });
  }, [clickCount, totalEvidence, upgrades, achievements]);

  const calculateIdleIncome = (upgradeState) => {
    let income = 0;
    UPGRADES.forEach(upgrade => {
      const owned = upgradeState[upgrade.id] || 0;
      income += upgrade.idleBonus * owned;
    });
    return income;
  };

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

  return (
    <div className="conspiracy-game">
      <div className="game-container">
        <header className="game-header">
          <div className="header-content">
            <div className="title-section">
              <h1 className="game-title">
                <Eye className="title-icon" />
                CONSPIRACY CLICKER
              </h1>
              <p className="game-subtitle">Uncover the truth, one click at a time</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Evidence</span>
                <span className="stat-value">{formatNumber(evidence)}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Per Click</span>
                <span className="stat-value">{formatNumber(clickPower)}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Per Second</span>
                <span className="stat-value">{formatNumber(idleIncome)}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Secrets</span>
                <span className="stat-value">{secretsUnlocked}</span>
              </div>
            </div>
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
                </div>
              </Button>
              
              <div className="click-feedback">
                <p>Click to gather evidence of hidden truths!</p>
                <Progress value={(totalEvidence % 1000) / 10} className="progress-bar" />
                <p className="progress-text">
                  {Math.floor((totalEvidence % 1000))} / 1000 to next secret
                </p>
              </div>
            </div>
          </div>

          <div className="game-tabs">
            <Tabs defaultValue="upgrades" className="tabs-container">
              <TabsList className="tabs-list">
                <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
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
                    <Card key={upgrade.id} className={`upgrade-card ${canAfford ? 'affordable' : ''}`}>
                      <CardContent className="upgrade-content">
                        <div className="upgrade-icon">
                          <Icon />
                          {owned > 0 && <Badge className="owned-badge">{owned}</Badge>}
                        </div>
                        <div className="upgrade-info">
                          <h3>{upgrade.name}</h3>
                          <p>{upgrade.description}</p>
                          <Button
                            onClick={() => buyUpgrade(upgrade.id)}
                            disabled={!canAfford}
                            className="upgrade-button"
                          >
                            Buy - {formatNumber(cost)} evidence
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;