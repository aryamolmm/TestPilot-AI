# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: generated.spec.ts >> should display error message for invalid credentials
- Location: tests\generated.spec.ts:12:4

# Error details

```
Error: toContainText can be only used with Locator object
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: Swag Labs
  - generic [ref=e5]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - textbox "Username" [ref=e11]: invalid_user
        - img [ref=e12]
      - generic [ref=e14]:
        - textbox "Password" [ref=e15]: invalid_sauce
        - img [ref=e16]
      - 'heading "Epic sadface: Username and password do not match any user in this service" [level=3] [ref=e19]':
        - button [ref=e20] [cursor=pointer]:
          - img [ref=e21]
        - text: "Epic sadface: Username and password do not match any user in this service"
      - button "Login" [active] [ref=e23] [cursor=pointer]
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "Accepted usernames are:" [level=4] [ref=e27]
        - text: standard_user
        - text: locked_out_user
        - text: problem_user
        - text: performance_glitch_user
        - text: error_user
        - text: visual_user
      - generic [ref=e28]:
        - heading "Password for all users:" [level=4] [ref=e29]
        - text: secret_sauce
```

# Test source

```ts
  1   | 
  2   |    import { test, expect } from '@playwright/test';
  3   | 
  4   |    test('should login successfully', async ({ page }) => {
  5   |      await page.goto('https://www.saucedemo.com/');
  6   |      await page.fill('input[name="user-name"]', 'standard_user');
  7   |      await page.fill('input[name="password"]', 'secret_sauce');
  8   |      await page.click('input[type="submit"]');
  9   |      await expect(page).toContainText('Products');
  10  |    });
  11  | 
  12  |    test('should display error message for invalid credentials', async ({ page }) => {
  13  |      await page.goto('https://www.saucedemo.com/');
  14  |      await page.fill('input[name="user-name"]', 'invalid_user');
  15  |      await page.fill('input[name="password"]', 'invalid_sauce');
  16  |      await page.click('input[type="submit"]');
> 17  |      await expect(page).toContainText('Epic sadface: Username and password do not match any user in this service');
      |                         ^ Error: toContainText can be only used with Locator object
  18  |    });
  19  | 
  20  |    test('should display error message for locked out user', async ({ page }) => {
  21  |      await page.goto('https://www.saucedemo.com/');
  22  |      await page.fill('input[name="user-name"]', 'locked_out_user');
  23  |      await page.fill('input[name="password"]', 'secret_sauce');
  24  |      await page.click('input[type="submit"]');
  25  |      await expect(page).toContainText('Epic sadface: Sorry, this user has been locked out.');
  26  |    });
  27  | 
  28  |    test('should display error message for problem user', async ({ page }) => {
  29  |      await page.goto('https://www.saucedemo.com/');
  30  |      await page.fill('input[name="user-name"]', 'problem_user');
  31  |      await page.fill('input[name="password"]', 'secret_sauce');
  32  |      await page.click('input[type="submit"]');
  33  |      await expect(page).toContainText('Products');
  34  |      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  35  |    });
  36  | 
  37  |    test('should display error message for performance glitch user', async ({ page }) => {
  38  |      await page.goto('https://www.saucedemo.com/');
  39  |      await page.fill('input[name="user-name"]', 'performance_glitch_user');
  40  |      await page.fill('input[name="password"]', 'secret_sauce');
  41  |      await page.click('input[type="submit"]');
  42  |      await expect(page).toContainText('Products');
  43  |      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  44  |    });
  45  | 
  46  |    test('should display products after successful login', async ({ page }) => {
  47  |      await page.goto('https://www.saucedemo.com/');
  48  |      await page.fill('input[name="user-name"]', 'standard_user');
  49  |      await page.fill('input[name="password"]', 'secret_sauce');
  50  |      await page.click('input[type="submit"]');
  51  |      await expect(page).toContainText('Sauce Labs Backpack');
  52  |    });
  53  | 
  54  |    test('should be able to add product to cart', async ({ page }) => {
  55  |      await page.goto('https://www.saucedemo.com/');
  56  |      await page.fill('input[name="user-name"]', 'standard_user');
  57  |      await page.fill('input[name="password"]', 'secret_sauce');
  58  |      await page.click('input[type="submit"]');
  59  |      await page.click('button[name="add-to-cart-sauce-labs-backpack"]');
  60  |      await expect(page.locator('span[class="shopping_cart_badge"]')).toContainText('1');
  61  |    });
  62  | 
  63  |    test('should be able to add multiple products to cart', async ({ page }) => {
  64  |      await page.goto('https://www.saucedemo.com/');
  65  |      await page.fill('input[name="user-name"]', 'standard_user');
  66  |      await page.fill('input[name="password"]', 'secret_sauce');
  67  |      await page.click('input[type="submit"]');
  68  |      await page.click('button[name="add-to-cart-sauce-labs-backpack"]');
  69  |      await page.click('button[name="add-to-cart-sauce-labs-bike-light"]');
  70  |      await expect(page.locator('span[class="shopping_cart_badge"]')).toContainText('2');
  71  |    });
  72  | 
  73  |    test('should be able to remove product from cart', async ({ page }) => {
  74  |      await page.goto('https://www.saucedemo.com/');
  75  |      await page.fill('input[name="user-name"]', 'standard_user');
  76  |      await page.fill('input[name="password"]', 'secret_sauce');
  77  |      await page.click('input[type="submit"]');
  78  |      await page.click('button[name="add-to-cart-sauce-labs-backpack"]');
  79  |      await page.click('button[name="remove-sauce-labs-backpack"]');
  80  |      await expect(page.locator('span[class="shopping_cart_badge"]')).toContainText('0');
  81  |    });
  82  | 
  83  |    test('should be able to remove multiple products from cart', async ({ page }) => {
  84  |      await page.goto('https://www.saucedemo.com/');
  85  |      await page.fill('input[name="user-name"]', 'standard_user');
  86  |      await page.fill('input[name="password"]', 'secret_sauce');
  87  |      await page.click('input[type="submit"]');
  88  |      await page.click('button[name="add-to-cart-sauce-labs-backpack"]');
  89  |      await page.click('button[name="add-to-cart-sauce-labs-bike-light"]');
  90  |      await page.click('button[name="remove-sauce-labs-backpack"]');
  91  |      await page.click('button[name="remove-sauce-labs-bike-light"]');
  92  |      await expect(page.locator('span[class="shopping_cart_badge"]')).toContainText('0');
  93  |    });
  94  | 
  95  |    test('should check cart total after adding and removing products', async ({ page }) => {
  96  |      await page.goto('https://www.saucedemo.com/');
  97  |      await page.fill('input[name="user-name"]', 'standard_user');
  98  |      await page.fill('input[name="password"]', 'secret_sauce');
  99  |      await page.click('input[type="submit"]');
  100 |      await page.click('button[name="add-to-cart-sauce-labs-backpack"]');
  101 |      await page.click('button[name="add-to-cart-sauce-labs-bike-light"]');
  102 |      await page.click('a[class="shopping_cart_link"]');
  103 |      await expect(page.locator('div[class="inventory_item_price"]')).toContainText('$29.99');
  104 |      await expect(page.locator('div[class="inventory_item_price"]')).toContainText('$9.99');
  105 |      await page.click('button[name="remove-sauce-labs-backpack"]');
  106 |      await expect(page.locator('div[class="inventory_item_price"]')).toContainText('$9.99');
  107 |    });
  108 | 
  109 |    test('should check product details page', async ({ page }) => {
  110 |      await page.goto('https://www.saucedemo.com/');
  111 |      await page.fill('input[name="user-name"]', 'standard_user');
  112 |      await page.fill('input[name="password"]', 'secret_sauce');
  113 |      await page.click('input[type="submit"]');
  114 |      await page.click('div[class="inventory_item_name"]');
  115 |      await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
  116 |    });
  117 | 
```