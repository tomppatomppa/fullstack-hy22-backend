const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to Mongo DB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDb', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{2,4}-\d{7}/.test(v)
      },
      message: (props) => `${props.message} is not a valid phone number`,
    },
    required: [true, 'User phone number required'],
  },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
module.exports = mongoose.model('Person', personSchema)
