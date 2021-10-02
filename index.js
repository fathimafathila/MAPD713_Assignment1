var SERVER_NAME = 'image-api'
var PORT = 8000;
var HOST = '127.0.0.1';


var restify = require('restify')

  // Get a persistence engine for the images
  , imagesSave = require('save')('images')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log(' /images')
  console.log(' /images/:id')  
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all images in the system
server.get('/images', function (req, res, next) {

  // Find every entity within the given collection
  imagesSave.find({}, function (error, images) {

    // Return all of the users in the system
    res.send(images)
  })
})

// Get a single user by their user id
server.get('/images/:id', function (req, res, next) {

  // Find a single user by their id within save
  imagesSave.findOne({ _id: req.params.id }, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (image) {
      // Send the image if no issues
      res.send(image)
    } else {
      // Send 404 header if the image doesn't exist
      res.send(404)
    }
  })
})

// Create a new image
server.post('/images', function (req, res, next) {

  // Make sure imageId is defined
  if (req.params.imageId === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('imageId must be supplied'))
  }
  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  // Make sure url is defined
  if (req.params.url === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('url must be supplied'))
  }
    // Make sure size is defined
  if (req.params.size === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('size must be supplied'))
  }
  var newImage = {
    imageId: req.params.imageId,
		name: req.params.name, 
		url: req.params.url,
    size: req.params.size

	}

  // Create the image using the persistence engine
  imagesSave.create( newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the user if no issues
    res.send(201, image)
  })
})
/*
// Update a user by their id
server.put('/images/:id', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.age === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }
  
  var newUser = {
		_id: req.params.id,
		name: req.params.name, 
		age: req.params.age
	}
  
  // Update the user with the persistence engine
  usersSave.update(newUser, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})
*/
// Delete user with the given id
server.del('/images/:id', function (req, res, next) {

  // Delete the user with the persistence engine
  imagesSave.delete(req.params.id, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})


