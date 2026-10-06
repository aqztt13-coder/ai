import React, { createContext, useContext, useState, useEffect } from 'react';
import { Place, Governorate, CategoryInfo, Review, Trip, EditSuggestion, AppNotification, Language } from '../types';
import { PLACES } from '../data/places';
import { GOVERNORATES } from '../data/governorates';
import { CATEGORIES } from '../data/categories';
import { INITIAL_TRIPS, INITIAL_REVIEWS, INITIAL_NOTIFICATIONS } from '../data/extraData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  places: Place[];
  addPlace: (place: Omit<Place, 'id' | 'created_at' | 'updated_at'>) => void;
  updatePlace: (id: string, updated: Partial<Place>) => void;
  deletePlace: (id: string) => void;
  governorates: Governorate[];
  categories: CategoryInfo[];
  favorites: string[];
  toggleFavorite: (placeId: string) => void;
  visitedPlaces: string[];
  toggleVisited: (placeId: string) => void;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'created_at' | 'status'>) => void;
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'created_at'>) => Trip;
  deleteTrip: (id: string) => void;
  addPlaceToTrip: (tripId: string, placeId: string, day?: number) => void;
  userLocation: { lat: number; lng: number } | null;
  requestUserLocation: () => void;
  isAdmin: boolean;
  toggleAdminMode: () => void;
  editSuggestions: EditSuggestion[];
  addEditSuggestion: (s: Omit<EditSuggestion, 'id' | 'created_at' | 'status'>) => void;
  moderateSuggestion: (id: string, status: 'approved' | 'rejected') => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  activeView: string;
  setActiveView: (view: string, idParam?: string) => void;
  selectedPlaceId: string | null;
  selectedGovernorateId: string | null;
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  aiChatInitialPrompt: string;
  openAiChatWithPrompt: (prompt: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('iraq_guide_lang') as Language) || 'ar';
  });

  const [places, setPlaces] = useState<Place[]>(() => {
    const saved = localStorage.getItem('iraq_guide_places');
    return saved ? JSON.parse(saved) : PLACES;
  });

  const [governorates] = useState<Governorate[]>(GOVERNORATES);
  const [categories] = useState<CategoryInfo[]>(CATEGORIES);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('iraq_guide_favorites');
    return saved ? JSON.parse(saved) : ['ziggurat-of-ur', 'chibayish-marshes', 'erbil-citadel'];
  });

  const [visitedPlaces, setVisitedPlaces] = useState<string[]>(() => {
    const saved = localStorage.getItem('iraq_guide_visited');
    return saved ? JSON.parse(saved) : ['iraq-museum'];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('iraq_guide_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('iraq_guide_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [editSuggestions, setEditSuggestions] = useState<EditSuggestion[]>(() => {
    const saved = localStorage.getItem('iraq_guide_suggestions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'sug-1',
        place_id: 'ziggurat-of-ur',
        place_name: 'زقورة أور السومرية',
        user_name: 'حيدر الكعبي',
        user_email: 'haider@example.com',
        suggestion_type: 'incorrect_hours',
        details: 'تم تمديد ساعات الدخول في الصيف حتى الساعة 06:30 مساءً بدلاً من 05:00 مساءً.',
        created_at: '2026-03-02T12:00:00Z',
        status: 'pending'
      }
    ];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('iraq_guide_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('iraq_guide_admin') === 'true';
  });

  const [activeView, setActiveViewState] = useState<string>('home');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedGovernorateId, setSelectedGovernorateId] = useState<string | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiChatInitialPrompt, setAiChatInitialPrompt] = useState('');

  const openAiChatWithPrompt = (prompt: string) => {
    setAiChatInitialPrompt(prompt);
    setIsAiChatOpen(true);
  };

  // Sync language with document HTML direction
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('iraq_guide_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Persist state updates to LocalStorage and CacheStorage for offline PWA continuity
  useEffect(() => {
    localStorage.setItem('iraq_guide_places', JSON.stringify(places));
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.open('iraq-tourism-places-data-v4').then(cache => {
        cache.put(
          new Request('/api/places'),
          new Response(JSON.stringify(places), {
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          })
        ).catch(() => {});
      }).catch(() => {});
    }
  }, [places]);

  useEffect(() => {
    localStorage.setItem('iraq_guide_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('iraq_guide_visited', JSON.stringify(visitedPlaces));
  }, [visitedPlaces]);

  useEffect(() => {
    localStorage.setItem('iraq_guide_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('iraq_guide_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('iraq_guide_suggestions', JSON.stringify(editSuggestions));
  }, [editSuggestions]);

  useEffect(() => {
    localStorage.setItem('iraq_guide_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('iraq_guide_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  const toggleFavorite = (placeId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(placeId);
      const updated = exists ? prev.filter(id => id !== placeId) : [...prev, placeId];
      // update places counter
      setPlaces(currentPlaces =>
        currentPlaces.map(p =>
          p.id === placeId
            ? { ...p, favorites_count: Math.max(0, p.favorites_count + (exists ? -1 : 1)) }
            : p
        )
      );
      return updated;
    });
  };

  const toggleVisited = (placeId: string) => {
    setVisitedPlaces(prev =>
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
  };

  const addPlace = (newPlaceData: Omit<Place, 'id' | 'created_at' | 'updated_at'>) => {
    const newPlace: Place = {
      ...newPlaceData,
      id: `place-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setPlaces(prev => [newPlace, ...prev]);
  };

  const updatePlace = (id: string, updatedFields: Partial<Place>) => {
    setPlaces(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields, updated_at: new Date().toISOString() } : p))
    );
  };

  const deletePlace = (id: string) => {
    setPlaces(prev => prev.filter(p => p.id !== id));
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'created_at' | 'status'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'approved'
    };
    setReviews(prev => [newReview, ...prev]);

    // Recalculate place overall rating
    setPlaces(prev =>
      prev.map(p => {
        if (p.id === reviewData.place_id) {
          const newCount = p.ratings_count + 1;
          const newAvg = Number(((p.rating * p.ratings_count + reviewData.rating) / newCount).toFixed(1));
          return {
            ...p,
            rating: newAvg,
            ratings_count: newCount
          };
        }
        return p;
      })
    );
  };

  const addTrip = (tripData: Omit<Trip, 'id' | 'created_at'>): Trip => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setTrips(prev => [newTrip, ...prev]);
    return newTrip;
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  const addPlaceToTrip = (tripId: string, placeId: string, day: number = 1) => {
    setTrips(prev =>
      prev.map(t => {
        if (t.id === tripId) {
          const newItem = {
            id: `item-${Date.now()}`,
            day,
            time: '11:00',
            place_id: placeId,
            duration_hours: 2
          };
          return {
            ...t,
            items: [...t.items, newItem]
          };
        }
        return t;
      })
    );
  };

  const requestUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Default to Baghdad if access denied
          setUserLocation({ lat: 33.3152, lng: 44.3661 });
        }
      );
    }
  };

  const toggleAdminMode = () => {
    setIsAdmin(prev => !prev);
  };

  const addEditSuggestion = (suggestionData: Omit<EditSuggestion, 'id' | 'created_at' | 'status'>) => {
    const newSug: EditSuggestion = {
      ...suggestionData,
      id: `sug-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    setEditSuggestions(prev => [newSug, ...prev]);
  };

  const moderateSuggestion = (id: string, status: 'approved' | 'rejected') => {
    setEditSuggestions(prev =>
      prev.map(s => (s.id === id ? { ...s, status } : s))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const setActiveView = (view: string, idParam?: string) => {
    setActiveViewState(view);
    if (view === 'place-detail' && idParam) {
      setSelectedPlaceId(idParam);
      // Increment views count
      setPlaces(current =>
        current.map(p => (p.id === idParam ? { ...p, views: p.views + 1 } : p))
      );
    } else if (view === 'governorate-detail' && idParam) {
      setSelectedGovernorateId(idParam);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        places,
        addPlace,
        updatePlace,
        deletePlace,
        governorates,
        categories,
        favorites,
        toggleFavorite,
        visitedPlaces,
        toggleVisited,
        reviews,
        addReview,
        trips,
        addTrip,
        deleteTrip,
        addPlaceToTrip,
        userLocation,
        requestUserLocation,
        isAdmin,
        toggleAdminMode,
        editSuggestions,
        addEditSuggestion,
        moderateSuggestion,
        notifications,
        markNotificationRead,
        activeView,
        setActiveView,
        selectedPlaceId,
        selectedGovernorateId,
        isAiChatOpen,
        setIsAiChatOpen,
        aiChatInitialPrompt,
        openAiChatWithPrompt
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
