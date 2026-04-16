# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: generated.spec.ts >> should be able to remove product from cart
- Location: tests\generated.spec.ts:73:4

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('span[class="shopping_cart_badge"]')
Expected substring: "0"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('span[class="shopping_cart_badge"]')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - button "Open Menu" [ref=e8] [cursor=pointer]
          - img "Open Menu" [ref=e9]
        - generic [ref=e11]: Swag Labs
      - generic [ref=e14]:
        - generic [ref=e15]: Products
        - generic [ref=e17] [cursor=pointer]:
          - generic [ref=e18]: Name (A to Z)
          - combobox [ref=e19]:
            - option "Name (A to Z)" [selected]
            - option "Name (Z to A)"
            - option "Price (low to high)"
            - option "Price (high to low)"
    - generic [ref=e23]:
      - generic [ref=e24]:
        - link "Sauce Labs Backpack" [ref=e26] [cursor=pointer]:
          - /url: "#"
          - img "Sauce Labs Backpack" [ref=e27]
        - generic [ref=e28]:
          - generic [ref=e29]:
            - link "Sauce Labs Backpack" [ref=e30] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e31]: Sauce Labs Backpack
            - generic [ref=e32]: carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.
          - generic [ref=e33]:
            - generic [ref=e34]: $29.99
            - button "Add to cart" [ref=e35] [cursor=pointer]
      - generic [ref=e36]:
        - link "Sauce Labs Bike Light" [ref=e38] [cursor=pointer]:
          - /url: "#"
          - img "Sauce Labs Bike Light" [ref=e39]
        - generic [ref=e40]:
          - generic [ref=e41]:
            - link "Sauce Labs Bike Light" [ref=e42] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e43]: Sauce Labs Bike Light
            - generic [ref=e44]: A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.
          - generic [ref=e45]:
            - generic [ref=e46]: $9.99
            - button "Add to cart" [ref=e47] [cursor=pointer]
      - generic [ref=e48]:
        - link "Sauce Labs Bolt T-Shirt" [ref=e50] [cursor=pointer]:
          - /url: "#"
          - img "Sauce Labs Bolt T-Shirt" [ref=e51]
        - generic [ref=e52]:
          - generic [ref=e53]:
            - link "Sauce Labs Bolt T-Shirt" [ref=e54] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e55]: Sauce Labs Bolt T-Shirt
            - generic [ref=e56]: Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.
          - generic [ref=e57]:
            - generic [ref=e58]: $15.99
            - button "Add to cart" [ref=e59] [cursor=pointer]
      - generic [ref=e60]:
        - link "Sauce Labs Fleece Jacket" [ref=e62] [cursor=pointer]:
          - /url: "#"
          - img "Sauce Labs Fleece Jacket" [ref=e63]
        - generic [ref=e64]:
          - generic [ref=e65]:
            - link "Sauce Labs Fleece Jacket" [ref=e66] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e67]: Sauce Labs Fleece Jacket
            - generic [ref=e68]: It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.
          - generic [ref=e69]:
            - generic [ref=e70]: $49.99
            - button "Add to cart" [ref=e71] [cursor=pointer]
      - generic [ref=e72]:
        - link "Sauce Labs Onesie" [ref=e74] [cursor=pointer]:
          - /url: "#"
          - img "Sauce Labs Onesie" [ref=e75]
        - generic [ref=e76]:
          - generic [ref=e77]:
            - link "Sauce Labs Onesie" [ref=e78] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e79]: Sauce Labs Onesie
            - generic [ref=e80]: Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.
          - generic [ref=e81]:
            - generic [ref=e82]: $7.99
            - button "Add to cart" [ref=e83] [cursor=pointer]
      - generic [ref=e84]:
        - link "Test.allTheThings() T-Shirt (Red)" [ref=e86] [cursor=pointer]:
          - /url: "#"
          - img "Test.allTheThings() T-Shirt (Red)" [ref=e87]
        - generic [ref=e88]:
          - generic [ref=e89]:
            - link "Test.allTheThings() T-Shirt (Red)" [ref=e90] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e91]: Test.allTheThings() T-Shirt (Red)
            - generic [ref=e92]: This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.
          - generic [ref=e93]:
            - generic [ref=e94]: $15.99
            - button "Add to cart" [ref=e95] [cursor=pointer]
  - contentinfo [ref=e96]:
    - list [ref=e97]:
      - listitem [ref=e98]:
        - link "Twitter" [ref=e99] [cursor=pointer]:
          - /url: https://twitter.com/saucelabs
      - listitem [ref=e100]:
        - link "Facebook" [ref=e101] [cursor=pointer]:
          - /url: https://www.facebook.com/saucelabs
      - listitem [ref=e102]:
        - link "LinkedIn" [ref=e103] [cursor=pointer]:
          - /url: https://www.linkedin.com/company/sauce-labs/
    - generic [ref=e104]: © 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy
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
  17  |      await expect(page).toContainText('Epic sadface: Username and password do not match any user in this service');
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
> 80  |      await expect(page.locator('span[class="shopping_cart_badge"]')).toContainText('0');
      |                                                                      ^ Error: expect(locator).toContainText(expected) failed
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
  118 |    test('should check product sorting', async ({ page }) => {
  119 |      await page.goto('https://www.saucedemo.com/');
  120 |      await page.fill('input[name="user-name"]', 'standard_user');
  121 |      await page.fill('input[name="password"]', 'secret_sauce');
  122 |      await page.click('input[type="submit"]');
  123 |      await page.selectOption('select[data-test="product_sort_container"]', 'za');
  124 |      await expect(page.locator('div[class="inventory_item_name"]')).toContainText('Test.allTheThings() T-Shirt (Red)');
  125 |    });
  126 | 
  127 |    test('should check product filtering', async ({ page }) => {
  128 |      await page.goto('https://www.saucedemo.com/');
  129 |      await page.fill('input[name="user-name"]', 'standard_user');
  130 |      await page.fill('input[name="password"]', 'secret_sauce');
  131 |      await page.click('input[type="submit"]');
  132 |      await page.click('button[name="add-to-cart-sauce-labs-backpack"]');
  133 |      await page.click('a[class="shopping_cart_link"]');
  134 |      await expect(page.locator('div[class="inventory_item_name"]')).toContainText('Sauce Labs Backpack');
  135 |    });
  136 |    
```