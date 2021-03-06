# Gatsby and Firebase

## Get Started
* Clone the repo, `git@github.com:akiryk/fun-retro-clone.git`
* Use node version 11.6 (e.g. switch with nvm, `nvm use 11.6`)
* Run with `gatsby develop`

## Todos
* Use Helmet to include page titles
* Change rules so only auth users can read/write

## Firebase Authentication

### Authentication
Firebase is imported and initialized in a standard es6 class in `src/context/firebase_context`.
It's then made available to the entire app via a Provider in `gatsby-browser`, which wraps everything (see [gatsby docs](https://www.gatsbyjs.org/blog/2019-01-31-using-react-context-api-with-gatsby/)).

Firebase can now be consumed anywhere in the app using `<FirebaseContext.Consumer>` — to simplify development, use the `withFirebaseConsumer` HOC, as in `withFirebaseConsumer(SomeComponent)`

### Session
Session information is also stored in React Context and is made available by a Provider using the `withSessionProvider`.
The session provider needs to have access to Firebase, so it's wrapped in a Firebase Consumer.

## Roles and Authorization
Roles are handled right now only in Admin. TBD: better organize code so it makes more sense. There is an awkward nesting of components so that Admin has access to the right context data for users.

## Sources
* [Unicorn Agency Polling App Tutorial](https://medium.com/@UnicornAgency/jamstack-pwa-lets-build-a-polling-app-with-gatsby-js-firebase-and-styled-components-pt-2-9044534ea6bc )
* [Deploy Gatsby/Firebase to Netlify](https://www.dajocarter.com/posts/upload-firebase-storage-gatsby-netlify/)

## Plugins
Gatsby does not support dynamically generated pages, meaning you can't have routes like `/users/:someId`. In order to accomplish this we need to add a plugin that will have Gatsby skip generating the markup for a specified route, effectively making that route’s page component behave like a single page application.

```
// First, install the plugin
npm install gatsby-plugin-create-client-paths

// Then update gatsby-config
{
  resolve: `gatsby-plugin-create-client-paths`,
  options: { prefixes: [`/admin/*`, `/stories/*`] },
},
```

## Netlify
To make a gatsby site work on Netlify, you may need to create a netlify.toml file with the command set to "gatsby build" (it may not be required if the netlify settings defaults just work). You also need to copy over all key variables in Netlify Settings > Build & Deploy > Continuous Deployment > Build Environment Variables.
These variables should be the same as you have in .env.development and should match the naming, as in `GATSBY_API_KEY` (or, in my case `GATSBY_FIREBASE_API_KEY`) -- the point is they must match between wherever the app uses them and the Netlify build vars.

## Firestore
### Example of saving a record to Firestore
```
// See set() vs add()
firebase.firestore
    .collection('retroBoards')
    .add({
      title,
    })
    .then(docRef => {
      if (docRef && docRef.id) {
        navigate(`${ROUTES.RETRO}/${docRef.id}`);
      } else {
        throw new Error('No document reference ID');
      }
    })
    .catch(function(error) {
      console.error('Error writing document: ', error);
    });
  ```
