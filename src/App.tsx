import assets from './assets.json';
import { Categories, Footer, GameCard, GameRanking, Header, Sidebar, SquircleClip } from './components';
import { collectionDescription, featuredGames, introduction, mobileAssets } from './data';

/** One responsive collection page implementing the two supplied Figma frames. */
export function App() {
  return <>
    <SquircleClip />
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Sidebar />
    <div className="page-shell">
      <Header />
      <main id="main-content" className="collection">
        <picture className="hero"><source media="(max-width: 767px)" srcSet={mobileAssets.imgSuperellipseN5} /><img src={assets.hero.imgSuperellipseN5} alt="Best 20 browser games, September 2026 — a colorful collection of adventure, puzzle, racing, and space games" width="600" height="338" fetchPriority="high" /></picture>
        <h1>Best 20 Browser Games<br />in September 2026</h1>
        <p className="introduction">{introduction}</p>
        <GameRanking />
        <p className="collection-description">{collectionDescription}</p>
        <section className="featured-games" aria-label="Featured games">
          {featuredGames.map(game => <GameCard key={game.rank} game={game} />)}
        </section>
        <Categories />
      </main>
      <Footer />
    </div>
  </>;
}
