import { Room, RoomType, SortingItem, QuizQuestion, DigitalLockConfig } from './types';

export const GAME_TITLE = "Protokol: OMEGA";

export const ROOMS: Room[] = [
  {
    id: 0,
    title: "1. Brána Firewallu",
    description: "Vítej v systému, kadete. Školní server byl napaden virem 'BlackOut'. Jsi naše poslední naděje. Pro vstup do systému musíš prolomit firewall. Bezpečnostní otázka se týká hesel.",
    imagePrompt: "A glowing futuristic digital gate, firewall concept, blue and red neon lights, padlock symbol, cyberpunk city background",
    type: RoomType.PUZZLE_QUIZ,
    puzzleData: {
      question: "Které z následujících hesel je NEJSILNĚJŠÍ z hlediska kyberbezpečnosti?",
      options: [
        "123456",
        "Heslo123",
        "PepaNovak",
        "K$8m#P9z!L2q"
      ],
      correctIndex: 3,
      feedback: "Správně! Silné heslo obsahuje velká i malá písmena, čísla a speciální znaky a nedává smysl jako slovo."
    } as QuizQuestion
  },
  {
    id: 1,
    title: "2. Základní Deska",
    description: "Firewall prolomen. Nyní se nacházíš na základní desce. Data zde proudí chaoticky. Musíme roztřídit signály, aby hardware fungoval správně. Roztřiď zařízení na VSTUPNÍ a VÝSTUPNÍ.",
    imagePrompt: "Inside a computer, motherbord landscape, giant cpu towers, golden circuits, flowing electricity, microscopic view",
    type: RoomType.PUZZLE_SORT,
    puzzleData: [
      { id: '1', text: 'Klávesnice', category: 'INPUT' },
      { id: '2', text: 'Monitor', category: 'OUTPUT' },
      { id: '3', text: 'Myš', category: 'INPUT' },
      { id: '4', text: 'Tiskárna', category: 'OUTPUT' },
      { id: '5', text: 'Mikrofon', category: 'INPUT' },
      { id: '6', text: 'Reproduktory', category: 'OUTPUT' }
    ] as SortingItem[]
  },
  {
    id: 2,
    title: "3. Binární Tunel",
    description: "Výborně! Hardware je stabilní. Cesta k jádru ale vede přes starý Binární Tunel. Dveře jsou zamčené číselným kódem. Vidíš na zdi napsáno: 101.",
    imagePrompt: "A dark tunnel made of green streaming binary numbers 0 and 1, matrix style, light at the end",
    type: RoomType.PUZZLE_LOCK,
    puzzleData: {
      code: "5",
      hint: "Převeď binární číslo 101 do desítkové soustavy. (1*4 + 0*2 + 1*1)"
    } as DigitalLockConfig
  },
  {
    id: 3,
    title: "4. Virová Karanténa",
    description: "Jsme blízko! Ale pozor, narazili jsme na karanténní zónu. Virus se snaží maskovat za běžné soubory. Musíš správně identifikovat příponu pro spustitelný program (aplikaci), abys virus izoloval.",
    imagePrompt: "A high tech quarantine lab, warning signs, red pulsing lights, digital glass cages containing glitches",
    type: RoomType.PUZZLE_QUIZ,
    puzzleData: {
      question: "Která přípona souboru označuje spustitelný program ve Windows?",
      options: [
        ".jpg",
        ".exe",
        ".docx",
        ".mp3"
      ],
      correctIndex: 1,
      feedback: "Výborně! .exe (executable) je spustitelný soubor. Ostatní jsou obrázek, dokument a hudba."
    } as QuizQuestion
  },
  {
    id: 4,
    title: "5. Jádro Systému",
    description: "Jsi v jádru! Je to tu... tiché. Abychom systém restartovali, musíme odemknout poslední zámek. Virus změnil přístupový kód na rok, kdy vznikl první web (WWW).",
    imagePrompt: "The core of a supercomputer, a glowing white orb of energy, suspended in a dark server room, cables connecting to it",
    type: RoomType.PUZZLE_LOCK,
    puzzleData: {
      code: "1991", // Usually attributed to 1991 public release or 1989 proposal, 1991 is common in elementary IT history
      hint: "Tim Berners-Lee zveřejnil první webovou stránku v srpnu roku 199_."
    } as DigitalLockConfig
  }
];
