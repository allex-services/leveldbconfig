function createHookToLevelDBConfigTask (execlib) {
  'use strict';
  var lib = execlib.lib,
      q = lib.q,
      execSuite = execlib.execSuite,
      Task = execSuite.Task;

  function HookToLevelDBConfigTask(prophash){
    Task.call(this,prophash);
    this.sink = prophash.sink;
    this.onConfig = prophash.onConfig;
    this.onConfigChange = prophash.onConfigChange;
    this.listenableMap = prophash.listenableMap;
    this.listenableName = prophash.listenableName;
    this.defer = prophash.defer || q.defer();
  }

  lib.inherit(HookToLevelDBConfigTask,Task);

  HookToLevelDBConfigTask.prototype.destroy = function(){
    this.listenableName = null;
    this.listenableMap = null;
    this.defer = null;
    this.onConfigChange = null;
    this.onConfig = null;
    this.sink = null;
    Task.prototype.destroy.call(this);
  };

  HookToLevelDBConfigTask.prototype.go = function () {
    this.listenableMap.listenFor(this.listenableName, this.onConfigSink.bind(this),true,false);
  };

  HookToLevelDBConfigTask.prototype.onConfigSink = function(sink){
    sink.sessionCall('hook', {accounts: ['***']});
    sink.consumeChannel('l', this.onConfigChange);
    sink.call('getConfig').then(
      this.onConfig,
      this.defer.reject.bind(this.defer,new lib.Error('CANNOT_GET_CONFIG'))
    );
  };

  HookToLevelDBConfigTask.prototype.compulsoryConstructionProperties = ['listenableMap', 'listenableName', 'onConfig', 'onConfigChange'];

  return HookToLevelDBConfigTask;
};

module.exports = createHookToLevelDBConfigTask;
