
import { PubSub } from 'graphql-subscriptions';
import { Polygon, FortuneCookie, User } from './connectors';
import jwt from 'jsonwebtoken';
import JWT_SECRET from '../config'
import lodash from 'lodash';
export const pubsub = new PubSub();

const resolvers = {
    Query: {
        allPolygons(_, args, ctx) {
            return ctx.user.polygons;
        },
        getUserPreferences(_, args, ctx) {
            return ctx.user.userPreference;
        },
        getUserProfile(_, args, ctx) {
            return ctx.user;
        }
    },
    Mutation: {
        async findOrCreateUser(_, {userData: {facebookToken, username}}, ctx) {
            let token;
            let user = await User.findOne({username});
            if(user) {
                 token = jwt.sign({
                    id: user.id,
                }, JWT_SECRET);
            } else {
              user = await User.create({
                    facebookToken: facebookToken,
                    username: username,
                })
                const { id } = user;
                token = jwt.sign({ id }, JWT_SECRET);
            }
            return {token}
        },
        async addPolygon(_, args, ctx) {
            ctx.user.polygons.push(args.polygon);
            await User.update({"_id": ctx.user._id}, {$set: {polygons: ctx.user.polygons}})
            pubsub.publish('updatePolygons', {data: ctx.user.polygons});
        },
        async removePolygon(_, args, ctx) {
            lodash.remove(ctx.user.polygons, polygon => `${polygon.id}` === args.polygonId);
            await User.update({"_id": ctx.user._id}, {$set: {polygons: ctx.user.polygons}})
            pubsub.publish('updatePolygons', {data: ctx.user.polygons});
        },
        async updateUserPreferences(_, args, ctx) {
            await User.update({"_id": ctx.user._id}, {userPreference: args.newPreferences});
            if(ctx.user.userPreference.cityId !== args.newPreferences.cityId) {
                await User.update({"_id": ctx.user._id}, {polygons: []});
                pubsub.publish('updatePolygons', {data: []});
            }
            return args.newPreferences
        }
    },
    Subscription: {
        updatePolygons: {
            resolve: (payload) => {
                return payload.data
            },
            subscribe: () => {
                return pubsub.asyncIterator('updatePolygons')
            }
        }
    },
};

export default resolvers;