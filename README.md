# [InYourLife](https://inyourlife-716bb.web.app/)

## Description
This project is a clone of Instagram that allows users to share photos and posts with others. While some features may be simple at this time, we plan to continuously improve our clone and add more advanced features in the future.

To get started, follow the installation instructions in the README and start sharing your photos and posts with others!

## Demo
### Infinite scroll
![homepage](http://g.recordit.co/r4IHUyXNfe.gif)

### create new post
![homepage](http://g.recordit.co/MMBUNcTnIQ.gif)

### Real-time chatroom
![chatroom](http://g.recordit.co/EcPePWYjM5.gif)

## Features
### Home Page
* View all posts from Firebase Firestore
* Comment on a post using useState to store input text and updating to Firestore
* Like and dislike a post using useState to store like status and updating to Firestore
* Collect and discollect a post using useState to store collect status and updating to Firestore
* Infinite scroll by observing the window's innerHeight and documentElement.scrollTop, and fetching more data from Firestore when needed
* Click "see more comments" to view all comments in a popup window using useState to store a "click" boolean value


### person Page
* View all personal posts and collected posts using Firestore
* Set username, full name, self-introduction and change personal image using useState to store input text and updating to Firestore

 
### Creat new page
* Create a new post by selecting one or more photos and previewing them, and then using Firestore to store the post's text and image URL


### Chat Room
* Search for a user by typing their full name.
* Select a user to send a message in real-time using Firestore.
* Receive real-time messages from other users.
 

## Technologies Used
* [Webpack](https://webpack.js.org/): Used for bundling and optimizing the front-end code for production.
* [NPM](https://www.npmjs.com/): Used for managing packages and dependencies in the project.
* [React](https://beta.es.reactjs.org/): Used to build the front-end user interface of the application, utilizing React Hooks for state management and lifecycle methods.
* [React Router](https://reactrouter.com/en/main): Used for client-side routing and navigation within the application.
* [Babel](https://babeljs.io/): Used for translation of JSX to JavaScript.
* [Firebase Firestore](https://firebase.google.com/docs/firestore?hl=zh-tw): Used for real-time data storage and retrieval of posts and user information.
* [Firebase Storage](https://firebase.google.com/docs/storage?hl=zh-tw): Used to store user-generated images and post images.
* [Firebase Authentication](https://firebase.google.com/docs/auth?hl=zh-tw): Used for user authentication and authorization.
* [Firebase Hosting](https://firebase.google.com/docs/hosting?hl=zh-tw): Used to deploy the application to a live server.
* [Git](https://git-scm.com/): Used for version control and collaboration.
* [Github](https://github.com/): Used for version control and collaboration, allowing multiple developers to work on the same codebase simultaneously.
* [VS Code](https://code.visualstudio.com/): Used as the primary code editor.

## Usage
To get started with this application, follow these steps:

1. Navigate to the project URL in your web browser.
2. If you do not have an account, click the "Sign Up" button to create a new account.
3. Log in to the application using your credentials.
4. From the home page, you can view all posts, comment on posts, like and dislike posts, and collect posts.
5. To create a new post, click the "Create Post" button and select the image(s) you want to upload.
6. Enter a caption for your post and click "Submit".
7. To view your personal page, click your profile picture in the top right corner of the screen.
8. From your personal page, you can view your own posts, edit your profile information, and change your profile picture.
9. To send a message to another user, search for their username using the search bar at the top of the screen.
10. Click on the user's profile, then click the "Send Message" button to open the chat room.


## Contact
Chiu-Hui-Ting
* Email: hana840101@gmail.com
* GitHub: [HuinChiu](https://github.com/HuinChiu)

## Conclusion
Thank you for taking the time to explore this project! While the current version is functional, I have plans to add additional features and enhancements in the future. Some of the ideas I'm considering include implementing a post limit and adding a notification system.

Thank you again for your interest in this project!
