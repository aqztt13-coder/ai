import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'religious',
    name_ar: 'المعالم الدينية والمزارات',
    name_en: 'Religious & Holy Shrines',
    iconName: 'Landmark',
    description_ar: 'المراقد المقدسة، المساجد التاريخية، الكنائس والأديرة والمعابد في بلاد الرافدين',
    description_en: 'Holy shrines, historic mosques, ancient churches, monasteries, and temples',
    color: 'emerald'
  },
  {
    id: 'archaeological',
    name_ar: 'المواقع الأثرية والحضارية',
    name_en: 'Archaeological & Ancient Sites',
    iconName: 'Pyramid',
    description_ar: 'الزقورات، المدن السومرية والبابلية والآشورية وقلاع الحضر وبوابة عشتار',
    description_en: 'Sumerian, Babylonian, Assyrian cities, Ziggurats, Hatra and Ishtar Gate',
    color: 'amber'
  },
  {
    id: 'historical',
    name_ar: 'المعالم والأبنية التاريخية',
    name_en: 'Historic Buildings & Souqs',
    iconName: 'Castle',
    description_ar: 'المدارس التراثية، القصور القديمة، الشناشيل والأسواق العتيقة مثل شارع المتنبي',
    description_en: 'Heritage houses, historical palaces, traditional Shanashil and ancient souqs',
    color: 'amber'
  },
  {
    id: 'natural',
    name_ar: 'الطبيعة والأهوار والشلالات',
    name_en: 'Nature, Marshes & Mountains',
    iconName: 'Trees',
    description_ar: 'أهوار جنوب العراق المدرجة دولياً، شلالات كوردستان، بحيرة الحبانية ودجلة والفرات',
    description_en: 'UNESCO Mesopotamian Marshes, Kurdistan waterfalls, lakes, and majestic rivers',
    color: 'sky'
  },
  {
    id: 'cultural',
    name_ar: 'المتاحف والمراكز الثقافية',
    name_en: 'Museums & Cultural Centers',
    iconName: 'Building2',
    description_ar: 'المتحف العراقي الوطني، مسارح بغداد، متاحف البصرة وأربيل والسليمانية',
    description_en: 'The National Museum of Iraq, cultural houses, galleries and heritage centers',
    color: 'indigo'
  },
  {
    id: 'entertainment',
    name_ar: 'الترفيه والحدائق والمقاهي',
    name_en: 'Entertainment & Parks',
    iconName: 'Compass',
    description_ar: 'متنزهات الزوراء، تلفريك كورك، المقاهي التراثية مثل مقهى الشابندر والقرى السياحية',
    description_en: 'Family parks, Korek cable cars, heritage cafes like Shabandar, and resorts',
    color: 'rose'
  },
  {
    id: 'activity',
    name_ar: 'الأنشطة والجولات السياحية',
    name_en: 'Tours & Outdoor Activities',
    iconName: 'Ship',
    description_ar: 'جولات المشحوف في الأهوار، رحلات تسلق الجبال، رحلات قوارب شط العرب والتخييم',
    description_en: 'Marsh boat tours in Mashhoof, mountain trekking, river cruises, and stargazing',
    color: 'teal'
  }
];
