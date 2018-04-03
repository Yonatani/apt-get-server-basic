'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _connectors = require('./data/connectors');

var _apolloServerExpress = require('apollo-server-express');

var _apolloServerCore = require('apollo-server-core');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = require('http');

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _apolloEngine = require('apollo-engine');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _subscriptionsTransportWs = require('subscriptions-transport-ws');

var _graphql = require('graphql');

var _schema = require('./data/schema');

var _schema2 = _interopRequireDefault(_schema);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GRAPHQL_PORT = 3000;

var app = (0, _express2.default)();
app.use((0, _compression2.default)());
app.use((0, _morgan2.default)('common'));

// `context` must be an object and can't be undefined when using connectors
app.use('/graphql', _bodyParser2.default.json(), async function (req, res, next) {
    console.log('try to load1');
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        var decoded = _jsonwebtoken2.default.verify(req.headers.authorization.split(' ')[1], _config2.default);
        console.log('try tofind user');
        var user = await _connectors.User.findOne({ _id: decoded.id });
        console.log('try tofind user2', user);
        req.user = user;
    }
    next();
}, (0, _apolloServerExpress.graphqlExpress)(function (req, res) {
    return {
        schema: _schema2.default,
        tracing: true,
        cacheControl: true,
        context: {
            user: req.user ? req.user : Promise.resolve()
        }
    };
}));

app.use('/graphiql', (0, _apolloServerExpress.graphiqlExpress)({
    endpointURL: '/graphql',
    subscriptionsEndpoint: 'ws://apt-get-server.herokuapp.com/subscriptions'
}));

var engine = new _apolloEngine.ApolloEngine({
    apiKey: 'service:Yonatani-9535:srHFL2UBA957BR7mikkCLQ',
    stores: [{
        name: 'inMemEmbeddedCache',
        inMemory: {
            cacheSize: 20971520 // 20 MB
        }
    }],
    queryCache: {
        publicFullQueryStore: 'inMemEmbeddedCache'
    }
});

engine.listen({
    port: GRAPHQL_PORT,
    graphqlPaths: ['/graphql', '/subscriptions'],
    expressApp: app,
    launcherOptions: {
        startupTimeout: 3000
    }
}, function () {
    console.log('Listening on port 3000!');
    _subscriptionsTransportWs.SubscriptionServer.create({
        execute: _graphql.execute,
        subscribe: _graphql.subscribe,
        schema: _schema2.default,
        onOperation: function onOperation(message, params) {
            if (message.payload.authentication) {
                return params;
            }
        },
        onConnect: function onConnect() {
            console.log("connected");
        }
    }, {
        server: engine.httpServer,
        path: '/subscriptions'
    });
});