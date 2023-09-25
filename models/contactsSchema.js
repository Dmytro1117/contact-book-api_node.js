const { Schema, model } = require("mongoose");
const Joi = require("joi");

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.bool(),
});

const favoriteJoiSchema = Joi.object({
  favorite: Joi.bool().required(),
});

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  joiSchema,
  favoriteJoiSchema,
};

// const fs = require("fs/promises");
// const path = require("path");
// const { nanoid } = require("nanoid");

// const contactsPath = path.join(__dirname, "./contacts.json");

// const updateContacts = async (contacts) =>
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

// const listContacts = async ()=> {
//     const data = await fs.readFile(contactsPath);
//     return JSON.parse(data);
// }

// const getContactById = async(contactId) => {
//     const contacts = await listContacts();
//     const result = contacts.find(item => item.id === contactId);
//     return result || null;
// }

// const addContact = async({name, email, phone }) => {
//     const contacts = await listContacts();
//     const newContact = {
//         id: nanoid(),
//         name,
//         email,
//         phone,
//     };
//     contacts.push(newContact);
//     await updateContacts(contacts);
//     return newContact;
// }

// const updateById = async(id, {name, email, phone})=> {
//     const contacts = await listContacts();
//     const index = contacts.findIndex(item => item.id === id);
//     if(index === -1){
//         return null;
//     }
//     contacts[index] = {id, name, email, phone};
//     await updateContacts(contacts);
//     return contacts[index];
// }

// const removeContact = async(contactId)=> {
//     const contacts = await listContacts();
//     const index = contacts.findIndex(item => item.id === contactId);
//     if(index === -1){
//         return null;
//     }
//     const [result] = contacts.splice(index, 1);
//     await updateContacts(contacts);
//     return result;
// }

// module.exports = {
//     listContacts,
//     getContactById,
//     addContact,
//     updateById,
//     removeContact,
// }
