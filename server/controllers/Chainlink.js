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

  if (!req.body.order) {
    return res.status(400).json({ error: 'Something is wrong' });
  }

  let p = false;
  if (req.body.private) p = true;

  return getFavicons(req.body.url).then(data => {
    const arr = ['assets/img/favicon.ico'];
    for (let i = 0; i < data.icons.length; i++) {
      arr.push(data.icons[i].src);
    }

    const linkData = {
      name: req.body.name,
      url: req.body.url,
      owner: req.session.account._id,
      images: data.icons,
      icon: data.icons[0].src,
      private: p,
      order: req.body.order,
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
      icon: 'assets/img/favicon.ico',
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

  if (req.query.private === 'false') {
    return Chainlink.LinkModel.findByOwner(req.session.account._id, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error has occured' });
      }

      return res.json({ links: docs });
    });
  }

  return Chainlink.LinkModel.findPrivate(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }

    return res.json({ links: docs });
  });
};

const editLink = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.name || !req.body.url) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  let p = false;
  if (req.body.private) p = true;

  console.dir(req.body);

  return Chainlink.LinkModel.findByName(req.session.account._id, req.body.oldName, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }

    const obj = docs;
    obj.name = req.body.name;
    obj.url = req.body.url;
    obj.private = p;
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

const swapKey = (key, object1, object2) => {
  const obj1 = object1;
  const obj2 = object2;

  const temp = obj1[key];
  obj1[key] = obj2[key];
  obj2[key] = temp;
};

const sort = (request, response) => {
  const req = request;
  const res = response;

  const name = req.body.name;
  console.dir(`swapping ${name}...`);

  return Chainlink.LinkModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }

    const obj = docs;

    const index1 = obj.findIndex((element) => element.name === req.body.name);

    let index2;
    if (req.body.up === 'true') {
      index2 = index1 - 1;
      if (index2 < 0) index2 = index1;
    } else {
      index2 = index1 + 1;
      if (index2 >= req.body.total) index2 = index1;
    }

    // const tempName = obj[index1].name;
    // obj[index1].name = obj[index2].name;
    // obj[index2].name = tempName;

    const object1 = obj[index1];
    const object2 = obj[index2];

    swapKey('name', object1, object2);
    swapKey('url', object1, object2);
    swapKey('icon', object1, object2);
    swapKey('images', object1, object2);
    swapKey('private', object1, object2);
    swapKey('order', object1, object2);

    const promise1 = obj[index1].save();
    promise1.then(() => res.json({ status: 'OK' }));
    promise1.catch(() => { res.status(400).json({ error: 'An error has occured' }); });

    const promise2 = obj[index2].save();
    promise2.then(() => res.json({ status: 'OK' }));
    promise2.catch(() => { res.status(400).json({ error: 'An error has occured' }); });

    return promise1;
  });
};


module.exports.mainPage = mainPage;
module.exports.getLinks = getLinks;
module.exports.removeLink = removeLink;
module.exports.make = makeLink;
module.exports.edit = editLink;
module.exports.sort = sort;
