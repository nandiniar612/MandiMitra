/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { FarmerLogin } from './components/FarmerLogin';
import { HomeDashboard } from './components/HomeDashboard';
import { CropPriceExplorer } from './components/CropPriceExplorer';
import { MandiComparison } from './components/MandiComparison';
import { AIPrediction } from './components/AIPrediction';
import { SmartRecommendation } from './components/SmartRecommendation';
import { ProfitCalculator } from './components/ProfitCalculator';
import { AboutUs } from './components/AboutUs';
import { FloatingChatbot } from './components/FloatingChatbot';
import { Footer } from './components/Footer';
import { CROPS_DATA, CropInfo } from './data/marketData';
import {
  FarmerProfile,
  LanguageCode,
  clearFarmerProfile,
  loadFarmerProfile,
  saveFarmerProfile,
} from './types/farmer';

export default function App() {
  const initialFarmer = loadFarmerProfile();

  const [farmer, setFarmer] = useState<FarmerProfile | null>(initialFarmer);
  const [language, setLanguage] = useState<LanguageCode>(
    initialFarmer?.language || 'en'
  );
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCrop, setSelectedCrop] = useState<CropInfo>(CROPS_DATA[0]);
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    if (farmer) {
      const updated = { ...farmer, language: newLang };
      setFarmer(updated);
      saveFarmerProfile(updated);
    }
  };

  const handleLoginSuccess = (profile: FarmerProfile) => {
    saveFarmerProfile(profile);
    setFarmer(profile);
    setLanguage(profile.language);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    clearFarmerProfile();
    setFarmer(null);
    setChatbotOpen(false);
  };

  const handleNavigate = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCropAndGo = (crop: CropInfo, tabId = 'explorer') => {
    setSelectedCrop(crop);
    handleNavigate(tabId);
  };

  const handleAskBotAboutCrop = (crop: CropInfo) => {
    setSelectedCrop(crop);
    setChatbotOpen(true);
  };

  // First-step Farmer Login gate
  if (!farmer) {
    return (
      <FarmerLogin
        language={language}
        setLanguage={handleLanguageChange}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen relative flex bg-[#07160d] text-stone-100 font-sans">
      {/* Scenic Lush Green Agricultural Background Layer (Reference Aesthetic) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="/src/assets/images/farmer_smart_tech_1794498775168.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-30 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#06140c]/90 via-[#0b2315]/75 to-[#06140c]/95" />
      </div>

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        language={language}
        onOpenChatbot={() => setChatbotOpen(true)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Right Main Column */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <TopBar
          farmer={farmer}
          language={language}
          setLanguage={handleLanguageChange}
          onSelectCropAndGo={handleSelectCropAndGo}
          onLogout={handleLogout}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'dashboard' && (
            <HomeDashboard
              farmer={farmer}
              onSelectCrop={setSelectedCrop}
              onNavigate={handleNavigate}
              onAskBotAboutCrop={handleAskBotAboutCrop}
              language={language}
            />
          )}

          {activeTab === 'explorer' && (
            <CropPriceExplorer
              selectedCrop={selectedCrop}
              onSelectCrop={setSelectedCrop}
              onNavigate={handleNavigate}
              language={language}
            />
          )}

          {activeTab === 'comparison' && (
            <MandiComparison
              selectedCrop={selectedCrop}
              onSelectCrop={setSelectedCrop}
              onNavigate={handleNavigate}
              language={language}
            />
          )}

          {activeTab === 'prediction' && (
            <AIPrediction
              selectedCrop={selectedCrop}
              onSelectCrop={setSelectedCrop}
              onNavigate={handleNavigate}
              language={language}
            />
          )}

          {activeTab === 'recommendation' && (
            <SmartRecommendation
              selectedCrop={selectedCrop}
              onSelectCrop={setSelectedCrop}
              onNavigate={handleNavigate}
              language={language}
              defaultDistrict={farmer.place}
            />
          )}

          {activeTab === 'calculator' && (
            <ProfitCalculator
              selectedCrop={selectedCrop}
              onSelectCrop={setSelectedCrop}
              language={language}
            />
          )}

          {activeTab === 'about' && (
            <AboutUs onNavigate={handleNavigate} language={language} />
          )}
        </main>

        <Footer onNavigate={handleNavigate} language={language} />
      </div>

      {/* Persistent Right-Corner Multilingual AI Price Analysis Chatbot */}
      <FloatingChatbot
        farmer={farmer}
        language={language}
        selectedCrop={selectedCrop}
        isOpen={chatbotOpen}
        setIsOpen={setChatbotOpen}
      />
    </div>
  );
}
