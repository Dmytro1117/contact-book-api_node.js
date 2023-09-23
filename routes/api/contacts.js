const express = require('express')
const {NotFound} = require('http-errors')
const Joi = require('joi');
const contactOperation = require("../../models/contacts")
const router = express.Router()

const contactsSchema = Joi.object({
  name: Joi.string().required(),
   email: Joi.string().email().required(),
   phone: Joi.number().required()
  })


router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactOperation.listContacts()
    res.json({
        status: "succes",
        code: 200,
        data: {
            result: contacts,
        }
    })
  } catch (error) {
    next(error)
  }
  
})

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params
    const contacts = await contactOperation.getContactById(contactId)
    if (!contacts) {
      throw new NotFound(`Sorry, contact with contactId ${contactId} not found`)
    }
    res.json({
         status: "succes",
        code: 200,
        data: {
            contacts
        }
    })
  } catch (error) {
     next(error)
  }
    
})


router.post("/", async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body)
    if (error) {
      error.status = 400
      throw error
    }
    const added = await contactOperation.addContact(req.body)
    res.status(201).json({
        status: "succes",
        code: 201,
        data: { added }
    })
  } catch (error) {
    next(error)
  }
  
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body)
    if (error) {
      error.status = 400
      throw error
    }
    const { contactId } = req.params

    const update = await contactOperation.updateById(contactId, req.body)
    if (!update) {
      throw new NotFound(`Sorry, contact with contactId ${contactId} not found`)
    }
    res.json({
        status: "succes",
        code: 200,
        data: { update }
    })
  } catch (error) {
    next(error)
  }
  
})



router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const delet = await contactOperation.removeContact(contactId)
    if (!delet) {
      throw new NotFound(`Sorry, contact with contactId ${contactId} not found`)
    }
      res.json({
        status: "succes",
        code: 200,
        message: "contact deleted",
        data: { delet }
    })
  } catch (error) {
     next(error)
  }

})



module.exports = router
