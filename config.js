import dotenv from 'dotenv';
dotenv.config({ silent: true });
export const {
    JWT_SECRET,
    PORT
} = process.env;
export default JWT_SECRET;