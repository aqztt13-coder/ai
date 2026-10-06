import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Place, PlaceCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, Layers, Compass, Filter } from 'lucide-react';

interface InteractiveMapProps {
  places: Place[];
  selectedCategory?: string;
  selectedGov?: string;
  heightClass?: string;
  focusPlace?: Place | null;
  interactive?: boolean;
}

const CATEGORY_COLORS: Record<PlaceCategory, string> = {
  religious: '#059669', // Emerald
  archaeological: '#b45309', // Amber dark
  historical: '#b45309', // Warm clay
  natural: '#0284c7', // Sky / Azure
  cultural: '#4f46e5', // Indigo
  entertainment: '#e11d48', // Rose
  activity: '#0d9488' // Teal
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  places,
  selectedCategory = 'all',
  selectedGov = 'all',
  heightClass = 'h-[500px]',
  focusPlace = null,
  interactive = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>(selectedCategory);
  const [activeGovFilter, setActiveGovFilter] = useState<string>(selectedGov);

  const { language, userLocation, requestUserLocation, setActiveView, governorates } = useApp();
  const isAr = language === 'ar';

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Iraq center coordinates: [33.2232, 43.6793]
      const defaultCenter: [number, number] = focusPlace
        ? [focusPlace.lat, focusPlace.lng]
        : [33.3152, 44.3661]; // Baghdad default

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: focusPlace ? 13 : 6,
        scrollWheelZoom: interactive,
        dragging: interactive,
        attributionControl: false
      });

      // CartoDB Positron / OpenStreetMap clean tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; OpenStreetMap contributors &copy; CARTO')
        .addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup if unmounted
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Filter places
    const filtered = places.filter(p => {
      const matchCat = activeCategoryFilter === 'all' || p.category === activeCategoryFilter;
      const matchGov = activeGovFilter === 'all' || p.governorate_id === activeGovFilter;
      return matchCat && matchGov;
    });

    // Create marker for each place
    filtered.forEach(place => {
      const color = CATEGORY_COLORS[place.category] || '#b45309';

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            <div style="
              width: 10px;
              height: 10px;
              background-color: #ffffff;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-stone-900 font-sans';
      popupContent.innerHTML = `
        <div style="width: 220px; font-family: 'Cairo', sans-serif; direction: ${isAr ? 'rtl' : 'ltr'}; text-align: ${isAr ? 'right' : 'left'};">
          <img src="${place.cover_image}" alt="${isAr ? place.name_ar : place.name_en}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-size: 11px; color: #b45309; font-weight: bold; margin-bottom: 2px;">
            ${isAr ? place.era_civilization_ar : place.era_civilization_en}
          </div>
          <h4 style="font-size: 14px; font-weight: bold; margin: 0 0 4px 0; color: #1c1917;">
            ${isAr ? place.name_ar : place.name_en}
          </h4>
          <div style="font-size: 11px; color: #78716c; margin-bottom: 8px;">
            ${isAr ? place.city_ar : place.city_en} · ⭐ ${place.rating} (${place.ratings_count})
          </div>
          <button id="view-place-${place.id}" style="
            width: 100%;
            background-color: #1c1917;
            color: #fef3c7;
            border: none;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
          ">
            ${isAr ? 'عرض تفاصيل المعلم ←' : 'View Place Details →'}
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-place-${place.id}`);
        if (btn) {
          btn.onclick = () => {
            setActiveView('place-detail', place.id);
          };
        }
      });

      markersLayer.addLayer(marker);
    });

    // Add user location pin if available
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="
            background-color: #2563eb;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 0 0 6px rgba(37,99,235,0.25);
          "></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindPopup(isAr ? 'موقعك الحالي' : 'Your Location');
      markersLayer.addLayer(userMarker);
    }

    // Focus on specific place if provided
    if (focusPlace) {
      map.setView([focusPlace.lat, focusPlace.lng], 13);
    }
  }, [places, activeCategoryFilter, activeGovFilter, userLocation, focusPlace, isAr]);

  const handleLocateMe = () => {
    requestUserLocation();
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 11);
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([33.3152, 44.3661], 6);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-300 shadow-md bg-stone-100">
      {/* Map Control Bar on Top */}
      <div className="absolute top-3 right-3 left-3 z-[20] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Category & Gov Filters dropdowns */}
        <div className="flex items-center gap-2 pointer-events-auto bg-stone-900/90 backdrop-blur-md p-1.5 rounded-xl border border-amber-900/40 shadow-lg text-xs">
          <select
            value={activeGovFilter}
            onChange={e => setActiveGovFilter(e.target.value)}
            className="bg-stone-800 text-stone-200 border-none rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">{isAr ? 'جميع المحافظات (18)' : 'All Governorates'}</option>
            {governorates.map(g => (
              <option key={g.id} value={g.id}>{isAr ? g.name_ar : g.name_en}</option>
            ))}
          </select>

          <select
            value={activeCategoryFilter}
            onChange={e => setActiveCategoryFilter(e.target.value)}
            className="bg-stone-800 text-stone-200 border-none rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">{isAr ? 'جميع التصنيفات' : 'All Categories'}</option>
            <option value="archaeological">{isAr ? 'مواقع أثرية' : 'Archaeological'}</option>
            <option value="religious">{isAr ? 'معالم دينية ومزارات' : 'Religious'}</option>
            <option value="historical">{isAr ? 'أبنية تاريخية وتراثية' : 'Historical'}</option>
            <option value="natural">{isAr ? 'طبيعة وأهوار' : 'Nature & Marshes'}</option>
            <option value="cultural">{isAr ? 'متاحف ومراكز ثقافية' : 'Cultural'}</option>
            <option value="entertainment">{isAr ? 'ترفيه وحدائق' : 'Entertainment'}</option>
          </select>
        </div>

        {/* Map Tool buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={handleLocateMe}
            className="p-2 bg-stone-900/90 hover:bg-stone-800 text-amber-300 rounded-xl border border-amber-900/40 shadow-lg transition backdrop-blur-md"
            title={isAr ? 'تحديد موقعي' : 'Locate Me'}
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-2 bg-stone-900/90 hover:bg-stone-800 text-amber-300 rounded-xl border border-amber-900/40 shadow-lg transition backdrop-blur-md"
            title={isAr ? 'إعادة ضبط الخريطة' : 'Reset View'}
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-10`} />

      {/* Map Legend on bottom */}
      <div className="absolute bottom-3 left-3 z-[20] hidden sm:flex items-center gap-3 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-900/40 text-[11px] text-stone-300 pointer-events-none">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          {isAr ? 'ديني' : 'Religious'}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
          {isAr ? 'أثري' : 'Archaeology'}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
          {isAr ? 'طبيعي' : 'Nature'}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
          {isAr ? 'ثقافي' : 'Cultural'}
        </span>
      </div>
    </div>
  );
};
