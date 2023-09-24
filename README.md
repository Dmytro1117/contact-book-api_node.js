# Node.js Task-2

## Критерії прийому

- Створено репозиторій з домашнім завданням — CLI додаток.
- Посилання на репозиторій надіслане ментору на перевірку.
- Код відповідає технічному завданню проєкту.
- При виконанні коду не виникає необроблених помилок.
- Назва змінних, властивостей і методів записана в нотації СamelCase.
- Використовуються англійські слова, назви функцій та методів містять дієслово.
- У коді немає закоментованих ділянок коду.
- Проєкт коректно працює з актуальною LTS-версією Node.

## Крок 1

Створи гілку `02-express` з гілки master.

Встанови командою пакети

```
npm i
```

Такі пакети є в проекті:

- [express](https://www.npmjs.com/package/express)
- [morgan](https://www.npmjs.com/package/morgan)
- [cors](https://www.npmjs.com/package/cors)

#### Крок 2

У `app.js` - веб сервер на `express` і прошарки `morgan` і `cors`. Почни налаштовувати раутінг для
роботи з колекцією контактів.

REST API повинен підтримувати такі раути.

**@ GET /api/contacts**

- Нічого не отримує;
- викликає функцію `listContacts` для роботи з json-файлом `contacts.json`;
- повертає масив всіх контактів в json-форматі зі статусом `200`.

**@ GET /api/contacts/:id**

- Не отримує 'body';
- отримує параметр 'id';
- викликає функцію `getById` для роботи з json-файлом `contacts.json`;
- якщо такий `id` є, повертає об'єкт контакту в json-форматі зі статусом `200`;
- якщо такого `id` немає, повертає json з ключем `"message": "Not found"` і статусом `404`.

**@ POST /api/contacts**

- Отримує `body` в форматі `{name, email, phone}` (усі поля обов'язкові);
- якщо в body немає якихось обов'язкових полів, повертає json з ключем
  `{"message": "missing required name field"}` і статусом `400`;
- якщо з `body` все добре, додає унікальний ідентифікатор в об'єкт контакту;
- викликає функцію `addContact(body)` для збереження контакту в файлі `contacts.json`;
- за результатом роботи функції повертає об'єкт з доданим `id` `{id, name, email, phone}` і статусом
  `201`.

**@ DELETE /api/contacts/:id**

- Не отримує `body`;
- отримує параметр `id`;
- викликає функцію `removeContact` для роботи з json-файлом `contacts.json`;
- якщо такий `id` є, повертає json формату `{"message": "contact deleted"}` і статусом `200`;
- якщо такого `id` немає, повертає json з ключем `"message": "Not found"` і статусом `404`.

**@ PUT /api/contacts/:id**

- Отримує параметр `id`;
- отримує `body` в json-форматі c оновленням будь-яких полів `name, email и phone`;
- якщо `body` немає, повертає json з ключем `{"message": "missing fields"}` і статусом `400`;
- якщо з `body` всі добре, викликає функцію `updateContact(contactId, body)`. (Напиши її) для
  поновлення контакту в файлі `contacts.json`;
- за результатом роботи функції повертає оновлений об'єкт контакту і статусом `200`. В іншому
  випадку, повертає json з ключем `"message": "Not found"` і статусом `404`.

#### Крок 3

Для маршрутів, що приймають дані ('POST' та 'PUT'), продумайте перевірку (валідацію) отриманих
даних. Для валідації прийнятих даних використовуйте пакет [joi](https://github.com/sideway/joi).
