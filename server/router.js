const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getLinks', mid.requiresLogin, controllers.Domo.getLinks);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/password', mid.requiresSecure, mid.requiresLogin, controllers.Account.passwordPage);
  app.post('/password', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/main', mid.requiresLogin, controllers.Domo.mainPage);
  app.post('/main', mid.requiresLogin, controllers.Domo.make);
  app.post('/edit', mid.requiresLogin, controllers.Domo.edit);
  app.get('/main', mid.requiresLogin, controllers.Bookmark.mainPage);
  app.post('/main', mid.requiresLogin, controllers.Bookmark.add);
  app.post('/removeLink', mid.requiresLogin, controllers.Domo.removeLink);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
