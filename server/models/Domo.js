const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

// const getFavicons = require('get-website-favicon');

let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
// const getFavicon = (url) => {
//   getFavicons('github.com').then(data => {
//     console.dir(data.icons[0].src);
//     return data.icons[0].src;
//   });
// };

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

  talent: {
    type: String,
    required: true,
    default: 'none',
    trim: true,
  },

  icon: {
    type: String,
    required: false,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  talent: doc.talent,
  icon: doc.icon,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name talent icon').exec(callback);
};

DomoSchema.statics.findByName = (ownerId, name, callback) => {
  const search = {
    owner: convertId(ownerId),
    name,
  };

  return DomoModel.find(search).select('name talent icon').exec(callback);
};

DomoSchema.statics.remove = (ownerId, name, callback) => {
  const search = {
    owner: convertId(ownerId),
    name,
  };

  return DomoModel.deleteOne(search).exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
