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

async function installApiFixtures(page) {
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

for (const viewport of viewports) {
  test(`all routes fit ${viewport.name}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await installApiFixtures(page);

    for (const route of routes) {
      await page.goto(route.path);

      if (route.path === '/login') {
        await expect(page.getByText(route.marker)).toBeVisible();
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
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Products Catalog', exact: true })).toBeVisible();
  await expect(page.getByText('Test Product 1').first()).toBeVisible();
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
