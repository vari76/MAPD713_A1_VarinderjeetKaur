let SERVER_NAME = 'products-api'
let PORT = 5000;
let HOST = '127.0.0.1';

const mongoose = require ("mongoose");
let uristring = 'mongodb://127.0.0.1:27017/';

// Makes db connection asynchronously
mongoose.connect(uristring, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
  // we're connected!
  console.log("!!!! Connected to db: " + uristring)
});

const productsSchema = new mongoose.Schema({
  name: String, 
  age: String
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'products' collection in the MongoDB database
let productssModel = mongoose.model('productss', productsSchema);

let errors = require('restify-errors');
let restify = require('restify')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('**** Resources: ****')
  console.log('********************')
  console.log(' /productss')
  console.log(' /productss/:id')  
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all productss in the system
server.get('/productss', function (req, res, next) {
  console.log('GET /productss params=>' + JSON.stringify(req.params));

  // Find every entity in db
  productssModel.find({})
    .then((productss)=>{
        // Return all of the productss in the system
        res.send(productss);
        return next();
    })
    .catch((error)=>{
        return next(new Error(JSON.stringify(error.errors)));
    });
})

// Get a single products by their products id
server.get('/productss/:id', function (req, res, next) {
  console.log('GET /productss/:id params=>' + JSON.stringify(req.params));

  // Find a single products by their id in db
  productssModel.findOne({ _id: req.params.id })
    .then((products)=>{
      console.log("found products: " + products);
      if (products) {
        // Send the products if no issues
        res.send(products)
      } else {
        // Send 404 header if the products doesn't exist
        res.send(404)
      }
      return next();
    })
    .catch((error)=>{
        console.log("error: " + error);
        return next(new Error(JSON.stringify(error.errors)));
    });
})

// Create a new products
server.post('/productss', function (req, res, next) {
  console.log('POST /productss params=>' + JSON.stringify(req.params));
  console.log('POST /productss body=>' + JSON.stringify(req.body));

  // validation of manadatory fields
  if (req.body.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('name must be supplied'))
  }
  if (req.body.age === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('age must be supplied'))
  }

  let newproducts = new productssModel({
		name: req.body.name, 
		age: req.body.age
	});

  // Create the products and save to db
  newproducts.save()
    .then((products)=> {
      console.log("saved products: " + products);
      // Send the products if no issues
      res.send(201, products);
      return next();
    })
    .catch((error)=>{
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
  });
})


// Delete products with the given id
server.del('/productss/:id', function (req, res, next) {
  console.log('POST /productss params=>' + JSON.stringify(req.params));
  // Delete the products in db
  productssModel.findOneAndDelete({ _id: req.params.id })
    .then((deletedproducts)=>{      
      console.log("deleted products: " + deletedproducts);
      if(deletedproducts){
        res.send(200, deletedproducts);
      } else {
        res.send(404, "products not found");
      }      
      return next();
    })
    .catch(()=>{
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
})


// // Example of using promise
// productssModel.findOne({ _id: req.params.id })
// .then((products)=>{ }) // success
// .catch((error)=>{ }); // error
