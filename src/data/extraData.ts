import { Trip, Review, EventItem, Article, Hotel, Restaurant, AppNotification } from '../types';

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'baghdad-heritage-2days',
    title: 'رحلة بغداد: عبق الخلافة والذاكرة الرافدينية (يومان)',
    description: 'جولة متكاملة في قلب العاصمة بغداد تشمل المتحف العراقي، شارع المتنبي، مقهى الشابندر، والمدرسة المستنصرية والكاظمية.',
    governorate_ids: ['baghdad'],
    duration_days: 2,
    created_at: '2025-02-15T10:00:00Z',
    is_template: true,
    items: [
      { id: 'item-1', day: 1, time: '09:00', place_id: 'iraq-museum', notes: 'جولة استكشافية لكنوز سومر وبابل وآشور', duration_hours: 3 },
      { id: 'item-2', day: 1, time: '13:00', place_id: 'mutanabbi-street', notes: 'غداء سمك مسكوف على دجلة ثم مقهى الشابندر', duration_hours: 3 },
      { id: 'item-3', day: 2, time: '10:00', place_id: 'mutanabbi-street', notes: 'جولة القشلة والمركز الثقافي البغدادي', duration_hours: 2 }
    ]
  },
  {
    id: 'sumer-marshes-3days',
    title: 'طريق سومر العظيم: من الزقورة إلى الأهوار (3 أيام)',
    description: 'رحلة أسطورية عبر جنوب العراق لزيارة زقورة أور ومسقط رأس إبراهيم الخليل ثم ركوب المشحوف في أهوار الجبايش.',
    governorate_ids: ['dhi_qar', 'muthanna'],
    duration_days: 3,
    created_at: '2025-02-10T10:00:00Z',
    is_template: true,
    items: [
      { id: 'item-4', day: 1, time: '09:30', place_id: 'uruk-warka', notes: 'زيارة مهد الكتابة المسمارية وزقورة أنو بالسماوة', duration_hours: 3 },
      { id: 'item-5', day: 2, time: '08:30', place_id: 'ziggurat-of-ur', notes: 'استكشاف زقورة أور والمقابر الملكية بالناصرية', duration_hours: 4 },
      { id: 'item-6', day: 3, time: '07:00', place_id: 'chibayish-marshes', notes: 'رحلة المشحوف وسط قصب الأهوار وزيارة المضايف السومرية', duration_hours: 6 }
    ]
  },
  {
    id: 'kurdistan-wonders-3days',
    title: 'جواهر الشمال: قلعة أربيل والعمادية المعلقة وجبل كورك',
    description: 'برنامج ممتع يجمع بين أقدم قلعة مأهولة، وقمم جبال كورك بالتلفريك، ومدينة العمادية المعلقة فوق الغيوم.',
    governorate_ids: ['erbil', 'duhok'],
    duration_days: 3,
    created_at: '2025-02-05T10:00:00Z',
    is_template: true,
    items: [
      { id: 'item-7', day: 1, time: '10:00', place_id: 'erbil-citadel', notes: 'زيارة قلعة أربيل والتسوق بسوق القيصرية القديم', duration_hours: 3 },
      { id: 'item-8', day: 2, time: '09:00', place_id: 'korek-mountain-resort', notes: 'صعود التلفريك والاستمتاع بالأنشطة الجبلية والإطلالات', duration_hours: 5 },
      { id: 'item-9', day: 3, time: '10:00', place_id: 'amedi-citadel', notes: 'اكتشاف بوابات العمادية الأثرية ومطلاتها الشاهقة', duration_hours: 4 }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    place_id: 'ziggurat-of-ur',
    user_name: 'أحمد السعدون',
    user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    ratings_breakdown: { cleanliness: 5, organization: 5, accessibility: 4.8, historicalValue: 5, overall: 5 },
    comment: 'زيارة مهيبة لا تُنسى! الوقوف أمام درجات الزقورة السومرية يجعلك تشعر بقداسة المكان وعظمة أجدادنا السومريين. التنظيم جيد والمرشدون المحليون ودودون جداً.',
    created_at: '2025-02-20T14:30:00Z',
    visit_date: 'فبراير 2025',
    status: 'approved'
  },
  {
    id: 'rev-2',
    place_id: 'chibayish-marshes',
    user_name: 'سارة الكرخي',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    ratings_breakdown: { cleanliness: 4.8, organization: 4.9, accessibility: 4.5, historicalValue: 5, overall: 5 },
    comment: 'تجربة ركوب المشحوف وقت الغروب بين غابات القصب والطيور المهاجرة لا مثيل لها عالمياً. كرم أهل الجبايش وضيافتهم في المضيف القصبي كانت الأجمل.',
    created_at: '2025-02-18T16:00:00Z',
    visit_date: 'يناير 2025',
    status: 'approved'
  },
  {
    id: 'rev-3',
    place_id: 'iraq-museum',
    user_name: 'د. علي الجبوري',
    user_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    ratings_breakdown: { cleanliness: 5, organization: 5, accessibility: 4.9, historicalValue: 5, overall: 5 },
    comment: 'المتحف العراقي كنز إنساني حقيقي. القاعات الآشورية وتماثيل الثور المجنح تأخذ الأنفاس. يستحق زيارة متأنية لا تقل عن 4 ساعات.',
    created_at: '2025-02-12T11:20:00Z',
    visit_date: 'فبراير 2025',
    status: 'approved'
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 'event-babylon-fest',
    title_ar: 'مهرجان بابل الدولي للثقافة والفنون',
    title_en: 'Babylon International Festival for Arts & Cultures',
    governorate_id: 'babylon',
    location_ar: 'المدرج البابلي، مدينة بابل الأثرية',
    location_en: 'Babylon Amphitheatre, Ancient Babylon',
    date_ar: 'مارس 2026',
    date_en: 'March 2026',
    category: 'festival',
    description_ar: 'عروض مسرحية وموسيقية ومعارض فن تشكيلي بمشاركة فرق عربية وعالمية فوق مسارح الحضارة البابلية.',
    description_en: 'International theatrical performances, folk music, and visual arts held at the ancient Babylonian amphitheater.',
    cover_image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'event-erbil-spring',
    title_ar: 'مهرجان نوروز وربيع أربيل',
    title_en: 'Newroz & Erbil Spring Festival',
    governorate_id: 'erbil',
    location_ar: 'قلعة أربيل وسفوح الجبال',
    location_en: 'Erbil Citadel & surrounding foothills',
    date_ar: '20 - 23 مارس',
    date_en: 'March 20 - 23',
    category: 'cultural',
    description_ar: 'إيقاد شعلة نوروز عند أسوار قلعة أربيل، احتفالات فلكلورية بالأزياء الكردية التقليدية ودبكات شعبية ومعارض تراثية.',
    description_en: 'Lighting of the Newroz torch at Erbil Citadel, vibrant traditional folk dances, and cultural exhibitions.',
    cover_image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'event-mutanabbi-book',
    title_ar: 'يوم الكتاب البغدادي في شارع المتنبي',
    title_en: 'Baghdad Book Day on Al-Mutanabbi Street',
    governorate_id: 'baghdad',
    location_ar: 'شارع المتنبي والقشلة، بغداد',
    location_en: 'Al-Mutanabbi Street & Al-Qishla',
    date_ar: 'كل جمعة على مدار العام',
    date_en: 'Every Friday year-round',
    category: 'heritage',
    description_ar: 'أكبر كرنفال أسبوعي للقراءة والأدب والشعر والموسيقى التراثية على ضفاف نهر دجلة بقلب بغداد التاريخية.',
    description_en: 'A weekly celebration of literature, book signings, poetry recitals, and traditional maqam music.',
    cover_image: 'https://images.unsplash.com/photo-1519046904884-53103b34b201?auto=format&fit=crop&w=800&q=80'
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'art-marshes-heritage',
    slug: 'marshes-heritage-guide',
    title_ar: 'الأهوار العراقية: كيف تعيش تجربة جنة عدن وسومر الأولى؟',
    title_en: 'The Mesopotamian Marshes: Living the Eden Experience',
    category_ar: 'أدلة السفر',
    category_en: 'Travel Guides',
    author_ar: 'فريق التحرير السياحي',
    author_en: 'Editorial Team',
    read_time_ar: '6 دقائق قراءة',
    read_time_en: '6 min read',
    publish_date: '2025-02-15',
    excerpt_ar: 'دليل شامل لزيارة أهوار الجبايش والحويزة: أفضل مواسم الزيارة، كيفية استئجار قوارب المشحوف، وتجربة المضايف القصبية.',
    excerpt_en: 'A comprehensive guide to visiting the Chibayish and Hawizeh marshes: seasons, canoe hires, and authentic reed mudhif stays.',
    content_ar: 'تعد الأهوار العراقية واحدة من أعظم النظم البيئية المائية في العالم. عندما تستقل المشحوف التقليدي بين مسالك القصب الشاهقة، تدخل عالماً يعود لآلاف السنين قبل الميلاد. ننصح الزوار ببدء الجولة فجراً لمشاهدة شروق الشمس فوق مياه الأهوار وانطلاق طيور الفلامنجو والبجع، ثم تناول وجبة المسكوف العراقي الطازج المشوي على خشب الصفصاف في أحد المضايف القصبية الشهيرة في الجبايش.',
    content_en: 'The Ahwar of Southern Iraq is a unique cultural and ecological landscape. Navigating the tranquil waters on a Mashhoof canoe brings ancient Sumer alive.',
    cover_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    tags_ar: ['الأهوار', 'ذي قار', 'اليونسكو', 'طبيعة العراق'],
    tags_en: ['Marshes', 'Dhi Qar', 'UNESCO', 'Nature']
  },
  {
    id: 'art-babylon-laws',
    slug: 'babylon-ishtar-legacy',
    title_ar: 'بابل العظيمة: بين بوابة عشتار وقوانين حمورابي',
    title_en: 'Mighty Babylon: From Ishtar Gate to Hammurabi Code',
    category_ar: 'تاريخ وحضارة',
    category_en: 'History & Civilization',
    author_ar: 'باحث في الآثار الرافدينية',
    author_en: 'Mesopotamian Archaeologist',
    read_time_ar: '8 دقائق قراءة',
    read_time_en: '8 min read',
    publish_date: '2025-02-01',
    excerpt_ar: 'أسرار العمارة البابلية، رمزية أسد بابل، وقصة شارع الموكب الذي سارت عليه مواكب الآلهة والملوك قبل 2600 عام.',
    excerpt_en: 'The architectural secrets of Babylon, the basalt Lion, and the Processional Way where kings and gods marched 2,600 years ago.',
    content_ar: 'لم تكن بابل مجرد مدينة عادية، بل كانت محور الكون بالنسبة للعالم القديم. شيد الملك نبوخذنصر أسواراً وبوابات كبوابة عشتار الشهيرة المزينة بحيوانات السيروش والثيران باللون الأزرق الملكي المصقول. لا تزال بقايا شارع الموكب وأسد بابل تشهد على عصر الإبداع المعماري والفلكي الذي غير مسار الحضارات الإنسانية.',
    content_en: 'Babylon was the jewel of the ancient Near East. Discover the fascinating history of its UNESCO-protected brick monuments and legacy.',
    cover_image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80',
    tags_ar: ['بابل', 'آثار', 'تاريخ العراق', 'حضارات'],
    tags_en: ['Babylon', 'Archaeology', 'History', 'Mesopotamia']
  }
];

