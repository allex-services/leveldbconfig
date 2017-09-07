function createLevelDBConfigService(execlib, ParentService, leveldbconfiglib) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib,
    LevelDBConfigMixin = leveldbconfiglib.LevelDBConfigMixin;
  

  function factoryCreator(parentFactory) {
    return {
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')),
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')) 
    };
  }

  function LevelDBConfigService(prophash) {
    ParentService.call(this, prophash);
    LevelDBConfigMixin.call(this, prophash);
  }
  
  ParentService.inherit(LevelDBConfigService, factoryCreator);
  LevelDBConfigMixin.addMethods(LevelDBConfigService);
  
  LevelDBConfigService.prototype.__cleanUp = function() {
    LevelDBConfigMixin.prototype.destroy.call(this);
    ParentService.prototype.__cleanUp.call(this);
  };

  LevelDBConfigService.prototype.isInitiallyReady = function (prophash){
    return false;
  };

  LevelDBConfigService.prototype.putDefaultValues = function(dfltVal){
    var promiseArry = [];
    this.fields.forEach(this._putDefault.bind(this,promiseArry,dfltVal));
    return q.all(promiseArry).then(
      this.readyToAcceptUsersDefer.resolve.bind(this.readyToAcceptUsersDefer,true),
      console.error.bind(console,'Error on putting default')
    );
  };

  LevelDBConfigService.prototype.propertyHashDescriptor = {
    path: {
      type: ['string', 'array'],
      items: {type: 'string'}
    },
    fields: {
      type: 'array',
      items: {type: 'string'}
    }
  };
  
  return LevelDBConfigService;
}

module.exports = createLevelDBConfigService;
