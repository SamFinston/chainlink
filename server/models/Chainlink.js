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

  // private: {
  //   type: Boolean,
  //   default: false,
  //   required: true,
  // },
});

LinkSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  url: doc.url,
  icon: doc.icon,
});

LinkSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return LinkModel.find(search).select('name url icon').exec(callback);
};

LinkSchema.statics.findByName = (ownerId, name, callback) => {
  const search = {
    owner: convertId(ownerId),
    name,
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
