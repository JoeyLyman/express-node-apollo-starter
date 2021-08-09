gql: user signs up
-> app: email is sent to email, with a Token
-> app -> db: user object created
-> app -> db: userToken object created (make token unique)

user clicks email link
-> gql: when they hit a page, there is a form, it says their email and they have to enter password
-> app: checks password and email against user object
-> app: checks userId and hash token against userToken object
-> db: if passes, email is set to confirmed in DB, and token is deleted

gql query: getUserInfoFromConfirmEmailToken(token) {
email
userId
}

gql mutation: confirmEmail(userId, password, tokenId)
-> to db, confirm entered password with userId from secret token
-> if good

- await update user account to confimed
- login (app.login) OR BETTER: see if i can generate auth token from updateUser response, then dont have to go back to DB
- delete all token objects for that email

token model

- token
- email
- userId
