const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
          return User.find({});
        },

        user: async (parent, {userId}) => {
          return User.findOne({
            _id: userId
          });
        },

        books: async (parent, { _id }) => {
          const params = _id ? { _id } : {};
          return Book.find(params);
        },
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
          if(context.user){
            return User.findOneAndUpdate(
              { _id: context.user._id },
              { 
                $addToSet: { 
                  savedBooks: args
                }
              },
              { 
                new: true, 
                runValidators: true 
              }
            );
          }
          throw AuthenticationError;
        },

        deleteBook: async (parent, args, context) => {
          if(context.user) {
            return await User.findOneAndUpdate(
              { _id: context.user._id },
              { 
                $pull: { 
                  savedBooks: { 
                    bookId: args.bookId 
                  }
                }
              },
              { new: true }
            )
          }
          throw AuthenticationError;
        }
      }
}

module.exports = resolvers;