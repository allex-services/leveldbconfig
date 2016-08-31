function createServiceUser(execlib, ParentUser) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  if (!ParentUser) {
    ParentUser = execlib.execSuite.ServicePack.Service.prototype.userFactory.get('user');
  }

  function ServiceUser(prophash) {
    ParentUser.call(this, prophash);
  }
  
  ParentUser.inherit(ServiceUser, require('../methoddescriptors/serviceuser'), [/*visible state fields here*/]/*or a ctor for StateStream filter*/);
  ServiceUser.prototype.__cleanUp = function () {
    ParentUser.prototype.__cleanUp.call(this);
  };

  ServiceUser.prototype.putDefaultValues = function(dfltVal,defer){
    qlib.promise2defer(this.__service.putDefaultValues(dfltVal),defer);
  };

  return ServiceUser;
}

module.exports = createServiceUser;