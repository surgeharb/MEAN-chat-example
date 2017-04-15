const statuses = require('../models/statuses');

module.exports = function(status_array) {

  (function populateStatuses() {
    statuses.create(status_array, function(err, docs) {
      if (err) {
        statuses.remove({}, function(err) {
          populateStatuses();
        })
      } else {
        console.log("Statuses collection updated");
      }
    })
  })();

}