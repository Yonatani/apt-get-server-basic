import express from 'express';
import {User} from './data/connectors';
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express';
import {runQuery} from 'apollo-server-core';
import bodyParser from 'body-parser';
import {createServer} from 'http';
import compression from 'compression';
import {ApolloEngine} from 'apollo-engine';
import JWT_SECRET from './config'

import {SubscriptionServer} from 'subscriptions-transport-ws';
import {execute, subscribe} from 'graphql';
import schema from './data/schema';
import jwt from 'jsonwebtoken';

const GRAPHQL_PORT = 3000;

import morgan from 'morgan';

const app = express();
app.use(compression());
app.use(morgan('common'))


// `context` must be an object and can't be undefined when using connectors
app.use('/graphql', bodyParser.json(), async (req, res, next) => {
    console.log('try to load1')
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], JWT_SECRET);
        console.log('try tofind user')
        const user = await User.findOne({_id: decoded.id})
        console.log('try tofind user2',user)
        req.user = user
    }
    next()
}, graphqlExpress((req, res) => ({
    schema,
    tracing: true,
    cacheControl: true,
    context: {
        user: req.user ?
            req.user : Promise.resolve(),
    },
})));

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://apt-get-server.herokuapp.com/subscriptions`
}));

const engine = new ApolloEngine({
    apiKey: `service:Yonatani-9535:srHFL2UBA957BR7mikkCLQ`,
    stores: [
        {
            name: 'inMemEmbeddedCache',
            inMemory: {
                cacheSize: 20971520 // 20 MB
            }
        }
    ],
    queryCache: {
        publicFullQueryStore: 'inMemEmbeddedCache'
    }
});

engine.listen({
    port: GRAPHQL_PORT,
    graphqlPaths: ['/graphql', '/subscriptions'],
    expressApp: app,
}, () => {
    console.log('Listening on port 3000!');
    SubscriptionServer.create({
            execute,
            subscribe,
            schema,
            onOperation: (message, params) => {
                if(message.payload.authentication) {
                    return params
                }
            },
            onConnect: () => {
                console.log("connected")
            }
        },
        {
            server: engine.httpServer,
            path: '/subscriptions'
        }
    );
});
