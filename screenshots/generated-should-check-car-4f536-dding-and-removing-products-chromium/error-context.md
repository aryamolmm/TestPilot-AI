# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: generated.spec.ts >> should check cart total after adding and removing products
- Location: tests\generated.spec.ts:95:4

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('div[class="inventory_item_price"]')
Expected substring: "$29.99"
Error: strict mode violation: locator('div[class="inventory_item_price"]') resolved to 2 elements:
    1) <div class="inventory_item_price" data-test="inventory-item-price">$29.99</div> aka getByText('$29.99')
    2) <div class="inventory_item_price" data-test="inventory-item-price">$9.99</div> aka getByText('$9.99')

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('div[class="inventory_item_price"]')

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
        - generic [ref=e14]: "2"
      - generic [ref=e16]: Your Cart
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]: QTY
        - generic [ref=e21]: Description
        - generic [ref=e22]:
          - generic [ref=e23]: "1"
          - generic [ref=e24]:
            - link "Sauce Labs Backpack" [ref=e25] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e26]: Sauce Labs Backpack
            - generic [ref=e27]: carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.
            - generic [ref=e28]:
              - generic [ref=e29]: $29.99
              - button "Remove" [ref=e30] [cursor=pointer]
        - generic [ref=e31]:
          - generic [ref=e32]: "1"
          - generic [ref=e33]:
            - link "Sauce Labs Bike Light" [ref=e34] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e35]: Sauce Labs Bike Light
            - generic [ref=e36]: A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.
            - generic [ref=e37]:
              - generic [ref=e38]: $9.99
              - button "Remove" [ref=e39] [cursor=pointer]
      - generic [ref=e40]:
        - button "Go back Continue Shopping" [ref=e41] [cursor=pointer]:
          - img "Go back" [ref=e42]
          - text: Continue Shopping
        - button "Checkout" [ref=e43] [cursor=pointer]
  - contentinfo [ref=e44]:
    - list [ref=e45]:
      - listitem [ref=e46]:
        - link "Twitter" [ref=e47] [cursor=pointer]:
          - /url: https://twitter.com/saucelabs
      - listitem [ref=e48]:
        - link "Facebook" [ref=e49] [cursor=pointer]:
          - /url: https://www.facebook.com/saucelabs
      - listitem [ref=e50]:
        - link "LinkedIn" [ref=e51] [cursor=pointer]:
          - /url: https://www.linkedin.com/company/sauce-labs/
    - generic [ref=e52]: © 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy
```

# Test source

```ts
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
> 103 |      await expect(page.locator('div[class="inventory_item_price"]')).toContainText('$29.99');
      |                                                                      ^ Error: expect(locator).toContainText(expected) failed
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