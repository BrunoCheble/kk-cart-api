# Cart API

### Notations

- The database settings and server port  are inside the file **.env**
- Don't forget of update **URL_PRODUCT_API** in **.env** file to call Product API
- There are test e2e (Don't forget to run the product-api when testing the cart-api)
- The development is using Nestjs / TypeORM
- The AUTH_TOKEN is **eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c**

**View the Cart**

[GET] - http://localhost:**3002**/carts/:id

[AUTH] - Bearer <AUTH_TOKEN>

**Add a product to cart**

[POST] - http://localhost:**3002**/carts/add-to-cart

[AUTH] - Bearer <AUTH_TOKEN>

[BODY] - {

shoppingCartId?: Number,

productId: Number,

}

**NOTE:** *If the shoppingCartId attribute exists, add one product to the cart; otherwise, create a new cart with the added product*

**Remove a product from cart**

[PATCH] - http://localhost:**3002**/carts/remove-from-cart

[AUTH] - Bearer <AUTH_TOKEN>

[BODY] - {

shoppingCartId: Number,

productId: Number,

}

**NOTE:** *If quantity product is zero, delete the product from cart and if there isn’t any product delete cart*
