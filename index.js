let SERVER_NAME = "product-api";
let PORT = 5000;
let HOST = "127.0.0.1";

let errors = require("restify-errors");
let restify = require("restify"),
  // Get a persistence engine for the users
  usersSave = require("save")("users"),
  productsSave = require("save")("products"),
  // Create the restify server
  server = restify.createServer({ name: SERVER_NAME });

server.listen(PORT, HOST, function () {
  console.log("Server %s listening at %s", server.name, server.url);
  console.log("**** Resources: ****");
  console.log("********************");
  console.log(" /productsSave");
  console.log(" /productsSave/:id");
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all Products in the system
server.get("/products", function (req, res, next) {
  console.log("GET /products params=>" + JSON.stringify(req.params));
  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {
    // Return all of the products in the system
    res.send(products);
  });
});

// Get a single product by their product id
server.get("/products/:id", function (req, res, next) {
  console.log("received request" + JSON.stringify(req.params));

  // Find a single product by their id within save
  productsSave.findOne({ _id: req.params.id }, function (error, product) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)));

    if (product) {
      // Send the product if no issues
      res.send(product);
    } else {
      // Send 404 header if the product doesn't exist
      res.send(404);
    }
  });
});

// Create a new product
server.post("/products", function (req, res, next) {
  console.log("POST /product params=>" + JSON.stringify(req.params));
  console.log("POST /product body=>" + JSON.stringify(req.body));

  // validation of manadatory fields
  if (req.body.productId === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("Product Id must be supplied"));
  }
  if (req.body.price === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("Price must be supplied"));
  }
  if (req.body.name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("Name must be supplied"));
  }
  if (req.body.quantity === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("Quantity must be supplied"));
  }

  let newProduct = {
    productId: req.body.productId,
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
  };

  // Create the product using the persistence engine
  productsSave.create(newProduct, function (error, product) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)));

    // Send the product if no issues
    res.send(201, product);
  });
});

// Update a product by their id
server.put("/products/:id", function (req, res, next) {
  console.log("POST /products params=>" + JSON.stringify(req.params));
  console.log("POST /products body=>" + JSON.stringify(req.body));
  // validation of manadatory fields
  if (req.body.productId === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("Product Id must be supplied"));
  }
  if (req.body.price === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("Price must be supplied"));
  }
  if (req.body.name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("Name must be supplied"));
  }
  if (req.body.quantity === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("Quantity must be supplied"));
  }
  let newProduct = {
    _id: req.params.id,
    productId: req.body.productId,
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
  };

  // Update the product with the persistence engine
  productsSave.update(newProduct, function (error, product) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)));

    // Send a 200 OK response
    res.send(200);
  });
});

// Delete product with the given id
server.del("/products/:id", function (req, res, next) {
  console.log("POST /products params=>" + JSON.stringify(req.params));
  // Delete the product with the persistence engine
  productsSave.delete(req.params.id, function (error, product) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new Error(JSON.stringify(error.errors)));
    // Send a 204 response
    res.send(200).JSON({ success: true, message: "Item deleted successfully" });
  });
});