import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "@/models/User";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

const MONGO_URL = process.env.MONGO_URL; // Assuming a secure way to store the URL
const SECRET = process.env.SECRET; // Assuming a secure way to store the secret

// Establish a global Mongoose connection (assuming you have a connection function)
let client;
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const authOptions = {
  secret: SECRET,
  adapter: MongoDBAdapter(clientPromise), // Assuming clientPromise resolves to the connection
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password", placeholder: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const user = await User.findOne({ email });
        if (!user) {
          // Handle invalid email case (optional: throw an error)
          return null;
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (passwordValid) {
          return user;
        }
        return null;
      },
    }),
  ],
};

export default authOptions;
