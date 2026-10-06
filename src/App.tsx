import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { AiChatbot } from './components/chat/AiChatbot';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';
import { CacheErrorAlert } from './components/common/CacheErrorAlert';

// Views
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { PlaceDetailView } from './views/PlaceDetailView';
import { GovernoratesView } from './views/GovernoratesView';
import { GovernorateDetailView } from './views/GovernorateDetailView';
import { InteractiveMapView } from './views/InteractiveMapView';
import { TripsView } from './views/TripsView';
import { UnescoView } from './views/UnescoView';
import { TravelGuideView } from './views/TravelGuideView';
import { FavoritesView } from './views/FavoritesView';
import { AdminDashboardView } from './views/AdminDashboardView';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <main className="min-h-screen pb-16 lg:pb-0">
      {activeView === 'home' && <HomeView />}
      {activeView === 'explore' && <ExploreView />}
      {activeView === 'place-detail' && <PlaceDetailView />}
      {activeView === 'governorates' && <GovernoratesView />}
      {activeView === 'governorate-detail' && <GovernorateDetailView />}
      {activeView === 'map' && <InteractiveMapView />}
      {activeView === 'trips' && <TripsView />}
      {activeView === 'unesco' && <UnescoView />}
      {activeView === 'guide' && <TravelGuideView />}
      {activeView === 'favorites' && <FavoritesView />}
      {activeView === 'admin' && <AdminDashboardView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-amber-500 selection:text-white">
        <Navbar />
        <div className="flex-1">
          <MainContent />
        </div>
        <Footer />
        <BottomNav />
        <AiChatbot />
        <PWAInstallBanner />
        <CacheErrorAlert />
      </div>
    </AppProvider>
  );
}
