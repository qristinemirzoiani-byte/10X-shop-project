import { expect, test } from '@playwright/test';

const product = {
  id: 1,
  title: 'Test Product',
  description: 'A product used for responsive browser checks.',
  category: 'beauty',
  brand: '10X',
  price: 99.99,
  discountPercentage: 0,
  rating: 4.5,
  stock: 10,
  thumbnail: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
  images: ['data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='],
  reviews: [],
};

const products = Array.from({ length: 12 }, (_, index) => ({
  ...product,
  id: index + 1,
  title: `Test Product ${index + 1}`,
}));

const cartItem = {
  productId: product.id,
  title: product.title,
  price: product.price,
  discountPercentage: product.discountPercentage,
  thumbnail: product.thumbnail,
  quantity: 1,
  stock: product.stock,
};

const testOrder = {
  id: 123,
  number: '10X-00123',
  items: [cartItem],
  shipping: {
    fullName: 'Demo User',
    email: 'demo@example.com',
    phone: '5551234',
    address: '1 Main Street',
    city: 'Tbilisi',
    country: 'Georgia',
  },
  subtotal: 99.99,
  discount: 0,
  shippingCost: 0,
  total: 99.99,
  placedAt: '2026-01-01T12:00:00.000Z',
};

const routes = [
  { path: '/', marker: 'Products Catalog' },
  { path: '/products/1', marker: 'Test Product' },
  { path: '/cart', marker: 'Shopping Cart' },
  { path: '/checkout', marker: 'Checkout' },
  { path: '/orders', marker: 'Orders History' },
  { path: '/orders/123', marker: 'Order #10X-00123' },
  { path: '/profile', marker: 'User Profile' },
  { path: '/login', marker: 'Sign in to your account' },
];

const viewports = [
  { name: 'mobile 375px', width: 375, height: 812 },
  { name: 'tablet 768px', width: 768, height: 812 },
  { name: 'desktop 1280px', width: 1280, height: 812 },
];

async function installApiFixtures(page, { seedSession = true } = {}) {
  await page.route('https://dummyjson.com/**', async (route) => {
    const url = new URL(route.request().url());
    let body;

    if (url.pathname === '/products/categories') {
      body = [{ slug: 'beauty', name: 'Beauty', url: 'https://dummyjson.com/products/category/beauty' }];
    } else if (url.pathname === '/products/1') {
      body = product;
    } else {
      body = { products, total: 194, skip: 0, limit: 12 };
    }

    await route.fulfill({ json: body });
  });

  if (seedSession) {
    await page.addInitScript(({ user, cart, orders }) => {
      localStorage.setItem('shop_user', JSON.stringify(user));
      localStorage.setItem('shop_cart', JSON.stringify(cart));
      localStorage.setItem('shop_orders', JSON.stringify(orders));
    }, {
      user: {
        username: 'demo',
        isLoggedIn: true,
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        phone: '5551234',
      },
      cart: { items: [cartItem], promoCode: null },
      orders: [testOrder],
    });
  }
}

