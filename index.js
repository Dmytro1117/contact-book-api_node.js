const { program } = require("commander");

const contacts = require("./db/contacts");

const invokeAction = async ({ action, id, name, email, phone }) => {
  switch (action) {
    case "list":
      const allBooks = await contacts.listContacts();
      console.table(allBooks);
      break;
    case "get":
      const oneBook = await contacts.getContactById(id);
      console.table(oneBook);
      break;
    case "add":
      const newBook = await contacts.addContact({ name, email, phone });
      console.table(newBook);
      break;
    case "update":
      const updateBook = await contacts.updateById(id, { name, email, phone });
      console.table(updateBook);
      break;
    case "remove":
      const removeBook = await contacts.removeContact(id);
      console.table(removeBook);
      break;
    default:
      console.warn("\x1B[31m Unknown action type!");
  }
};

program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "contact id")
  .option("-n, --name <type>", "contact name")
  .option("-e, --email <type>", "contact email")
  .option("-p, --phone <type>", "contact phone");

program.parse();

const options = program.opts();
invokeAction(options);
