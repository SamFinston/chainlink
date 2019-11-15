const models = require('../models');

const Domo = models.Domo;

const getFavicons = require('get-website-favicon');

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.talent) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return getFavicons(req.body.talent).then(data => {
    console.dir(data.icons[0].src);

    const domoData = {
      name: req.body.name,
      talent: req.body.talent,
      owner: req.session.account._id,
      icon: data.icons[1].src,
    };

    const newDomo = new Domo.DomoModel(domoData);

    const domoPromise = newDomo.save();

    domoPromise.then(() => res.json({ redirect: '/maker' }));

    domoPromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Domo already exists' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });

    return domoPromise;
  }).catch((e) => {
    console.log(e);
    const domoData = {
      name: req.body.name,
      talent: req.body.talent,
      owner: req.session.account._id,
      icon: "assets/img/ricon.ico",
    };

    const newDomo = new Domo.DomoModel(domoData);

    const domoPromise = newDomo.save();

    domoPromise.then(() => res.json({ redirect: '/maker' }));

    domoPromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Domo already exists' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });

    return domoPromise;
  });
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }

    // console.dir(docs[0]._doc.name);

    return res.json({ domos: docs });
  });
};

const removeDomo = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.remove(req.session.account._id, req.body.name, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }

    return res.json({ domos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.removeDomo = removeDomo;
module.exports.make = makeDomo;
