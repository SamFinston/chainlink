const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let LinkModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const LinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  url: {
    type: String,
    required: true,
    trim: true,
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

  category: {
    type: String,
    required: true,
    default: 'bookmark',
    trim: true,
  },

  image: {
    type: String,
  },

  images: {
    type: Array,
    default: ['assets/img/favicon.ico'],
    required: true,
  },

  private: {
    type: Boolean,
    default: false,
    required: true,
  },
});

LinkSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  url: doc.url,
  category: doc.category,
});

LinkSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return LinkModel.find(search).select('name url category').exec(callback);
};

LinkSchema.statics.findByCategory = (ownerId, category, callback) => {
  const search = {
    owner: convertId(ownerId),
    category,
  };

  return LinkModel.find(search).select('name age talent').exec(callback);
};

LinkSchema.statics.remove = (ownerId, name, callback) => {
  const search = {
    owner: convertId(ownerId),
    name,
  };

  return LinkModel.deleteOne(search).exec(callback);
};

LinkModel = mongoose.model('Link', LinkSchema);

module.exports.LinkModel = LinkModel;
module.exports.LinkSchema = LinkSchema;
