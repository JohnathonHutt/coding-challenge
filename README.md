# Ambassador Coding Challenge

#### README


**Deployment:**

<https://ambserver.herokuapp.com>


**Description**

This web-application provides an interface for tracking referral links to a landing page for the world wide web. It also consists of the backend API and database to store referral information.

The user interface consists two parts:

A home page - found at <https://ambserver.herokuapp.com> - that displays referral links, has an input to add new links, and has functionality to edit and delete links. The number of "clicks" are set to a default value of 0 for newly generated links. Links are incremented by one with each click and can also be modified directly through the edit feature.

Landing Page - the landing page may be accessed through any of the referral links found on the home page. The page contains the name from the referral link either via the react state or (in the event of a page refresh) the url (https://ambserver.herokuapp.com/{link_name}). Additionally, the page contains a series of links for exploring the world wide web and a world wide web spiderman image (drawn by me for this project) that comes with spiderman puns and references.


**Stack Choices**

I chose the full-stack approach to this project utilizing the MERN stack (MongoDB, Express, ReactJS, Node.js).

The reasoning behind my stack/technology choices:

ReactJS: React was chosen as it was designated as a preferred technology by Ambassador. I am relatively new to React development - this project was my first "build" and deploy with create-react-app (see links to additional react projects at the bottom). I've been working heavily with react recently so I thought a react frontend would be readily attainable while providing some valuable learning experience during the build/deployment process. Furthermore, using a single page application library like react would be ideal for updating views in a CRUD app such as this project.

React Router: React router was used to manage the url/views as it appeared to  be the preferred choice of the react community for handling routing. Also, it seemed like the most straightforward solution to make the back button (browser) work with the application.

CSS: Plain CSS is generally my go to for styling. In general I prefer to minimize dependencies and rely on native web-technologies whenever possible/appropriate - which lends itself to more development with plain CSS (I do have some experience with bootstrap though).

Node.js/Express/Mongoose/MongoDB: These technologies were chosen due to my personal familiarity. I am also experienced with Python but I have yet to use Django (although I would be interested in/excited to do so) so I thought it would be overambitious to attempt to use this technology in the given timeframe.


**Architectual Choices and Strategy**

This project provided me with some new challenges and learning experiences. It was the first time I "built" (using "npm run build"/create-react-app) and deployed a react app. As a result I originally took the strategy of building/deploying the API and the react app separately - that way if I ran into significant issues that I couldn't resolve within the time window I could fall back to either the front-end or back-end approach. It also allowed me to start development of the front-end and back-end quickly and in parallel - rather than spending too much time up front planning file architecture and connectivity in the context of a Heroku deployment. (note: After building separately I deployed as a conventional full-stack app).

I kept my file architecture simple - the main file (coding-challenge) contains a server folder (for the API) and a client folder (for the create-react-app/front-end).

All of the server javascript code is contained in the app.js file. Since this is a relatively simple API this architecture is appropriate, however, it was a trade-off that I will discus more in the following section. Once completed, the API was deployed on heroku so that I could access it while developing the front-end on my local development server. During the build process I used the cors npm package to enable cors for all of the REST API routes - allowing me to make fetch requests through my localhost address.

For the database I used a MongoDB add-on through heroku. This simplified integration with the back-end and provided me with some additional experience using heroku, as my previous database projects used MongoDB Atlas.

The front-end javascript and CSS is contained in the client folder and structured via the create-react-app. All of the react components are stored in the src/App.js file while the CSS classes are stored in src/App.css and the CSS element styles are stored in src/index.css. Again, this file architecture was a trade-off (further described below), with the objective being to keep design patterns minimalist and prioritize developing a functional, polished, app.

During the course of the build I realized the approach to deploying a full-stack react application under a single domain was relatively straightforward. The build process provides a static bundle that can be served from the root of the domain - as a result I ended up modifying the deployed back-end to serve the front-end react files. Since the final file architecture with the "build" file is different than the coding-challenge repository I have also made this directory available to view at:

<https://github.com/JohnathonHutt/ambassador-project-heroku>


**Trade-Offs / What I Would Do With More Time  / Additional Features**

One trade-off/shortcoming that I had for this project was not being able to invest time up front to research best practices for file architecture in Node.js and React apps. My previous experience has been largely with small to medium scale projects, so although I am familiar with some design patterns/file architectures, it is not something I regularly implement in my projects.

During the course of this project I have done some research about react file architecture. The official file structure for react is...  "Move files around until they feel right"-Dan Abramov - which I feel that I accomplished (by my current preferences), however, I have seen the use of a components folders (in src) with individual files for each component as a relatively common theme. Ideally I would have liked to build in some more sophisticated file architecture from the beginning but with deployment being a potential obstacle for me, I thought it would be unwise to attempt any significant late stage file rearrangements.

Given additional time I would have liked to make the node.js server file architecture more sophisticated. This is often accomplished in a similar fashion to react, by having a central javascript (index.js or app.js) file in the root directory that imports the various routes from other files/subdirectories. Since my primary goal was to complete, polish and deploy the app, I made the trade-off to go for a simple file architecture.

Features I would have liked to add:

Unit tests: Ideally testing suites for the API and for the react components would have been added. These features were largely left out due to time constraints and my own inexperience. My experience writing tests has been with pure functions in the context of code katas - which is related but admittedly simpler. To write effective testing suites for a react UI and a Node API I would have needed some additional time/planning to review and weigh the available resources and strategies. Instead, I used manual UI testing/javascript console/console.log() on the frontend and postman on the back-end to perform informal testing during development.

An additional feature that would be interesting would be a toggle switch to sort the links by either number of clicks, alphabetical by name or order they were added (default from the server). As the app I stands I added a method to sort the links by number of clicks to be consistent with the image provided in the description. Given more time I would have likely added the ability to change the display order.

Another feature that I would have added if this were a real application would be a data analytics page. By adding a list parameter (e.g. clickData: [...datetime data]) to each link that contains datetime information for each click we could create a page that allows the user to sort links by various measures of activity level - i.e. pull up links that have been active in the last week, month, etc., seeing what times of the day or days of the week a link is most effective. This feature would have been a little beyond the scope of the project - as I would have had to fabricate data to make it interesting but it could be potentially useful for a production level app.


## Additional Projects

**Original Vanilla Javascript Games**

Invaders: Possibly From Space:
<https://johnathonhutt.github.io/spaceInvaders_1.0/>

Mario Maze:
<https://johnathonhutt.github.io/mario-maze/>

Tic-Tac-Toe with AI:
<https://johnathonhutt.github.io/tic-tac-toe-ai/>

Mario Matching:
<https://johnathonhutt.github.io/mario-matching/>


**ReactJS Projects For freeCodeCamp**
(Projects were made without tutorials see freeCodeCamp for details)

React markdown previewer:
<https://codepen.io/johnathonhutt/pen/oNNMJZL?editors=1010>

React Gene's Drum Machine:
<https://codepen.io/johnathonhutt/pen/WNNPEbb>

React Quote Generator:
<https://codepen.io/johnathonhutt/pen/dyyKEom>
