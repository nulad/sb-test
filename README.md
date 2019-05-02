# sb-test
This application contains two API endpoints, checkout and order. This application is written in Node.JS.

## checkout
checkout is a POST command. It will create a redis key with given param containing the list of items the customer has added to cart. There is basic condition checking in the cart, such as whether the item exists or not, the availability of the items, etc.

## order
order is a POST command. It will get a redis key created in the checkout endpoint. Then, it will try to start the order process (payment, PO creation, stock update). For concurrency control, this application is using locking mechanism with the lock stored in redis.
