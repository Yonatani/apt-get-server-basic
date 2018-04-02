import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  allPolygons: [Polygon]!
  getUserPreferences: userPreference!
  getFortuneCookie: String @cacheControl(maxAge: 5)
  jwt: String
}
type Mutation {
  findOrCreateUser(userData: UserInput!): jwt
  addPolygon(polygon: PolygonInput): [Polygon]
  removePolygon(polygonId: ID!): Polygon
  updateUserPreferences(newPreferences: userPreferenceInput!): userPreference
}
type Subscription {
  updatePolygons: [Polygon]!
}
input PolygonInput {
  coordinates: [CoordinateInput!]!
}
type Polygon {
  id: ID!
  coordinates: [Coordinate!]!
}
type jwt {
  token: String!
}
type User {
  id: ID!
  username: String!
  facebookToken: String!
  createdAt: String!
  updatedAt: String!
  polygons: [Polygon]!
  userPreference: userPreference!
}
type userPreference {
    cityId: Int!
    numberOfRooms: Int!
    price: [Int!]!
}
input userPreferenceInput {
    cityId: Int!
    numberOfRooms: Int!
    price: [Int!]!
}
input UserInput {
  facebookToken: String!
  username: String!
  userPreference: userPreferenceInput
}
type Coordinate {
  longitude: Float!
  latitude: Float!
}
input CoordinateInput {
  longitude: Float!
  latitude: Float!
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