export const HOTELS: Hotel[] = [
  {
    id: 'hotel-babylon-rotana',
    name_ar: 'فندق بابل روتانا بغداد',
    name_en: 'Babylon Rotana Baghdad',
    governorate_id: 'baghdad',
    city_ar: 'بغداد - الجادرية',
    city_en: 'Baghdad - Jadriya',
    stars: 5,
    price_range_ar: '$$$$ (فاخر)',
    price_range_en: '$$$$ (Luxury)',
    rating: 4.8,
    address_ar: 'حي الجادرية، ضفاف نهر دجلة، بغداد',
    address_en: 'Al-Jadriya, Tigris riverbank, Baghdad',
    cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    amenities_ar: ['مسبح خارجي', 'إطلالة على دجلة', 'نادي صحي', 'مطاعم راقية', 'أمن على مدار الساعة'],
    amenities_en: ['Outdoor pool', 'Tigris river view', 'Spa', 'Fine dining', '24/7 security'],
    lat: 33.2847,
    lng: 44.3853
  },
  {
    id: 'hotel-divan-erbil',
    name_ar: 'فندق ديفان أربيل',
    name_en: 'Divan Hotel Erbil',
    governorate_id: 'erbil',
    city_ar: 'أربيل',
    city_en: 'Erbil',
    stars: 5,
    price_range_ar: '$$$$ (فاخر)',
    price_range_en: '$$$$ (Luxury)',
    rating: 4.9,
    address_ar: 'شارع كولان، مقابل متنزه سامي عبد الرحمن، أربيل',
    address_en: 'Gulan Street, opposite Sami Abdulrahman Park, Erbil',
    cover_image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    amenities_ar: ['سبا فاخر', 'مسبح داخلي', 'مركز أعمال', 'أجنحة عائلية', 'مواقف سيارات مجانية'],
    amenities_en: ['Luxury spa', 'Indoor pool', 'Business center', 'Family suites', 'Free parking'],
    lat: 36.2081,
    lng: 43.9922
  },
  {
    id: 'hotel-basra-grand-millennium',
    name_ar: 'فندق غراند ميلينيوم السيف البصرة',
    name_en: 'Grand Millennium Al Seef Basra',
    governorate_id: 'basra',
    city_ar: 'البصرة',
    city_en: 'Basra',
    stars: 5,
    price_range_ar: '$$$$ (فاخر)',
    price_range_en: '$$$$ (Luxury)',
    rating: 4.8,
    address_ar: 'شارع الوفود، البصرة',
    address_en: 'Al-Wufood Street, Basra',
    cover_image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    amenities_ar: ['إطلالة مائية', 'مسابح متعددة', 'مطعم سيف إيطالي وتركي', 'قاعات مؤتمرات'],
    amenities_en: ['Water views', 'Multiple pools', 'Gourmet dining', 'Conference halls'],
    lat: 30.5283,
    lng: 47.8183
  }
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-samad-baghdad',
    name_ar: 'مطعم صمد العراقي',
    name_en: 'Al-Samad Iraqi Restaurant',
    governorate_id: 'baghdad',
    city_ar: 'بغداد - المنصور',
    city_en: 'Baghdad - Mansour',
    cuisine_ar: 'مطبخ عراقي أصيل ومشويات',
    cuisine_en: 'Authentic Iraqi Cuisine & BBQ',
    famous_dish_ar: 'قوزي على التمن، كباب عراقي، مسكوف بني',
    famous_dish_en: 'Quzi on Rice, Iraqi Kebab, Masgouf',
    price_range_ar: '$$$ (متوسط - مرتفع)',
    price_range_en: '$$$ (Moderate - High)',
    rating: 4.8,
    address_ar: 'شارع الأميرات، المنصور، بغداد',
    address_en: 'Al-Amirat Street, Mansour, Baghdad',
    cover_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    lat: 33.3102,
    lng: 44.3491
  },
  {
    id: 'rest-tarin-erbil',
    name_ar: 'مطعم وكافيه طرين أربيل',
    name_en: 'Tarin Traditional Restaurant Erbil',
    governorate_id: 'erbil',
    city_ar: 'أربيل',
    city_en: 'Erbil',
    cuisine_ar: 'مطبخ كردي وشرقي تقليدي',
    cuisine_en: 'Traditional Kurdish & Oriental',
    famous_dish_ar: 'برياني، دولمة كوردية، كباب أربيل',
    famous_dish_en: 'Biryani, Kurdish Dolma, Erbil Kebab',
    price_range_ar: '$$ (متوسط)',
    price_range_en: '$$ (Moderate)',
    rating: 4.7,
    address_ar: 'قرب طريق شقلاوة، أربيل',
    address_en: 'Near Shaqlawa road, Erbil',
    cover_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    lat: 36.2200,
    lng: 44.0200
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title_ar: 'أهلاً بك في دليل العراق السياحي!',
    title_en: 'Welcome to Iraq Tourism Guide!',
    message_ar: 'اكتشف روائع بلاد الرافدين، خطط لرحلتك القادمة، واحفظ معالمك المفضلة بسهولة.',
    message_en: 'Explore the wonders of Mesopotamia, plan your custom trip, and bookmark your favorite sites.',
    created_at: '2026-03-01T08:00:00Z',
    type: 'system',
    read: false
  },
  {
    id: 'notif-2',
    title_ar: 'مواقع جديدة مدرجة باليونسكو',
    title_en: 'UNESCO World Heritage Sites',
    message_ar: 'استكشف قائمة مواقع العراق المسجلة بالتراث العالمي من أوروك والحضر إلى الأهوار وبابل.',
    message_en: 'Explore Iraq UNESCO World Heritage inscribed cultural and natural treasures.',
    created_at: '2026-03-02T10:00:00Z',
    type: 'place',
    read: false
  }
];
