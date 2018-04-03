import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  # get user profile
  getUserProfile: User!
  # get users preferences(city, numberOfRooms, price)
  getUserPreferences: userPreference!
  jwt: String
  # get all of the user polygons
  allPolygons: [Polygon]!
}
type Mutation {
  # find a user or create if doesnt exists, and sends back token
  findOrCreateUser(userData: UserInput!): jwt
  # add a polygon to user's polygons array
  addPolygon(polygon: PolygonInput): [Polygon]
  # remove a polygon from user's polygons array
  removePolygon(polygonId: ID!): Polygon
  # update user's preferences
  updateUserPreferences(newPreferences: userPreferenceInput!): userPreference
}
type Subscription {
  # websocket to update client with changes on user's polygons 
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
    # cityId, the cities array exists on the client.
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
