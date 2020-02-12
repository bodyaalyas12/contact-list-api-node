const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')

const contactsRoutes = require('./api/routes/contacts')

mongoose.connect(
	`mongodb+srv://bodyaalya12:${process.env.mongoDbPass}@cluster0-cvg0p.mongodb.net/test?retryWrites=true&w=majority`,
	{ useUnifiedTopology: true, useNewUrlParser: true }
)
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/images',express.static('images'))

app.use('/contacts', contactsRoutes)

app.use((req, res, next) => {
	const error = new Error('Not found')
	error.status = 404
	next(error)
})

app.use((error, req, res, next) => {
	res.status(error.status || 500)
	res.json({
		error: {
			message: error.message
		}
	})
})
module.exports = app
