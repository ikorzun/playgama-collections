import assets from './assets.json';
import categoryIcons from './category-icons.json';
import catalogue from './games.json';

export const mobileAssets = assets['reference-0'];
export const GAME_URL = 'https://playgama.com/game/melon-sandbox';
export const APP_URL = 'https://play.google.com/store/apps/details?id=com.playgama.twa';

/** Maps the labels in the reference to the live catalog's category paths. */
export function categoryUrl(slug: string) {
  const aliases: Record<string, string> = { '2-player': 'two-player', 'for-girls': 'girls', 'for-boys': 'boys' };
  return 'https://playgama.com/' + (slug ? 'category/' + (aliases[slug] || slug) : 'all/categories');
}

export type GameLink = { label: string; href: string };
export type GameTag = { label: string; count: string; href: string };

/** One entry of the Playgama collection catalogue in `games.json`. */
export type Game = {
  rank: number;
  slug: string;
  title: string;
  href: string;
  /** Square catalogue icon, used by the ranking and the search results. */
  image: string;
  /** 16:9 artwork; only the games shown as full cards carry one. */
  cover: string | null;
  category: string;
  platforms: string;
  updatedAt: string;
  relatedLinks: GameLink[];
  tags: GameTag[];
  sourceDescription: string;
  /** The catalogue's full write-up — at least four sentences. */
  description: string;
  /** Catalogue preview clip, played while the card is on screen. */
  video: string | null;
};

/** The ranked collection: real Playgama titles, artwork, tags, and copy. */
export const games: Game[] = catalogue as Game[];

/** The games the frames show as full cards — the ones with 16:9 artwork. */
export const featuredGames = games.filter(
  (game): game is Game & { cover: string } => Boolean(game.cover),
);

export const introduction = "The beauty of today's snake games lies in their variety. Apple Snake keeps things refreshingly simple — sometimes you just want pure, unadulterated snake action without bells and whistles.";
export const gameDescription = "Okay, let me be honest — I never thought I'd get this excited about moving a pixelated worm around a screen again. But here we are, and snake games are having a serious moment. Remember when Nokia 3310 ruled the world? Yeah, that little green snake was probably your first gaming addiction.";
export const collectionDescription = gameDescription + " What's fascinating is how this simple concept — eat, grow, don't crash — has evolved into something way more complex and addictive. Modern snake games aren't just about nostalgia anymore. They're strategic, competitive, and honestly? Some of them will make you question your reflexes in ways you didn't know were possible.";
export const aboutDescription = 'Playgama features the latest and best free online games. You can enjoy playing fun games without interruptions from downloads, intrusive ads, or pop-ups. Just load up your favorite games instantly in your web browser and enjoy the experience.';

export const tags = [
  { label: 'Construct Games Online', count: '126', slug: 'construct' },
  { label: 'Cute', count: '54', slug: 'cute' },
  { label: 'Action', count: '2354', slug: 'action' },
  { label: 'Arena Games', count: '4110', slug: 'arena' },
  { label: 'Robot', count: '509', slug: 'robot' },
  { label: 'Battle', count: '10 289', slug: 'battle' },
];

const sidebarIcons = assets.sidebar;
export const sidebarLinks = [
  ['My games', 'profile', sidebarIcons.imgHeart],
  ['Action', 'category/action', sidebarIcons.imgCategoryAction],
  ['Adventure', 'category/adventure', sidebarIcons.imgCategoryAdventure],
  ['Apps', 'category/apps', sidebarIcons.imgCategoryApps],
  ['Arcade', 'category/arcade', sidebarIcons.imgCategoryArcade],
  ['Baby', 'category/baby', sidebarIcons.imgCategoryBaby],
  ['Balloons', 'category/balloon', sidebarIcons.imgCategoryBalloon],
  ['Match 3', 'category/match-3', sidebarIcons.imgCategoryBejeweled],
  ['For boys', 'category/boys', sidebarIcons.imgCategoryBoys],
  ['Cards', 'category/cards', sidebarIcons.imgCategoryCards],
  ['Casino', 'category/casino', sidebarIcons.imgCategoryCasino],
  ['Clicker', 'category/clicker', sidebarIcons.imgCategoryClicker],
  ['Skill', 'category/skill', sidebarIcons.imgCategoryCompleteReg],
  ['Cooking', 'category/cooking', sidebarIcons.imgCategoryCook],
  ['Drawing', 'category/drawing', sidebarIcons.imgCategoryDrawing],
  ['Economic', 'category/economic', sidebarIcons.imgCategoryEconomic],
  ['Educational', 'category/educational', sidebarIcons.imgCategoryEducation],
  ['Farming', 'category/farming', sidebarIcons.imgCategoryFarming],
  ['For girls', 'category/girls', sidebarIcons.imgCategoryGirls],
  ['Horror', 'category/horror', sidebarIcons.imgCategoryHorror],
  ['Hypercasual', 'category/hypercasual', sidebarIcons.imgCategoryHypercasual],
  ['.io', 'category/io', sidebarIcons.imgCategoryIo],
] as const;

