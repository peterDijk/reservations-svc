# API for simple Reservations app
accounts have locations, which have time units with certain capacity, reservations can be made for certain timeunits for certain dates

## Stack keywords
- TypeORM
- Postgres
- Heroku release phase (run migrations)
- passwords stored encrypted


## Controllers

### Setup
`POST /setup` 
- if more than 0 users, throw `Setup is already done`
- create user `superadmin` with password and email from params

### User
`POST /users` 
- throws if: no username or password in parameters, user or email exists
- create user with role `user`

`GET /users`
- Authorized (Role `admin`)
- returns list of all users

`GET /users/:id`
- Authorized (Role `admin`)
- returns user of given id

### ResetPassword
`POST /reset`
- parameters: `email`
- throws if: no user found with that email
- Uses Twillio SendGrid to email a JWT token containing user's id (valid 30min) to the user's emailaddress
- returns message token has been emailed

`POST /reset/:token`
- parameters: `password`
- throws if: token is not valid, no user found with id that's in the token
- Uses method `setPassword` on User entity that creates encrypted version of the new password
- returns the altered user 

### Login
`POST /login`
- throws if: no user with username found, `checkPassword` method on User entity (bcrypt verify of raw vs stored encrypted string)
- returns: JWT object with `id` (user.id) and `roles`

### Account
`POST /accounts` 
- Authorized (Role `user`)
- creates a new account. Sets the account administrator to the current logged in user
- change to the current user's `roles` -> adds Account Admin role

`GET /accounts`
- returns a list of all accounts, including the related administrators

### Location

### Reservation

### Service
`GET /health`
- health check

### TODO

- roles to own table manytomany
- user reg > email confirmation
- datecreated + datemodified column add to models
- become member of account endpoint (using a token)
- after reset, invalidate token
- start script > use build target/index.js. ormconfig needs change (naming strategy)
