import { expect, test } from '@playwright/test';

for (const width of [320, 390, 768, 1200, 1600]) {
  test('collection lays out correctly at ' + width + 'px', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Best 20 Browser Gamesin September 2026');
    await expect(page.locator('.game-ranking > li')).toHaveCount(20);
    await expect(page.locator('.game-card:visible')).toHaveCount(20);
    await expect(page.locator('.sidebar')).toBeVisible({ visible: width >= 768 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const ranks = await page.locator('.game-ranking .rank').allTextContents();
    expect(ranks).toEqual(Array.from({ length: 20 }, (_, index) => String(index + 1)));
    // One column below 768, two above it.
    const expectedColumns = width < 768 ? 1 : 2;
    const columns = new Set(await page.locator('.game-ranking li').evaluateAll(
      items => items.map(item => Math.round(item.getBoundingClientRect().x))));
    expect(columns.size).toBe(expectedColumns);
    const first = await page.locator('.game-ranking li').nth(0).boundingBox();
    const second = await page.locator('.game-ranking li').nth(1).boundingBox();
    // Ranks run down each column, so 2 always sits below 1.
    expect(second!.x).toBe(first!.x);
    expect(second!.y).toBeGreaterThan(first!.y);
    expect(await page.locator('.game-ranking').evaluate(list => list.getBoundingClientRect().width))
      .toBeLessThanOrEqual(800);
    // The badge and the title must stay within the cover's height.
    const overflowing = await page.locator('.ranking-link').evaluateAll(links => links.filter(link => {
      const cover = link.querySelector('.ranking-cover')!.getBoundingClientRect();
      const rank = link.querySelector('.rank')!.getBoundingClientRect();
      const text = link.querySelector('.ranking-text')!.getBoundingClientRect();
      return rank.top < cover.top - 0.5 || text.bottom > cover.bottom + 0.5;
    }).length);
    expect(overflowing).toBe(0);
    await page.locator('.copyright').scrollIntoViewIfNeeded();
    for (const image of await page.locator('img:visible').all()) {
      if (!(await image.evaluate(image => image.complete && image.naturalWidth > 0))) {
        await image.scrollIntoViewIfNeeded();
      }
    }
    await expect.poll(() => page.locator('img:visible').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
    expect(errors).toEqual([]);
    if (width === 1200 || width === 390) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: 'test-results/collection-' + width + '.png', fullPage: true });
    }
  });
}

for (const width of [390, 1200]) {
  test('search works with keyboard and restores focus at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Search games', exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const input = page.getByRole('searchbox', { name: 'Search the collection' });
    await expect(input).toBeFocused();
    await input.fill('a game that does not exist');
    await expect(dialog.getByRole('status')).toHaveText('No games found');
    await dialog.getByRole('button', { name: 'Show all games' }).click();
    await expect(dialog.locator('.search-results li')).toHaveCount(20);
    await input.fill('MELON');
    await expect(dialog.locator('.search-results li')).toHaveCount(1);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
}

for (const width of [390, 1200]) {
  test('cards preview and highlight as they scroll into view at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const clips: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/games/video/')) clips.push(request.url().split('/').pop()!);
    });
    await page.goto('/');
    // Nothing is fetched until a card is reached.
    expect(clips).toEqual([]);

    const second = page.locator('#game-2');
    await second.scrollIntoViewIfNeeded();
    const badge = second.locator('.game-position:visible');
    await expect(badge).toHaveClass(/in-view/);
    await expect(badge).toHaveCSS('background-color', 'rgb(243, 234, 255)');
    await expect(badge).toHaveCSS('color', 'rgb(13, 13, 15)');
    await expect.poll(() => second.locator('video').evaluate(
      (video: HTMLVideoElement) => !video.paused && video.currentTime > 0)).toBe(true);
    expect(clips).toContain('mr-racer-car-racing.mp4');

    // First place keeps its gold even while it is on screen.
    const first = page.locator('#game-1');
    await first.scrollIntoViewIfNeeded();
    const gold = first.locator('.game-position:visible');
    await expect(gold).toHaveClass(/in-view/);
    await expect(gold).toHaveCSS('background-color', 'rgb(255, 200, 80)');
  });
}

test('play and language links have usable destinations', async ({ page }) => {
  await page.goto('/');
  for (const button of await page.getByRole('link', { name: 'Play now — Melon Sandbox' }).all()) {
    await expect(button).toHaveAttribute('href', 'https://playgama.com/game/melon-sandbox');
  }
  await expect(page.getByRole('link', { name: 'Español', exact: true })).toHaveAttribute('href', 'https://playgama.com/es');
  expect(await page.locator('a').evaluateAll(links => links.every(link => link.getAttribute('href') && link.getAttribute('href') !== '#'))).toBe(true);
});
