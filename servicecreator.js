function createLevelDBConfigService(execlib, ParentService) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;
  

  function factoryCreator(parentFactory) {
    return {
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')),
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')) 
    };
  }

  function LevelDBConfigService(prophash) {
    ParentService.call(this, prophash);
    this.fields = prophash.fields.slice();
  }
  
  ParentService.inherit(LevelDBConfigService, factoryCreator);
  
  LevelDBConfigService.prototype.__cleanUp = function() {
    this.fields = null;
    ParentService.prototype.__cleanUp.call(this);
  };

  LevelDBConfigService.prototype.isInitiallyReady = function (prophash){
    return false;
  };

  LevelDBConfigService.prototype._putDefault = function(promiseArry,dfltVal,field){
    promiseArry.push(this.put(field,dfltVal));
  };

  LevelDBConfigService.prototype.putDefaultValues = function(dfltVal){
    var promiseArry = [];
    this.fields.forEach(this._putDefault.bind(this,promiseArry,dfltVal));
    return q.all(promiseArry).then(
      this.readyToAcceptUsersDefer.resolve.bind(this.readyToAcceptUsersDefer,true),
      console.error.bind(console,'Error on putting default')
    );
  };

  LevelDBConfigService.prototype.put = function(key,value){
    if (this.fields.indexOf(key) < 0){
      return q.reject(new lib.Error('NOT_A_CONFIG_FIELD',key));
    }
    return ParentService.prototype.put.call(this,key,value);
  };

  LevelDBConfigService.prototype.safeGet = function(key, deflt){
    if (this.fields.indexOf(key) < 0){
      return q.reject(new lib.Error('NOT_A_CONFIG_FIELD',key));
    }
    return ParentService.prototype.safeGet.call(this,key,deflt);
  };

  LevelDBConfigService.prototype.getWDefault = function(key, deflt){
    if (this.fields.indexOf(key) < 0){
      return q.reject(new lib.Error('NOT_A_CONFIG_FIELD',key));
    }
    return ParentService.prototype.getWDefault.call(this,key,deflt);
  };

  LevelDBConfigService.prototype._configPutter = function (retobj, conffieldname) {
    var _q = q,
      ret = this.get(conffieldname).then(function (conffieldvalue) {
        var ret = _q(true);
        retobj[conffieldname] = conffieldvalue;
        _q = null;
        retobj = null;
        conffieldname = null;
        return ret;
      });
    return ret;
  };

  LevelDBConfigService.prototype.getConfig = function(){
    var ret = {}, promises = this.fields.map(this._configPutter.bind(this, ret));
    return q.all(promises).then(
      qlib.returner(ret)
    );
  };

  LevelDBConfigService.prototype.propertyHashDescriptor = {
    fields: {
      type: 'array',
      items: {type: 'string'}
    }
  };
  
  return LevelDBConfigService;
}

module.exports = createLevelDBConfigService;
