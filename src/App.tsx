import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { SparePartsPage } from './pages/SparePartsPage';
import { NearbyFinderPage } from './pages/NearbyFinderPage';
import { AIDecisionPage } from './pages/AIDecisionPage';
import { ProductsPage } from './pages/ProductsPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ComparePage } from './pages/ComparePage';
import { RepairAssistantPage } from './pages/RepairAssistantPage';
import { MyDevicesPage } from './pages/MyDevicesPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { TeardownLabPage } from './pages/TeardownLabPage';
import { AIChatPage } from './pages/AIChatPage';
import { Product } from './types';
import { LoginPage } from './pages/LoginPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [navParams, setNavParams] = useState<Record<string, any>>({});

  // Compared products across application
  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);

  // Scroll to top on page change
  const navigateTo = (page: string, params: Record<string, any> = {}) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompare = (product: Product) => {
    if (comparedProductIds.includes(product.id)) {
      setComparedProductIds(comparedProductIds.filter((id) => id !== product.id));
    } else {
      if (comparedProductIds.length >= 3) {
        // Remove the first and add new
        setComparedProductIds([...comparedProductIds.slice(1), product.id]);
      } else {
        setComparedProductIds([...comparedProductIds, product.id]);
      }
    }
  };

  const handleRemoveFromCompare = (productId: string) => {
    setComparedProductIds(comparedProductIds.filter((id) => id !== productId));
  };



  if (currentPage === 'login') {
    return <LoginPage onPreview={() => { setCurrentPage('home'); window.scrollTo({ top: 0 }); }} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-[#1B2722] font-sans antialiased selection:bg-[#DCE9DF] selection:text-[#10382D]">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
      />

      {/* Main Page Content Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
              />
        )}

        {currentPage === 'spare-parts' && (
          <SparePartsPage
            initialProductId={navParams.productId}
            initialCategory={navParams.category}
            initialSearch={navParams.search}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === '3d-lab' && (
          <TeardownLabPage
            initialProductId={navParams.productId}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'find-nearby' && (
          <NearbyFinderPage
            initialCategory={navParams.category}
            initialModel={navParams.model}
            initialPartId={navParams.partId}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'ai-chat' && (
          <AIChatPage
            initialPrompt={navParams.prompt}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'ai-agent' && (
          <AIDecisionPage
            initialMode={navParams.mode}
            initialProductId={navParams.productId}
            initialComponent={navParams.component}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'products' && (
          <ProductsPage
            initialSearch={navParams.search}
            initialSelectedId={navParams.selectedId}
            onNavigate={navigateTo}
            comparedProductIds={comparedProductIds}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {currentPage === 'calculator' && (
          <CalculatorPage
            initialProductId={navParams.productId}
            initialComponent={navParams.component}
            initialMinPartCost={navParams.minPartCost}
            initialMaxPartCost={navParams.maxPartCost}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'compare' && (
          <ComparePage
            comparedProductIds={comparedProductIds}
            onRemoveFromCompare={handleRemoveFromCompare}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'repair-assistant' && (
          <RepairAssistantPage onNavigate={navigateTo} />
        )}

        {currentPage === 'my-devices' && (
          <MyDevicesPage onNavigate={navigateTo} />
        )}

        {currentPage === 'methodology' && (
          <MethodologyPage />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />


    </div>
  );
}