for (const viewport of viewports) {
  test(`all routes fit ${viewport.name}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await installApiFixtures(page);

    for (const route of routes) {
      await page.goto(route.path, { waitUntil: 'commit' });

      if (route.path === '/login') {
        await expect(page.getByText(route.marker)).toBeVisible();
      } else if (route.path === '/products/1') {
        await expect(page.getByRole('heading', { name: route.marker, exact: true })).toBeVisible({ timeout: 60_000 });
      } else {
        await expect(page.getByRole('heading', { name: route.marker, exact: true })).toBeVisible();
      }

      const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(documentWidth, `${route.path} overflows at ${viewport.width}px`).toBeLessThanOrEqual(viewport.width);

      if (viewport.width === 375) {
        const smallControls = await page.locator('button, input, select, textarea').evaluateAll((controls) =>
          controls.filter((control) => {
            const rect = control.getBoundingClientRect();
            const style = getComputedStyle(control);
            return rect.width > 0
              && rect.height > 0
              && style.visibility !== 'hidden'
              && style.display !== 'none'
              && (rect.width < 44 || rect.height < 44);
          }).map((control) => ({
            tag: control.tagName,
            width: control.getBoundingClientRect().width,
            height: control.getBoundingClientRect().height,
          })),
        );
        expect(smallControls, `${route.path} has controls smaller than 44px`).toEqual([]);
      }
    }
  });
}

test('catalog grid matches documented CSS breakpoint thresholds', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 375, height: 812 });
  await installApiFixtures(page);
  await page.goto('/', { waitUntil: 'commit' });
  await expect(page.getByRole('heading', { name: 'Products Catalog', exact: true })).toBeVisible();
  await expect(page.getByText('Test Product 1').first()).toBeVisible();
  await expect(page.getByRole('img', { name: 'Test Product 1' }).first()).toHaveAttribute('loading', 'eager');
  await expect(page.getByRole('img', { name: 'Test Product 1' }).first()).toHaveAttribute('fetchpriority', 'high');
  await expect(page.getByRole('img', { name: 'Test Product 2' }).first()).toHaveAttribute('loading', 'lazy');
  await expect(page.locator('link[rel="preload"][as="image"][data-catalog-image-preload]')).toHaveAttribute('href', product.thumbnail);
  await expect(page.locator('main .grid').first().locator(':scope > *')).toHaveCount(12);
  const pagination = page.getByRole('navigation', { name: 'Pagination' });
  await expect(pagination).toBeVisible();
  const paginationButtonSizes = await pagination.getByRole('button').evaluateAll((buttons) =>
    buttons.map((button) => {
      const { width, height } = button.getBoundingClientRect();
      return { width, height };
    }),
  );
  expect(paginationButtonSizes.length).toBeGreaterThan(2);
  expect(paginationButtonSizes.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);

  const expectedColumns = new Map([
    [375, 1],
    [480, 1],
    [481, 2],
    [767, 2],
    [768, 3],
    [1024, 3],
    [1025, 4],
    [1280, 4],
  ]);

  for (const [width, columns] of expectedColumns) {
    await page.setViewportSize({ width, height: 812 });
    const actualColumns = await page.locator('main .grid').first().evaluate((grid) =>
      getComputedStyle(grid).gridTemplateColumns.split(' ').length,
    );
    expect(actualColumns, `${width}px grid columns`).toBe(columns);
  }
});

test('catalog categories use an accessible dropdown on mobile and tablet', async ({ page }) => {
  test.setTimeout(120_000);
  await installApiFixtures(page);

  for (const width of [375, 768]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/?page=1', { waitUntil: 'commit' });
    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }',
    });

    const menuButton = page.getByRole('button', { name: 'Browse categories. Current category: All Products' });
    const categoryNavigation = page.getByRole('navigation', { name: 'Sidebar categories' });

    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(categoryNavigation).toBeHidden();

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(categoryNavigation).toBeVisible();
    await expect(categoryNavigation.getByRole('button', { name: 'Beauty', exact: true })).toBeVisible();

    const menuWidth = await categoryNavigation.evaluate((element) => element.scrollWidth);
    const menuClientWidth = await categoryNavigation.evaluate((element) => element.clientWidth);
    expect(menuWidth, `category menu overflows horizontally at ${width}px`).toBeLessThanOrEqual(menuClientWidth);

    await categoryNavigation.getByRole('button', { name: 'Beauty', exact: true }).click();
    await expect(page).toHaveURL(/category=beauty/);
    await expect(categoryNavigation).toBeHidden();
  }
});

test('catalog keeps its category list visible on desktop', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1280, height: 812 });
  await installApiFixtures(page);
  await page.goto('/', { waitUntil: 'commit' });

  await expect(page.getByRole('button', { name: /Browse categories/ })).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Sidebar categories' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Sidebar categories' }).getByRole('button', { name: 'Beauty', exact: true })).toBeVisible();
});

test('guest can complete the catalog-to-order flow', async ({ page }) => {
  test.setTimeout(120_000);
  await installApiFixtures(page, { seedSession: false });
  await page.goto('/', { waitUntil: 'commit' });

  await expect(page.getByRole('heading', { name: 'Products Catalog', exact: true })).toBeVisible();
  await page.getByText('Test Product 1', { exact: true }).click({ force: true });
  await expect(page).toHaveURL(/\/products\/1$/);
  await expect(page.getByRole('heading', { name: 'Test Product', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Add to cart' }).click();

  await page.getByRole('link', { name: 'Cart with 1 items' }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByRole('heading', { name: 'Shopping Cart', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.locator('input[autocomplete="username"]').fill('demo');
  await page.locator('input[type="password"]').fill('demo-password');
  await page.getByRole('button', { name: 'Log In' }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole('heading', { name: 'Checkout', exact: true })).toBeVisible();
  await page.getByPlaceholder('e.g. John Doe').fill('Demo User');
  await page.getByPlaceholder('e.g. john@example.com').fill('demo@example.com');
  await page.getByPlaceholder('e.g. +995555123456').fill('+995555123456');
  await page.getByPlaceholder('Street name, building, apartment').fill('1 Main Street');
  await page.getByPlaceholder('e.g. Tbilisi').fill('Tbilisi');
  await page.getByPlaceholder('e.g. 0179').fill('0179');
  await page.getByRole('button', { name: /Place Order/ }).click();

  await expect(page.getByRole('heading', { name: 'Thank you! Your order has been placed.' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('shop_cart') || '{"items":[]}').items)).toEqual([]);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('shop_orders') || '[]').length)).toBe(1);
});
