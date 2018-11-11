### First time:  
    npm install

### Run server (make sure mongo running on port 27017):  
    npm start

### Initialize/Reset DB:  
    localhost:3000/misc/reset

### Schemas:
#### User
+ username: String
+ email: String
+ password: String
#### Question
+ text: String
+ user: ObjectId
+ created: Date
+ answers
    - text: String
    - user: ObjectId
    - created: Date

### Routes
#### Users (/users)
##### / (GET)  
Desc: Get all users  
In: -  
Out: Array of users  

##### /signUp (POST)
Desc: Store new user in db  
In: username(String), email(String), password(String)  
Out: Status 403 if username exists, 200 otherwise

##### /signIn (POST)
Desc: Return authentication token  
In: username(String), password(String)  
Out: token(String)

##### /usernameValid/:username (GET)
Desc: Check if username exists  
In: username(String)  
Out: Status 403 if db error, 409 if user exists, 200 otherwise

#### Questions (/questions)
##### / (GET)  
Desc: Get all questions  
In: -  
Out: Array of questions  

##### /:id (GET)
Desc: Get question by id  
In: id(ObjectId)  
Out: Question

##### /createQuestion (POST)
Desc: Store new question in db  
In: username(String), text(String)  
Out: Status 403 if user doesn't exist, 200 otherwise

##### /createAnswer (POST)
Desc: Store new answer in db  
In: qid(ObjectId), username(String), text(String)  
Out: Status 403 if question or user doesn't exist, 200 otherwise