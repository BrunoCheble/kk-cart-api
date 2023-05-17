# Cart API

### Notations

- The database settings and server port  are inside the file **.env**
- Don't forget of update **URL_PRODUCT_API** in **.env** file to call Product API
- There are test e2e (Don't forget to run the product-api when testing the cart-api)
- The development is using Nestjs / TypeORM

**View the Cart**

[GET] - http://localhost:**3002**/carts/:id

**Add a product to cart**

[POST] - http://localhost:**3002**/carts/add-to-cart

[BODY] - {

shoppingCartId?: Number,

productId: Number,

}

**NOTE:** *If the shoppingCartId attribute exists, add one product to the cart; otherwise, create a new cart with the added product*

**Remove a product from cart**

[PATCH] - http://localhost:**3002**/carts/remove-from-cart

[BODY] - {

shoppingCartId: Number,

productId: Number,

}

**NOTE:** *If quantity product is zero, delete the product from cart and if there isn’t any product delete cart*
