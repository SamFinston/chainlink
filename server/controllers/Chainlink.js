const models = require('../models');

const Chainlink = models.Chainlink;

const getFavicons = require('get-website-favicon');

const mainPage = (req, res) => {
  Chainlink.LinkModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), links: docs });
  });
};

const makeLink = (req, res) => {
  if (!req.body.name || !req.body.url) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return getFavicons(req.body.url).then(data => {
    console.dir(data.icons[0].src);

    const linkData = {
      name: req.body.name,
      url: req.body.url,
      owner: req.session.account._id,
      icon: data.icons[1].src,
    };

    const newLink = new Chainlink.LinkModel(linkData);

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
  }).catch((e) => {
    console.log(e);
    const linkData = {
      name: req.body.name,
      url: req.body.url,
      owner: req.session.account._id,
      icon: 'assets/img/ricon.ico',
    };

    const newLink = new Chainlink.LinkModel(linkData);

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
  });
};

const getLinks = (request, response) => {
  const req = request;
  const res = response;

  return Chainlink.LinkModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }

    // console.dir(docs[0]._doc.name);

    return res.json({ links: docs });
  });
};

const editLink = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.name || !req.body.url) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  console.dir(req.body);

  return Chainlink.LinkModel.findByName(req.session.account._id, req.body.oldName, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }

    const obj = docs;
    obj.name = req.body.name;
    obj.url = req.body.url;
    const promise = docs.save();
    promise.then(() => res.json({ status: 'OK' }));
    promise.catch(() => { res.status(400).json({ error: 'An error has occured' }); });

    return promise;
  });
};

const removeLink = (request, response) => {
  const req = request;
  const res = response;

  return Chainlink.LinkModel.remove(req.session.account._id, req.body.name, (err, docs) => {
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
module.exports.make = makeLink;
module.exports.edit = editLink;
