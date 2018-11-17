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
+ imagePath: String
#### Question
+ text: String
+ user: ObjectId
+ created: Date
+ [answers]
    - text: String
    - user: ObjectId
    - created: Date
    - upvotedBy: [ObjectId]
    - upvotes: Number (virtual)
+ upvotedBy: [ObjectId]
+ upvotes: Number (virtual)

### Routes
#### Users (/users)
##### / (GET)  
Desc: Get all users  
In: -  
Out: Array of users  

##### /signUp (POST)
Desc: Store new user in db  
In: username, email, password  
Out: Status 403 if username exists, 200 otherwise

##### /signIn (POST)
Desc: Return authentication token  
In: username password 
Out: token, email

##### /usernameValid/:username (GET)
Desc: Check if username exists  
In: username  
Out: Status 403 if db error, 409 if user exists, 200 otherwise

#### Questions (/questions)
##### / (GET)  
Desc: Get all questions  
In: -  
Out: Array of questions  

##### /:id (GET)
Desc: Get question by id  
In: id  
Out: Question

##### /createQuestion (POST)
Desc: Store new question in db  
In: text  
Out: Status 403 if user doesn't exist, 200 otherwise

##### /createAnswer (POST)
Desc: Store new answer in db  
In: qid, text  
Out: Status 403 if question or user doesn't exist, 200 otherwise

##### /questionsBy/:username (GET)
Desc: Get all questions asked by user
In: username
Out: Array of questions

##### /answersBy/:username (GET)
Desc: Get all answers asked by user
In: username
Out: Array of questions

##### /upvoteQuestion/:qid (GET)
Desc: Upvote a question
In: qid
Out: Status 409 if already upvoted, 200 otherwise

##### /upvoteAnswer/:qid/:aid (GET)
Desc: Upvote an answer
In: qid, aid
Out: Status 409 if already upvoted or aid not in question, 200 otherwise