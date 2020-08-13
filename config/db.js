const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log('connected to database'))
.catch(err => console.log('refuse to connect',err))
