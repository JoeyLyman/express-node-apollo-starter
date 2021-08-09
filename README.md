# express-node-apollo-starter

This is a starter pack of an express server, running node, with apollo handling it as a graphql endpoint, and performing some logic before querying and mutating users in a mongodb instance.

You will need:

- a running instance of mongodb (checkout mongo atlas, they probably have a free tier)
- a cloudinary account for file handling (profile pictures)

## Environmental variables that need to be set

MONGODB: // url
SECRET_KEY: // this is for processing tokens used in logging in, email confirmation, and password resets. Set to anything, but keep secret and store as an environmental variable in production.
PORT=4000
WEB_CONCURRENCY=1
NODEMAILER_TRANSPORT_OBJ= // i.e. {"service":"SendinBlue","auth":{"user":"${your email address}","pass":"${your password}"}}
DOMAIN=localhost:4000
CLOUDINARY_CLOUD_NAME: // all this info should be clear when an account is created
CLOUDINARY_API_KEY:
CLOUDINARY_API_SECRET:
CLOUDINARY_URL:
CLOUDINARY_PROFILE_PICTURES_FOLDER_NAME=ProfilePictures
