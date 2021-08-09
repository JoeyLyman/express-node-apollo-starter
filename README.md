# express-node-apollo-starter

Express, node, apollo, mongoose, mongodb, jest starter with login, email confirmation, reset password, etc.

Pair it with this [nextjs-apollo starter pack](https://github.com/JoeyLyman/nextjs-apollo-starter) for client login flow already built.

You will need:

- a running instance of mongodb (checkout mongo atlas, they probably have a free tier)
- a cloudinary account for file handling (profile pictures)
- a SendinBlue account (or different email service of your choice) for email confirmations, resetting password, etc.

## Environmental variables that need to be set

- MONGODB: // url. this url will include your credentials
- SECRET_KEY: // this is for processing tokens used in logging in, email confirmation, and password resets. Set to anything, but keep secret and store as an environmental variable in production.
- PORT=4000
- WEB_CONCURRENCY=1
- NODEMAILER_TRANSPORT_OBJ= // i.e. {"service":"SendinBlue","auth":{"user":"${your email address}","pass":"${your password}"}} // this is for your email service, for email confirmation and resetting password.
- DOMAIN=localhost:4000
- CLOUDINARY_CLOUD_NAME: // all this info should be clear when an account is created
- CLOUDINARY_API_KEY:
- CLOUDINARY_API_SECRET:
- CLOUDINARY_URL:
- CLOUDINARY_PROFILE_PICTURES_FOLDER_NAME=ProfilePictures
