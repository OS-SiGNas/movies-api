# Escalable API REST For Movies based in NodeJS OOP, TypeScript, hexagonal architecture, Express, Mongo, JWT...

## Install Dependences:

```
npm i
```

## Run Mongo service with Docker Compose:

```
docker-compose up --build
```

## Available Scripts

```
unix systems:
  start ->  export NODE_ENV=prod && node bin/index.js
  dev ->  export NODE_ENV=dev && ts-node-dev --poll src/index.ts
windows:
  start:win ->  set NODE_ENV=prod && node bin/index.js
  dev:win ->  set NODE_ENV=dev && ts-node-dev --poll src/index.ts

  test ->  jest
  build ->  tsc
```

## This API need .env file:

```
#Token secretKey
JWT_SECRET=blablablablabla

#PORT
PORT=3000

#DATABASE
MONGO_URI_HEADER=mongodb://
MONGO_CLUSTER=localhost:27017

#Test user for Jest testing
USER_TEST_USERNAME=test
USER_TEST_PASSWORD=1111111111
ADMIN_TEST_USERNAME=testadmin
ADMIN_TEST_PASSWORD=1111111111
```

## Tree

```
├── docker-compose.yml
├── jest.config.js
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── index.ts
│   ├── modules
│   │   ├── 404
│   │   │   └── index.ts
│   │   ├── comments
│   │   │   ├── application
│   │   │   │   ├── CommentsSchema.ts
│   │   │   │   ├── MongoCommentsRepository.ts
│   │   │   │   └── ratingCalculator.ts
│   │   │   ├── comments.spec.ts
│   │   │   ├── domain
│   │   │   │   ├── CommentsModel.ts
│   │   │   │   ├── IComment.d.ts
│   │   │   │   └── ICommentsService.d.ts
│   │   │   ├── index.ts
│   │   │   └── infrastructure
│   │   │       ├── CommentsController.ts
│   │   │       └── CommentsRouter.ts
│   │   ├── errorHandler
│   │   │   └── index.ts
│   │   ├── index.ts
│   │   ├── movies
│   │   │   ├── application
│   │   │   │   ├── MongoMoviesRepository.ts
│   │   │   │   └── MovieSchema.ts
│   │   │   ├── domain
│   │   │   │   ├── IMoviesService.d.ts
│   │   │   │   ├── Movie.d.ts
│   │   │   │   └── MoviesModel.ts
│   │   │   ├── index.ts
│   │   │   ├── infrastructure
│   │   │   │   ├── MoviesController.ts
│   │   │   │   └── MoviesRouter.ts
│   │   │   └── movies.spec.ts
│   │   ├── shared
│   │   │   ├── HttpResponse.ts
│   │   │   ├── SchemaValidatorMiddleware.ts
│   │   │   └── types.d.ts
│   │   ├── types.d.ts
│   │   └── users
│   │       ├── application
│   │       │   ├── auth
│   │       │   │   ├── AuthMiddleware.ts
│   │       │   │   └── AuthService.ts
│   │       │   ├── types.d.ts
│   │       │   └── user
│   │       │       ├── MongoUsersRepository.ts
│   │       │       └── UsersSchema.ts
│   │       ├── domain
│   │       │   ├── IAuthService.d.ts
│   │       │   ├── User.d.ts
│   │       │   ├── UsersModel.ts
│   │       │   └── UsersService.d.ts
│   │       ├── index.ts
│   │       ├── infrastructure
│   │       │   ├── UsersController.ts
│   │       │   └── UsersRouter.ts
│   │       └── users.spec.ts
│   └── server
│       ├── index.ts
│       ├── Mongo.ts
│       ├── Server.ts
│       ├── Settings.ts
│       └── types.d.ts
└── tsconfig.json
```

## How does it work?

### 1 - src/index.ts entry point with an IIFE

### 2 - Initial server configuration such as environment variables are loaded into the config object in src/server/Settings.ts

### 3 - Express configuration and modules are loaded into the server object in src/server/index.ts

### 4 - All modules in the src/modules folder should export an object of type Express.Router and include them in the array declared in the src/modules/index.ts file, will be automatically exported and included in the server object.

```
/***************************************************************
                Add Routers modules in the array
****************************************************************/
const modules: Modules = [users, movies, comments, otherRouterObject];
```

### 5 - In the folder src/modules/share are the classes objects or functions shared by all the modules, such as the HttpResponse class or the ValidadorSchemas.

### 6 - The model for user it's in src/modules/users/UserModel, you need create any user in your DB like this:

```
{
	"username": "anyuser",
	"password": "mysecurepassword123456",
	"email": "anyuser@any.com",
	"name": "Any",
	"telf": "+58 000 0000",
	"active": true,
	"roles": ["admin","user"]
}

// or you can use the /register endpoint and then add in DB the role of "admin" in the roles array
```

### 7 - The user rols array are ["admin","user"] and are validate with the checkSession middleware.

```
this.#router.use('/users', checkSession('admin'))

// the 'admin' Rol is required for all enpoints /users
```

### 8 - Security in Endpoints powered by The method AuthMiddleware.checkSession, is: type -> checkSession:(arg: Rol) => RequestHandler;

```
const { checkSession } = new AuthMiddleware({ httpResponse, verifyJwt });

// create instance like this, look in src/modules/users/index.ts for good example
```

### 9 - Security and integrity Request is validated and powered by class SchemaValidatorMiddleware implementing Zod library.

```
/*
 that middleware is type:
 schemaValidator: (arg: AnyZodObject) => RequestHandler;
*/

this.#router.post('/users', schemaValidator(createSchema), postUser)
```

## Modules Movies and Comments

### 1 - User and Auth

```
Public
=> POST: '/auth'
received { username, password } return user and token session

=> POST: '/register'
received user in request.body without attribute isActive(default is false) or rol (default is 'user')

User
=> GET: '/auth'
this endpoint is only for validate token expired time, return 204 for OK NO CONTENT, or Forbidden 403

Admin
=> GET: '/users'
return all array IUser

=> GET: '/users/:_id'
return particular user by id

=> POST: '/users'
received user with all attributes

=> PUT: '/users/:_id'
update user with any atribute

=> delete: '/users/:_id'
delete users by id

```

### 2 - Movies:

```
Public:

=> GET: '/movies/all'
return all movies approved

=> GET: '/movies/one/:_id'
return detail for one movie without comments

Users:

=> POST:  '/movies/one'
add movie to list for revision to approve

=> PUT:   '/movies/one/:_id'
update movie information

=> DELETE '/movies/one/:_id'
delete movie

Admin:

=> GET: '/movies/user/:_id'
return all movies add by any user

=> GET: '/movies/notapproved'
return all movies not approved for revision

=> PUT: /movies/notapproved'
receive movieId[] in request.body for approve multiple movies in a single request and return moviesApproved[]
```

### 3 - Comments:

```
Public:
=> GET: '/comments/movie/:movieId'
returns the comments of a particular movie along with its rating, use this endpoint together with /movies/all

User:
=> POST: '/comments/movie/:movieId'
add comment and score in a particular movie

=> GET: '/comments/one/:_id'
return single comment by id

=> PUT: '/comments/one/:_id'
update comment and return comment updated

=> DELETE: '/comments/one/:_id'
delete comment

GET: '/comments/user/:userId', checkSession('admin')
return all comments of a particular user

```
