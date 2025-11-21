import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { capricorneData, verseauData, poissonsData } from '../../mocks/zodiac-signs-data';

interface Meal {
  nom: string;
  conteúdo: string;
  icone: string;
  methodeCuisson: string;
  recette: string;
  bienfaits: string;
  origine?: string;
  saison: string;
  influenceCosmique: string;
  prix?: number;
  isPremium?: boolean;
  cuisine: 'sénégalaise' | 'européenne' | 'arabe' | 'internationale';
  difficulte: 'facile' | 'moyen' | 'difficile';
  tempsPreparation: string;
  portions: number;
  imageUrl: string;
  chef?: string;
  restaurant?: string;
}

interface RecipePack {
  id: string;
  nom: string;
  description: string;
  recettes: string[];
  prix: number;
  prixOriginal: number;
  reduction: number;
  imageUrl: string;
  badge: string;
  conteúdo: string[];
}

interface CartItem {
  type: 'recipe' | 'pack';
  item: Meal | RecipePack;
  quantity: number;
  id: string;
}

interface Drink {
  nom: string;
  conteúdo: string;
  icone: string;
  saison: string;
}

interface NutritionData {
  meta: {
    lang: string;
    region: string;
    date: string;
    tz: string;
    saison: string;
    phaseCosmique: string;
  };
  astro: {
    sunSign: string;
    moonSign: string;
    ascendant: string;
  };
  profile: {
    element: string;
    quality: string;
    mantra: string;
    focusSante: string;
  };
  meals: {
    petitDejeuner: Meal[];
    dejeuner: Meal[];
    diner: Meal[];
  };
  drinks: {
    jus: Drink;
    smoothie: Drink;
  };
  tip: string;
}

interface ZodiacSign {
  name: string;
  symbol: string;
  element: string;
  dates: string;
  quality: string;
  color: string;
  bgColor: string;
  borderColor: string;
  period: { start: { month: number; day: number }; end: { month: number; day: number } };
}

interface SignNutrition {
  element: string;
  quality: string;
  mantra: string;
  focusSante: string;
  meals: {
    petitDejeuner: Meal[];
    dejeuner: Meal[];
    diner: Meal[];
  };
  drinks: {
    jus: Drink;
    smoothie: Drink;
  };
  tip: string;
}

interface HealthState {
  id: string;
  name: string;
  icon: string;
  description: string;
  benefits: string;
  color: string;
  bgColor: string;
}

interface PersonalizedAdvice {
  healthState: string;
  signElement: string;
  advice: string;
  focusAreas: string[];
  recommendedIngredients: string[];
  avoidIngredients: string[];
}

