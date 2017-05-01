const _ = require('underscore');
const users = require('../models/users');
const jsonToken = require('../libs/token');

module.exports.routes = function (api, config) {

  api.route('/users/:username')
    /**
     * @api {get} /users/:username Get User
     * @apiGroup Users
     *
     * @apiParam {String} username Username
     *
     * @apiSuccess {Object} user User Object
     * @apiSuccess {Boolean} success Defining response's status
     *
     * @apiError Unauthorized Invalid token sent
     */
    .get(function (request, response, next) {
      var username = request.params.username;

      if (!username) {
        return response.status(400).json({ "message": process.env.BAD_REQUEST });
      }

      var token = jsonToken.decode(request.headers.authorization, 'chat');
      if (token.username != username) {
        return response.status(401).json({ "message": process.env.UNAUTHORIZED });
      } else {
        var condition = { "username": username }
      }

      users
        .findOne(condition)
        .select('-__v')
        .exec(function (err, user) {
          if (!_.isEmpty(user)) {
            var data = {};
            for (var field in user) {
              if (_.contains(config.get('users').fields, field))
                data[field] = user[field];
            }
            return response.json({ "user": data, "success": true });
          } else {
            return response.json({ "user": {}, "success": false });
          }
        })
    });

}