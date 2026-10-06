export type Language = 'ar' | 'en';

export type PlaceCategory = 
  | 'religious'
  | 'archaeological'
  | 'historical'
  | 'natural'
  | 'cultural'
  | 'entertainment'
  | 'activity';

export interface PlaceSource {
  name: string;
  url?: string;
  publisher?: string;
  accessDate?: string;
}

export interface PlaceFeatures {
  familyFriendly: boolean;
  kidsFriendly: boolean;
  parkingAvailable: boolean;
  restroomsAvailable: boolean;
  wheelchairAccessible: boolean;
  nearbyRestaurants: boolean;
  requiresTicket: boolean;
}

export interface RatingBreakdown {
  cleanliness: number;
  organization: number;
  accessibility: number;
  historicalValue: number;
  overall: number;
}

export interface Place {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  category: PlaceCategory;
  governorate_id: string;
  city_ar: string;
  city_en: string;
  address_ar: string;
  address_en: string;
  lat: number;
  lng: number;
  cover_image: string;
  images: string[];
  short_description_ar: string;
  short_description_en: string;
  description_ar: string;
  description_en: string;
  history_ar: string;
  history_en: string;
  era_civilization_ar: string;
  era_civilization_en: string;
  opening_hours_ar: string;
  opening_hours_en: string;
  ticket_price_ar: string;
  ticket_price_en: string;
  best_time_ar: string;
  best_time_en: string;
  average_visit_duration_ar: string;
  average_visit_duration_en: string;
  rating: number;
  ratings_count: number;
  ratings_breakdown: RatingBreakdown;
  features: PlaceFeatures;
  unesco: boolean;
  unesco_year?: number;
  religion_detail_ar?: string;
  religion_detail_en?: string;
  sources: PlaceSource[];
  views: number;
  favorites_count: number;
  shares_count: number;
  featured: boolean;
  status: 'published' | 'pending' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface Governorate {
  id: string;
  name_ar: string;
  name_en: string;
  capital_ar: string;
  capital_en: string;
  region_ar: string;
  region_en: string;
  cover_image: string;
  description_ar: string;
  description_en: string;
  best_time_ar: string;
  best_time_en: string;
  lat: number;
  lng: number;
  highlights_ar: string[];
  highlights_en: string[];
}

export interface CategoryInfo {
  id: PlaceCategory;
  name_ar: string;
  name_en: string;
  iconName: string;
  description_ar: string;
  description_en: string;
  color: string;
}

export interface Review {
  id: string;
  place_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  ratings_breakdown: RatingBreakdown;
  comment: string;
  created_at: string;
  visit_date?: string;
  status: 'approved' | 'pending';
}

export interface TripItineraryItem {
  id: string;
  day: number;
  time: string;
  place_id: string;
  notes?: string;
  duration_hours?: number;
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  governorate_ids: string[];
  start_date?: string;
  duration_days: number;
  items: TripItineraryItem[];
  created_at: string;
  is_template?: boolean;
}

export interface EventItem {
  id: string;
  title_ar: string;
  title_en: string;
  governorate_id: string;
  location_ar: string;
  location_en: string;
  date_ar: string;
  date_en: string;
  category: 'religious' | 'cultural' | 'festival' | 'heritage';
  description_ar: string;
  description_en: string;
  cover_image: string;
}

export interface Article {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  category_ar: string;
  category_en: string;
  author_ar: string;
  author_en: string;
  read_time_ar: string;
  read_time_en: string;
  publish_date: string;
  excerpt_ar: string;
  excerpt_en: string;
  content_ar: string;
  content_en: string;
  cover_image: string;
  tags_ar: string[];
  tags_en: string[];
}

export interface Hotel {
  id: string;
  name_ar: string;
  name_en: string;
  governorate_id: string;
  city_ar: string;
  city_en: string;
  stars: number;
  price_range_ar: string;
  price_range_en: string;
  rating: number;
  address_ar: string;
  address_en: string;
  cover_image: string;
  amenities_ar: string[];
  amenities_en: string[];
  lat: number;
  lng: number;
}

export interface Restaurant {
  id: string;
  name_ar: string;
  name_en: string;
  governorate_id: string;
  city_ar: string;
  city_en: string;
  cuisine_ar: string;
  cuisine_en: string;
  famous_dish_ar: string;
  famous_dish_en: string;
  price_range_ar: string;
  price_range_en: string;
  rating: number;
  address_ar: string;
  address_en: string;
  cover_image: string;
  lat: number;
  lng: number;
}

export interface EditSuggestion {
  id: string;
  place_id: string;
  place_name: string;
  user_name: string;
  user_email: string;
  suggestion_type: 'incorrect_hours' | 'wrong_location' | 'outdated_info' | 'closed_permanently' | 'other';
  details: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AppNotification {
  id: string;
  title_ar: string;
  title_en: string;
  message_ar: string;
  message_en: string;
  created_at: string;
  type: 'place' | 'trip' | 'event' | 'system';
  read: boolean;
  link?: string;
}
