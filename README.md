# apt-get-server

This repository is a working example of the server side of apt-get app

* initial commit explenation *
the initial commit have basic functionality:

bootstrap:
1. running http server of graphql with authorization.
2. subscription server for websocket with authorization.
3. apolloEngine for graphql logs and info (does not include websockets data aka graphql subscriptions).
4. it also have working function for the app: create user, add polygon, remove polygon, get all polygons, update user preference etc.



# To make grapihql work
1. use : http://localhost:3000/graphiql
2. add chorme extensio : ModHeader - https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj/related
3. add: authorization(left side) and token(right side - "Bearer eys3c....")