export const categories = [
  { label: 'Action', slug: 'action', icon: sidebarIcons.imgCategoryAction, mobileOrder: 1 },
  { label: 'Funny', slug: 'funny', icon: categoryIcons.funny, mobileOrder: 4 },
  { label: '2 Player', slug: '2-player', icon: categoryIcons['2-player'], mobileOrder: 9 },
  { label: 'Simulation', slug: 'simulation', icon: categoryIcons.simulation, mobileOrder: 2 },
  { label: 'Sports', slug: 'sports', icon: categoryIcons.sports, mobileOrder: 3 },
  { label: 'For Girls', slug: 'for-girls', icon: sidebarIcons.imgCategoryGirls, mobileOrder: 10 },
  { label: 'Clicker', slug: 'clicker', icon: sidebarIcons.imgCategoryClicker, mobileOrder: 5 },
  { label: 'Solitaire', slug: 'solitaire', icon: sidebarIcons.imgCategoryCards, mobileOrder: 8 },
  { label: 'Snake', slug: 'snake', icon: categoryIcons.snake, mobileOrder: 11 },
  { label: '.io', slug: 'io', icon: sidebarIcons.imgCategoryIo, mobileOrder: 7 },
  { label: 'Racing', slug: 'racing', icon: categoryIcons.racing, mobileOrder: 6 },
  { label: 'Shooter', slug: 'shooting', icon: categoryIcons.shooting, mobileOrder: 12 },
  { label: 'All Categories', slug: '', icon: categoryIcons.all, mobileOrder: 13 },
];

export const footerCategories = [
  ['.io', 'io'], ['2 Player', '2-player'], ['Action', 'action'], ['Adventure', 'adventure'],
  ['Arcade', 'arcade'], ['Balloons', 'balloon'], ['Boys', 'for-boys'], ['Cards', 'cards'],
  ['Casino', 'casino'], ['Economic', 'economic'], ['Educational', 'educational'], ['Girls', 'for-girls'],
  ['Horrors', 'horror'], ['Hypercasual', 'hypercasual'], ['Imitations', 'simulation'], ['Kids', 'kids'],
  ['Match3', 'match-3'], ['Midcore', 'midcore'], ['Puzzle', 'puzzle'], ['Quiz', 'quiz'],
  ['Racing', 'racing'], ['Role', 'role-playing'], ['Simulator', 'simulation'], ['Sports', 'sports'],
  ['Strategy', 'strategy'], ['Tabletop', 'tabletop'], ['Tests', 'tests'], ['All games', ''],
] as const;

export const companyLinks = [
  ['Gift cards', '/gift-cards'], ['Blog', '/blog'], ['Developers', '/developers'],
  ['Advertisers', '/adv'], ['Publishers', '/business'], ['Contact us', '/contacts'],
  ['Privacy Policy', '/confidential'], ['Takedown notice', '/takedown-notice'],
] as const;

export const languages = [
  ['English', 'UnitedStates', ''], ['Español', 'Spain', 'es'], ['Deutsch', 'Germany', 'de'],
  ['Français', 'France', 'fr'], ['Italiano', 'Italy', 'it'], ['Português', 'Brazil', 'br'],
  ['Türkçe', 'Turkey', 'tr'], ['Polski', 'Poland', 'pl'], ['Indonesia', 'Indonesia', 'id'],
] as const;

export const socialLinks = [
  ['Discord', 'Discord', 'https://discord.com/invite/pzqd2upxr8'],
  ['Bluesky', 'Bluesky', 'https://bsky.app/profile/playgama.bsky.social'],
  ['Facebook', 'Facebook', 'https://www.facebook.com/playgamagames'],
  ['X', 'X', 'https://x.com/PlaygamaCom'],
  ['Instagram', 'Insta', 'https://www.instagram.com/playgama/'],
  ['YouTube', 'Youtube', 'https://www.youtube.com/@playgama'],
  ['TikTok', 'Tiktok', 'https://www.tiktok.com/@playgama'],
  ['LinkedIn', 'LinkedIn', 'https://www.linkedin.com/company/playgama/'],
  ['Telegram', 'Telegram', 'https://t.me/playgama_bridge'],
  ['GitHub', 'Github', 'https://github.com/playgama/bridge'],
] as const;
