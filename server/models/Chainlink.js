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

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

  url: {
    type: String,
    required: true,
    default: 'none',
    trim: true,
  },

  icon: {
    type: String,
    required: true,
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

  order: {
    type: Number,
    default: 0,
    required: true,
  },
});

LinkSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  url: doc.url,
  icon: doc.icon,
  images: doc.images,
  private: doc.private,
  order: doc.order,
});

LinkSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return LinkModel.find(search).select('name url icon images private order').exec(callback);
};

LinkSchema.statics.findPrivate = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
    private: true,
  };

  return LinkModel.find(search).select('name url icon images private order').exec(callback);
};

LinkSchema.statics.findByName = (ownerId, name, callback) => {
  const search = {
    owner: convertId(ownerId),
    name,
  };

  return LinkModel.findOne(search).exec(callback);
};

LinkSchema.statics.findByIndex = (ownerId, index, callback) => {
  const search = {
    owner: convertId(ownerId),
    order: index,
  };

  return LinkModel.findOne(search).exec(callback);
};

LinkSchema.statics.remove = (ownerId, name, callback) => {
  const search = {
    owner: convertId(ownerId),
    name,
  };

  return LinkModel.deleteOne(search).exec(callback);
};

LinkModel = mongoose.model('Chainlink', LinkSchema);

module.exports.LinkModel = LinkModel;
module.exports.LinkSchema = LinkSchema;
