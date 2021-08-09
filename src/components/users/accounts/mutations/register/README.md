user signs up
user account created, with email.confirmed set to false
confirmEmailToken is also created in database, and secret token is sent in email (as url) to user

(at this point, other users cannot sign up with same username, but can sign up with same email)

(user can ask for another email, by submitting username. Another token will be created to replace existing one, and another email is sent)

user clicks on link in email, and is taken to a url at yewtide.com
username is populated on this page, as it is within the Token (in the url)
user enters password, and submits. Server checks to make sure username / password match, and that user isnt confirmed yet. Username is autofilled from token.

if passwords match, all tokens are deleted for that email address, and all other users with that email are deleted as well.

Cronjob: regularly delete users after an expiration time that do not confirm. Alternative, set an expiration on each user in the createdAt: field, and remove the expiration time when they confirm email
