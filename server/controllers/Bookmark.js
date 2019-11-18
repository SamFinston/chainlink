const models = require('../models');

const Link = models.Link;

const mainPage = (req, res) => {
  Link.LinkModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), links: docs });
  });
};

const addLink = (req, res) => {
  if (!req.body.name || !req.body.url || !req.body.category) {
    return res.status(400).json({ error: 'Whoops! All fields are required' });
  }

  const linkData = {
    name: req.body.name,
    url: req.body.url,
    category: req.body.category,
    owner: req.session.account._id,
  };

  const newLink = new Link.LinkModel(linkData);

  const linkPromise = newLink.save();

  linkPromise.then(() => res.json({ redirect: '/main' }));

  linkPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Link already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return linkPromise;
};

const getLinks = (request, response) => {
  const req = request;
  const res = response;

  return Link.LinkModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }

    return res.json({ links: docs });
  });
};

const removeLink = (request, response) => {
  const req = request;
  const res = response;

  return Link.LinkModel.remove(req.session.account._id, req.body.name, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }

    return res.json({ links: docs });
  });
};

module.exports.mainPage = mainPage;
module.exports.getLinks = getLinks;
module.exports.removeLink = removeLink;
module.exports.add = addLink;
