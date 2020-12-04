
# Adventure Archive [![pipeline status](https://gitlab.com/brennanwilkes/adventure-archive/badges/main/pipeline.svg) ](https://gitlab.com/brennanwilkes/adventure-archive/-/pipelines)[![coverage report](https://gitlab.com/brennanwilkes/adventure-archive/badges/main/coverage.svg)](https://brennanwilkes.gitlab.io/adventure-archive/)

Adventure archive is a planning and research tool for the amateur adventurer and traveller. It is designed to be a complete archive of the old Lonely Planet Thorntree travel forum, a goldmine for niche travel information on far away places. It features an easy to use API and front-end interface for researchers.

---

<img src=https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg width=40px height=40px> **Acquire Adventure Archive**

Adventure archive can be cloned from the [public GitHub repository](https://github.com/brennanwilkes/adventure-archive). This repository is also mirrored on [GitLab](https://gitlab.com/brennanwilkes/adventure-archive/) where a complete continuous integration and deployment pipeline can be found. This pipeline automatically runs an extensive test suite, ensuring the application is robust and bug free on every production commit. The results and coverage of these tests can be viewed on the [coverage report](https://brennanwilkes.gitlab.io/adventure-archive/) page.  

  After robustly testing and linting the source code, the CI/CD pipeline automatically minifies and compiles the entire front-end into a single production-mode bundle file, as well as packaging the application back-end in a docker container. This container is then published via a container registry to a heroku webserver where it is then deployed publicly. More information can be found [below](#Deployment).  

---

<img src=https://i.pinimg.com/originals/c7/b8/11/c7b8113247fecd83bd9b5ed5bd3f34d5.png width=40px height=40px><img src=https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg width=50px height=40px> **Installation**<img src=https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg width=40px height=40px><img src=https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Windows_Logo_1995.svg/1181px-Windows_Logo_1995.svg.png width=50px height=40px>  

  Once the source code is acquired, Adventure Archive can be easily installed. Node and NPM are the only big-picture dependencies, and must be installed on your system. The remaining JS dependencies can be installed with the usual `npm install`. The front-end bundle can be compiled using `npm run build:frontend`. Please note that by default this will compile in *development* mode, as the webpack *mode* flag has been set to *development* in the source. (As part of the live deployment, the CI/CD pipeline automatically switches this to *production* for a minified bundle.) If you would like to automatically build for production, you can instead use `npm run build:production`. Running `npm run watch` will automatically track and compile changes in the front-end code.  

The webserver can be started with `npm start`, and can continually track changes using `npm run dev` script. Both the front-end and back-end code can be tracked, recompiled, and restarted automatically by the aggregated script `npm run dev:full`.  

The CD/CI pipeline can be investigated locally using the `npm run test` and `npm run lint` commands. Additionally a complete JSDoc's documentation can be compiled by running `npm run doc`. This documentation can be viewed in `documentation/index.html`.

Finally, should you wish to extend the database's collection and continue the project, you should investigate the `npm run scrapeData`, `npm run speedTest`, and `npm run rootIndex` commands. These scripts are interesting, and their source code shows how the database was built (Relevant to the project, so I decided to leave them in my submission for your viewing), but are not run in the production container.  

---

<img src=https://raw.githubusercontent.com/brennanwilkes/adventure-archive/main/public-frontend/favicon.png width=40px height=40px> **Deployment**  

Adventure Archive can be found deployed live at [adventure-archive.herokuapp.com](https://adventure-archive.herokuapp.com/). In the navigation bar, you will find a search bar where you can search comments by their contents, as well as a drop-down advanced search panel. This advanced search panel allows you to specify multiple text queries (AND), multiple countries (OR), multiple sub-forums (OR), and a maximum number of comments to query for. Please note that some obscure searches may take a number of seconds to query, and as such please observe the small loading indicator next to the search bar; This indicator will remain spinning for as long as work is being done behind the scenes (NoSQL database is being queried).  

<img src=https://raw.githubusercontent.com/brennanwilkes/adventure-archive/main/assets/demo1.png width=863px height=190px>  

Once the results of your search have been returned, you may preview them at will. If you find one which interests you, you may click on the **forum title** (*"First-Hand Reports from Japan"* in the above example), to view a full-screen view of the entire forum which the comment was posted in. Should you be interested in other similar posts you can click on the **country**, **sub-forum**, and **user** headings in order to quickly search for more comments with similar attributes.   

Should you wish to add first hand information of your own to the repository of knowledge or simply correct misleading or out-dated information, you can easily post your own comment to a forum. Simply *"login"* with a username of choice by clicking the **LOGIN** button on the top left of the navigation header, and enter a username to use. Then simply open a forum up, scroll to the bottom and post your comment.  

---

<img src=https://raw.githubusercontent.com/brennanwilkes/adventure-archive/main/public-frontend/favicon.png width=40px height=40px> **API**  

Should the front-end of Adventure Archive not be to your taste, you can build your application to utilise Adventure Archive's public API. All endpoints listed below are *extensions* of the root URL `https://adventure-archive.herokuapp.com`  
  ### Available versions  
 `/api/v0.0.1` The latest and greatest API version.  
 `/api` A default API route which will automatically route to `v0.0.1`.  

All endpoints listed below are *extensions* of these API endpoints.  

 ### Available Resources  

`GET`  `/comments` Will return a list a list of comment documents. These comments will contain a unique `_id`, as well as their `content`, `date` posted, the `threadId` of the thread they were posted to, and the `userId` of the user who posted them.   

Comments can be filtered in a number of ways. These query parameters can be combined together in as many combinations as you chose, however detailed specific queries will perform much slower than simpler queries.  
`/comments?thread=[ID]` : Comments belonging to a specific thread.  
`/comments?search=[SEARCH QUERY]` :  Comments containing a specific sub-string.  
`/comments?user=[ID]` : Comments posted by a specific user.  
`/comments?country=[COUNTRY NAME]` : Comments about a specific country  
`/comments?subforum=[FORUM NAME]` : Comments posted to a specific sub-forum  
`/comments?groupByThread=true` : A maximum of one comment per thread  
`/comments?limit=[NUMBER]` : A maximum of `[NUMBER]` results will be returned  
`/comments?random=[NUMBER]` : Simmilar to limit, but comments will be better randomly sampled.   

The above queries can be combined using `&`, so to search for up to 10 comments posted to threads about `Canada` OR `Mexico`, containing the words `Vancouver` AND `Hiking` the following endpoint would be appropriate:   
`/comments?country=canada&country=mexico&search=vancouver&search=hiking&limit=10`    

Please note that all searches are case sensitive and substring based.    

A specific comment can be accessed at the end point  
`/comments/[ID]`   

New comments may be posted to the endpoint   
`POST` `/comments`   
Post bodies must contain an *ASCII* string `comment` with a minimum length of 1, a *valid* unique ID of a `user`, and a *valid* unique ID of a `thread`.  

`GET`  `/users` Will return a list a list of user documents. These comments will contain a unique `_id`, as well as their `name`. The following endpoints are available for users, with similar filtering rules as above.  
`/users?name=[USER NAME]`: Search by name  
`/users?limit=[NUMBER]` : Limit query results  
`/user/[ID]` : Get a specific user document  

New users may be posted to the endpoint    
`POST` `/users`    
Post bodies must contain an *ASCII* string `name` with a minimum length of 1. A unique ID will be created based on a *sha256* hash of this name, so all name's must also by default be unique. Should a user already exist with this name, a record of that user will be returned.    

`GET`  `/threads` Will return a list a list of thread documents. These comments will contain a unique `_id`, as well as their `title`, `country`, and `subforum`. The following endpoints are available for threads, with similar filtering rules as above.  
`/threads?title=[THREAD TITLE]`: Search by title  
`/threads?country=[COUNTRY NAME]` : Threads about a specific country  
`/threads?subforum=[FORUM NAME]` : Threads posted to a specific sub-forum  
`/threads?limit=[NUMBER]` : Limit query results  
`/threads/[ID]` : Get a specific thread document    

All available resources additionally have a `links` attribute containing *HATEOAS* style links for better discovery. Sensible validation is applied to query parameters to prevent attacks, but in general, the API is very forgiving, returning what it can, when it can.  

### Citations and Sources

Images in this README have been retrieved from the following URLS:  
https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg  
https://i.pinimg.com/originals/c7/b8/11/c7b8113247fecd83bd9b5ed5bd3f34d5.png  
https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg  
https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg  
https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Windows_Logo_1995.svg/1181px-Windows_Logo_1995.svg.png  

The Adventure Archive favicon is an adapted version of an ICON from [Font Awesome](https://fontawesome.com/icons/passport?style=solid)  

The content of this archive has been archived from the [Thorntree](https://www.lonelyplanet.com/thorntree/forums) forum. This information was retrieved from the *compact form* api endpoint which can be found by appending forum URL's with `?compact`. An example of which can be found [here](https://www.lonelyplanet.com/thorntree/forums/africa/topics/africa-branch-faq/compact?)  

Finally the following JS modules have been included in the project as dependencies:
 - bootstrap
 - jQuery
 - popper.js
 - react-icons
 - shasum
 - unescape
 - eslint
 - jest
 - jsdoc
 - npm-run-all
 - supertest
