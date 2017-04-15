const _ = require('underscore');
const password = require('pwd');
const users = require('../models/users');
const jsonToken = require('../libs/token');

module.exports.routes = function(api, config) {

  api.route('/login')
    /**
     * @api {post} /login Login
     * @apiGroup Login
     *
     * @apiParam {String} username Username
     * @apiParam {String} password User's password
     *
     * @apiSuccess {Object} user User Object
     * @apiSuccess {String} token User token to access api requests
     * @apiSuccess {String} message Defining response's status
     *
     * @apiError Unauthorized Invalid token sent
     */
    .post(function(request, response, next) {
      var username = request.body.username;
      var password = request.body.password;
      var condition = { "username": username };

      if (!username || !password) {
        return res.status(400).json({ message: process.env.BAD_REQUEST });
      }

      users
        .findOne(condition)
        .select('-__v')
        .exec(function(err, user) {
          if (!_.isEmpty(user)) {
            if (!request.body.password) { //handles undefined password
              request.body.password = '';
            }
            password.hash(password, user.salt).then(function(result) {
              if (user.password === result.hash) {
                var token = jsonToken.generate(user._id, user.username);
                var data = {};
                for (var field in user) {
                  if (_.contains(config.get('users').fields, field))
                    data[field] = user[field];
                }
                return res.json({ user: data, token: token, message: "welcome" });
              } else {
                return res.status(401).json({ message: "unauthorized user" });
              }
            });
          } else {
            return res.status(401).json({ message: "unauthorized user" });
          }
        })
    });

}