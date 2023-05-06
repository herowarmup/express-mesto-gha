const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя карточки должно быть заполнено'],
    minlength: [2, 'Минимальная длина имени карточки - 2 символа'],
    maxlength: [30, 'Максимальная длина имени карточки - 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Ссылка на картинку должна быть заполнена'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Владелец карточки должен быть указан'],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    unique: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
