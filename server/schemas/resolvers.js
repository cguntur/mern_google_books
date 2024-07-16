const { User} = require('../models');
const { signToken, AuthenticationError, decryptToken } = require('../utils/auth');

const resolvers = {
  Query:{
    users: async () => {
      return User.find({});
    },

    user: async (parent, args, context) => {
      return User.findOne({
      _id: context.user._id
      });
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    }
  },

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });      
      const token = signToken(user);
      return { token, user };
    },

    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, args, context) => {
      const userId = decryptToken(args.token);
      //return User.findById("668449ddd087aaa5cefc693d");
      //return {
      // "_id": "668449ddd087aaa5cefc693d",
      // "username": "testuser2",
      // "email": "testuser2@gmail.com",
      // "password": userId,
      // "savedBooks": [{
      // "bookId": args.bookId,
      // "authors": args.authors,
      // "description": args.description,
      // "image": args.image,
      // "link": args.link,
      // "title": args.title,
      // }]
      //};
      
      if (!userId) {
        throw new Error("Unauthenticated");
      }
      
      return await User.findOneAndUpdate(
      { 
        _id: userId 
      },
      {
        $addToSet: {
          savedBooks: { bookId: args.bookId, title: args.title, description: args.description }
        }
      },
      {
        new: true,
        runValidators: true
      });
    },

    deleteBook: async(parent, args, context) =>{
      if(context.user){
        return await User.findOneAndUpdate({
          _id: context.user._id
        },
        {
          $pull: {
            savedBooks: {
              bookId: args.bookId
            }
          }
        },
        {
          new: true
        }
      )}
      throw AuthenticationError;
    }
  }
};

module.exports = resolvers;