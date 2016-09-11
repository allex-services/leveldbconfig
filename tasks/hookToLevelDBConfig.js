function createHookToLevelDBConfigTask (execlib) {
  'use strict';
  var lib = execlib.lib,
      q = lib.q,
      execSuite = execlib.execSuite,
      Task = execSuite.Task;

  function HookToLevelDBConfigTask(prophash){
    Task.call(this,prophash);
    this.sink = prophash.sink;
    this.listenableMap = prophash.listenableMap;
    this.listenableName = prophash.listenableName;
    this.targetMap = prophash.targetMap;
    this.hookPreConfig = prophash.hookPreConfig || lib.dummyFunc;
    this.hookPostConfig = prophash.hookPostConfig || lib.dummyFunc;
    this.defer = prophash.defer || q.defer();
  }

  lib.inherit(HookToLevelDBConfigTask,Task);

  HookToLevelDBConfigTask.prototype.destroy = function(){
    this.targetMap = null;
    this.listenableName = null;
    this.listenableMap = null;
    this.defer = null;
    this.sink = null;
    Task.prototype.destroy.call(this);
  };

  HookToLevelDBConfigTask.prototype.go = function () {
    this.listenableMap.listenFor(this.listenableName, this.onConfigSink.bind(this),true,false);
  };

  HookToLevelDBConfigTask.prototype.onConfigSink = function(sink){
    this.targetMap.purge();
    sink.sessionCall('hook', {accounts: ['***']});
    sink.consumeChannel('l', this.onConfigChanged.bind(this));
    sink.call('getConfig').then(
      this.completeOnRecievedConfigCb.bind(this),
      this.defer.reject.bind(this.defer,new lib.Error('CANNOT_GET_CONFIG'))
    );
  };

  HookToLevelDBConfigTask.prototype.completeOnRecievedConfigCb = function(configObj){
    this.hookPreConfig(this.defer,configObj);
    this.onRecievedConfig(configObj);
    this.hookPostConfig(this.defer,configObj);
  };

  HookToLevelDBConfigTask.prototype.instantiateTargetMap = function(value,key){
    //we are modifying map only if value doesnt already exist in map
    if (lib.isUndef(this.targetMap.get(key))){
      if (value === null){
        this.targetMap.add(key,0);
        return;
      }
      if (lib.defined(value)){
        this.targetMap.add(key,value);
        return;
      }
    }
  };

  HookToLevelDBConfigTask.prototype.onRecievedConfig = function(configObj){
    lib.traverseShallow(configObj,this.instantiateTargetMap.bind(this)); //private!
    this.defer.resolve(true);
  };

  HookToLevelDBConfigTask.prototype.onConfigChanged = function(recordArry){
    var key = recordArry[0],
      value = recordArry[1];
    if (lib.isDefinedAndNotNull(value)){
      this.targetMap.add(key,value);
      return;
    }
    if (value === null){
      this.targetMap.remove(key);
      return;
    }
  };

  HookToLevelDBConfigTask.prototype.compulsoryConstructionProperties = ['listenableMap', 'listenableName','targetMap'];

  return HookToLevelDBConfigTask;
};

module.exports = createHookToLevelDBConfigTask;
