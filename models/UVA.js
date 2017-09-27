var Promise = require("bluebird");
var request = Promise.promisify(require('request'));
Promise.promisifyAll(request);
const END_POINT = 'http://uhunt.felix-halim.net/api';

class UVA {

  static uname2uid(username) {
    var url = END_POINT + '/uname2uid/' + username;
    return request(url);
  };

  static getProblems() {
    var url = END_POINT + '/p';
    return request(url);
  };

  static getProblemById(id) {
    var url = END_POINT + '/p/id/' + id;
    return request(url);
  };

  static getProblemByNum(num) {
    var url = END_POINT + '/p/num/' + num;
    return request(url);
  };

  static getSubmissions(uid) {
    var url = END_POINT + '/subs-user/' + uid;
    return request(url);
  };

  static getSubmissionsByUsername(username) {
    return UVA.uname2uid(username)
            .then(function(uid) {
              return UVA.getSubmissions(uid.body);
            });
  };

  static compareBySolves(p1, p2) {
    const SOLVES = 3;
    return Number(p2[SOLVES]) - Number(p1[SOLVES]);
  }

};

module.exports = UVA;
