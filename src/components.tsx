import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import { SQUIRCLE_PATH } from './squircle';
import {
  APP_URL, aboutDescription, assets, categories, categoryUrl, companyLinks, footerCategories,
  games, languages, mobileAssets, sidebarLinks, socialLinks, type Game,
} from './data';

/** Reports whether the element is on screen, driving the badge state and the previews. */
function useInView<T extends HTMLElement>(amount: number) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting), { threshold: amount },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [amount]);
  return [ref, inView] as const;
}

/** The superellipse Playgama masks its cover art with; referenced from CSS. */
export function SquircleClip() {
  return <svg className="squircle-defs" aria-hidden="true" focusable="false">
    <defs><clipPath id="pg-squircle" clipPathUnits="objectBoundingBox"><path d={SQUIRCLE_PATH} /></clipPath></defs>
  </svg>;
}

/** Renders an unmodified Figma export in a consistently sized icon box. */
export function Icon({ src, className = '' }: { src: string; className?: string }) {
  return <img className={'icon ' + className} src={src} alt="" aria-hidden="true" width="24" height="24" />;
}

/** Compact desktop category rail from the 1200 px reference. */
export function Sidebar() {
  return <aside className="sidebar" aria-label="Game navigation">
    <a href="/" className="home-icon" aria-label="Playgama home"><Icon src={assets.sidebar.imgFennec} /></a>
    <nav aria-label="Game categories" className="sidebar-links">
      {sidebarLinks.map(([label, path, src]) => <a key={label} href={'https://playgama.com/' + path} aria-label={label} title={label}>
        <Icon src={src} /><span className="rail-tooltip" aria-hidden="true">{label}</span>
      </a>)}
    </nav>
  </aside>;
}

/** Responsive navigation with an accessible native search dialog. */
export function Header() {
  const dialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const results = games.filter(game => game.title.toLowerCase().includes(query.trim().toLowerCase()));

  function openSearch() {
    setQuery('');
    dialog.current?.showModal();
    searchInput.current?.focus();
  }

  return <>
    <header className="header">
      <button type="button" className="mobile-search" aria-label="Search games" onClick={openSearch}><Icon src={mobileAssets.imgMagnifyingGlass} /></button>
      <a className="brand" href="/" aria-label="Playgama home"><img src={assets.header.imgPlaygama} alt="Playgama" width="148" height="32" /></a>
      <button type="button" className="desktop-search" onClick={openSearch} aria-label="Search games"><Icon src={assets.header.imgMagnifyingGlass} /><span>Search</span></button>
      <a className="app-link" href={APP_URL} aria-label="Get the Playgama app"><Icon src={assets.header.imgApple} /><Icon src={assets.header.imgPlayIcon} /></a>
      <a className="header-circle desktop-only" href="https://playgama.com/steam-games" aria-label="Steam games"><Icon src={assets.header.imgGroup} /></a>
      <a className="header-circle youtube desktop-only" href="https://www.youtube.com/@playgama" aria-label="Playgama on YouTube"><Icon src={assets.header.imgGroup2085660674} /></a>
      <a className="no-ads" href="https://playgama.com/" aria-label="Explore ad-free play on Playgama">
        <span className="no-ads-timer"><strong>30</strong><span>DAYS</span></span>
        <img className="no-ads-mobile" src={mobileAssets.imgNoAds} alt="No ads" width="48" height="48" />
      </a>
      <a className="account" href="https://playgama.com/profile" aria-label="Log in on Playgama"><img src={assets.header.imgAva} alt="" width="52" height="52" /><span>Login</span></a>
      <nav className="business-nav" aria-label="Company">
        <div><a className="publishers" href="https://playgama.com/business">Publishers</a><a className="developers" href="https://playgama.com/developers">Developers</a></div>
        <div><a className="partners" href="https://playgama.com/business">Partners</a><a className="blog" href="https://playgama.com/blog">Blog</a><a className="contacts" href="https://playgama.com/contacts">Contacts</a></div>
      </nav>
    </header>
    <dialog ref={dialog} className="search-dialog" aria-labelledby="search-title" onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); dialog.current?.close(); } }} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <div className="search-panel">
        <div className="search-heading"><h2 id="search-title">Find your next game</h2><button type="button" className="close-button" onClick={() => dialog.current?.close()} aria-label="Close search">×</button></div>
        <label className="search-input"><Icon src={mobileAssets.imgMagnifyingGlass} /><input ref={searchInput} type="search" placeholder="Search games" aria-label="Search the collection" value={query} onChange={event => setQuery(event.target.value)} /></label>
        <p className="search-count" role="status">{results.length ? results.length + ' games in this collection' : 'No games found'}</p>
        {results.length ? <ul className="search-results">{results.map(game => <li key={game.rank}><a href={game.href}><img src={game.image} alt="" width="48" height="48" /><span><strong>{game.title}</strong><small>#{game.rank} in September’s collection</small></span></a></li>)}</ul>
          : <div className="search-empty"><p>Try “game” or “Melon Sandbox”.</p><button type="button" onClick={() => setQuery('')}>Show all games</button></div>}
      </div>
    </dialog>
  </>;
}

/** Keeps the ranking in numeric DOM order while CSS flows it down columns. */
export function GameRanking() {
  return <ol className="game-ranking" aria-label="Top 20 browser games">
    {games.map(game => <li key={game.rank} value={game.rank}><a className="ranking-link" href={game.href} aria-label={'Play ' + game.title + ', ranked ' + game.rank}>
      <img className="ranking-cover" src={game.image} alt="" width="80" height="80" loading="lazy" />
      <span className="ranking-body">
        <span className={'rank' + (game.rank === 1 ? ' first' : '')}>{game.rank}</span>
        <span className="ranking-text">
          <span className="ranking-title">{game.title}</span>
          <span className="ranking-category">{game.category}</span>
        </span>
      </span>
    </a></li>)}
  </ol>;
}

/**
 * Featured game card. The 1200 frame leads with the cover and overlays the rank
 * on it; the 390 frame leads with the rank and title, so both badges are in the
 * markup and each breakpoint hides the one it does not use.
 */
export function GameCard({ game }: { game: Game & { cover: string } }) {
  const id = 'game-' + game.rank;
  const badge = <><span className="sr-only">Rank </span>{game.rank}</>;
  const first = game.rank === 1 ? ' first' : '';
  const [cardRef, inView] = useInView<HTMLElement>(0.3);
  const video = useRef<HTMLVideoElement>(null);
  // The clip is only fetched once the card has been reached, then played while it shows.
  const [reached, setReached] = useState(false);
  useEffect(() => { if (inView) setReached(true); }, [inView]);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (inView && !still) element.play().catch(() => {});
    else element.pause();
  }, [inView, reached]);
  const state = first + (inView ? ' in-view' : '');
  return <article className="game-card" id={id} aria-labelledby={id + '-title'} ref={cardRef}>
    <div className="card-cover">
      <a className="game-cover-link" href={game.href} tabIndex={-1} aria-hidden="true">
        {game.video
          ? <video className="game-cover" ref={video} poster={game.cover} src={reached ? game.video : undefined}
              width={600} height={338} muted loop playsInline preload="none" />
          : <img className="game-cover" src={game.cover} alt="" width="600" height="338" loading="lazy" />}
      </a>
      <span className={'game-position on-cover' + state}>{badge}</span>
    </div>
    <div className="game-heading">
      <span className={'game-position inline-badge' + state}>{badge}</span>
      <img className="game-icon" src={game.image} alt="" width="56" height="56" loading="lazy" />
      <div className="game-heading-text">
        <h2 id={id + '-title'}>{game.title}</h2>
        <p>{game.category}</p>
      </div>
    </div>
    <a className="play-button" href={game.href}>Play now<span className="sr-only"> — {game.title}</span></a>
    <div className="game-details">
      <dl className="game-facts">
        <div className="fact-platform"><dt>Platform:</dt><dd>{game.platforms}</dd></div>
        <div className="fact-update"><dt>Last Update:</dt><dd>{game.updatedAt}</dd></div>
        <div className="fact-series"><dt>Series:</dt><dd>{game.relatedLinks.map((link, index) =>
          <Fragment key={link.href}>{index > 0 && ', '}<a href={link.href}>{link.label}</a></Fragment>)}</dd></div>
      </dl>
      <ul className="game-tags" aria-label="Game tags">{game.tags.map(tag =>
        <li key={tag.href}><a href={tag.href}>{tag.label} <span>{tag.count}</span></a></li>)}</ul>
      <p className="game-description">{game.description}</p>
    </div>
  </article>;
}

