const _ = require("underscore");
const jsonToken = require('./libs/token.js');

module.exports = function(router, config) {

  // route middleware that will happen on every request
  router.use(function(req, res, next) {

    if (_.contains(config.get("allowedRoutes"), req.method + " " + req.url)) { //routes that do not need any authorization
      next();
    } else {
      if (typeof(req.headers.authorization) == "undefined") {
        return res.status(401).json({ message: 'missing authorization header' });
      } else { //other api routes that needs JWT authorization
        jsonToken.verify(req.headers.authorization, 'chat')
          .then(function(response) {
            if (response.message === 'verified') {
              next();
            } else {
              return res.status(401).json(response.message);
            }
          })
          .catch(function() {
            return res.status(401).json({ message: 'invalid authorization header' });
          })
      }
    }
  });

}