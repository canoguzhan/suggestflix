// Available languages
export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

// Default language
export const DEFAULT_LANGUAGE: Language = 'en';

// Detect browser language and return one of our supported languages
export function detectLanguage(): Language {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }
  
  const browserLang = navigator.language.split('-')[0];
  
  // Check if browserLang is one of our supported languages
  if (['en', 'es', 'fr', 'de', 'ja', 'zh'].includes(browserLang)) {
    return browserLang as Language;
  }
  
  return DEFAULT_LANGUAGE;
}

// Translation strings
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Home page
    'discover.title': 'Discover Your Next Favorite Movie',
    'discover.description': 'Click the button below to get a random movie suggestion. Find something new to watch every day!',
    'suggest.button': 'Suggest a Movie',
    'error.title': 'Oops! Something went wrong',
    'error.message': 'We couldn\'t fetch a movie suggestion. Please try again later.',
    'error.button': 'Try Again',
    
    // Movie card
    'movie.year': 'Year',
    'movie.runtime': 'min',
    'movie.viewTmdb': 'View on TMDB',
    'streaming.title': 'Stream On',
    'streaming.rent': 'Rent From',
    'streaming.buy': 'Buy From',
    
    // Footer
    'footer.copyright': '© {year} SuggestFlix',
    'footer.poweredBy': 'Powered by TMDB API'
  },
  es: {
    'discover.title': 'Descubre Tu Próxima Película Favorita',
    'discover.description': '¡Haz clic en el botón de abajo para obtener una sugerencia de película aleatoria. Encuentra algo nuevo para ver todos los días!',
    'suggest.button': 'Sugerir una Película',
    'error.title': '¡Ops! Algo salió mal',
    'error.message': 'No pudimos obtener una sugerencia de película. Por favor, inténtalo de nuevo más tarde.',
    'error.button': 'Intentar de Nuevo',
    'movie.year': 'Año',
    'movie.runtime': 'min',
    'movie.viewTmdb': 'Ver en TMDB',
    'streaming.title': 'Ver En',
    'streaming.rent': 'Alquilar De',
    'streaming.buy': 'Comprar De',
    'footer.copyright': '© {year} SuggestFlix',
    'footer.poweredBy': 'Desarrollado con la API de TMDB'
  },
  fr: {
    'discover.title': 'Découvrez Votre Prochain Film Préféré',
    'discover.description': 'Cliquez sur le bouton ci-dessous pour obtenir une suggestion de film aléatoire. Trouvez quelque chose de nouveau à regarder chaque jour!',
    'suggest.button': 'Suggérer un Film',
    'error.title': 'Oups! Quelque chose s\'est mal passé',
    'error.message': 'Nous n\'avons pas pu obtenir une suggestion de film. Veuillez réessayer plus tard.',
    'error.button': 'Réessayer',
    'movie.year': 'Année',
    'movie.runtime': 'min',
    'movie.viewTmdb': 'Voir sur TMDB',
    'streaming.title': 'Regarder Sur',
    'streaming.rent': 'Louer De',
    'streaming.buy': 'Acheter De',
    'footer.copyright': '© {year} SuggestFlix',
    'footer.poweredBy': 'Propulsé par l\'API TMDB'
  },
  de: {
    'discover.title': 'Entdecke Deinen Nächsten Lieblingsfilm',
    'discover.description': 'Klicke auf die Schaltfläche unten, um einen zufälligen Filmvorschlag zu erhalten. Finde jeden Tag etwas Neues zum Ansehen!',
    'suggest.button': 'Film Vorschlagen',
    'error.title': 'Hoppla! Etwas ist schief gelaufen',
    'error.message': 'Wir konnten keinen Filmvorschlag abrufen. Bitte versuche es später noch einmal.',
    'error.button': 'Erneut Versuchen',
    'movie.year': 'Jahr',
    'movie.runtime': 'min',
    'movie.viewTmdb': 'Auf TMDB ansehen',
    'streaming.title': 'Ansehen Auf',
    'streaming.rent': 'Ausleihen Von',
    'streaming.buy': 'Kaufen Von',
    'footer.copyright': '© {year} SuggestFlix',
    'footer.poweredBy': 'Unterstützt durch die TMDB API'
  },
  ja: {
    'discover.title': '次のお気に入り映画を発見しよう',
    'discover.description': '下のボタンをクリックして、ランダムな映画の提案を取得してください。毎日新しい映画を見つけましょう！',
    'suggest.button': '映画を提案する',
    'error.title': 'おっと！問題が発生しました',
    'error.message': '映画の提案を取得できませんでした。後でもう一度お試しください。',
    'error.button': '再試行',
    'movie.year': '年',
    'movie.runtime': '分',
    'movie.viewTmdb': 'TMDBで見る',
    'streaming.title': '視聴する',
    'streaming.rent': 'レンタルする',
    'streaming.buy': '購入する',
    'footer.copyright': '© {year} SuggestFlix',
    'footer.poweredBy': 'TMDB APIを使用'
  },
  zh: {
    'discover.title': '发现您的下一部最爱电影',
    'discover.description': '点击下面的按钮获取随机电影建议。每天找到新的观看内容！',
    'suggest.button': '推荐一部电影',
    'error.title': '哎呀！出了点问题',
    'error.message': '我们无法获取电影建议。请稍后再试。',
    'error.button': '重试',
    'movie.year': '年份',
    'movie.runtime': '分钟',
    'movie.viewTmdb': '在TMDB上查看',
    'streaming.title': '观看于',
    'streaming.rent': '租赁于',
    'streaming.buy': '购买于',
    'footer.copyright': '© {year} SuggestFlix',
    'footer.poweredBy': '由TMDB API提供支持'
  }
};

// Create a function to get translations
export function useTranslation() {
  const language = detectLanguage();
  
  const t = (key: string, replacements: Record<string, string | number> = {}) => {
    let text = translations[language][key] || translations[DEFAULT_LANGUAGE][key] || key;
    
    // Replace placeholders with values
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(`{${placeholder}}`, String(value));
    });
    
    return text;
  };
  
  return {
    t,
    language
  };
}