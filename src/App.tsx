import { Categories, Footer, GameCard, GameRanking, Header, Sidebar, SquircleClip } from './components';
import { assets, collectionDescription, featuredGames, introduction, mobileAssets } from './data';

/** One responsive collection page implementing the two supplied Figma frames. */
export function App() {
  return <>
    <SquircleClip />
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Sidebar />
    <div className="page-shell">
      <Header />
      <main id="main-content" className="collection">
        <picture className="hero"><source media="(max-width: 767px)" srcSet={mobileAssets.imgSuperellipseN5} /><img src={assets.hero.imgSuperellipseN5} alt="A collage of the collection: a racing supercar, blocky sandbox worlds, a puzzle maze, a pirate ship, and a shooter" width="1600" height="900" fetchPriority="high" /></picture>
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