// Ajouter les données manquantes après les interfaces
const healthStates = {
  fr: [
    { id: 'digestion', name: 'Digestion', icon: '🌿', description: 'Améliorer la digestion', benefits: 'Meilleure assimilation', color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'energie', name: 'Énergie', icon: '⚡', description: 'Booster l\'énergie', benefits: 'Plus de vitalité', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { id: 'stress', name: 'Stress', icon: '🧘', description: 'Réduire le stress', benefits: 'Calme et sérénité', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'immunite', name: 'Immunité', icon: '🛡️', description: 'Renforcer l\'immunité', benefits: 'Meilleure défense', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'detox', name: 'Détox', icon: '🌊', description: 'Détoxifier l\'organisme', benefits: 'Purification', color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
    { id: 'sommeil', name: 'Sommeil', icon: '😴', description: 'Améliorer le sommeil', benefits: 'Repos réparateur', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: 'peau', name: 'Peau', icon: '✨', description: 'Santé de la peau', benefits: 'Éclat naturel', color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { id: 'poids', name: 'Poids', icon: '⚖️', description: 'Équilibre du poids', benefits: 'Poids santé', color: 'text-orange-600', bgColor: 'bg-orange-50' }
  ],
  en: [
    { id: 'digestion', name: 'Digestion', icon: '🌿', description: 'Improve digestion', benefits: 'Better assimilation', color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'energie', name: 'Energy', icon: '⚡', description: 'Boost energy', benefits: 'More vitality', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { id: 'stress', name: 'Stress', icon: '🧘', description: 'Reduce stress', benefits: 'Calm and serenity', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'immunite', name: 'Immunity', icon: '🛡️', description: 'Strengthen immunity', benefits: 'Better defense', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'detox', name: 'Detox', icon: '🌊', description: 'Detoxify body', benefits: 'Purification', color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
    { id: 'sommeil', name: 'Sleep', icon: '😴', description: 'Improve sleep', benefits: 'Restorative rest', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: 'peau', name: 'Skin', icon: '✨', description: 'Skin health', benefits: 'Natural glow', color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { id: 'poids', name: 'Weight', icon: '⚖️', description: 'Weight balance', benefits: 'Healthy weight', color: 'text-orange-600', bgColor: 'bg-orange-50' }
  ],
  ar: [
    { id: 'digestion', name: 'الهضم', icon: '🌿', description: 'تحسين الهضم', benefits: 'امتصاص أفضل', color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'energie', name: 'الطاقة', icon: '⚡', description: 'تعزيز الطاقة', benefits: 'المزيد من الحيوية', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { id: 'stress', name: 'التوتر', icon: '🧘', description: 'تقليل التوتر', benefits: 'الهدوء والسكينة', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'immunite', name: 'المناعة', icon: '🛡️', description: 'تقوية المناعة', benefits: 'دفاع أفضل', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'detox', name: 'التخلص من السموم', icon: '🌊', description: 'تنقية الجسم', benefits: 'التطهير', color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
    { id: 'sommeil', name: 'النوم', icon: '😴', description: 'تحسين النوم', benefits: 'راحة مجددة', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: 'peau', name: 'البشرة', icon: '✨', description: 'صحة البشرة', benefits: 'إشراقة طبيعية', color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { id: 'poids', name: 'الوزن', icon: '⚖️', description: 'توازن الوزن', benefits: 'وزن صحي', color: 'text-orange-600', bgColor: 'bg-orange-50' }
  ]
};

const personalizedAdvice: Record<string, Record<string, PersonalizedAdvice>> = {
  fr: {
    'Bélier-digestion': {
      healthState: 'digestion',
      signElement: 'Feu',
      advice: 'Votre feu digestif a besoin d\'aliments rafraîchissants et faciles à digérer.',
      focusAreas: ['Hydratation', 'Aliments frais', 'Cuisson douce'],
      recommendedIngredients: ['Concombre', 'Pastèque', 'Menthe', 'Yaourt'],
      avoidIngredients: ['Épices fortes', 'Aliments frits', 'Café en excès']
    }
  },
  en: {
    'Aries-digestion': {
      healthState: 'digestion',
      signElement: 'Fire',
      advice: 'Your digestive fire needs cooling and easy-to-digest foods.',
      focusAreas: ['Hydration', 'Fresh foods', 'Gentle cooking'],
      recommendedIngredients: ['Cucumber', 'Watermelon', 'Mint', 'Yogurt'],
      avoidIngredients: ['Strong spices', 'Fried foods', 'Excess coffee']
    }
  },
  ar: {
    'الحمل-digestion': {
      healthState: 'digestion',
      signElement: 'نار',
      advice: 'نارك الهضمية تحتاج إلى أطعمة منعشة وسهلة الهضم.',
      focusAreas: ['الترطيب', 'الأطعمة الطازجة', 'الطبخ اللطيف'],
      recommendedIngredients: ['خيار', 'بطيخ', 'نعناع', 'زبادي'],
      avoidIngredients: ['التوابل القوية', 'الأطعمة المقلية', 'القهوة الزائدة']
    }
  }
};

const signSpecificAdvice = {
  fr: {
    'Bélier': {
      conseil: 'Votre feu intérieur a besoin d\'être canalisé avec des aliments rafraîchissants et apaisants. Privilégiez les saveurs douces qui calment votre impulsivité naturelle.',
      aFaire: [
        'Boire beaucoup d\'eau pour refroidir votre feu intérieur',
        'Consommer des aliments riches en magnésium (épinards, amandes)',
        'Privilégier les cuissons douces et à la vapeur',
        'Manger des fruits rafraîchissants (concombre, pastèque)',
        'Prendre des tisanes apaisantes (camomille, menthe)'
      ],
      aEviter: [
        'Les aliments très épicés qui attisent votre feu',
        'L\'excès de caféine qui augmente l\'agitation',
        'Les fritures et aliments trop gras',
        'Les repas pris dans la précipitation',
        'L\'excès d\'alcool qui réchauffe'
      ],
      couleurTheme: 'text-red-600',
      bgTheme: 'bg-red-50'
    },
    'Taureau': {
      conseil: 'Votre nature terrestre apprécie la stabilité et les plaisirs gustatifs. Privilégiez des aliments de qualité qui nourrissent votre corps sans l\'alourdir.',
      aFaire: [
        'Manger lentement et savourer chaque bouchée',
        'Choisir des aliments bio et de saison',
        'Privilégier les légumes verts pour la détox',
        'Consommer des fibres pour la digestion',
        'Prendre des repas réguliers et équilibrés'
      ],
      aEviter: [
        'Les excès alimentaires',
        'Les aliments trop sucrés',
        'La sédentarité après les repas',
        'Les repas trop copieux le soir',
        'Les aliments transformés'
      ],
      couleurTheme: 'text-green-600',
      bgTheme: 'bg-green-50'
    },
    'Gémeaux': {
      conseil: 'Votre nature aérienne a besoin de légèreté et de variété. Privilégiez des repas colorés et diversifiés qui stimulent votre curiosité.',
      aFaire: [
        'Varier les aliments et les saveurs',
        'Manger des fruits et légumes colorés',
        'Privilégier les aliments riches en oméga-3',
        'Prendre des collations saines',
        'S\'hydrater régulièrement'
      ],
      aEviter: [
        'La monotonie alimentaire',
        'Les repas trop lourds',
        'Manger en faisant autre chose',
        'Les excès de sucre',
        'Sauter des repas'
      ],
      couleurTheme: 'text-yellow-600',
      bgTheme: 'bg-yellow-50'
    },
    'Cancer': {
      conseil: 'Votre nature émotionnelle a besoin de réconfort et de douceur. Privilégiez des aliments qui nourrissent votre âme autant que votre corps.',
      aFaire: [
        'Cuisiner avec amour et intention',
        'Privilégier les aliments réconfortants',
        'Manger en famille ou entre amis',
        'Consommer des aliments riches en calcium',
        'Prendre des tisanes digestives'
      ],
      aEviter: [
        'Manger sous le coup de l\'émotion',
        'Les aliments trop salés',
        'Les produits laitiers en excès',
        'Les repas pris dans la solitude',
        'Les aliments acides'
      ],
      couleurTheme: 'text-blue-600',
      bgTheme: 'bg-blue-50'
    },
    'Lion': {
      conseil: 'Votre nature royale mérite des aliments nobles et énergisants. Privilégiez la qualité et la présentation pour nourrir votre vitalité.',
      aFaire: [
        'Choisir des aliments de première qualité',
        'Soigner la présentation des plats',
        'Consommer des aliments riches en vitamine D',
        'Privilégier les protéines nobles',
        'Prendre le temps de savourer'
      ],
      aEviter: [
        'Les aliments bas de gamme',
        'Les repas négligés',
        'L\'excès de viande rouge',
        'Les aliments trop gras',
        'Manger debout ou en vitesse'
      ],
      couleurTheme: 'text-orange-600',
      bgTheme: 'bg-orange-50'
    },
    'Vierge': {
      conseil: 'Votre nature perfectionniste recherche la pureté et l\'équilibre. Privilégiez des aliments sains et une alimentation méthodique.',
      aFaire: [
        'Privilégier les aliments bio et naturels',
        'Manger à heures régulières',
        'Consommer beaucoup de fibres',
        'Privilégier les légumes verts',
        'Prendre des probiotiques'
      ],
      aEviter: [
        'Les aliments transformés',
        'Les excès de tout type',
        'Les repas irréguliers',
        'Les aliments trop riches',
        'Le stress pendant les repas'
      ],
      couleurTheme: 'text-emerald-600',
      bgTheme: 'bg-emerald-50'
    },
    'Balance': {
      conseil: 'Votre nature harmonieuse recherche l\'équilibre parfait. Privilégiez des aliments qui nourrissent vos reins et votre sens esthétique.',
      aFaire: [
        'Équilibrer les saveurs dans chaque repas',
        'Soigner la présentation des plats',
        'Consommer des aliments alcalinisants',
        'Privilégier les fruits rouges',
        'Boire beaucoup d\'eau pure'
      ],
      aEviter: [
        'Les excès de sel',
        'Les aliments déséquilibrés',
        'Les repas pris seul',
        'Les aliments acides',
        'Les déséquilibres nutritionnels'
      ],
      couleurTheme: 'text-pink-600',
      bgTheme: 'bg-pink-50'
    },
    'Scorpion': {
      conseil: 'Votre nature intense a besoin de transformation et de régénération. Privilégiez des aliments détoxifiants et puissants.',
      aFaire: [
        'Consommer des aliments détoxifiants',
        'Privilégier les saveurs intenses',
        'Manger des aliments fermentés',
        'Consommer des antioxydants',
        'Boire des jus détox'
      ],
      aEviter: [
        'Les toxines et additifs',
        'L\'excès d\'alcool',
        'Les aliments trop transformés',
        'Les excès de sucre',
        'Les aliments stagnants'
      ],
      couleurTheme: 'text-purple-600',
      bgTheme: 'bg-purple-50'
    },
    'Sagittaire': {
      conseil: 'Votre nature aventureuse aime la découverte et l\'expansion. Privilégiez des cuisines du monde et des saveurs exotiques.',
      aFaire: [
        'Explorer de nouvelles cuisines',
        'Privilégier les épices du monde',
        'Consommer des aliments énergisants',
        'Manger des fruits exotiques',
        'Varier les sources de protéines'
      ],
      aEviter: [
        'La monotonie alimentaire',
        'Les excès de foie gras',
        'L\'alcool en excès',
        'Les repas trop lourds',
        'La sédentarité'
      ],
      couleurTheme: 'text-indigo-600',
      bgTheme: 'bg-indigo-50'
    },
    'Capricorne': {
      conseil: 'Votre nature disciplinée apprécie la tradition et la structure. Privilégiez des aliments qui renforcent vos os et votre endurance.',
      aFaire: [
        'Consommer des aliments riches en calcium',
        'Privilégier les protéines de qualité',
        'Manger à heures régulières',
        'Consommer des aliments reminéralisants',
        'Prendre des bouillons d\'os'
      ],
      aEviter: [
        'Sauter des repas',
        'Les aliments trop acides',
        'L\'excès de café',
        'Les régimes trop stricts',
        'Le manque de minéraux'
      ],
      couleurTheme: 'text-gray-600',
      bgTheme: 'bg-gray-50'
    },
    'Verseau': {
      conseil: 'Votre nature innovante recherche l\'originalité et la nouveauté. Privilégiez des aliments modernes et des combinaisons créatives.',
      aFaire: [
        'Expérimenter de nouvelles recettes',
        'Privilégier les superaliments',
        'Consommer des aliments innovants',
        'Manger des aliments colorés',
        'S\'hydrater avec des eaux infusées'
      ],
      aEviter: [
        'La routine alimentaire',
        'Les aliments conventionnels',
        'Les repas monotones',
        'Le manque de créativité',
        'Les aliments trop classiques'
      ],
      couleurTheme: 'text-cyan-600',
      bgTheme: 'bg-cyan-50'
    },
    'Poissons': {
      conseil: 'Votre nature intuitive a besoin de douceur et de fluidité. Privilégiez des aliments qui nourrissent votre sensibilité.',
      aFaire: [
        'Consommer des poissons et fruits de mer',
        'Privilégier les aliments doux',
        'Manger des soupes et bouillons',
        'Consommer des algues',
        'Boire beaucoup d\'eau'
      ],
      aEviter: [
        'Les aliments trop lourds',
        'L\'excès d\'alcool',
        'Les toxines',
        'Les aliments trop épicés',
        'La déshydratation'
      ],
      couleurTheme: 'text-teal-600',
      bgTheme: 'bg-teal-50'
    }
  },
  en: {
    'Aries': {
      conseil: 'Your inner fire needs to be channeled with cooling and soothing foods. Favor gentle flavors that calm your natural impulsiveness.',
      aFaire: [
        'Drink plenty of water to cool your inner fire',
        'Consume magnesium-rich foods (spinach, almonds)',
        'Prefer gentle cooking methods and steaming',
        'Eat cooling fruits (cucumber, watermelon)',
        'Take soothing herbal teas (chamomile, mint)'
      ],
      aEviter: [
        'Very spicy foods that fuel your fire',
        'Excess caffeine that increases agitation',
        'Fried and too fatty foods',
        'Meals eaten in haste',
        'Excess alcohol that heats up'
      ],
      couleurTheme: 'text-red-600',
      bgTheme: 'bg-red-50'
    }
  },
  ar: {
    'الحمل': {
      conseil: 'نارك الداخلية تحتاج إلى توجيه بأطعمة مبردة ومهدئة. فضل النكهات اللطيفة التي تهدئ اندفاعك الطبيعي.',
      aFaire: [
        'شرب الكثير من الماء لتبريد نارك الداخلية',
        'تناول الأطعمة الغنية بالمغنيسيوم (السبانخ، اللوز)',
        'تفضيل طرق الطبخ اللطيفة والبخار',
        'تناول الفواكه المبردة (الخيار، البطيخ)',
        'شرب الأعشاب المهدئة (البابونج، النعناع)'
      ],
      aEviter: [
        'الأطعمة الحارة جداً التي تؤجج نارك',
        'الإفراط في الكافيين الذي يزيد الاضطراب',
        'الأطعمة المقلية والدهنية جداً',
        'الوجبات المتناولة بعجلة',
        'الإفراط في الكحول الذي يسخن'
      ],
      couleurTheme: 'text-red-600',
      bgTheme: 'bg-red-50'
    }
  }
};

export default function Nutrition() {
  const { t, i18n } = useTranslation();
  const [selectedMealType, setSelectedMealType] = useState<'petitDejeuner' | 'dejeuner' | 'diner'>('petitDejeuner');
  const [selectedSunSign, setSelectedSunSign] = useState('Bélier');
  const [selectedMoonSign, setSelectedMoonSign] = useState('Cancer');
  const [selectedAscendant, setSelectedAscendant] = useState('Taureau');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchasedRecipes, setPurchasedRecipes] = useState<Set<string>>(new Set());
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [recipeToPurchase, setRecipeToPurchase] = useState<Meal | null>(null);
  
  // Nouveaux états pour le panier et les packs
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<'all' | 'sénégalaise' | 'européenne' | 'arabe' | 'internationale'>('all');
  const [showPacks, setShowPacks] = useState(false);
  const [showChefAI, setShowChefAI] = useState(false);
  
  // Nouveaux états pour les conditions de santé
  const [selectedHealthStates, setSelectedHealthStates] = useState<string[]>([]);
  const [showHealthSelector, setShowHealthSelector] = useState(false);

  // Nouveaux états pour le QR code
  const [showQRCode, setShowQRCode] = useState(false);

  // Nouveaux états pour la boutique intégrée
  const [showIntegratedStore, setShowIntegratedStore] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [itemToPurchase, setItemToPurchase] = useState<{ type: 'recipe' | 'pack'; item: Meal | RecipePack } | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  // Fonction pour obtenir la saison actuelle
  const getCurrentSeason = (date: string) => {
    const month = new Date(date).getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Printemps';
    if (month >= 6 && month <= 8) return 'Été';
    if (month >= 9 && month <= 11) return 'Automne';
    return 'Hiver';
  };

  // Fonction pour obtenir la phase cosmique actuelle
  const getCurrentPhase = (date: string) => {
    const day = new Date(date).getDate();
    if (day <= 7) return 'Nouvelle Lune';
    if (day <= 14) return 'Premier Quartier';
    if (day <= 21) return 'Pleine Lune';
    return 'Dernier Quartier';
  };

  // Fonction pour obtenir le signe actif selon la date
  const getActiveSign = (date: string) => {
    const month = new Date(date).getMonth() + 1;
    const day = new Date(date).getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Bélier';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taureau';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gémeaux';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Lion';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Vierge';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Balance';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpion';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittaire';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorne';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Verseau';
    return 'Poissons';
  };

  // Calculer les valeurs cosmiques
  const currentSeason = getCurrentSeason(selectedDate);
  const currentPhase = getCurrentPhase(selectedDate);
  const activeSign = getActiveSign(selectedDate);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  // Signes du zodiaque
  const zodiacSigns: ZodiacSign[] = [
    { name: 'Bélier', symbol: '♈', element: 'Feu', dates: '21 mars - 19 avril', quality: 'Cardinal', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', period: { start: { month: 3, day: 21 }, end: { month: 4, day: 19 } } },
    { name: 'Taureau', symbol: '♉', element: 'Terre', dates: '20 avril - 20 mai', quality: 'Fixe', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', period: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } } },
    { name: 'Gémeaux', symbol: '♊', element: 'Air', dates: '21 mai - 20 juin', quality: 'Mutable', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', period: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } } },
    { name: 'Cancer', symbol: '♋', element: 'Eau', dates: '21 juin - 22 juillet', quality: 'Cardinal', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', period: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } } },
    { name: 'Lion', symbol: '♌', element: 'Feu', dates: '23 juillet - 22 août', quality: 'Fixe', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', period: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } } },
    { name: 'Vierge', symbol: '♍', element: 'Terre', dates: '23 août - 22 septembre', quality: 'Mutable', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', period: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } } },
    { name: 'Balance', symbol: '♎', element: 'Air', dates: '23 septembre - 22 octobre', quality: 'Cardinal', color: 'text-pink-600', bgColor: 'bg-pink-50', borderColor: 'border-pink-200', period: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } } },
    { name: 'Scorpion', symbol: '♏', element: 'Eau', dates: '23 octobre - 21 novembre', quality: 'Fixe', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', period: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } } },
    { name: 'Sagittaire', symbol: '♐', element: 'Feu', dates: '22 novembre - 21 décembre', quality: 'Mutable', color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', period: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } } },
    { name: 'Capricorne', symbol: '♑', element: 'Terre', dates: '22 décembre - 19 janvier', quality: 'Cardinal', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', period: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } } },
    { name: 'Verseau', symbol: '♒', element: 'Air', dates: '20 janvier - 18 février', quality: 'Fixe', color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', period: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } } },
    { name: 'Poissons', symbol: '♓', element: 'Eau', dates: '19 février - 20 mars', quality: 'Mutable', color: 'text-teal-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-200', period: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } } }
  ];

  // Données de nutrition par signe (avec les 12 signes)
  const signNutritionData: Record<string, Record<string, SignNutrition>> = {
    fr: {
      'Bélier': {
        element: 'Feu',
        quality: 'Cardinal',
        mantra: 'Je nourris mon feu avec clarté et douceur.',
        focusSante: 'Tête / Hydratation / Système nerveux',
        meals: {
          petitDejeuner: [
            { 
              nom: 'Assiette harmonieuse rose et blanc', 
              conteúdo: 'yaourt grec, fruits rouges, granola rose, miel de fleurs, pétales comestibles', 
              icone: '🌸', 
              methodeCuisson: 'Composition esthétique : Disposer yaourt grec en spirale, ajouter fruits rouges en cercle parfait. Décorer avec art.',
              recette: 'Yaourt grec 200g, fraises, framboises, myrtilles, granola rose (betterave), miel de fleurs, pétales de rose comestibles.',
              bienfaits: 'Yaourt grec pour protéines et calcium. Fruits rouges antioxydants pour les reins. Présentation harmonieuse qui ravit la Balance.',
              saison: 'Printemps',
              influenceCosmique: 'Nouvelle Lune - Harmonie matinale',
              prix: 3.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'facile',
              tempsPreparation: '15 min',
              portions: 1,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20breakfast%20photography%20of%20harmonious%20pink%20and%20white%20plate%20with%20Greek%20yogurt%2C%20red%20berries%2C%20pink%20granola%2C%20flower%20honey%2C%20edible%20rose%20petals%2C%20artistic%20spiral%20arrangement%2C%20elegant%20presentation%2C%20aesthetic%20styling&width=800&height=600&seq=harmony-bowl-libra-luxury&orientation=landscape',
              chef: 'Chef IA Harmonie',
              restaurant: 'Laboratoire Astro-Esthétique'
            },
            { 
              nom: 'Thiakry rose aux fruits exotiques', 
              conteúdo: 'couscous de mil, lait de coco rose, fruits exotiques, vanille, fleur d\'hibiscus', 
              icone: '🌺', 
              methodeCuisson: 'Préparation sénégalaise esthétique : Cuire couscous, colorer lait de coco avec hibiscus. Disposer fruits en harmonie.',
              recette: 'Couscous de mil 200g, lait de coco 400ml, infusion d\'hibiscus, mangue, fruit de la passion, vanille, sucre de canne.',
              bienfaits: 'Mil équilibré pour la Balance. Hibiscus pour les reins. Fruits exotiques pour vitamines. Couleur rose apaisante.',
              origine: 'Sénégal',
              saison: 'Été',
              influenceCosmique: 'Pleine Lune - Beauté tropicale',
              prix: 0.99,
              isPremium: true,
              cuisine: 'sénégalaise',
              difficulte: 'moyen',
              tempsPreparation: '35 min',
              portions: 4,
              imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20Senegalese%20dessert%20photography%20of%20pink%20thiakry%20with%20coconut%20milk%2C%20exotic%20fruits%2C%20vanilla%2C%20hibiscus%20flower%2C%20elegant%20African%20bowl%2C%20aesthetic%20presentation%2C%20tropical%20colors%2C%20luxury%20styling&width=800&height=600&seq=thiakry-libra-luxury&orientation=landscape',
              chef: 'Chef IA Sahel',
              restaurant: 'Atelier Astro-Rose'
            },
            { 
              nom: 'Pancakes soufflés japonais', 
              conteúdo: 'œufs fermiers, farine, lait, beurre, sirop d\'érable, fruits frais', 
              icone: '🥞', 
              methodeCuisson: 'Technique japonaise délicate : Séparer blancs et jaunes, monter blancs en neige. Cuire à feu doux pour texture aérienne.',
              recette: 'Œufs fermiers 3, farine 100g, lait 120ml, beurre, sirop d\'érable, fruits frais, sucre glace.',
              bienfaits: 'Pancakes légers et aériens pour la Balance. Texture parfaite et présentation élégante. Équilibre sucré-doux.',
              origine: 'Japon',
              saison: 'Toutes saisons',
              influenceCosmique: 'Premier Quartier - Légèreté aérienne',
              prix: 3.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'difficile',
              tempsPreparation: '30 min',
              portions: 2,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20Japanese%20cuisine%20photography%20of%20fluffy%20souffl%C3%A9%20pancakes%20with%20farm%20eggs%2C%20maple%20syrup%2C%20fresh%20fruits%2C%20powdered%20sugar%2C%20elegant%20stacking%2C%20aesthetic%20presentation%2C%20high-end%20styling&width=800&height=600&seq=pancakes-libra-luxury&orientation=landscape',
              chef: 'Chef IA Tokyo',
              restaurant: 'Studio Astro-Soufflé'
            },
            { 
              nom: 'Bol açaí artistique', 
              conteúdo: 'açaí, banane, fruits colorés, granola, beurre d\'amande, fleurs comestibles', 
              icone: '🎨', 
              methodeCuisson: 'Composition artistique : Mixer açaí et banane. Disposer toppings en motifs géométriques harmonieux.',
              recette: 'Açaí bio 100g, banane, fraises, kiwi, myrtilles, granola, beurre d\'amande, fleurs comestibles.',
              bienfaits: 'Açaï antioxydant pour équilibre. Fruits colorés pour vitamines. Présentation artistique qui enchante la Balance.',
              origine: 'Brésil',
              saison: 'Été',
              influenceCosmique: 'Lune Gibbeuse - Art culinaire',
              prix: 2.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'moyen',
              tempsPreparation: '20 min',
              portions: 1,
              imageUrl: 'https://readdy.ai/api/search-image?query=Ultra%20luxury%20wellness%20photography%20of%20artistic%20acai%20bowl%20with%20colorful%20fruits%2C%20granola%2C%20almond%20butter%2C%20edible%20flowers%2C%20geometric%20patterns%2C%20aesthetic%20arrangement%2C%20vibrant%20colors%2C%20high-end%20presentation&width=800&height=600&seq=acai-libra-luxury&orientation=landscape',
              chef: 'Chef IA Artiste',
              restaurant: 'Laboratoire Astro-Art'
            }
          ],
          dejeuner: [
            { 
              nom: 'Salade arc-en-ciel équilibrée', 
              conteúdo: 'légumes multicolores, quinoa, avocat, grenade, vinaigrette balsamique', 
              icone: '🌈', 
              methodeCuisson: 'Composition harmonieuse : Disposer légumes par couleur en arc-en-ciel. Équilibrer textures et saveurs.',
              recette: 'Quinoa, betterave, carotte, poivron jaune, concombre, chou rouge, avocat, grenade, vinaigrette balsamique.',
              bienfaits: 'Arc-en-ciel de nutriments pour équilibre parfait. Légumes variés pour les reins. Présentation qui ravit la Balance.',
              origine: 'International',
              saison: 'Été',
              influenceCosmique: 'Pleine Lune - Harmonie colorée',
              prix: 4.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'moyen',
              tempsPreparation: '40 min',
              portions: 2,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20wellness%20cuisine%20photography%20of%20rainbow%20salad%20with%20multicolored%20vegetables%2C%20quinoa%2C%20avocado%2C%20pomegranate%2C%20balsamic%20dressing%2C%20rainbow%20arrangement%2C%20elegant%20bowl%2C%20aesthetic%20presentation&width=800&height=600&seq=rainbow-salad-libra-luxury&orientation=landscape',
              chef: 'Chef IA Arc-en-ciel',
              restaurant: 'Atelier Astro-Couleurs'
            },
            { 
              nom: 'Thiéboudienne rose aux crevettes', 
              conteúdo: 'riz basmati, crevettes roses, légumes colorés, sauce tomate rose, épices douces', 
              icone: '🦐', 
              methodeCuisson: 'Cuisson sénégalaise harmonieuse : Préparer sauce rose délicate, cuire crevettes et légumes avec équilibre.',
              recette: 'Riz basmati, crevettes roses 400g, légumes colorés (carottes, aubergines), sauce tomate rose, épices douces.',
              bienfaits: 'Crevettes pour protéines légères. Légumes colorés pour équilibre nutritionnel. Couleur rose apaisante pour la Balance.',
              origine: 'Sénégal',
              saison: 'Printemps',
              influenceCosmique: 'Premier Croissant - Élégance marine',
              prix: 3.99,
              isPremium: true,
              cuisine: 'sénégalaise',
              difficulte: 'moyen',
              tempsPreparation: '1h15',
              portions: 4,
              imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20Senegalese%20cuisine%20photography%20of%20pink%20thieboudienne%20with%20pink%20shrimp%2C%20colorful%20vegetables%2C%20rose%20tomato%20sauce%2C%20basmati%20rice%2C%20elegant%20African%20ceramic%2C%20aesthetic%20presentation&width=800&height=600&seq=thiebou-libra-luxury&orientation=landscape',
              chef: 'Chef IA Dakar',
              restaurant: 'Studio Astro-Rose'
            },
            { 
              nom: 'Tajine d\'agneau aux abricots et amandes', 
              conteúdo: 'agneau tendre, abricots moelleux, amandes effilées, miel, épices douces', 
              icone: '🍯', 
              methodeCuisson: 'Cuisson marocaine équilibrée : Mijoter agneau avec abricots et miel. Équilibre sucré-salé parfait.',
              recette: 'Agneau 800g, abricots secs, amandes effilées, miel d\'acacia, cannelle, safran, oignons.',
              bienfaits: 'Agneau pour protéines. Abricots pour douceur et vitamines. Équilibre sucré-salé qui enchante la Balance.',
              origine: 'Maroc',
              saison: 'Automne',
              influenceCosmique: 'Lune Décroissante - Douceur orientale',
              prix: 2.99,
              isPremium: true,
              cuisine: 'arabe',
              difficulte: 'moyen',
              tempsPreparation: '2h',
              portions: 4,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20Moroccan%20cuisine%20photography%20of%20lamb%20tagine%20with%20apricots%2C%20sliced%20almonds%2C%20honey%2C%20mild%20spices%2C%20traditional%20ceramic%20tagine%2C%20elegant%20North%20African%20presentation%2C%20sweet%20and%20savory%20balance&width=800&height=600&seq=tajine-libra-luxury&orientation=landscape',
              chef: 'Chef IA Marrakech',
              restaurant: 'Laboratoire Astro-Équilibre'
            },
            { 
              nom: 'Sushi art décoratif', 
              conteúdo: 'saumon, thon, avocat, concombre, riz sushi, décoration artistique', 
              icone: '🍣', 
              methodeCuisson: 'Technique japonaise artistique : Préparer sushi avec précision. Disposer en motifs harmonieux et esthétiques.',
              recette: 'Saumon frais, thon rouge, avocat, concombre, riz sushi, nori, sauce soja, wasabi, gingembre.',
              bienfaits: 'Poissons pour oméga-3. Présentation artistique parfaite. Équilibre des saveurs qui ravit la Balance.',
              origine: 'Japon',
              saison: 'Toutes saisons',
              influenceCosmique: 'Premier Quartier - Art culinaire',
              prix: 3.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'difficile',
              tempsPreparation: '1h',
              portions: 2,
              imageUrl: 'https://readdy.ai/api/search-image?query=Ultra%20luxury%20Japanese%20cuisine%20photography%20of%20decorative%20sushi%20art%20with%20salmon%2C%20tuna%2C%20avocado%2C%20cucumber%2C%20artistic%20arrangement%2C%20elegant%20black%20slate%2C%20aesthetic%20presentation%2C%20Michelin%20star%20styling&width=800&height=600&seq=sushi-art-libra-luxury&orientation=landscape',
              chef: 'Chef IA Sakura',
              restaurant: 'Atelier Astro-Art'
            }
          ],
          diner: [
            { 
              nom: 'Risotto aux asperges et parmesan', 
              conteúdo: 'riz Carnaroli, asperges vertes, parmesan, vin blanc, beurre', 
              icone: '🍚', 
              methodeCuisson: 'Technique italienne raffinée : Nacrer le riz, ajouter bouillon progressivement. Mantecare avec élégance.',
              recette: 'Riz Carnaroli 300g, asperges vertes, parmesan Reggiano, vin blanc, beurre, bouillon de légumes.',
              bienfaits: 'Riz crémeux et équilibré. Asperges pour les reins. Texture parfaite qui enchante la Balance.',
              origine: 'Italie',
              saison: 'Printemps',
              influenceCosmique: 'Nouvelle Lune - Élégance italienne',
              prix: 3.99,
              isPremium: true,
              cuisine: 'européenne',
              difficulte: 'moyen',
              tempsPreparation: '40 min',
              portions: 2,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20Italian%20cuisine%20photography%20of%20asparagus%20risotto%20with%20Carnaroli%20rice%2C%20green%20asparagus%2C%20Parmigiano%20Reggiano%2C%20white%20wine%2C%20butter%2C%20elegant%20white%20plate%2C%20refined%20presentation&width=800&height=600&seq=risotto-libra-luxury&orientation=landscape',
              chef: 'Chef IA Milan',
              restaurant: 'Studio Astro-Risotto'
            },
            { 
              nom: 'Caldou de poisson blanc aux légumes', 
              conteúdo: 'daurade, légumes harmonieux, bouillon parfumé, herbes fraîches', 
              icone: '🐟', 
              methodeCuisson: 'Caldou sénégalais équilibré : Pocher daurade délicatement. Équilibrer saveurs et textures.',
              recette: 'Daurade 600g, carottes, courgettes, pommes de terre, bouillon de poisson, persil, citron.',
              bienfaits: 'Daurade légère et équilibrée. Légumes variés pour harmonie nutritionnelle. Bouillon délicat pour la Balance.',
              origine: 'Sénégal',
              saison: 'Été',
              influenceCosmique: 'Pleine Lune - Harmonie marine',
              prix: 1.99,
              isPremium: true,
              cuisine: 'sénégalaise',
              difficulte: 'moyen',
              tempsPreparation: '50 min',
              portions: 3,
              imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20Senegalese%20cuisine%20photography%20of%20caldou%20with%20white%20fish%20sea%20bream%2C%20harmonious%20vegetables%2C%20fragrant%20broth%2C%20fresh%20herbs%2C%20elegant%20African%20ceramic%2C%20balanced%20presentation&width=800&height=600&seq=caldou-libra-luxury&orientation=landscape',
              chef: 'Chef IA Casamance',
              restaurant: 'Laboratoire Astro-Harmonie'
            },
            { 
              nom: 'Couscous aux sept légumes colorés', 
              conteúdo: 'semoule fine, légumes arc-en-ciel, pois chiches, bouillon parfumé', 
              icone: '🥘', 
              methodeCuisson: 'Couscous harmonieux : Cuire légumes colorés séparément. Composer assiette avec équilibre esthétique.',
              recette: 'Semoule fine, sept légumes colorés (carottes, courgettes, navets...), pois chiches, bouillon, épices douces.',
              bienfaits: 'Légumes variés pour équilibre parfait. Couleurs harmonieuses pour l\'œil. Saveurs équilibrées pour la Balance.',
              origine: 'Maghreb',
              saison: 'Automne',
              influenceCosmique: 'Lune Gibbeuse - Arc-en-ciel végétal',
              prix: 2.99,
              isPremium: true,
              cuisine: 'arabe',
              difficulte: 'moyen',
              tempsPreparation: '1h30',
              portions: 5,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20North%20African%20cuisine%20photography%20of%20couscous%20with%20seven%20colorful%20vegetables%2C%20chickpeas%2C%20fine%20semolina%2C%20fragrant%20broth%2C%20traditional%20ceramic%2C%20rainbow%20presentation%2C%20aesthetic%20styling&width=800&height=600&seq=couscous-libra-luxury&orientation=landscape',
              chef: 'Chef IA Fès',
              restaurant: 'Atelier Astro-Couleurs'
            },
            { 
              nom: 'Ramen artistique aux légumes', 
              conteúdo: 'nouilles ramen, bouillon miso, légumes colorés, œuf mollet, décoration', 
              icone: '🍜', 
              methodeCuisson: 'Ramen japonais esthétique : Préparer bouillon équilibré. Disposer ingrédients avec art et harmonie.',
              recette: 'Nouilles ramen, bouillon miso, champignons, pak choi, carottes, œuf mollet, oignons verts, nori.',
              bienfaits: 'Bouillon équilibré et réconfortant. Légumes colorés pour harmonie. Présentation artistique pour la Balance.',
              origine: 'Japon',
              saison: 'Hiver',
              influenceCosmique: 'Dernier Quartier - Art du ramen',
              prix: 3.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'moyen',
              tempsPreparation: '1h',
              portions: 2,
              imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20Japanese%20cuisine%20photography%20of%20artistic%20ramen%20with%20miso%20broth%2C%20colorful%20vegetables%2C%20soft-boiled%20egg%2C%20elegant%20bowl%2C%20aesthetic%20arrangement%2C%20high-end%20presentation%2C%20balanced%20composition&width=800&height=600&seq=ramen-libra-luxury&orientation=landscape',
              chef: 'Chef IA Kyoto',
              restaurant: 'Studio Astro-Ramen'
            }
          ]
        },
        drinks: {
          jus: { nom: 'Jus Équilibre rose', conteúdo: 'betterave • pomme • citron • gingembre • miel', icone: '🧃', saison: 'Toutes saisons' },
          smoothie: { nom: 'Smoothie Harmonie', conteúdo: 'fruits rouges • banane • lait d\'amande • vanille', icone: '🥤', saison: 'Toutes saisons' }
        },
        tip: 'Cherche l\'équilibre dans chaque repas — harmonie des saveurs, des couleurs et des textures.'
      },
      'Scorpion': {
        element: 'Eau',
        quality: 'Fixe',
        mantra: 'Je transforme mon énergie par des saveurs intenses et profondes.',
        focusSante: 'Organes reproducteurs / Détoxification / Régénération',
        meals: {
          petitDejeuner: [
            { 
              nom: 'Bol détox noir au charbon actif', 
              conteúdo: 'charbon actif, açaí noir, myrtilles, graines de chia, lait de coco', 
              icone: '🖤', 
              methodeCuisson: 'Préparation détox intense : Mixer açaí avec charbon actif. Créer texture profonde et mystérieuse.',
              recette: 'Açaí noir 100g, charbon actif alimentaire, myrtilles, graines de chia noires, lait de coco, miel noir.',
              bienfaits: 'Charbon actif détoxifiant puissant pour le Scorpion. Açaï antioxydant. Couleur noire mystérieuse et transformatrice.',
              saison: 'Automne',
              influenceCosmique: 'Nouvelle Lune - Transformation profonde',
              prix: 2.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'moyen',
              tempsPreparation: '15 min',
              portions: 1,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20detox%20food%20photography%20of%20black%20charcoal%20bowl%20with%20activated%20charcoal%2C%20black%20acai%2C%20blueberries%2C%20black%20chia%20seeds%2C%20coconut%20milk%2C%20mysterious%20dark%20presentation%2C%20high-end%20wellness%20styling&width=800&height=600&seq=black-bowl-scorpio-luxury&orientation=landscape',
              chef: 'Chef IA Mystère',
              restaurant: 'Laboratoire Astro-Transformation'
            },
            { 
              nom: 'Thiakry noir aux dattes et sésame', 
              conteúdo: 'couscous de mil noir, lait de coco, dattes Medjool, sésame noir, miel noir', 
              icone: '🌑', 
              methodeCuisson: 'Préparation sénégalaise intense : Cuire couscous noir, infuser avec épices profondes. Texture riche et mystérieuse.',
              recette: 'Couscous de mil noir 200g, lait de coco 400ml, dattes Medjool, sésame noir grillé, miel noir, cardamome.',
              bienfaits: 'Mil noir riche en antioxydants. Dattes pour énergie profonde. Sésame noir pour régénération du Scorpion.',
              origine: 'Sénégal',
              saison: 'Hiver',
              influenceCosmique: 'Pleine Lune - Intensité nocturne',
              prix: 1.99,
              isPremium: true,
              cuisine: 'sénégalaise',
              difficulte: 'moyen',
              tempsPreparation: '40 min',
              portions: 4,
              imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20Senegalese%20dessert%20photography%20of%20black%20thiakry%20with%20black%20millet%2C%20coconut%20milk%2C%20Medjool%20dates%2C%20black%20sesame%2C%20dark%20honey%2C%20mysterious%20presentation%2C%20luxury%20styling&width=800&height=600&seq=thiakry-scorpio-luxury&orientation=landscape',
              chef: 'Chef IA Sahel',
              restaurant: 'Atelier Astro-Noir'
            },
            { 
              nom: 'Œufs brouillés aux truffes noires', 
              conteúdo: 'œufs fermiers, truffes noires, beurre, crème, pain noir', 
              icone: '🍳', 
              methodeCuisson: 'Technique française intense : Cuire œufs à feu très doux. Incorporer truffes râpées pour saveur profonde.',
              recette: 'Œufs fermiers 4, truffes noires 20g, beurre AOP, crème fraîche, pain noir au charbon, fleur de sel.',
              bienfaits: 'Œufs pour protéines. Truffes noires pour intensité et transformation. Saveur profonde qui captive le Scorpion.',
              origine: 'France',
              saison: 'Hiver',
              influenceCosmique: 'Lune Décroissante - Luxe mystérieux',
              prix: 1.99,
              isPremium: true,
              cuisine: 'européenne',
              difficulte: 'difficile',
              tempsPreparation: '20 min',
              portions: 2,
              imageUrl: 'https://readdy.ai/api/search-image?query=Ultra%20luxury%20French%20cuisine%20photography%20of%20scrambled%20eggs%20with%20black%20truffles%2C%20farm%20eggs%2C%20butter%2C%20cream%2C%20charcoal%20bread%2C%20elegant%20black%20plate%2C%20mysterious%20presentation%2C%20Michelin%20star%20styling&width=800&height=600&seq=eggs-truffle-scorpio-luxury&orientation=landscape',
              chef: 'Chef IA Périgord',
              restaurant: 'Studio Astro-Truffe'
            },
            { 
              nom: 'Smoothie détox rouge intense', 
              conteúdo: 'betterave, grenade, gingembre, citron, piment de Cayenne', 
              icone: '🔴', 
              methodeCuisson: 'Préparation détox puissante : Mixer betterave et grenade. Ajouter gingembre et piment pour intensité.',
              recette: 'Betterave crue 200g, grenade, gingembre frais, citron, piment de Cayenne, miel, eau filtrée.',
              bienfaits: 'Betterave détoxifiante pour le Scorpion. Grenade antioxydant. Gingembre et piment pour transformation profonde.',
              origine: 'International',
              saison: 'Automne',
              influenceCosmique: 'Premier Quartier - Purification intense',
              prix: 1.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'facile',
              tempsPreparation: '10 min',
              portions: 1,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20wellness%20photography%20of%20intense%20red%20detox%20smoothie%20with%20beetroot%2C%20pomegranate%2C%20ginger%2C%20lemon%2C%20cayenne%20pepper%2C%20powerful%20presentation%2C%20vibrant%20red%20color%2C%20high-end%20health%20food%20styling&width=800&height=600&seq=smoothie-scorpio-luxury&orientation=landscape',
              chef: 'Chef IA Détox',
              restaurant: 'Laboratoire Astro-Intense'
            }
          ],
          dejeuner: [
            { 
              nom: 'Poulpe grillé aux épices intenses', 
              conteúdo: 'poulpe, paprika fumé, piment d\'Espelette, ail noir, citron', 
              icone: '🐙', 
              methodeCuisson: 'Cuisson méditerranéenne intense : Attendrir poulpe, griller à feu vif. Assaisonner avec épices puissantes.',
              recette: 'Poulpe 800g, paprika fumé, piment d\'Espelette, ail noir, citron, huile d\'olive, persil.',
              bienfaits: 'Poulpe riche en protéines et minéraux. Épices intenses pour transformation. Saveur profonde pour le Scorpion.',
              origine: 'Méditerranée',
              saison: 'Été',
              influenceCosmique: 'Pleine Lune - Intensité marine',
              prix: 3.99,
              isPremium: true,
              cuisine: 'européenne',
              difficulte: 'difficile',
              tempsPreparation: '2h',
              portions: 3,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20Mediterranean%20cuisine%20photography%20of%20grilled%20octopus%20with%20intense%20spices%2C%20smoked%20paprika%2C%20Espelette%20pepper%2C%20black%20garlic%2C%20lemon%2C%20elegant%20black%20plate%2C%20powerful%20presentation&width=800&height=600&seq=octopus-scorpio-luxury&orientation=landscape',
              chef: 'Chef IA Méditerranée',
              restaurant: 'Atelier Astro-Poulpe'
            },
            { 
              nom: 'Thiéboudienne noire aux fruits de mer', 
              conteúdo: 'riz noir, encre de seiche, fruits de mer, légumes, épices intenses', 
              icone: '🦑', 
              methodeCuisson: 'Cuisson sénégalaise mystérieuse : Colorer riz avec encre de seiche. Ajouter fruits de mer et épices puissantes.',
              recette: 'Riz noir 500g, encre de seiche, calmars, crevettes, moules, légumes, épices intenses (piment, gingembre).',
              bienfaits: 'Riz noir antioxydant. Fruits de mer pour minéraux. Encre de seiche détoxifiante pour le Scorpion.',
              origine: 'Sénégal',
              saison: 'Automne',
              influenceCosmique: 'Nouvelle Lune - Mystère océanique',
              prix: 3.99,
              isPremium: true,
              cuisine: 'sénégalaise',
              difficulte: 'difficile',
              tempsPreparation: '2h',
              portions: 5,
              imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20Senegalese%20cuisine%20photography%20of%20black%20thieboudienne%20with%20squid%20ink%2C%20black%20rice%2C%20seafood%2C%20vegetables%2C%20intense%20spices%2C%20mysterious%20presentation%2C%20luxury%20African%20ceramic&width=800&height=600&seq=thiebou-scorpio-luxury&orientation=landscape',
              chef: 'Chef IA Dakar',
              restaurant: 'Studio Astro-Encre'
            },
            { 
              nom: 'Tajine d\'agneau aux pruneaux et miel noir', 
              conteúdo: 'agneau, pruneaux, miel noir, épices ras el hanout, amandes', 
              icone: '🍯', 
              methodeCuisson: 'Cuisson marocaine profonde : Mijoter agneau avec pruneaux et miel noir. Épices intenses pour transformation.',
              recette: 'Agneau 1kg, pruneaux d\'Agen, miel noir, ras el hanout intense, amandes grillées, cannelle, safran.',
              bienfaits: 'Agneau riche et nourrissant. Pruneaux pour détox. Miel noir et épices pour intensité du Scorpion.',
              origine: 'Maroc',
              saison: 'Hiver',
              influenceCosmique: 'Lune Gibbeuse - Profondeur orientale',
              prix: 3.99,
              isPremium: true,
              cuisine: 'arabe',
              difficulte: 'moyen',
              tempsPreparation: '2h30',
              portions: 4,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20Moroccan%20cuisine%20photography%20of%20lamb%20tagine%20with%20prunes%2C%20black%20honey%2C%20intense%20ras%20el%20hanout%20spices%2C%20toasted%20almonds%2C%20traditional%20ceramic%2C%20deep%20flavors%2C%20mysterious%20presentation&width=800&height=600&seq=tajine-scorpio-luxury&orientation=landscape',
              chef: 'Chef IA Marrakech',
              restaurant: 'Laboratoire Astro-Profondeur'
            },
            { 
              nom: 'Sashimi de thon rouge au wasabi noir', 
              conteúdo: 'thon rouge, wasabi noir, sauce soja vieillie, gingembre noir', 
              icone: '🍣', 
              methodeCuisson: 'Technique japonaise intense : Découper thon rouge en tranches parfaites. Servir avec wasabi noir puissant.',
              recette: 'Thon rouge 300g, wasabi noir, sauce soja vieillie 3 ans, gingembre noir mariné, sésame noir.',
              bienfaits: 'Thon rouge riche en oméga-3. Wasabi noir détoxifiant. Saveurs intenses pour transformation du Scorpion.',
              origine: 'Japon',
              saison: 'Toutes saisons',
              influenceCosmique: 'Premier Croissant - Pureté intense',
              prix: 2.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'difficile',
              tempsPreparation: '30 min',
              portions: 2,
              imageUrl: 'https://readdy.ai/api/search-image?query=Ultra%20luxury%20Japanese%20cuisine%20photography%20of%20bluefin%20tuna%20sashimi%20with%20black%20wasabi%2C%20aged%20soy%20sauce%2C%20black%20ginger%2C%20black%20sesame%2C%20elegant%20black%20slate%2C%20intense%20presentation%2C%20Michelin%20star%20styling&width=800&height=600&seq=sashimi-scorpio-luxury&orientation=landscape',
              chef: 'Chef IA Tokyo',
              restaurant: 'Atelier Astro-Sashimi'
            }
          ],
          diner: [
            { 
              nom: 'Risotto à l\'encre de seiche', 
              conteúdo: 'riz Carnaroli, encre de seiche, calmars, vin blanc, parmesan', 
              icone: '🦑', 
              methodeCuisson: 'Technique italienne mystérieuse : Nacrer riz, ajouter encre de seiche progressivement. Créer texture noire profonde.',
              recette: 'Riz Carnaroli 300g, encre de seiche, calmars frais, vin blanc, parmesan, beurre, ail.',
              bienfaits: 'Encre de seiche détoxifiante. Calmars pour protéines. Couleur noire mystérieuse pour le Scorpion.',
              origine: 'Italie',
              saison: 'Automne',
              influenceCosmique: 'Nouvelle Lune - Mystère vénitien',
              prix: 3.99,
              isPremium: true,
              cuisine: 'européenne',
              difficulte: 'difficile',
              tempsPreparation: '45 min',
              portions: 2,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20Italian%20cuisine%20photography%20of%20squid%20ink%20risotto%20with%20Carnaroli%20rice%2C%20fresh%20squid%2C%20white%20wine%2C%20Parmesan%2C%20mysterious%20black%20presentation%2C%20elegant%20white%20plate%2C%20high-end%20styling&width=800&height=600&seq=risotto-scorpio-luxury&orientation=landscape',
              chef: 'Chef IA Venise',
              restaurant: 'Studio Astro-Encre'
            },
            { 
              nom: 'Caldou de poisson fumé aux épices', 
              conteúdo: 'poisson fumé, légumes racines, bouillon intense, piment, gingembre', 
              icone: '🐟', 
              methodeCuisson: 'Caldou sénégalais intense : Fumer poisson, préparer bouillon avec épices puissantes. Saveur profonde.',
              recette: 'Poisson fumé 600g, légumes racines, bouillon de poisson, piment habanero, gingembre, ail.',
              bienfaits: 'Poisson fumé pour saveur intense. Épices pour transformation. Bouillon puissant pour le Scorpion.',
              origine: 'Sénégal',
              saison: 'Hiver',
              influenceCosmique: 'Pleine Lune - Fumée mystérieuse',
              prix: 1.99,
              isPremium: true,
              cuisine: 'sénégalaise',
              difficulte: 'moyen',
              tempsPreparation: '1h30',
              portions: 3,
              imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20Senegalese%20cuisine%20photography%20of%20smoked%20fish%20caldou%20with%20root%20vegetables%2C%20intense%20broth%2C%20habanero%20pepper%2C%20ginger%2C%20elegant%20African%20ceramic%2C%20powerful%20presentation&width=800&height=600&seq=caldou-scorpio-luxury&orientation=landscape',
              chef: 'Chef IA Casamance',
              restaurant: 'Laboratoire Astro-Fumé'
            },
            { 
              nom: 'Couscous aux merguez épicées', 
              conteúdo: 'semoule, merguez artisanales, légumes, harissa intense, épices', 
              icone: '🌶️', 
              methodeCuisson: 'Couscous maghrébin intense : Griller merguez, préparer harissa maison. Épices puissantes pour transformation.',
              recette: 'Semoule fine, merguez artisanales, légumes, harissa intense maison, épices (cumin, coriandre, piment).',
              bienfaits: 'Merguez pour protéines et saveur intense. Harissa détoxifiante. Épices transformatrices pour le Scorpion.',
              origine: 'Maghreb',
              saison: 'Hiver',
              influenceCosmique: 'Lune Décroissante - Feu épicé',
              prix: 2.99,
              isPremium: true,
              cuisine: 'arabe',
              difficulte: 'moyen',
              tempsPreparation: '1h45',
              portions: 4,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20North%20African%20cuisine%20photography%20of%20couscous%20with%20spicy%20merguez%20sausages%2C%20vegetables%2C%20intense%20harissa%2C%20spices%2C%20traditional%20ceramic%2C%20powerful%20presentation%2C%20fiery%20colors&width=800&height=600&seq=couscous-scorpio-luxury&orientation=landscape',
              chef: 'Chef IA Tunis',
              restaurant: 'Atelier Astro-Épices'
            },
            { 
              nom: 'Ramen noir au bouillon d\'os', 
              conteúdo: 'nouilles ramen, bouillon d\'os 24h, encre de seiche, porc chashu, œuf', 
              icone: '🍜', 
              methodeCuisson: 'Ramen japonais intense : Mijoter bouillon d\'os 24h. Ajouter encre de seiche pour profondeur mystérieuse.',
              recette: 'Nouilles ramen, bouillon d\'os 24h, encre de seiche, porc chashu, œuf mollet, nori, oignons verts.',
              bienfaits: 'Bouillon d\'os pour collagène et régénération. Encre de seiche détoxifiante. Intensité pour le Scorpion.',
              origine: 'Japon',
              saison: 'Hiver',
              influenceCosmique: 'Dernier Quartier - Profondeur nocturne',
              prix: 3.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'difficile',
              tempsPreparation: '24h + 1h',
              portions: 2,
              imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20Japanese%20cuisine%20photography%20of%20black%20ramen%20with%2024-hour%20bone%20broth%2C%20squid%20ink%2C%20chashu%20pork%2C%20soft-boiled%20egg%2C%20elegant%20black%20bowl%2C%20mysterious%20presentation%2C%20intense%20flavors&width=800&height=600&seq=ramen-scorpio-luxury&orientation=landscape',
              chef: 'Chef IA Kyoto',
              restaurant: 'Studio Astro-Noir'
            }
          ]
        },
        drinks: {
          jus: { nom: 'Jus Transformation noire', conteúdo: 'betterave • grenade • gingembre • charbon actif', icone: '🧃', saison: 'Toutes saisons' },
          smoothie: { nom: 'Smoothie Intensité', conteúdo: 'açaí noir • myrtilles • cacao • piment', icone: '🥤', saison: 'Toutes saisons' }
        },
        tip: 'Embrasse la transformation — nourris ton intensité avec des saveurs profondes et mystérieuses.'
      },
      'Sagittaire': {
        element: 'Feu',
        quality: 'Mutable',
        mantra: 'J\'explore le monde à travers les saveurs et les cuisines.',
        focusSante: 'Foie / Hanches / Expansion',
        meals: {
          petitDejeuner: [
            { 
              nom: 'Bol du voyageur aux superfruits', 
              conteúdo: 'quinoa, fruits exotiques, graines variées, miel de manuka, épices du monde', 
              icone: '🌍', 
              methodeCuisson: 'Préparation nomade : Cuire quinoa, ajouter fruits exotiques de différents continents. Mélange d\'épices internationales.',
              recette: 'Quinoa 150g, mangue, fruit de la passion, kiwi, graines (chia, lin, tournesol), miel de manuka, cannelle, cardamome.',
              bienfaits: 'Quinoa énergétique pour l\'aventurier Sagittaire. Fruits exotiques pour vitamines. Épices du monde pour expansion.',
              saison: 'Été',
              influenceCosmique: 'Nouvelle Lune - Aventure matinale',
              prix: 1.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'facile',
              tempsPreparation: '20 min',
              portions: 2,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20international%20cuisine%20photography%20of%20traveler%20bowl%20with%20quinoa%2C%20exotic%20fruits%20from%20different%20continents%2C%20varied%20seeds%2C%20manuka%20honey%2C%20world%20spices%2C%20adventurous%20presentation&width=800&height=600&seq=traveler-bowl-sagittarius-luxury&orientation=landscape',
              chef: 'Chef IA Nomade',
              restaurant: 'Laboratoire Astro-Voyage'
            },
            { 
              nom: 'Thiakry aux fruits du monde', 
              conteúdo: 'couscous de mil, lait de coco, fruits exotiques variés, épices internationales', 
              icone: '🥥', 
              methodeCuisson: 'Préparation sénégalaise cosmopolite : Cuire couscous, ajouter fruits de 5 continents. Fusion d\'épices.',
              recette: 'Couscous de mil 200g, lait de coco, mangue (Afrique), ananas (Amérique), litchi (Asie), kiwi (Océanie), vanille.',
              bienfaits: 'Mil énergétique pour le Sagittaire. Fruits du monde pour vitamines variées. Fusion culturelle inspirante.',
              origine: 'Sénégal',
              saison: 'Été',
              influenceCosmique: 'Pleine Lune - Fusion mondiale',
              prix: 1.99,
              isPremium: true,
              cuisine: 'sénégalaise',
              difficulte: 'moyen',
              tempsPreparation: '35 min',
              portions: 4,
              imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20Senegalese%20dessert%20photography%20of%20thiakry%20with%20world%20fruits%2C%20millet%20couscous%2C%20coconut%20milk%2C%20exotic%20fruits%20from%20five%20continents%2C%20international%20fusion%2C%20luxury%20styling&width=800&height=600&seq=thiakry-sagittarius-luxury&orientation=landscape',
              chef: 'Chef IA Sahel',
              restaurant: 'Atelier Astro-Monde'
            },
            { 
              nom: 'Pancakes aux épices chai', 
              conteúdo: 'farine, lait, œufs, mélange chai, sirop d\'érable, fruits', 
              icone: '🥞', 
              methodeCuisson: 'Technique fusion : Infuser pâte avec épices chai indiennes. Cuire pancakes moelleux et parfumés.',
              recette: 'Farine 200g, lait 250ml, œufs 2, mélange chai (cannelle, cardamome, gingembre), sirop d\'érable, fruits frais.',
              bienfaits: 'Pancakes énergétiques pour le Sagittaire. Épices chai stimulantes pour le foie. Saveurs voyageuses.',
              origine: 'Fusion Inde-Amérique',
              saison: 'Automne',
              influenceCosmique: 'Premier Quartier - Épices voyageuses',
              prix: 1.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'moyen',
              tempsPreparation: '25 min',
              portions: 3,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20fusion%20cuisine%20photography%20of%20chai%20spice%20pancakes%20with%20Indian%20spices%2C%20maple%20syrup%2C%20fresh%20fruits%2C%20fluffy%20texture%2C%20international%20presentation%2C%20high-end%20styling&width=800&height=600&seq=pancakes-sagittarius-luxury&orientation=landscape',
              chef: 'Chef IA Fusion',
              restaurant: 'Studio Astro-Chai'
            },
            { 
              nom: 'Açaí bowl brésilien authentique', 
              conteúdo: 'açaí, guarana, fruits tropicaux, granola, beurre de cacahuète', 
              icone: '🇧🇷', 
              methodeCuisson: 'Préparation brésilienne authentique : Mixer açaí avec guarana. Disposer fruits tropicaux colorés.',
              recette: 'Açaí bio 100g, guarana en poudre, banane, mangue, fruits de la passion, granola, beurre de cacahuète.',
              bienfaits: 'Açaï énergétique pour l\'aventurier. Guarana stimulant pour expansion. Fruits tropicaux pour vitamines.',
              origine: 'Brésil',
              saison: 'Été',
              influenceCosmique: 'Lune Gibbeuse - Énergie tropicale',
              prix: 1.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'facile',
              tempsPreparation: '15 min',
              portions: 1,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20Brazilian%20cuisine%20photography%20of%20authentic%20acai%20bowl%20with%20guarana%2C%20tropical%20fruits%2C%20granola%2C%20peanut%20butter%2C%20vibrant%20colors%2C%20energetic%20presentation%2C%20high-end%20styling&width=800&height=600&seq=acai-sagittarius-luxury&orientation=landscape',
              chef: 'Chef IA Rio',
              restaurant: 'Laboratoire Astro-Brésil'
            }
          ],
          dejeuner: [
            { 
              nom: 'Curry thaï aux fruits de mer', 
              conteúdo: 'crevettes, calmars, lait de coco, curry rouge, basilic thaï', 
              icone: '🍛', 
              methodeCuisson: 'Cuisson thaïlandaise authentique : Préparer pâte de curry maison. Mijoter fruits de mer dans lait de coco épicé.',
              recette: 'Crevettes 300g, calmars 200g, lait de coco 400ml, pâte de curry rouge, basilic thaï, citronnelle, galanga.',
              bienfaits: 'Fruits de mer pour protéines. Curry stimulant pour le foie du Sagittaire. Saveurs exotiques aventureuses.',
              origine: 'Thaïlande',
              saison: 'Été',
              influenceCosmique: 'Pleine Lune - Aventure asiatique',
              prix: 3.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'moyen',
              tempsPreparation: '45 min',
              portions: 3,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20Thai%20cuisine%20photography%20of%20seafood%20curry%20with%20shrimp%2C%20squid%2C%20coconut%20milk%2C%20red%20curry%20paste%2C%20Thai%20basil%2C%20authentic%20presentation%2C%20vibrant%20colors%2C%20high-end%20Asian%20styling&width=800&height=600&seq=curry-sagittarius-luxury&orientation=landscape',
              chef: 'Chef IA Bangkok',
              restaurant: 'Atelier Astro-Thaï'
            },
            { 
              nom: 'Thiéboudienne fusion internationale', 
              conteúdo: 'riz basmati, poisson exotique, légumes du monde, épices fusion', 
              icone: '🌏', 
              methodeCuisson: 'Cuisson sénégalaise fusion : Mélanger techniques africaines et épices asiatiques. Créer fusion unique.',
              recette: 'Riz basmati, mahi-mahi, légumes variés (bok choy, aubergine), épices fusion (curcuma, gingembre, piment).',
              bienfaits: 'Poisson exotique pour oméga-3. Légumes du monde pour vitamines. Fusion culturelle pour le Sagittaire.',
              origine: 'Sénégal-Asie',
              saison: 'Automne',
              influenceCosmique: 'Premier Croissant - Fusion mondiale',
              prix: 3.99,
              isPremium: true,
              cuisine: 'sénégalaise',
              difficulte: 'difficile',
              tempsPreparation: '1h30',
              portions: 4,
              imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20fusion%20cuisine%20photography%20of%20international%20thieboudienne%20with%20basmati%20rice%2C%20exotic%20fish%2C%20world%20vegetables%2C%20fusion%20spices%2C%20creative%20presentation%2C%20multicultural%20styling&width=800&height=600&seq=thiebou-sagittarius-luxury&orientation=landscape',
              chef: 'Chef IA Dakar',
              restaurant: 'Studio Astro-Fusion'
            },
            { 
              nom: 'Tajine marocain aux sept épices', 
              conteúdo: 'agneau, abricots, amandes, mélange d\'épices du monde, couscous', 
              icone: '🌶️', 
              methodeCuisson: 'Cuisson marocaine épicée : Mijoter agneau avec sept épices de différents pays. Saveurs voyageuses.',
              recette: 'Agneau 800g, abricots, amandes, sept épices (cumin, coriandre, cannelle, cardamome, safran, gingembre, paprika).',
              bienfaits: 'Agneau pour protéines. Sept épices stimulantes pour le foie. Voyage culinaire pour le Sagittaire.',
              origine: 'Maroc',
              saison: 'Hiver',
              influenceCosmique: 'Lune Décroissante - Route des épices',
              prix: 3.99,
              isPremium: true,
              cuisine: 'arabe',
              difficulte: 'moyen',
              tempsPreparation: '2h',
              portions: 4,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20Moroccan%20cuisine%20photography%20of%20lamb%20tagine%20with%20seven%20world%20spices%2C%20apricots%2C%20almonds%2C%20traditional%20ceramic%2C%20spice%20route%20inspiration%2C%20aromatic%20presentation&width=800&height=600&seq=tajine-sagittarius-luxury&orientation=landscape',
              chef: 'Chef IA Marrakech',
              restaurant: 'Laboratoire Astro-Épices'
            },
            { 
              nom: 'Poke bowl hawaïen authentique', 
              conteúdo: 'thon ahi, riz sushi, avocat, edamame, sauce ponzu, sésame', 
              icone: '🌺', 
              methodeCuisson: 'Assemblage hawaïen traditionnel : Mariner thon dans sauce soja. Composer bowl avec ingrédients frais.',
              recette: 'Thon ahi 300g, riz sushi, avocat, edamame, concombre, sauce ponzu, sésame, algues wakame.',
              bienfaits: 'Thon pour oméga-3. Ingrédients frais pour vitamines. Cuisine hawaïenne aventureuse pour le Sagittaire.',
              origine: 'Hawaï',
              saison: 'Été',
              influenceCosmique: 'Premier Quartier - Paradis pacifique',
              prix: 3.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'facile',
              tempsPreparation: '30 min',
              portions: 2,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20Hawaiian%20cuisine%20photography%20of%20authentic%20poke%20bowl%20with%20ahi%20tuna%2C%20sushi%20rice%2C%20avocado%2C%20edamame%2C%20ponzu%20sauce%2C%20sesame%2C%20tropical%20presentation%2C%20island%20styling&width=800&height=600&seq=poke-sagittarius-luxury&orientation=landscape',
              chef: 'Chef IA Honolulu',
              restaurant: 'Atelier Astro-Pacifique'
            }
          ],
          diner: [
            { 
              nom: 'Paella valencienne aux fruits de mer', 
              conteúdo: 'riz bomba, fruits de mer variés, safran, poivrons, chorizo', 
              icone: '🥘', 
              methodeCuisson: 'Cuisson espagnole traditionnelle : Préparer sofrito, ajouter riz et safran. Disposer fruits de mer artistiquement.',
              recette: 'Riz bomba 400g, crevettes, moules, calmars, safran, poivrons, chorizo, petits pois, citron.',
              bienfaits: 'Fruits de mer pour protéines et minéraux. Safran stimulant. Plat festif pour le Sagittaire aventurier.',
              origine: 'Espagne',
              saison: 'Été',
              influenceCosmique: 'Pleine Lune - Fête méditerranéenne',
              prix: 2.99,
              isPremium: true,
              cuisine: 'européenne',
              difficulte: 'difficile',
              tempsPreparation: '1h30',
              portions: 5,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20Spanish%20cuisine%20photography%20of%20Valencian%20paella%20with%20bomba%20rice%2C%20varied%20seafood%2C%20saffron%2C%20peppers%2C%20chorizo%2C%20traditional%20paella%20pan%2C%20festive%20presentation&width=800&height=600&seq=paella-sagittarius-luxury&orientation=landscape',
              chef: 'Chef IA Valence',
              restaurant: 'Studio Astro-Paella'
            },
            { 
              nom: 'Mafé fusion aux arachides épicées', 
              conteúdo: 'poulet, pâte d\'arachide, légumes exotiques, épices internationales', 
              icone: '🥜', 
              methodeCuisson: 'Cuisson sénégalaise fusion : Mélanger mafé traditionnel avec épices asiatiques. Créer saveur unique.',
              recette: 'Poulet 800g, pâte d\'arachide, patates douces, aubergines, épices (curry, gingembre, citronnelle).',
              bienfaits: 'Poulet pour protéines. Arachides pour énergie. Fusion d\'épices stimulante pour le Sagittaire.',
              origine: 'Sénégal-Asie',
              saison: 'Automne',
              influenceCosmique: 'Nouvelle Lune - Fusion créative',
              prix: 3.99,
              isPremium: true,
              cuisine: 'sénégalaise',
              difficulte: 'moyen',
              tempsPreparation: '1h45',
              portions: 4,
              imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20fusion%20cuisine%20photography%20of%20mafe%20with%20spicy%20peanut%20sauce%2C%20chicken%2C%20exotic%20vegetables%2C%20international%20spices%2C%20creative%20presentation%2C%20multicultural%20styling&width=800&height=600&seq=mafe-sagittarius-luxury&orientation=landscape',
              chef: 'Chef IA Casamance',
              restaurant: 'Laboratoire Astro-Arachide'
            },
            { 
              nom: 'Couscous royal aux épices du monde', 
              conteúdo: 'semoule, viandes variées, légumes, mélange d\'épices internationales', 
              icone: '🌍', 
              methodeCuisson: 'Couscous fusion : Combiner techniques maghrébines avec épices de 5 continents. Voyage culinaire.',
              recette: 'Semoule, agneau, poulet, merguez, légumes variés, épices du monde (cumin, curry, paprika, gingembre).',
              bienfaits: 'Viandes pour protéines. Légumes variés pour vitamines. Épices du monde pour expansion du Sagittaire.',
              origine: 'Maghreb-Monde',
              saison: 'Hiver',
              influenceCosmique: 'Lune Gibbeuse - Festin mondial',
              prix: 3.99,
              isPremium: true,
              cuisine: 'arabe',
              difficulte: 'difficile',
              tempsPreparation: '2h30',
              portions: 6,
              imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20North%20African%20fusion%20cuisine%20photography%20of%20royal%20couscous%20with%20world%20spices%2C%20varied%20meats%2C%20vegetables%2C%20international%20spice%20blend%2C%20festive%20presentation%2C%20multicultural%20styling&width=800&height=600&seq=couscous-sagittarius-luxury&orientation=landscape',
              chef: 'Chef IA Fès',
              restaurant: 'Atelier Astro-Monde'
            },
            { 
              nom: 'Ramen fusion aux épices thaï', 
              conteúdo: 'nouilles ramen, bouillon tom yum, crevettes, citronnelle, basilic thaï', 
              icone: '🍜', 
              methodeCuisson: 'Ramen fusion : Combiner ramen japonais avec saveurs thaïlandaises. Bouillon tom yum épicé.',
              recette: 'Nouilles ramen, bouillon tom yum, crevettes, citronnelle, galanga, basilic thaï, champignons, piment.',
              bienfaits: 'Bouillon épicé stimulant pour le foie. Crevettes pour protéines. Fusion Japon-Thaïlande pour le Sagittaire.',
              origine: 'Japon-Thaïlande',
              saison: 'Hiver',
              influenceCosmique: 'Dernier Quartier - Fusion asiatique',
              prix: 2.99,
              isPremium: true,
              cuisine: 'internationale',
              difficulte: 'moyen',
              tempsPreparation: '1h',
              portions: 2,
              imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20Asian%20fusion%20cuisine%20photography%20of%20ramen%20with%20tom%20yum%20broth%2C%20shrimp%2C%20lemongrass%2C%20Thai%20basil%2C%20fusion%20presentation%2C%20spicy%20and%20aromatic%2C%20high-end%20styling&width=800&height=600&seq=ramen-sagittarius-luxury&orientation=landscape',
              chef: 'Chef IA Tokyo',
              restaurant: 'Studio Astro-Fusion'
            }
          ]
        },
        drinks: {
          jus: { nom: 'Jus Aventure exotique', conteúdo: 'mangue • ananas • fruit de la passion • gingembre', icone: '🧃', saison: 'Toutes saisons' },
          smoothie: { nom: 'Smoothie Exploration', conteúdo: 'açaí • guarana • fruits tropicaux • épices chai', icone: '🥤', saison: 'Toutes saisons' }
        },
        tip: 'Explore sans limites — découvre de nouvelles saveurs du monde entier pour nourrir ton esprit aventurier.'
      },
      'Capricorne': capricorneData,
      'Verseau': verseauData,
      'Poissons': poissonsData
    },
    en: {
      'Aries': {
        conseil: 'Your inner fire needs to be channeled with cooling and soothing foods. Favor gentle flavors that calm your natural impulsiveness.',
        aFaire: [
          'Drink plenty of water to cool your inner fire',
          'Consume magnesium-rich foods (spinach, almonds)',
          'Prefer gentle cooking methods and steaming',
          'Eat cooling fruits (cucumber, watermelon)',
          'Take soothing herbal teas (chamomile, mint)'
        ],
        aEviter: [
          'Very spicy foods that fuel your fire',
          'Excess caffeine that increases agitation',
          'Fried and too fatty foods',
          'Meals eaten in haste',
          'Excess alcohol that heats up'
        ],
        couleurTheme: 'text-red-600',
        bgTheme: 'bg-red-50'
      }
      // Ajouter les autres signes en anglais...
    },
    ar: {
      'الحمل': {
        conseil: 'نارك الداخلية تحتاج إلى توجيه بأطعمة مبردة ومهدئة. فضل النكهات اللطيفة التي تهدئ اندفاعك الطبيعي.',
        aFaire: [
          'شرب الكثير من الماء لتبريد نارك الداخلية',
          'تناول الأطعمة الغنية بالمغنيسيوم (السبانخ، اللوز)',
          'تفضيل طرق الطبخ اللطيفة والبخار',
          'تناول الفواكه المبردة (الخيار، البطيخ)',
          'شرب الأعشاب المهدئة (البابونج، النعناع)'
        ],
        aEviter: [
          'الأطعمة الحارة جداً التي تؤجج نارك',
          'الإفراط في الكافيين الذي يزيد الاضطراب',
          'الأطعمة المقلية والدهنية جداً',
          'الوجبات المتناولة بعجلة',
          'الإفراط في الكحول الذي يسخن'
        ],
        couleurTheme: 'text-red-600',
        bgTheme: 'bg-red-50'
      }
      // Ajouter les autres signes en arabe...
    }
  };

  // Packs de recettes premium
  const recipePacks: RecipePack[] = [
    {
      id: 'pack-feu-luxury',
      nom: 'Collection Feu de Luxe',
      description: 'Recettes premium pour les signes de Feu (Bélier, Lion, Sagittaire) créées par notre Chef IA spécialisé',
      recettes: ['Bol énergie quinoa-gingembre', 'Salade de homard aux agrumes', 'Velouté de châtaignes au foie gras'],
      prix: 53.99,
      prixOriginal: 75.99,
      reduction: 33,
      imageUrl: 'https://readdy.ai/api/search-image?query=Luxury%20cookbook%20collection%20photography%20featuring%20fire%20element%20recipes%2C%20elegant%20cookbook%20covers%2C%20premium%20food%20photography%2C%20international%20cuisine%2C%20gold%20and%20red%20color%20scheme%2C%20high-end%20culinary%20presentation%2C%20professional%20styling&width=800&height=600&seq=fire-collection-luxury&orientation=landscape',
      badge: '🔥 Collection Feu',
      conteúdo: ['24 recettes IA personnalisées', 'Techniques adaptées aux signes', 'Adaptations astrologiques', 'Photos professionnelles']
    },
    {
      id: 'pack-international-gourmet',
      nom: 'Voyage Gastronomique IA',
      description: 'Tour du monde culinaire avec 24 recettes créées par nos Chefs IA spécialisés par région',
      recettes: ['Croissant aux amandes', 'Sushi omakase', 'Tagine d\'agneau', 'Thieboudienne rouge'],
      prix: 50.99,
      prixOriginal: 70.99,
      reduction: 35,
      imageUrl: 'https://readdy.ai/api/search-image?query=International%20gourmet%20cuisine%20collection%20photography%2C%20world%20culinary%20tour%2C%20French%20Japanese%20Moroccan%20Senegalese%20dishes%2C%20luxury%20cookbook%20presentation%2C%20multicultural%20food%20styling%2C%20premium%20restaurant%20quality&width=800&height=600&seq=international-gourmet-luxury&orientation=landscape',
      badge: '🌍 International IA',
      conteúdo: ['Cuisine française IA', 'Art culinaire japonais IA', 'Saveurs du Maghreb IA', 'Traditions sénégalaises IA']
    },
    {
      id: 'pack-chef-ia-premium',
      nom: 'Secrets de Chef IA Premium',
      description: 'Recettes exclusives créées par notre Chef IA Master, adaptées à votre profil astrologique unique',
      recettes: ['Salade de homard au caviar', 'Velouté de châtaignes', 'Caldou de poisson noble'],
      prix: 70.99,
      prixOriginal: 90.99,
      reduction: 33,
      imageUrl: 'https://readdy.ai/api/search-image?query=AI%20chef%20premium%20recipes%20collection%2C%20luxury%20fine%20dining%20cookbook%2C%20artificial%20intelligence%20culinary%20creation%2C%20elegant%20food%20photography%2C%20high-end%20culinary%20techniques%2C%20premium%20restaurant%20presentation&width=800&height=600&seq=chef-ia-premium-luxury&orientation=landscape',
      badge: '🤖 Chef IA Premium',
      conteúdo: ['Algorithmes culinaires avancés', 'Ingrédients d\'exception', 'Présentation IA optimisée', 'Personnalisation astrologique']
    }
  ];

  // Fonctions du panier
  const addToCart = (item: Meal | RecipePack, type: 'recipe' | 'pack') => {
    const id = type === 'recipe' ? (item as Meal).nom : (item as RecipePack).id;
    const existingItem = cart.find(cartItem => cartItem.id === id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { type, item, quantity: 1, id }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, cartItem) => {
      const price = cartItem.type === 'recipe' 
        ? (cartItem.item as Meal).prix || 0
        : (cartItem.item as RecipePack).prix;
      return total + (price * cartItem.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Filtrage par cuisine
  const getFilteredMeals = (meals: Meal[]) => {
    if (selectedCuisine === 'all') return meals;
    return meals.filter(meal => meal.cuisine === selectedCuisine);
  };

  // Helper functions
  const getMealTypeLabel = (type: string) => {
    const labels = {
      fr: { petitDejeuner: 'Petit-déjeuner', dejeuner: 'Déjeuner', diner: 'Dîner' },
      en: { petitDejeuner: 'Breakfast', dejeuner: 'Lunch', diner: 'Dinner' },
      ar: { petitDejeuner: 'الإفطار', dejeuner: 'الغداء', diner: 'العشاء' }
    };
    return labels[selectedLanguage as keyof typeof labels]?.[type as keyof typeof labels.fr] || type;
  };

  const getSignSymbol = (signName: string) => {
    const sign = zodiacSigns.find(s => s.name === signName);
    return sign ? sign.symbol : '♈';
  };

  const getSignColors = (signName: string) => {
    const sign = zodiacSigns.find(s => s.name === signName);
    return sign ? { color: sign.color, bgColor: sign.bgColor, borderColor: sign.borderColor } : { color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const SignSelector = ({ 
    label, 
    selectedSign, 
    onSignChange 
  }: { 
    label: string; 
    selectedSign: string; 
    onSignChange: (sign: string) => void; 
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedColors = getSignColors(selectedSign);

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white border rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-orange-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer ${selectedColors.borderColor}`}
        >
          <div className="flex items-center space-x-3">
            <span className={`text-xl ${selectedColors.color}`}>{getSignSymbol(selectedSign)}</span>
            <span className="font-medium text-gray-900">{selectedSign}</span>
          </div>
          <i className={`ri-arrow-down-s-line text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.name}
                onClick={() => {
                  onSignChange(sign.name);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:${sign.bgColor} flex items-center space-x-3 transition-colors cursor-pointer ${
                  selectedSign === sign.name ? `${sign.bgColor} ${sign.color}` : 'text-gray-700'
                }`}
              >
                <span className={`text-xl ${sign.color}`}>{sign.symbol}</span>
                <div>
                  <div className="font-medium">{sign.name}</div>
                  <div className="text-xs text-gray-500">{sign.dates} • {sign.element}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Fonction pour obtenir les conseils personnalisés
  const getPersonalizedAdvice = () => {
    const currentHealthStates = healthStates[selectedLanguage as keyof typeof healthStates] || healthStates.fr;
    const currentAdvice = personalizedAdvice[selectedLanguage as keyof typeof personalizedAdvice] || personalizedAdvice.fr;
    
    if (selectedHealthStates.length === 0) return null;
    
    const primaryHealthState = selectedHealthStates[0];
    const adviceKey = `${selectedSunSign}-${primaryHealthState}`;
    const fallbackKey = `Bélier-${primaryHealthState}`;
    
    return currentAdvice[adviceKey] || currentAdvice[fallbackKey] || null;
  };

  // Fonction pour filtrer les recettes selon l'état de santé
  const getHealthFilteredMeals = (meals: Meal[]) => {
    let filteredMeals = getFilteredMeals(meals);
    
    if (selectedHealthStates.length === 0) return filteredMeals;
    
    // Logique de filtrage basée sur les états de santé
    return filteredMeals.map(meal => ({
      ...meal,
      bienfaits: `${meal.bienfaits} • Adapté pour: ${selectedHealthStates.map(state => {
        const healthState = healthStates[selectedLanguage as keyof typeof healthStates]?.find(h => h.id === state);
        return healthState?.name || state;
      }).join(', ')}`
    }));
  };

  // Automatisation : Détection du signe actif selon la date
  const autoDetectSign = () => {
    const detectedSign = getActiveSign(currentDate);
    setSelectedSunSign(detectedSign);
  };

  const nutritionData: NutritionData = useMemo(() => {
    const fallback = signNutritionData.fr['Bélier'];
    const langMap = signNutritionData[selectedLanguage as keyof typeof signNutritionData] || signNutritionData.fr;
    const sunSignData = langMap[selectedSunSign] || fallback;

    return {
      meta: { 
        lang: selectedLanguage, 
        region: "global", 
        date: selectedDate, 
        tz: "Africa/Dakar",
        saison: currentSeason,
        phaseCosmique: currentPhase
      },
      astro: { sunSign: selectedSunSign, moonSign: selectedMoonSign, ascendant: selectedAscendant },
      profile: {
        element: sunSignData?.element || 'Feu',
        quality: sunSignData?.quality || 'Cardinal',
        mantra: sunSignData?.mantra || 'Je nourris mon feu avec clarté et douceur.',
        focusSante: sunSignData?.focusSante || 'Tête / Hydratation / Système nerveux'
      },
      meals: sunSignData?.meals || fallback.meals,
      drinks: sunSignData?.drinks || fallback.drinks,
      tip: sunSignData?.tip || fallback.tip
    };
  }, [selectedSunSign, selectedMoonSign, selectedAscendant, selectedLanguage, selectedDate, currentSeason, currentPhase]);

  const handlePurchaseRecipe = (meal: Meal) => {
    setRecipeToPurchase(meal);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (recipeToPurchase) {
      const recipeId = `${recipeToPurchase.nom}-${selectedSunSign}`;
      setPurchasedRecipes(prev => new Set([...prev, recipeId]));
      setShowPurchaseModal(false);
      setRecipeToPurchase(null);
      
      // Simuler le téléchargement
      downloadRecipe(recipeToPurchase);
    }
  };

  const downloadRecipe = (meal: Meal) => {
    const recipeContent = `
RECETTE ASTROLOGIQUE ASTROFOOD LUXURY - GÉNÉRATION IA
=====================================================

${meal.nom}
${meal.origine ? `Origine: ${meal.origine}` : ''}
Créé par: ${meal.chef || 'Chef IA Astro-Culinaire'}
Laboratoire: ${meal.restaurant || 'Astrofood IA Lab'}
Cuisine: ${meal.cuisine}
Difficulté: ${meal.difficulte}
Temps de préparation: ${meal.tempsPreparation}
Portions: ${meal.portions}

Saison: ${meal.saison}
Influence Cosmique: ${meal.influenceCosmique}

INGRÉDIENTS:
${meal.contenido}

MÉTHODE DE CUISSON:
${meal.methodeCuisson}

RECETTE DÉTAILLÉE:
${meal.recette}

BIENFAITS POUR VOTRE SIGNE:
${meal.bienfaits}

---
🤖 RECETTE GÉNÉRÉE PAR IA ASTRO-CULINAIRE
Adaptée spécialement pour votre profil astrologique unique
Signe Solaire: ${selectedSunSign}
Signe Lunaire: ${selectedMoonSign}
Ascendant: ${selectedAscendant}

Cette recette a été créée par notre Chef IA spécialisé en nutrition astrologique,
en analysant les besoins énergétiques de votre configuration astrale et les 
influences cosmiques actuelles pour optimiser votre bien-être.

© Astrofood Luxury - Nutrition Astrologique IA
    `;

    const blob = new Blob([recipeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meal.nom.replace(/[^a-zA-Z0-9]/g, '_')}_Astrofood_Luxury.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isRecipePurchased = (meal: Meal) => {
    const recipeId = `${meal.nom}-${selectedSunSign}`;
    return purchasedRecipes.has(recipeId);
  };

  const CuisineFilter = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {(['all', 'sénégalaise', 'européenne', 'arabe', 'internationale'] as const).map((cuisine) => (
        <button
          key={cuisine}
          onClick={() => setSelectedCuisine(cuisine)}
          className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
            selectedCuisine === cuisine
              ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cuisine === 'all' ? '🌟 Toutes' : 
           cuisine === 'sénégalaise' ? '🇸🇳 Sénégalaise' :
           cuisine === 'européenne' ? '🇫🇷 Européenne' :
           cuisine === 'arabe' ? '🕌 Arabe' : '🌍 Internationale'}
        </button>
      ))}
    </div>
  );

  const CartModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">🛒</span>
              Panier de Luxe
            </h3>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-3xl"></i>
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg">Votre panier est vide</p>
              <p className="text-gray-400">Ajoutez des recettes de luxe pour commencer</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cart.map((cartItem) => (
                  <div key={cartItem.id} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={cartItem.type === 'recipe' ? (cartItem.item as Meal).imageUrl : (cartItem.item as RecipePack).imageUrl}
                          alt={cartItem.type === 'recipe' ? (cartItem.item as Meal).nom : (cartItem.item as RecipePack).nom}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {cartItem.type === 'recipe' ? (cartItem.item as Meal).nom : (cartItem.item as RecipePack).nom}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {cartItem.type === 'recipe' ? 
                              `${(cartItem.item as Meal).cuisine} • ${(cartItem.item as Meal).tempsPreparation}` :
                              (cartItem.item as RecipePack).description
                            }
                          </p>
                          <p className="text-orange-600 font-bold">
                            {cartItem.type === 'recipe' ? (cartItem.item as Meal).prix : (cartItem.item as RecipePack).prix}€
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 cursor-pointer"
                        >
                          <i className="ri-subtract-line"></i>
                        </button>
                        <span className="font-semibold">{cartItem.quantity}</span>
                        <button
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                          className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 cursor-pointer"
                        >
                          <i className="ri-add-line"></i>
                        </button>
                        <button
                          onClick={() => removeFromCart(cartItem.id)}
                          className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer ml-2"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-orange-600">{getTotalPrice().toFixed(2)}€</span>
                </div>
                <button className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-500 hover:to-red-600 transition-all whitespace-nowrap cursor-pointer text-lg">
                  <i className="ri-secure-payment-line mr-2"></i>
                  Procéder au Paiement Sécurisé
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const PacksModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">📚</span>
              Collections Premium
            </h3>
            <button
              onClick={() => setShowPacks(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-3xl"></i>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipePacks.map((pack) => (
              <div key={pack.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-xl transition-shadow">
                <div className="relative mb-4">
                  <img 
                    src={pack.imageUrl}
                    alt={pack.nom}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{pack.reduction}%
                  </div>
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {pack.badge}
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-2">{pack.nom}</h4>
                <p className="text-gray-600 text-sm mb-4">{pack.description}</p>
                
                <div className="space-y-2 mb-4">
                  {pack.contenido.map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <i className="ri-check-line text-green-500 mr-2"></i>
                      {item}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-purple-600">{pack.prix}€</span>
                    <span className="text-lg text-gray-400 line-through ml-2">{pack.prixOriginal}€</span>
                  </div>
                  <div className="text-green-600 font-semibold">
                    Économie: {(pack.prixOriginal - pack.prix).toFixed(2)}€
                  </div>
                </div>
                
                <button
                  onClick={() => addToCart(pack, 'pack')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-shopping-cart-line mr-2"></i>
                  Ajouter au Panier
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Nouvelle Modal Boutique Intégrée
  const IntegratedStoreModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">🛍️</span>
              {selectedLanguage === 'ar' ? 'متجر الوصفات المتكامل' : selectedLanguage === 'en' ? 'Integrated Recipe Store' : 'Boutique Recettes Intégrée'}
            </h3>
            <button
              onClick={() => setShowIntegratedStore(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-3xl"></i>
            </button>
          </div>

          {/* Section Recettes Individuelles */}
          <div className="mb-12">
            <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🍽️</span>
              {selectedLanguage === 'ar' ? 'الوصفات الفردية' : selectedLanguage === 'en' ? 'Individual Recipes' : 'Recettes Individuelles'}
            </h4>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nutritionData.meals[selectedMealType].map((meal, index) => (
                <div key={index} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 hover:shadow-xl transition-shadow">
                  <div className="relative mb-4">
                    <img 
                      src={meal.imageUrl}
                      alt={meal.nom}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {meal.prix}€
                    </div>
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {meal.isPremium ? '⭐ Premium' : '🆓 Gratuit'}
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{meal.nom}</h4>
                  <p className="text-gray-600 text-sm mb-4">{meal.contenido.substring(0, 100)}...</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="ri-time-line text-orange-500 mr-2"></i>
                      {meal.tempsPreparation}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="ri-group-line text-orange-500 mr-2"></i>
                      {meal.portions} portions
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="ri-star-line text-orange-500 mr-2"></i>
                      {meal.difficulte}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePurchaseItem(meal, 'recipe')}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-shopping-cart-line mr-2"></i>
                    {selectedLanguage === 'ar' ? 'شراء فوري' : selectedLanguage === 'en' ? 'Buy Now' : 'Acheter Maintenant'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section Collections Premium */}
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">📚</span>
              {selectedLanguage === 'ar' ? 'المجموعات المميزة' : selectedLanguage === 'en' ? 'Premium Collections' : 'Collections Premium'}
            </h4>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipePacks.map((pack) => (
                <div key={pack.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-xl transition-shadow">
                  <div className="relative mb-4">
                    <img 
                      src={pack.imageUrl}
                      alt={pack.nom}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{pack.reduction}%
                    </div>
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {pack.badge}
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{pack.nom}</h4>
                  <p className="text-gray-600 text-sm mb-4">{pack.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {pack.contenido.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <i className="ri-check-line text-green-500 mr-2"></i>
                        {item}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-purple-600">{pack.prix}€</span>
                      <span className="text-lg text-gray-400 line-through ml-2">{pack.prixOriginal}€</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePurchaseItem(pack, 'pack')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-shopping-cart-line mr-2"></i>
                    {selectedLanguage === 'ar' ? 'شراء المجموعة' : selectedLanguage === 'en' ? 'Buy Collection' : 'Acheter Collection'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Nouvelle Modal de Paiement
  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        <div className="text-center">
          {!paymentSuccess ? (
            <>
              <div className="text-6xl mb-4">
                {itemToPurchase?.type === 'recipe' ? (itemToPurchase.item as Meal).icone : '📚'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedLanguage === 'ar' ? 'إتمام الدفع' : selectedLanguage === 'en' ? 'Complete Payment' : 'Finaliser le Paiement'}
              </h3>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                {itemToPurchase?.type === 'recipe' 
                  ? (itemToPurchase.item as Meal).nom 
                  : (itemToPurchase.item as RecipePack).nom}
              </h4>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {itemToPurchase?.type === 'recipe' 
                    ? (itemToPurchase.item as Meal).prix 
                    : (itemToPurchase.item as RecipePack).prix}€
                </div>
                
                {/* Formulaire de paiement simulé */}
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {selectedLanguage === 'ar' ? 'رقم البطاقة' : selectedLanguage === 'en' ? 'Card Number' : 'Numéro de Carte'}
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={paymentProcessing}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {selectedLanguage === 'ar' ? 'انتهاء الصلاحية' : selectedLanguage === 'en' ? 'Expiry' : 'Expiration'}
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={paymentProcessing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={paymentProcessing}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={processPayment}
                  disabled={paymentProcessing}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all whitespace-nowrap cursor-pointer text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {paymentProcessing ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      {selectedLanguage === 'ar' ? 'جاري المعالجة...' : selectedLanguage === 'en' ? 'Processing...' : 'Traitement...'}
                    </>
                  ) : (
                    <>
                      <i className="ri-secure-payment-line mr-2"></i>
                      {selectedLanguage === 'ar' ? 'دفع آمن' : selectedLanguage === 'en' ? 'Secure Payment' : 'Paiement Sécurisé'}
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setItemToPurchase(null);
                  }}
                  disabled={paymentProcessing}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {selectedLanguage === 'ar' ? 'إلغاء' : selectedLanguage === 'en' ? 'Cancel' : 'Annuler'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                {selectedLanguage === 'ar' ? 'تم الدفع بنجاح!' : selectedLanguage === 'en' ? 'Payment Successful!' : 'Paiement Réussi !'}
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedLanguage === 'ar' ? 
                  'شكراً لك! يمكنك الآن تحميل مشترياتك.' :
                  selectedLanguage === 'en' ? 
                  'Thank you! You can now download your purchase.' :
                  'Merci ! Vous pouvez maintenant télécharger votre achat.'
                }
              </p>
              
              {downloadReady && (
                <button
                  onClick={downloadPurchasedItem}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all whitespace-nowrap cursor-pointer text-lg mb-4"
                >
                  <i className="ri-download-line mr-2"></i>
                  {selectedLanguage === 'ar' ? 'تحميل الآن' : selectedLanguage === 'en' ? 'Download Now' : 'Télécharger Maintenant'}
                </button>
              )}
              
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentSuccess(false);
                  setDownloadReady(false);
                  setItemToPurchase(null);
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-all whitespace-nowrap cursor-pointer"
              >
                {selectedLanguage === 'ar' ? 'إغلاق' : selectedLanguage === 'en' ? 'Close' : 'Fermer'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Fonction pour activer le Chef IA
  const activateChefAI = () => {
    // Activer le widget Readdy Agent qui sert de Chef IA
    const vapiWidget = document.querySelector('#vapi-widget-floating-button') as HTMLElement;
    if (vapiWidget) {
      vapiWidget.click();
    } else {
      setShowChefAI(true);
    }
  };

  // Nouvelles fonctions pour la boutique intégrée
  const openIntegratedStore = () => {
    setShowIntegratedStore(true);
  };

  const handlePurchaseItem = (item: Meal | RecipePack, type: 'recipe' | 'pack') => {
    setItemToPurchase({ type, item });
    setShowPaymentModal(true);
    setShowIntegratedStore(false);
  };

  const processPayment = async () => {
    setPaymentProcessing(true);
    
    // Simulation du processus de paiement
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setPaymentProcessing(false);
    setPaymentSuccess(true);
    
    // Marquer l'item comme acheté
    if (itemToPurchase) {
      if (itemToPurchase.type === 'recipe') {
        const recipeId = `${(itemToPurchase.item as Meal).nom}-${selectedSunSign}`;
        setPurchasedRecipes(prev => new Set([...prev, recipeId]));
      }
      
      // Préparer le téléchargement
      setTimeout(() => {
        setDownloadReady(true);
      }, 1000);
    }
  };

  const downloadPurchasedItem = () => {
    if (itemToPurchase) {
      if (itemToPurchase.type === 'recipe') {
        downloadRecipe(itemToPurchase.item as Meal);
      } else {
        downloadRecipePack(itemToPurchase.item as RecipePack);
      }
      
      // Réinitialiser les états
      setShowPaymentModal(false);
      setPaymentSuccess(false);
      setDownloadReady(false);
      setItemToPurchase(null);
    }
  };

  const downloadRecipePack = (pack: RecipePack) => {
    const packContent = `
COLLECTION ASTROFOOD LUXURY - ${pack.nom}
========================================

${pack.description}

CONTENU DE LA COLLECTION:
${pack.contenido.map(item => `• ${item}`).join('\n')}

RECETTES INCLUSES:
${pack.recettes.map(recipe => `• ${recipe}`).join('\n')}

VALEUR TOTALE: ${pack.prixOriginal}€
PRIX PAYÉ: ${pack.prix}€
ÉCONOMIE RÉALISÉE: ${(pack.prixOriginal - pack.prix).toFixed(2)}€

---
🤖 COLLECTION GÉNÉRÉE PAR IA ASTRO-CULINAIRE
Adaptée spécialement pour votre profil astrologique unique
Signe Solaire: ${selectedSunSign}
Signe Lunaire: ${selectedMoonSign}
Ascendant: ${selectedAscendant}

Cette collection a été créée par nos Chefs IA spécialisés en nutrition astrologique,
en analysant les besoins énergétiques de votre configuration astrale.

© Astrofood Luxury - Nutrition Astrologique IA
    `;

    const blob = new Blob([packContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pack.nom.replace(/[^a-zA-Z0-9]/g, '_')}_Collection_Astrofood.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Composant sélecteur d'états de santé
  const HealthStateSelector = () => {
    const currentHealthStates = healthStates[selectedLanguage as keyof typeof healthStates] || healthStates.fr;
    
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">🎯</span>
            {selectedLanguage === 'ar' ? 'حالتك الصحية' : selectedLanguage === 'en' ? 'Your Health Focus' : 'Votre Focus Santé'}
          </h3>
          <button
            onClick={() => setShowHealthSelector(!showHealthSelector)}
            className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer flex items-center"
          >
            <i className={`ri-${showHealthSelector ? 'subtract' : 'add'}-line mr-1`}></i>
            {selectedLanguage === 'ar' ? 'تخصيص' : selectedLanguage === 'en' ? 'Customize' : 'Personnaliser'}
          </button>
        </div>
        
        {showHealthSelector && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {currentHealthStates.map((healthState) => (
              <button
                key={healthState.id}
                onClick={() => {
                  if (selectedHealthStates.includes(healthState.id)) {
                    setSelectedHealthStates(selectedHealthStates.filter(id => id !== healthState.id));
                  } else {
                    setSelectedHealthStates([...selectedHealthStates, healthState.id]);
                  }
                }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                  selectedHealthStates.includes(healthState.id)
                    ? `${healthState.bgColor} border-current ${healthState.color} shadow-md`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{healthState.icon}</span>
                  <h4 className="font-semibold text-sm">{healthState.name}</h4>
                </div>
                <p className="text-xs text-gray-600">{healthState.description}</p>
              </button>
            ))}
          </div>
        )}
        
        {selectedHealthStates.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedHealthStates.map((stateId) => {
              const healthState = currentHealthStates.find(h => h.id === stateId);
              if (!healthState) return null;
              
              return (
                <span
                  key={stateId}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${healthState.bgColor} ${healthState.color}`}
                >
                  <span className="mr-2">{healthState.icon}</span>
                  {healthState.name}
                  <button
                    onClick={() => setSelectedHealthStates(selectedHealthStates.filter(id => id !== stateId))}
                    className="ml-2 hover:text-red-600 cursor-pointer"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Fonction pour obtenir le conseil spécifique au signe
  const getSignSpecificAdvice = () => {
    const currentAdvice = signSpecificAdvice[selectedLanguage as keyof typeof signSpecificAdvice] || signSpecificAdvice.fr;
    const signKey = selectedLanguage === 'ar' ? 
      (selectedSunSign === 'Bélier' ? 'الحمل' : selectedSunSign) : 
      (selectedLanguage === 'en' && selectedSunSign === 'Bélier' ? 'Aries' : selectedSunSign);
    
    return currentAdvice[signKey] || currentAdvice['Bélier'] || currentAdvice['Aries'] || currentAdvice['الحمل'];
  };

  // Fonction pour générer l'URL actuelle
  const getCurrentURL = () => {
    return window.location.href;
  };

  // Fonction pour générer le QR code
  const generateQRCodeURL = (url: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-50 to-red-50 ${selectedLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Header avec panier et QR code */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center relative overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Modern%20elegant%20logo%20design%20for%20Astrofood%20luxury%20brand%20featuring%20sophisticated%20typography%20with%20cosmic%20stars%20and%20culinary%20elements%2C%20minimalist%20design%20with%20orange%20and%20red%20gradient%20colors%2C%20premium%20food%20and%20astronomy%20theme%2C%20clean%20geometric%20shapes%2C%20luxury%20brand%20identity%2C%20white%20background%2C%20vector%20style%20illustration%20with%20celestial%20and%20gastronomic%20symbols&width=200&height=200&seq=astrofood-logo-luxury&orientation=squarish"
                  alt="Astrofood Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Pacifico", serif' }}>Astrofood Luxury</h1>
                <p className="text-gray-600">
                  {selectedLanguage === 'ar' ? 'مطبخ فلكي فاخر' : selectedLanguage === 'en' ? 'Luxury Astrological Cuisine' : 'Cuisine Astrologique de Luxe'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Bouton QR Code Mobile */}
              <button
                onClick={() => setShowQRCode(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all whitespace-nowrap cursor-pointer flex items-center"
                title={selectedLanguage === 'ar' ? 'رمز QR للهاتف المحمول' : selectedLanguage === 'en' ? 'QR Code for Mobile' : 'QR Code pour Mobile'}
              >
                <i className="ri-qr-code-line mr-2"></i>
                <span className="hidden sm:inline">
                  {selectedLanguage === 'ar' ? 'QR موبايل' : selectedLanguage === 'en' ? 'Mobile QR' : 'QR Mobile'}
                </span>
                <span className="sm:hidden">QR</span>
              </button>

              {/* Bouton Boutique Intégrée */}
              <button
                onClick={openIntegratedStore}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all whitespace-nowrap cursor-pointer flex items-center"
              >
                <i className="ri-store-line mr-2"></i>
                <span className="hidden sm:inline">
                  {selectedLanguage === 'ar' ? 'متجر الوصفات' : selectedLanguage === 'en' ? 'Recipe Store' : 'Boutique Recettes'}
                </span>
                <span className="sm:hidden">🛍️</span>
              </button>
              
              {/* Bouton Panier */}
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-500 hover:to-red-600 transition-all whitespace-nowrap cursor-pointer flex items-center"
              >
                <i className="ri-shopping-cart-line mr-2"></i>
                <span className="hidden sm:inline">
                  {selectedLanguage === 'ar' ? 'السلة' : selectedLanguage === 'en' ? 'Cart' : 'Panier'}
                </span>
                <span className="sm:hidden">🛒</span>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
              
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer pr-8"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Sélecteur de Date Cosmique */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-3">🌙</span>
            {selectedLanguage === 'ar' ? 'منتقي التاريخ الكوني' : selectedLanguage === 'en' ? 'Cosmic Date Selector' : 'Sélecteur de Date Cosmique'}
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedLanguage === 'ar' ? 'التاريخ' : selectedLanguage === 'en' ? 'Date' : 'Date'}
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-1">
                {selectedLanguage === 'ar' ? 'الموسم الحالي' : selectedLanguage === 'en' ? 'Current Season' : 'Saison Actuelle'}
              </h4>
              <p className="text-purple-600 font-medium">{currentSeason}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-1">
                {selectedLanguage === 'ar' ? 'المرحلة الكونية' : selectedLanguage === 'en' ? 'Cosmic Phase' : 'Phase Cosmique'}
              </h4>
              <p className="text-indigo-600 font-medium">{currentPhase}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-1">
                {selectedLanguage === 'ar' ? 'البرج النشط' : selectedLanguage === 'en' ? 'Active Sign' : 'Signe Actif'}
              </h4>
              <div className="flex items-center justify-between">
                <p className="text-orange-600 font-medium">{activeSign}</p>
                <button
                  onClick={autoDetectSign}
                  className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full hover:bg-orange-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {selectedLanguage === 'ar' ? 'كشف تلقائي' : selectedLanguage === 'en' ? 'Auto-detect' : 'Détecter automatiquement'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profil Astrologique */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">✨</span>
            {selectedLanguage === 'ar' ? 'ملفك الفلكي' : selectedLanguage === 'en' ? 'Your Astrological Profile' : 'Votre Profil Astrologique'}
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sélecteurs de signes */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedLanguage === 'ar' ? 'خصص أبراجك' : selectedLanguage === 'en' ? 'Customize your signs' : 'Personnalisez vos signes'}
              </h3>
              
              <SignSelector
                label={selectedLanguage === 'ar' ? 'برج الشمس' : selectedLanguage === 'en' ? 'Sun Sign' : 'Signe Solaire'}
                selectedSign={selectedSunSign}
                onSignChange={setSelectedSunSign}
              />
              
              <SignSelector
                label={selectedLanguage === 'ar' ? 'برج القمر' : selectedLanguage === 'en' ? 'Moon Sign' : 'Signe Lunaire'}
                selectedSign={selectedMoonSign}
                onSignChange={setSelectedMoonSign}
              />
              
              <SignSelector
                label={selectedLanguage === 'ar' ? 'الطالع' : selectedLanguage === 'en' ? 'Ascendant' : 'Ascendant'}
                selectedSign={selectedAscendant}
                onSignChange={setSelectedAscendant}
              />
            </div>
            
            {/* Profil actuel */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getSignColors(selectedSunSign).bgColor} ${getSignColors(selectedSunSign).borderColor} border-2`}>
                  <span className={`text-2xl ${getSignColors(selectedSunSign).color}`}>{getSignSymbol(selectedSunSign)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedLanguage === 'ar' ? 'الأبراج الفلكية' : selectedLanguage === 'en' ? 'Astrological Signs' : 'Signes Astrologiques'}
                  </h3>
                  <p className="text-gray-600">
                    {selectedLanguage === 'ar' ? 'برج الشمس' : selectedLanguage === 'en' ? 'Sun Sign' : 'Signe Solaire'}: <span className={getSignColors(selectedSunSign).color}>{nutritionData.astro.sunSign}</span>
                  </p>
                  <p className="text-gray-600">
                    {selectedLanguage === 'ar' ? 'برج القمر' : selectedLanguage === 'en' ? 'Moon Sign' : 'Signe Lunaire'}: <span className={getSignColors(selectedMoonSign).color}>{nutritionData.astro.moonSign}</span>
                  </p>
                  <p className="text-gray-600">
                    {selectedLanguage === 'ar' ? 'الطالع' : selectedLanguage === 'en' ? 'Ascendant' : 'Ascendant'}: <span className={getSignColors(selectedAscendant).color}>{nutritionData.astro.ascendant}</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {selectedLanguage === 'ar' ? 'العنصر' : selectedLanguage === 'en' ? 'Element' : 'Élément'}: {nutritionData.profile.element}
                </h4>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {selectedLanguage === 'ar' ? 'الجودة' : selectedLanguage === 'en' ? 'Quality' : 'Qualité'}: {nutritionData.profile.quality}
                </h4>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {selectedLanguage === 'ar' ? 'تركيز الصحة' : selectedLanguage === 'en' ? 'Health Focus' : 'Focus Santé'}: {nutritionData.profile.focusSante}
                </h4>
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <p className="text-gray-700 italic">"{nutritionData.profile.mantra}"</p>
                </div>
                
                {/* Informations cosmiques */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <h5 className="text-sm font-semibold text-purple-900">
                      {selectedLanguage === 'ar' ? 'التغيير الموسمي' : selectedLanguage === 'en' ? 'Seasonal Variation' : 'Variation Saisonnière'}
                    </h5>
                    <p className="text-purple-700 text-sm">{nutritionData.meta.saison}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <h5 className="text-sm font-semibold text-indigo-900">
                      {selectedLanguage === 'ar' ? 'التأثير الكوني' : selectedLanguage === 'en' ? 'Cosmic Influence' : 'Influence Cosmique'}
                    </h5>
                    <p className="text-indigo-700 text-sm">{nutritionData.meta.phaseCosmique}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sélecteur d'États de Santé */}
        <HealthStateSelector />

        {/* Conseil du Jour avec Chef IA intégré */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="mr-3">💡</span>
                {selectedLanguage === 'ar' ? 'نصيحة اليوم' : selectedLanguage === 'en' ? 'Daily Advice' : 'Conseil du Jour'}
              </h2>
              
              {/* Conseil spécifique au signe sélectionné */}
              <div className="mb-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4">
                  <h3 className="font-bold text-xl mb-3 flex items-center">
                    <span className={`text-3xl mr-3 ${getSignColors(selectedSunSign).color}`}>{getSignSymbol(selectedSunSign)}</span>
                    {selectedLanguage === 'ar' ? 
                      `نصيحة خاصة لبرج ${selectedSunSign}` :
                      selectedLanguage === 'en' ? 
                      `Special advice for ${selectedSunSign}` :
                      `Conseil spécial pour ${selectedSunSign}`
                    }
                  </h3>
                  <p className="text-orange-100 mb-4 text-lg leading-relaxed">
                    {getSignSpecificAdvice()?.conseil}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* À FAIRE */}
                    <div className="bg-green-500 bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                      <h4 className="font-bold text-lg mb-3 flex items-center text-green-100">
                        <i className="ri-check-double-line text-xl mr-2"></i>
                        {selectedLanguage === 'ar' ? 'يُنصح بفعله' : selectedLanguage === 'en' ? 'TO DO' : 'À FAIRE'}
                      </h4>
                      <ul className="space-y-2">
                        {getSignSpecificAdvice()?.aFaire.map((item, index) => (
                          <li key={index} className="flex items-start text-sm text-green-100">
                            <i className="ri-leaf-line text-green-300 mr-2 mt-0.5 flex-shrink-0"></i>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* À ÉVITER */}
                    <div className="bg-red-500 bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                      <h4 className="font-bold text-lg mb-3 flex items-center text-red-100">
                        <i className="ri-close-circle-line text-xl mr-2"></i>
                        {selectedLanguage === 'ar' ? 'يُنصح بتجنبه' : selectedLanguage === 'en' ? 'TO AVOID' : 'À ÉVITER'}
                      </h4>
                      <ul className="space-y-2">
                        {getSignSpecificAdvice()?.aEviter.map((item, index) => (
                          <li key={index} className="flex items-start text-sm text-red-100">
                            <i className="ri-alert-line text-red-300 mr-2 mt-0.5 flex-shrink-0"></i>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conseil personnalisé selon l'état de santé */}
              {getPersonalizedAdvice() ? (
                <div className="mb-6">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                    <h3 className="font-bold text-lg mb-2 flex items-center">
                      <span className="mr-2">🎯</span>
                      {selectedLanguage === 'ar' ? 'نصيحة مخصصة لحالتك' : selectedLanguage === 'en' ? 'Personalized Advice for Your Condition' : 'Conseil Personnalisé pour Votre État'}
                    </h3>
                    <p className="text-orange-100 mb-3">{getPersonalizedAdvice()?.advice}</p>
                    
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="bg-white bg-opacity-10 rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-2">
                          {selectedLanguage === 'ar' ? 'مناطق التركيز' : selectedLanguage === 'en' ? 'Focus Areas' : 'Zones de Focus'}
                        </h4>
                        <ul className="text-xs space-y-1">
                          {getPersonalizedAdvice()?.focusAreas.map((area, index) => (
                            <li key={index} className="flex items-center">
                              <i className="ri-check-line mr-1"></i>
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-white bg-opacity-10 rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-2">
                          {selectedLanguage === 'ar' ? 'مكونات موصى بها' : selectedLanguage === 'en' ? 'Recommended Ingredients' : 'Ingrédients Recommandés'}
                        </h4>
                        <ul className="text-xs space-y-1">
                          {getPersonalizedAdvice()?.recommendedIngredients.slice(0, 3).map((ingredient, index) => (
                            <li key={index} className="flex items-center">
                              <i className="ri-leaf-line mr-1"></i>
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-white bg-opacity-10 rounded-lg p-3">
                        <h4 className="font-semibold text-sm mb-2">
                          {selectedLanguage === 'ar' ? 'تجنب' : selectedLanguage === 'en' ? 'Avoid' : 'À Éviter'}
                        </h4>
                        <ul className="text-xs space-y-1">
                          {getPersonalizedAdvice()?.avoidIngredients.slice(0, 3).map((ingredient, index) => (
                            <li key={index} className="flex items-center">
                              <i className="ri-close-line mr-1"></i>
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-xl font-medium mb-4">{nutritionData.tip}</p>
                  <div className="text-orange-100 text-sm mb-6">
                    {selectedLanguage === 'ar' ? 
                      `مُكيف للموسم ${nutritionData.meta.saison} • المرحلة ${nutritionData.meta.phaseCosmique}` :
                      selectedLanguage === 'en' ? 
                      `Adapted to ${nutritionData.meta.saison} season • ${nutritionData.meta.phaseCosmique} phase` :
                      `Adapté à la saison ${nutritionData.meta.saison} • Phase ${nutritionData.meta.phaseCosmique}`
                    }
                  </div>
                </div>
              )}
            </div>
            
            {/* Chef IA Section */}
            <div className="ml-8 bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="font-bold text-lg mb-2">
                  {selectedLanguage === 'ar' ? 'الشيف الذكي' : selectedLanguage === 'en' ? 'AI Chef' : 'Chef IA'}
                </h3>
                <p className="text-sm text-orange-100 mb-4">
                  {selectedLanguage === 'ar' ? 
                    'مستشار التغذية الفلكية الشخصي' :
                    selectedLanguage === 'en' ? 
                    'Personal Astrological Nutrition Advisor' :
                    'Conseiller en nutrition astrologique personnalisé'
                  }
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={activateChefAI}
                  className="w-full bg-white text-orange-600 py-3 px-4 rounded-lg font-semibold hover:bg-orange-50 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center"
                >
                  <i className="ri-chat-voice-line mr-2"></i>
                  {selectedLanguage === 'ar' ? 'تحدث مع الشيف' : selectedLanguage === 'en' ? 'Talk to Chef' : 'Parler au Chef'}
                </button>
                
                <button
                  onClick={openIntegratedStore}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center"
                >
                  <i className="ri-store-line mr-2"></i>
                  {selectedLanguage === 'ar' ? 'متجر الوصفات' : selectedLanguage === 'en' ? 'Recipe Store' : 'Boutique Recettes'}
                </button>
                
                <div className="text-xs text-orange-100 text-center">
                  {selectedLanguage === 'ar' ? 
                    'وصفات رقمية حصرية مُكيفة لبرجك وحالتك الصحية' :
                    selectedLanguage === 'en' ? 
                    'Exclusive digital recipes adapted to your sign and health condition' :
                    'Recettes digitales exclusives adaptées à votre signe et état de santé'
                  }
                </div>
              </div>
            </div>
          </div>
          
          {/* Fonctionnalités du Chef IA */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <i className="ri-restaurant-line text-xl mr-2"></i>
                <h4 className="font-semibold">
                  {selectedLanguage === 'ar' ? 'وصفات مخصصة' : selectedLanguage === 'en' ? 'Custom Recipes' : 'Recettes Personnalisées'}
                </h4>
              </div>
              <p className="text-sm text-orange-100">
                {selectedLanguage === 'ar' ? 
                  'وصفات مُصممة خصيصاً لبرجك وحالتك الصحية' :
                  selectedLanguage === 'en' ? 
                  'Recipes designed specifically for your sign and health condition' :
                  'Recettes conçues spécialement pour votre signe et état de santé'
                }
              </p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <i className="ri-calendar-line text-xl mr-2"></i>
                <h4 className="font-semibold">
                  {selectedLanguage === 'ar' ? 'تخطيط الوجبات' : selectedLanguage === 'en' ? 'Meal Planning' : 'Planification Repas'}
                </h4>
              </div>
              <p className="text-sm text-orange-100">
                {selectedLanguage === 'ar' ? 
                  'خطط أسبوعية مُكيفة للمواسم الكونية وحالتك' :
                  selectedLanguage === 'en' ? 
                  'Weekly plans adapted to cosmic seasons and your condition' :
                  'Plans hebdomadaires adaptés aux saisons cosmiques et votre état'
                }
              </p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <i className="ri-heart-pulse-line text-xl mr-2"></i>
                <h4 className="font-semibold">
                  {selectedLanguage === 'ar' ? 'نصائح صحية' : selectedLanguage === 'en' ? 'Health Tips' : 'Conseils Santé'}
                </h4>
              </div>
              <p className="text-sm text-orange-100">
                {selectedLanguage === 'ar' ? 
                  'إرشادات غذائية مُكيفة لطاقتك الفلكية ومشاكلك الصحية' :
                  selectedLanguage === 'en' ? 
                  'Nutritional guidance adapted to your astrological energy and health issues' :
                  'Conseils nutritionnels adaptés à votre énergie astrologique et problèmes de santé'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Menu des Repas avec filtre cuisine */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">🍽️</span>
              {selectedLanguage === 'ar' ? 'القائمة الذواقة الدولية' : selectedLanguage === 'en' ? 'International Gourmet Menu' : 'Menu Gastronomique International'}
            </h2>
            
            {/* Bouton Boutique Intégrée */}
            <button
              onClick={openIntegratedStore}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all whitespace-nowrap cursor-pointer flex items-center"
            >
              <i className="ri-store-line mr-2"></i>
              {selectedLanguage === 'ar' ? 'متجر الوصفات المتكامل' : selectedLanguage === 'en' ? 'Integrated Recipe Store' : 'Boutique Recettes Intégrée'}
            </button>
          </div>
          
          {/* Filtre par cuisine */}
          <CuisineFilter />
          
          {/* Sélecteur de Repas */}
          <div className="flex space-x-2 mb-8 bg-gray-100 rounded-full p-2">
            {(['petitDejeuner', 'dejeuner', 'diner'] as const).map((mealType) => (
              <button
                key={mealType}
                onClick={() => setSelectedMealType(mealType)}
                className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedMealType === mealType
                    ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {getMealTypeLabel(mealType)}
              </button>
            ))}
          </div>

          {/* Plats du Repas Sélectionné avec filtrage santé */}
          <div className="grid lg:grid-cols-2 gap-8">
            {getHealthFilteredMeals(nutritionData.meals[selectedMealType]).map((meal, index) => {
              const signColors = getSignColors(selectedSunSign);
              const isPurchased = isRecipePurchased(meal);
              
              return (
                <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow border border-gray-100">
                  {/* Image de la recette */}
                  <div className="relative h-64">
                    <img 
                      src={meal.imageUrl}
                      alt={meal.nom}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        meal.isPremium ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-green-100 text-green-800'
                      }`}>
                        {meal.isPremium ? '⭐ Premium' : '🆓 Gratuit'}
                      </span>
                      <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {meal.cuisine === 'sénégalaise' ? '🇸🇳' :
                         meal.cuisine === 'européenne' ? '🇫🇷' :
                         meal.cuisine === 'arabe' ? '🕌' : '🌍'} {meal.cuisine}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                      <span className="text-2xl font-bold text-gray-900">{meal.prix}€</span>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {meal.difficulte} • {meal.tempsPreparation} • {meal.portions} pers.
                    </div>
                    
                    {/* Badge d'adaptation santé */}
                    {selectedHealthStates.length > 0 && (
                      <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        <i className="ri-heart-pulse-line mr-1"></i>
                        {selectedLanguage === 'ar' ? 'مُكيف لحالتك' : selectedLanguage === 'en' ? 'Adapted for you' : 'Adapté pour vous'}
                      </div>
                    )}
                  </div>
                  
                  {/* Contenu de la carte */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{meal.nom}</h3>
                        {meal.chef && (
                          <p className="text-sm text-gray-600 mb-1">
                            <i className="ri-robot-line mr-1"></i>
                            {meal.chef}
                          </p>
                        )}
                        {meal.restaurant && (
                          <p className="text-sm text-gray-600 mb-2">
                            <i className="ri-flask-line mr-1"></i>
                            {meal.restaurant}
                          </p>
                        )}
                      </div>
                      <span className="text-3xl">{meal.icone}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{meal.contenido}</p>
                    
                    {/* Informations cosmiques */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-purple-50 rounded-lg p-2">
                        <p className="text-xs text-purple-800">🌿 {meal.saison}</p>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-2">
                        <p className="text-xs text-indigo-800">🌙 {meal.influenceCosmique}</p>
                      </div>
                    </div>
                    
                    {/* Informations du chef */}
                    {(meal.chef || meal.restaurant) && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                        {meal.chef && (
                          <p className="text-gray-700 mb-1">
                            <i className="ri-robot-line mr-2"></i>
                            <strong>
                              {selectedLanguage === 'ar' ? 'أنشأه:' : selectedLanguage === 'en' ? 'Created by:' : 'Créé par:'}
                            </strong> {meal.chef}
                          </p>
                        )}
                        {meal.restaurant && (
                          <p className="text-gray-700">
                            <i className="ri-flask-line mr-2"></i>
                            <strong>
                              {selectedLanguage === 'ar' ? 'المختبر:' : selectedLanguage === 'en' ? 'Laboratory:' : 'Laboratoire:'}
                            </strong> {meal.restaurant}
                          </p>
                        )}
                        <p className="text-xs text-purple-600 mt-2">
                          <i className="ri-sparkle-line mr-1"></i>
                          {selectedLanguage === 'ar' ? 
                            'وصفة مُولدة بالذكاء الاصطناعي وفقاً لملفك الفلكي وحالتك الصحية' :
                            selectedLanguage === 'en' ? 
                            'AI-generated recipe according to your astrological profile and health condition' :
                            'Recette générée par IA selon votre profil astrologique et état de santé'
                          }
                        </p>
                      </div>
                    )}
                    
                    {/* Boutons d'action */}
                    <div className="space-y-3">
                      <button 
                        onClick={() => setSelectedMeal(meal)}
                        className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-500 hover:to-blue-700 transition-all whitespace-nowrap cursor-pointer">
                        <i className="ri-eye-line mr-2"></i>
                        {selectedLanguage === 'ar' ? 'عرض الوصفة' : selectedLanguage === 'en' ? 'View Recipe' : 'Voir la Recette'}
                      </button>
                      
                      <div className="flex space-x-2">
                        {isPurchased ? (
                          <button
                            onClick={() => downloadRecipe(meal)}
                            className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center"
                          >
                            <i className="ri-download-line mr-2"></i>
                            {selectedLanguage === 'ar' ? 'تحميل' : selectedLanguage === 'en' ? 'Download' : 'Télécharger'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePurchaseRecipe(meal)}
                            className="flex-1 bg-gradient-to-r from-orange-400 to-red-500 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-500 hover:to-red-600 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center"
                          >
                            <i className="ri-shopping-cart-line mr-2"></i>
                            {selectedLanguage === 'ar' ? 'شراء' : selectedLanguage === 'en' ? 'Buy' : 'Acheter'}
                          </button>
                        )}
                        
                        <button
                          onClick={() => addToCart(meal, 'recipe')}
                          className="bg-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-600 transition-all whitespace-nowrap cursor-pointer"
                        >
                          <i className="ri-add-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedLanguage === 'ar' ? 'التغذية المتناغمة مع النجوم' : selectedLanguage === 'en' ? 'Nutrition Harmonized with the Stars' : 'Nutrition Harmonisée avec les Astres'}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto" dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}>
              {selectedLanguage === 'ar' ? 
                `تم تخصيص نظامك الغذائي وفقاً لملفك الفلكي الفريد والتأثيرات الكونية الحالية وحالتك الصحية. كل توصية تجمع بين تأثير برج الشمس (${selectedSunSign}) والقمر (${selectedMoonSign}) والطالع (${selectedAscendant}) مع موسم ${nutritionData.meta.saison} والمرحلة الكونية ${nutritionData.meta.phaseCosmique} لتوازن طاقة ${nutritionData.profile.element} ودعم رفاهيتك العامة وحالتك الصحية المحددة.` :
                selectedLanguage === 'en' ? 
                `Your diet is personalized according to your unique astrological profile, current cosmic influences and health condition. Each recommendation combines the influence of your sun sign (${selectedSunSign}), moon sign (${selectedMoonSign}) and ascendant (${selectedAscendant}) with the ${nutritionData.meta.saison} season and cosmic phase ${nutritionData.meta.phaseCosmique} to balance your ${nutritionData.profile.element} energy and support your overall well-being and specific health condition.` :
                `Votre alimentation est personnalisée selon votre profil astrologique unique, les influences cosmiques actuelles et votre état de santé. Chaque recommandation combine l'influence de votre signe solaire (${selectedSunSign}), lunaire (${selectedMoonSign}) et ascendant (${selectedAscendant}) avec la saison ${nutritionData.meta.saison} et la phase cosmique ${nutritionData.meta.phaseCosmique} pour équilibrer votre énergie ${nutritionData.profile.element} et soutenir votre bien-être global et état de santé spécifique.`
              }
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4">
              <a href="https://readdy.ai/?origin=logo" className="text-amber-600 hover:text-amber-700 font-medium">
                Powered by Marcady
              </a>
              <span className="text-gray-300">•</span>
              <button
                onClick={openIntegratedStore}
                className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
              >
                {selectedLanguage === 'ar' ? 'متجر الوصفات' : selectedLanguage === 'en' ? 'Recipe Store' : 'Boutique Recettes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCart && <CartModal />}
      {showIntegratedStore && <IntegratedStoreModal />}
      {showPaymentModal && <PaymentModal />}
      
      {/* Modal d'achat (ancien système) */}
      {showPurchaseModal && recipeToPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">{recipeToPurchase.icone}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Acheter cette recette</h3>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">{recipeToPurchase.nom}</h4>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 mb-4">Obtenez la recette complète avec tous les détails et téléchargez-la instantanément</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <i className="ri-check-line text-green-500 mr-2"></i>
                    Recette complète avec ingrédients
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="ri-check-line text-green-500 mr-2"></i>
                    Méthode de cuisson détaillée
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="ri-check-line text-green-500 mr-2"></i>
                    Bienfaits astrologiques personnalisés
                  </div>
                  <div className="flex items-center justify-center">
                    <i className="ri-check-line text-green-500 mr-2"></i>
                    Téléchargement instantané
                  </div>
                </div>
              </div>
              
              <div className="text-3xl font-bold text-gray-900 mb-6">
                {recipeToPurchase.prix}€
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowPurchaseModal(false);
                    handlePurchaseItem(recipeToPurchase, 'recipe');
                  }}
                  className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-500 hover:to-red-600 transition-all whitespace-nowrap cursor-pointer text-lg"
                >
                  <i className="ri-secure-payment-line mr-2"></i>
                  Acheter maintenant
                </button>
                
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-all whitespace-nowrap cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Recette Complète */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="mr-4 text-4xl">{selectedMeal.icone}</span>
                  {selectedMeal.nom}
                  {selectedMeal.origine && (
                    <span className="ml-3 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                      <span className="mr-1">🌍</span>
                      {selectedMeal.origine}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setSelectedMeal(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-3xl"></i>
                </button>
              </div>
              
              {/* Image de la recette dans le modal */}
              <div className="mb-6">
                <img 
                  src={selectedMeal.imageUrl}
                  alt={selectedMeal.nom}
                  className="w-full h-64 object-cover object-top rounded-xl"
                />
              </div>
              
              {/* Informations du chef */}
              {(selectedMeal.chef || selectedMeal.restaurant) && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                  {selectedMeal.chef && (
                    <p className="text-gray-700 mb-1">
                      <i className="ri-robot-line mr-2"></i>
                      <strong>Créé par:</strong> {selectedMeal.chef}
                    </p>
                  )}
                  {selectedMeal.restaurant && (
                    <p className="text-gray-700">
                      <i className="ri-flask-line mr-2"></i>
                      <strong>Laboratoire:</strong> {selectedMeal.restaurant}
                    </p>
                  )}
                  <p className="text-xs text-purple-600 mt-2">
                    <i className="ri-sparkle-line mr-1"></i>
                    Recette générée par IA selon votre profil astrologique
                  </p>
                </div>
              )}
              
              {/* Informations cosmiques dans le modal */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Variation Saisonnière</h4>
                  <p className="text-purple-700">{selectedMeal.saison}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2">Influence Cosmique</h4>
                  <p className="text-indigo-700">{selectedMeal.influenceCosmique}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
                      <span className="mr-2">🛒</span>
                      Ingrédients
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{selectedMeal.contenido}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
                      <span className="mr-2">🎯</span>
                      Bienfaits pour votre signe
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{selectedMeal.bienfaits}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
                      <span className="mr-2">👨‍🍳</span>
                      Méthode de cuisson
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{selectedMeal.methodeCuisson}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
                      <span className="mr-2">📝</span>
                      Recette détaillée
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{selectedMeal.recette}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={() => setSelectedMeal(null)}
                  className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-500 hover:to-red-600 transition-all whitespace-nowrap cursor-pointer text-lg"
                >
                  Parfait, je vais essayer ! ⭐
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nouvelle Modal Boutique Intégrée */}
      {showIntegratedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">🛍️</span>
                  {selectedLanguage === 'ar' ? 'متجر الوصفات المتكامل' : selectedLanguage === 'en' ? 'Integrated Recipe Store' : 'Boutique Recettes Intégrée'}
                </h3>
                <button
                  onClick={() => setShowIntegratedStore(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-3xl"></i>
                </button>
              </div>

              {/* Section Recettes Individuelles */}
              <div className="mb-12">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">🍽️</span>
                  {selectedLanguage === 'ar' ? 'الوصفات الفردية' : selectedLanguage === 'en' ? 'Individual Recipes' : 'Recettes Individuelles'}
                </h4>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nutritionData.meals[selectedMealType].map((meal, index) => (
                    <div key={index} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 hover:shadow-xl transition-shadow">
                      <div className="relative mb-4">
                        <img 
                          src={meal.imageUrl}
                          alt={meal.nom}
                          className="w-full h-48 object-cover rounded-xl"
                        />
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {meal.prix}€
                        </div>
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {meal.isPremium ? '⭐ Premium' : '🆓 Gratuit'}
                        </div>
                      </div>
                      
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{meal.nom}</h4>
                      <p className="text-gray-600 text-sm mb-4">{meal.contenido.substring(0, 100)}...</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="ri-time-line text-orange-500 mr-2"></i>
                          {meal.tempsPreparation}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="ri-group-line text-orange-500 mr-2"></i>
                          {meal.portions} portions
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="ri-star-line text-orange-500 mr-2"></i>
                          {meal.difficulte}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handlePurchaseItem(meal, 'recipe')}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-shopping-cart-line mr-2"></i>
                        {selectedLanguage === 'ar' ? 'شراء فوري' : selectedLanguage === 'en' ? 'Buy Now' : 'Acheter Maintenant'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Collections Premium */}
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">📚</span>
                  {selectedLanguage === 'ar' ? 'المجموعات المميزة' : selectedLanguage === 'en' ? 'Premium Collections' : 'Collections Premium'}
                </h4>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipePacks.map((pack) => (
                    <div key={pack.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-xl transition-shadow">
                      <div className="relative mb-4">
                        <img 
                          src={pack.imageUrl}
                          alt={pack.nom}
                          className="w-full h-48 object-cover rounded-xl"
                        />
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -{pack.reduction}%
                        </div>
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {pack.badge}
                        </div>
                      </div>
                      
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{pack.nom}</h4>
                      <p className="text-gray-600 text-sm mb-4">{pack.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {pack.contenido.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <i className="ri-check-line text-green-500 mr-2"></i>
                            {item}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-purple-600">{pack.prix}€</span>
                          <span className="text-lg text-gray-400 line-through ml-2">{pack.prixOriginal}€</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handlePurchaseItem(pack, 'pack')}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-shopping-cart-line mr-2"></i>
                        {selectedLanguage === 'ar' ? 'شراء المجموعة' : selectedLanguage === 'en' ? 'Buy Collection' : 'Acheter Collection'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nouvelle Modal de Paiement */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center">
              {!paymentSuccess ? (
                <>
                  <div className="text-6xl mb-4">
                    {itemToPurchase?.type === 'recipe' ? (itemToPurchase.item as Meal).icone : '📚'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedLanguage === 'ar' ? 'إتمام الدفع' : selectedLanguage === 'en' ? 'Complete Payment' : 'Finaliser le Paiement'}
                  </h3>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    {itemToPurchase?.type === 'recipe' 
                      ? (itemToPurchase.item as Meal).nom 
                      : (itemToPurchase.item as RecipePack).nom}
                  </h4>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-4">
                      {itemToPurchase?.type === 'recipe' 
                        ? (itemToPurchase.item as Meal).prix 
                        : (itemToPurchase.item as RecipePack).prix}€
                    </div>
                    
                    {/* Formulaire de paiement simulé */}
                    <div className="space-y-4 text-left">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {selectedLanguage === 'ar' ? 'رقم البطاقة' : selectedLanguage === 'en' ? 'Card Number' : 'Numéro de Carte'}
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={paymentProcessing}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {selectedLanguage === 'ar' ? 'انتهاء الصلاحية' : selectedLanguage === 'en' ? 'Expiry' : 'Expiration'}
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={paymentProcessing}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={paymentProcessing}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={processPayment}
                      disabled={paymentProcessing}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all whitespace-nowrap cursor-pointer text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {paymentProcessing ? (
                        <>
                          <i className="ri-loader-4-line animate-spin mr-2"></i>
                          {selectedLanguage === 'ar' ? 'جاري المعالجة...' : selectedLanguage === 'en' ? 'Processing...' : 'Traitement...'}
                        </>
                      ) : (
                        <>
                          <i className="ri-secure-payment-line mr-2"></i>
                          {selectedLanguage === 'ar' ? 'دفع آمن' : selectedLanguage === 'en' ? 'Secure Payment' : 'Paiement Sécurisé'}
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        setItemToPurchase(null);
                      }}
                      disabled={paymentProcessing}
                      className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
                    >
                      {selectedLanguage === 'ar' ? 'إلغاء' : selectedLanguage === 'en' ? 'Cancel' : 'Annuler'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">
                    {selectedLanguage === 'ar' ? 'تم الدفع بنجاح!' : selectedLanguage === 'en' ? 'Payment Successful!' : 'Paiement Réussi !'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {selectedLanguage === 'ar' ? 
                      'شكراً لك! يمكنك الآن تحميل مشترياتك.' :
                      selectedLanguage === 'en' ? 
                      'Thank you! You can now download your purchase.' :
                      'Merci ! Vous pouvez maintenant télécharger votre achat.'
                    }
                  </p>
                  
                  {downloadReady && (
                    <button
                      onClick={downloadPurchasedItem}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all whitespace-nowrap cursor-pointer text-lg mb-4"
                    >
                      <i className="ri-download-line mr-2"></i>
                      {selectedLanguage === 'ar' ? 'تحميل الآن' : selectedLanguage === 'en' ? 'Download Now' : 'Télécharger Maintenant'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentSuccess(false);
                      setDownloadReady(false);
                      setItemToPurchase(null);
                    }}
                    className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-all whitespace-nowrap cursor-pointer"
                  >
                    {selectedLanguage === 'ar' ? 'إغلاق' : selectedLanguage === 'en' ? 'Close' : 'Fermer'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Chef IA (fallback si widget non disponible) */}
      {showChefAI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedLanguage === 'ar' ? 'الشيف الذكي' : selectedLanguage === 'en' ? 'AI Chef' : 'Chef IA'}
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedLanguage === 'ar' ? 
                  'مستشارك الشخصي في التغذية الفلكية متاح الآن!' :
                  selectedLanguage === 'en' ? 
                  'Your personal astrological nutrition advisor is now available!' :
                  'Votre conseiller personnel en nutrition astrologique est maintenant disponible !'
                }
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={openIntegratedStore}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-store-line mr-2"></i>
                  {selectedLanguage === 'ar' ? 'تسوق الوصفات' : selectedLanguage === 'en' ? 'Shop Recipes' : 'Acheter Recettes'}
                </button>
                
                <button
                  onClick={() => setShowChefAI(false)}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-all whitespace-nowrap cursor-pointer"
                >
                  {selectedLanguage === 'ar' ? 'إغلاق' : selectedLanguage === 'en' ? 'Close' : 'Fermer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal QR Code */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">📱</span>
                  {selectedLanguage === 'ar' ? 'رمز QR للهاتف المحمول' : selectedLanguage === 'en' ? 'Mobile QR Code' : 'QR Code Mobile'}
                </h3>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-lg mb-4 inline-block">
                  <img 
                    src={generateQRCodeURL(getCurrentURL())}
                    alt="QR Code Astrofood"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                
                <h4 className="font-bold text-lg text-gray-900 mb-2">
                  {selectedLanguage === 'ar' ? 'امسح للوصول السريع' : selectedLanguage === 'en' ? 'Scan for Quick Access' : 'Scannez pour un Accès Rapide'}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  {selectedLanguage === 'ar' ? 
                    'استخدم كاميرا هاتفك لمسح رمز QR والوصول إلى Astrofood Luxury على هاتفك المحمول' :
                    selectedLanguage === 'en' ? 
                    'Use your phone camera to scan the QR code and access Astrofood Luxury on your mobile device' :
                    'Utilisez l\'appareil photo de votre téléphone pour scanner le QR code et accéder à Astrofood Luxury sur votre mobile'
                  }
                </p>
                
                {/* Avantages Mobile */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <i className="ri-smartphone-line text-blue-600 mr-2"></i>
                      <span className="font-semibold text-gray-800">
                        {selectedLanguage === 'ar' ? 'محسن للهاتف' : selectedLanguage === 'en' ? 'Mobile Optimized' : 'Optimisé Mobile'}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {selectedLanguage === 'ar' ? 'تجربة مثالية على الهاتف' : selectedLanguage === 'en' ? 'Perfect mobile experience' : 'Expérience mobile parfaite'}
                    </p>
                  </div>
                  
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <i className="ri-voice-recognition-line text-green-600 mr-2"></i>
                      <span className="font-semibold text-gray-800">
                        {selectedLanguage === 'ar' ? 'شيف ذكي صوتي' : selectedLanguage === 'en' ? 'Voice AI Chef' : 'Chef IA Vocal'}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {selectedLanguage === 'ar' ? 'نصائح صوتية مخصصة' : selectedLanguage === 'en' ? 'Personalized voice advice' : 'Conseils vocaux personnalisés'}
                    </p>
                  </div>
                  
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <i className="ri-shopping-cart-line text-orange-600 mr-2"></i>
                      <span className="font-semibold text-gray-800">
                        {selectedLanguage === 'ar' ? 'تسوق سهل' : selectedLanguage === 'en' ? 'Easy Shopping' : 'Achat Facile'}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {selectedLanguage === 'ar' ? 'شراء الوصفات بسهولة' : selectedLanguage === 'en' ? 'Easy recipe purchasing' : 'Achat de recettes facile'}
                    </p>
                  </div>
                  
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <i className="ri-star-line text-purple-600 mr-2"></i>
                      <span className="font-semibold text-gray-800">
                        {selectedLanguage === 'ar' ? 'تجربة فلكية' : selectedLanguage === 'en' ? 'Astro Experience' : 'Expérience Astro'}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {selectedLanguage === 'ar' ? 'تغذية مخصصة لبرجك' : selectedLanguage === 'en' ? 'Nutrition for your sign' : 'Nutrition pour votre signe'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Instructions */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6">
                <h5 className="font-semibold text-gray-900 mb-2 flex items-center justify-center">
                  <i className="ri-information-line mr-2"></i>
                  {selectedLanguage === 'ar' ? 'كيفية الاستخدام' : selectedLanguage === 'en' ? 'How to Use' : 'Comment Utiliser'}
                </h5>
                <ol className="text-sm text-gray-700 space-y-1 text-left">
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                    {selectedLanguage === 'ar' ? 
                      'افتح تطبيق الكاميرا على هاتفك' :
                      selectedLanguage === 'en' ? 
                      'Open your phone\'s camera app' :
                      'Ouvrez l\'appareil photo de votre téléphone'
                    }
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                    {selectedLanguage === 'ar' ? 
                      'وجه الكاميرا نحو رمز QR' :
                      selectedLanguage === 'en' ? 
                      'Point the camera at the QR code' :
                      'Pointez la caméra vers le QR code'
                    }
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                    {selectedLanguage === 'ar' ? 
                      'اضغط على الرابط الذي يظهر' :
                      selectedLanguage === 'en' ? 
                      'Tap the link that appears' :
                      'Appuyez sur le lien qui apparaît'
                    }
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">4</span>
                    {selectedLanguage === 'ar' ? 
                      'استمتع بتجربة Astrofood على هاتفك!' :
                      selectedLanguage === 'en' ? 
                      'Enjoy Astrofood experience on your phone!' :
                      'Profitez d\'Astrofood sur votre téléphone !'
                    }
                  </li>
                </ol>
              </div>
              
              {/* Boutons d'action */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigator.share && navigator.share({
                      title: 'Astrofood Luxury',
                      text: selectedLanguage === 'ar' ? 
                        'اكتشف التغذية الفلكية الفاخرة' :
                        selectedLanguage === 'en' ? 
                        'Discover luxury astrological nutrition' :
                        'Découvrez la nutrition astrologique de luxe',
                      url: getCurrentURL()
                    }).catch(() => {
                      // Fallback: copier l'URL
                      navigator.clipboard.writeText(getCurrentURL());
                    });
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center"
                >
                  <i className="ri-share-line mr-2"></i>
                  {selectedLanguage === 'ar' ? 'مشاركة الرابط' : selectedLanguage === 'en' ? 'Share Link' : 'Partager le Lien'}
                </button>
                
                <button
                  onClick={() => setShowQRCode(false)}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-all whitespace-nowrap cursor-pointer"
                >
                  {selectedLanguage === 'ar' ? 'إغلاق' : selectedLanguage === 'en' ? 'Close' : 'Fermer'}
                </button>
              </div>
              
              {/* Note sur la compatibilité */}
              <p className="text-xs text-gray-500 mt-4">
                {selectedLanguage === 'ar' ? 
                  'متوافق مع جميع الهواتف الذكية الحديثة' :
                  selectedLanguage === 'en' ? 
                  'Compatible with all modern smartphones' :
                  'Compatible avec tous les smartphones modernes'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