/** Category links share the desktop icons and the compact mobile artwork. */
export function Categories() {
  return <section className="categories" id="categories" aria-labelledby="categories-title"><div className="categories-copy"><h2 id="categories-title">Free Online Games at Playgama</h2><p>{aboutDescription}</p></div>
    <nav className="category-links" aria-label="Explore categories">{categories.map(category => <a key={category.label} className={'category-pill category-' + (category.slug || 'all')} style={{ '--mobile-order': category.mobileOrder } as CSSProperties} href={categoryUrl(category.slug)}>
      <picture><source media="(max-width: 767px)" srcSet={mobileAssets.imgFennecCircle} /><Icon src={category.icon} /></picture>{category.label}
    </a>)}</nav>
  </section>;
}

/** Responsive directory, social links, and language navigation. */
export function Footer() {
  const quickLinks = [['New games', '/category/new'], ['Trending now', '/category/trending_now'], ['Random games', '/random'], ['All series', '/all/series'], ['All tags', '/all/tags']];
  return <footer className="footer">
    <a className="mobile-app-banner" href={APP_URL}><img src={mobileAssets.imgBadges} alt="Get it on Google Play" width="166" height="48" /><span>Games on your<br />Phone or Tablet</span><Icon src={mobileAssets.imgChevronRight} /></a>
    <nav className="footer-quick" aria-label="Explore Playgama">{quickLinks.map(([label, path]) => <a key={label} href={'https://playgama.com' + path}>{label}</a>)}</nav>
    <div className="footer-directory"><nav className="footer-company" aria-label="About Playgama">{companyLinks.map(([label, path]) => <a key={label} href={'https://playgama.com' + path}>{label}</a>)}</nav><nav className="footer-categories" aria-label="All game categories">{footerCategories.map(([label, slug]) => <a key={label} href={categoryUrl(slug)}>{label}</a>)}</nav></div>
    <nav className="social-links" aria-label="Social media">{socialLinks.map(([label, asset, href]) => <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer"><Icon src={assets.footer[('imgSocial' + asset) as keyof typeof assets.footer]} /></a>)}</nav>
    <nav className="language-links" aria-label="Language">{languages.map(([label, flag, code]) => <a key={label} className={'language' + (!code ? ' selected' : '')} href={'https://playgama.com/' + code} hrefLang={code || 'en'} aria-current={!code ? 'true' : undefined}><Icon src={assets.footer[('imgFlag' + flag) as keyof typeof assets.footer]} /><span>{label}</span></a>)}</nav>
    <p className="copyright">© Playgama, 2025</p>
  </footer>;
}
