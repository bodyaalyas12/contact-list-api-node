const Contact = require('../models/contact')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './images/')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	}
})

const fileFilter = (req, file, cb) => {
	// reject a file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
})

router.get('/getList', (req, res, next) => {
	Contact.find()
		.exec()
		.then(contacts => {
			res.status(200).json({
				message: 'everything is ok',
				contacts
			})
		})
})

router.post('/create', upload.single('image'), (req, res, next) => {
	// console.log(JSON.parse(req.body.body))
	const data = JSON.parse(req.body.form)
	const contact = new Contact({
		_id: new mongoose.Types.ObjectId(),
		name: data.name,
		phone: data.phone,
		info: data.info,
		...(req.file && { image: req.file.path })
	})
	contact
		.save()
		.then(result => {
			res.status(201).json({
				message: 'Contact has been created',
				contact: contact
			})
		})
		.catch(error => {
			res.status(500).json({
				message: 'smthng wrong',
				error
			})
		})
})

router.delete('/delete/:id', (req, res, next) => {
	const { id } = req.params
	Contact.deleteOne({
		_id: id
	})
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'contact succesfully deleted',
				result
			})
		})
		.catch(error => {
			res.status(500).json({
				message: 'something wrong',
				error
			})
		})
})
router.patch('/update/:id', (req, res, next) => {
	const { id } = req.params
	const { name, phone, info } = req.body
	Contact.updateOne(
		{ _id: id },
		{
			$set: {
				name,
				phone,
				info
			}
		}
	)
		.exec()
		.then(result => {
			res.status(200).json({
				message: `contact with id ${id} was succesfully updated.`
			})
		})
		.catch(error => {
			res.status(500).json({
				message: 'something wrong',
				error
			})
		})
})

module.exports = router
