import casual from 'casual';
import _ from 'lodash';
import Mongoose from 'mongoose';
import fetch from 'node-fetch';

Mongoose.Promise = global.Promise;

const mongo = Mongoose.connect('mongodb://yonitz:555556@ds213759.mlab.com:13759/firstdb', {
    useMongoClient: true
});

const UserSchema = Mongoose.Schema({
    username: {
        type: String,
        required: [true, "can't be blank"],
        index: true
    },
    facebookToken: String,
    polygons: [{coordinates: [{latitude: Number, longitude: Number}] }],
    userPreference: {cityId: {type: Number, default: 1}, numberOfRooms: {type: Number, default: 1}, price: {type: [Number], default: [1,10000]}}
}, {timestamps: true});

const User = Mongoose.model('User', UserSchema);

export { User };

// Create 10 Mock Polygons:
//
// Polygon.find({}).then(polygons => {
//
//     if (!_.isEmpty(polygons)) {
//         return;
//     }
//
//     casual.seed(123);
//     _.times(10, () => {
//         return Polygon.create(
//             {
//                 coordinates: [
//                     {
//                         latitude: casual.integer(0, 100),
//                         longitude: casual.integer(0, 100)
//                     },
//                     {
//                         latitude: casual.integer(0, 100),
//                         longitude: casual.integer(0, 100)
//                     },
//                     {
//                         latitude: casual.integer(0, 100),
//                         longitude: casual.integer(0, 100)
//                     }
//                 ]
//             });
//     });
// });