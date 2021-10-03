var SERVER_NAME = 'image-api'
var PORT = 5000;
var HOST = '127.0.0.1';

var getCounter = 0;
var postCounter = 0;

var restify = require('restify')

  // Get a persistence engine for the images
  , imagesSave = require('save')('images')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log(' /images')
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all images in the system
server.get('/images', function (req, res, next) {
   console.log("/images - Get Request - Received Request")
  // Find every entity within the given collection
  imagesSave.find({}, function (error, images) {
    getCounter = getCounter+1;
    console.log("/images - Get Request - sending Response " + images + "getCounter:" + getCounter)
    // Return all of the users in the system
    res.send(images)
  })
})

// Create a new image
server.post('/images', function (req, res, next) {

  console.log("/images - Post Request - Received Request")

  var newImage = {
    imageId: req.params.imageId,
		name: req.params.name, 
		url: req.params.url,
    size: req.params.size

	}

  // Create the image using the persistence engine
  imagesSave.create( newImage, function (error, image) {
    postCounter = postCounter+1;
    console.log("/images - Post Request - Sending Request " + image + " postCounter:" + postCounter)

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the user if no issues
    res.send(201, image)
  })
})

// Delete user with the given id
server.del('/images', function (req, res, next) {

  console.log("/images - delete request - received Request ");
  // Delete the user with the persistence engine
  imagesSave.deleteMany(req.params.id, function (error, image) {
    console.log("/images - delete request - sending Response - Deleted Successfully ");
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})


