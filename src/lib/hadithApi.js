// Hadith API utility (hadithapi.com)
// Note: Requires API key in .env.local as NEXT_PUBLIC_HADITH_API_KEY

const API_BASE = 'https://hadithapi.com/api';

// Helper to get API key at runtime
const getAPIKey = () => process.env.NEXT_PUBLIC_HADITH_API_KEY || '';

/**
 * Fetch all hadith books/collections
 */
export async function getBooks() {
  const API_KEY = getAPIKey();
  if (!API_KEY) {
    console.warn('Hadith API key not found. Using mock data.');
    return getMockBooks();
  }

  try {
    const response = await fetch(`${API_BASE}/books?apiKey=${API_KEY}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return getMockBooks();
  }
}

/**
 * Fetch hadiths from a specific book
 * @param {string} bookSlug - Book identifier (e.g., 'sahih-bukhari')
 * @param {number} page - Page number for pagination
 * @param {number} paginate - Number of hadiths per page
 */
export async function getHadiths(bookSlug, page = 1, paginate = 50) {
  const API_KEY = getAPIKey();
  if (!API_KEY) {
    console.warn('Hadith API key not found. Using mock data.');
    return getMockHadiths(bookSlug);
  }

  try {
    const response = await fetch(
      `${API_BASE}/hadiths?apiKey=${API_KEY}&bookSlug=${bookSlug}&page=${page}&paginate=${paginate}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching hadiths:', error);
    return getMockHadiths(bookSlug);
  }
}

/**
 * Fetch hadiths by chapter
 */
export async function getHadithsByChapter(bookSlug, chapterNumber) {
  const API_KEY = getAPIKey();
  if (!API_KEY) {
    return getMockHadiths(bookSlug);
  }

  try {
    const response = await fetch(
      `${API_BASE}/hadiths?apiKey=${API_KEY}&bookSlug=${bookSlug}&chapterNumber=${chapterNumber}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching hadiths by chapter:', error);
    return getMockHadiths(bookSlug);
  }
}

/**
 * Get chapters for a book
 */
export async function getChapters(bookSlug) {
  const API_KEY = getAPIKey();
  console.log('API Key status:', API_KEY ? 'Found ✓' : 'Missing ✗');
  if (!API_KEY) {
    console.warn('Hadith API key not found. Using mock data.');
    return getMockChapters(bookSlug);
  }

  try {
    const response = await fetch(
      `${API_BASE}/${bookSlug}/chapters?apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return getMockChapters(bookSlug);
  }
}

// Mock data functions (used when API key is not available)
function getMockBooks() {
  return {
    status: 200,
    message: 'Success',
    books: [
      {
        bookSlug: 'sahih-bukhari',
        bookName: 'Sahih al-Bukhari',
        writerName: 'Imam Muhammad al-Bukhari',
        about_writer: 'The most authentic hadith collection',
        hadiths_count: 7563,
        chapters_count: 97
      },
      {
        bookSlug: 'sahih-muslim',
        bookName: 'Sahih Muslim',
        writerName: 'Imam Muslim ibn al-Hajjaj',
        about_writer: 'Second most authentic hadith collection',
        hadiths_count: 7470,
        chapters_count: 56
      },
      {
        bookSlug: 'sunan-abi-dawud',
        bookName: 'Sunan Abi Dawud',
        writerName: 'Imam Abu Dawud',
        about_writer: 'Collection focused on legal hadith',
        hadiths_count: 5274,
        chapters_count: 43
      }
    ]
  };
}

function getMockHadiths(bookSlug) {
  return {
    status: 200,
    message: 'Success',
    hadiths: {
      data: [
        {
          hadithNumber: 1,
          englishNarrator: 'Umar ibn al-Khattab',
          hadithEnglish: 'I heard Allah\'s Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for."',
          hadithArabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ',
          hadithUrdu: 'امام بخاری رحمہ اللہ علیہ نے فرمایا کہ تمام اعمال کا دار و مدار نیتوں پر ہے اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی۔',
          bookSlug: 'sahih-bukhari',
          chapterId: '1',
          chapterNumber: '1',
          chapterEnglish: 'Revelation',
          status: 'Sahih'
        },
        {
          hadithNumber: 2,
          englishNarrator: 'Aisha',
          hadithEnglish: 'The Prophet (ﷺ) said, "If anyone invents something which is not in agreement with our matter, it will be rejected."',
          hadithArabic: 'مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ',
          hadithUrdu: 'نبی کریم صلی اللہ علیہ وسلم نے فرمایا جس نے ہمارے دین میں کوئی نئی چیز ایجاد کی جو اس میں نہیں ہے تو وہ مردود ہے۔',
          bookSlug: 'sahih-bukhari',
          chapterId: '1',
          chapterNumber: '1',
          chapterEnglish: 'Belief',
          status: 'Sahih'
        },
        {
          hadithNumber: 3,
          englishNarrator: 'Abu Huraira',
          hadithEnglish: 'The Prophet (ﷺ) said, "Religion is very easy and whoever overburdens himself in his religion will not be able to continue in that way. So you should not be extremists, but try to be near to perfection and receive the good tidings that you will be rewarded."',
          hadithArabic: 'إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلاَّ غَلَبَهُ، فَسَدِّدُوا وَقَارِبُوا وَأَبْشِرُوا',
          hadithUrdu: 'نبی کریم صلی اللہ علیہ وسلم نے فرمایا دین آسان ہے اور جو بھی دین میں سختی کرے گا دین اس پر غالب آجائے گا۔',
          bookSlug: 'sahih-bukhari',
          chapterId: '1',
          chapterNumber: '1',
          chapterEnglish: 'Belief',
          status: 'Sahih'
        }
      ],
      total: 3,
      page: 1,
      limit: 50
    }
  };
}

function getMockChapters(bookSlug) {
  return {
    status: 200,
    message: 'Success',
    chapters: [
      {
        id: '1',
        chapterNumber: '1',
        chapterEnglish: 'Revelation',
        chapterArabic: 'كتاب بدء الوحي',
        hadithStartNumber: 1,
        hadithEndNumber: 7,
        hadithRange: '1 to 7'
      },
      {
        id: '2',
        chapterNumber: '2',
        chapterEnglish: 'Belief',
        chapterArabic: 'كتاب الإيمان',
        hadithStartNumber: 8,
        hadithEndNumber: 58,
        hadithRange: '8 to 58'
      },
      {
        id: '3',
        chapterNumber: '3',
        chapterEnglish: 'Knowledge',
        chapterArabic: 'كتاب العلم',
        hadithStartNumber: 59,
        hadithEndNumber: 134,
        hadithRange: '59 to 134'
      },
      {
        id: '4',
        chapterNumber: '4',
        chapterEnglish: 'Ablutions (Wudu)',
        chapterArabic: 'كتاب الوضوء',
        hadithStartNumber: 135,
        hadithEndNumber: 247,
        hadithRange: '135 to 247'
      },
      {
        id: '5',
        chapterNumber: '5',
        chapterEnglish: 'Bathing (Ghusl)',
        chapterArabic: 'كتاب الغسل',
        hadithStartNumber: 248,
        hadithEndNumber: 293,
        hadithRange: '248 to 293'
      }
    ]
  };
}
