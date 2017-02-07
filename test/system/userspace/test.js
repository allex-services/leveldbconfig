function go(taskobj){
  var confsink,
    execLib,
    lib,
    q,
    qlib;
  if (!(taskobj && taskobj.sink)){
    process.exit(0);
    return;
  }
  confsink = taskobj.sink;
  execLib = taskobj.execlib;
  lib = execLib.lib;
  q = lib.q;
  qlib = lib.qlib,
  p2c = qlib.promise2console,
  executor = qlib.executor;
  execLib.execSuite.taskRegistry.run('queryLevelDB', {
    sink: confsink,
    scanInitially: true,
    filter: {
      keys: {
        op: 'eq',
        field: null,
        value: 'width'
      }
    },
    onPut: console.log.bind(console, 'qput'),
    onDel: console.log.bind(console, 'qdel')
  });
  /*
  confsink.call('getConfig').then(
    console.log.bind(console,'GET CONFIG'),
    console.error.bind(console,'GET CONFIG ERROR')
  );
  confsink.call('put','width',5+(~~(Math.random()*15))).then(
    console.log.bind(console,'PUT WIDTH OK'),
    console.error.bind(console,'PUT WIDTH ERROR')
  );
  confsink.call('put','height',10+(~~(Math.random()*20))).then(
    console.log.bind(console,'PUT WIDTH OK'),
    console.error.bind(console,'PUT WIDTH ERROR')
  );
  confsink.call('put','weight',50+(~~(Math.random()*50))).then(
    console.log.bind(console,'PUT WIDTH OK'),
    console.error.bind(console,'PUT WIDTH ERROR')
  );
  confsink.call('getConfig').then(
    console.log.bind(console,'GET CONFIG'),
    console.error.bind(console,'GET CONFIG ERROR')
  );
  */
  function p2cb (func) {
    return function () {
      return p2c(func());
    };
  }
  function ender () {
    p2c = null;
    process.exit(0);
  }
  p2c(confsink.call('getConfig'), 'GET CONFIG').then(
    executor(p2cb(confsink.call.bind(confsink, 'put','width',5+(~~(Math.random()*15)))))
  ).then(
    executor(p2cb(confsink.call.bind(confsink, 'put','height',10+(~~(Math.random()*20)))))
  ).then(
    executor(p2cb(confsink.call.bind(confsink, 'put','weight',50+(~~(Math.random()*50)))))
  ).then(
    executor(p2cb(confsink.call.bind(confsink, 'getConfig')))
  ).then(
    ender
  );
}

module.exports = {
  sinkname: 'Config',
  identity: {name: 'user', role: 'user'},
  task: {
    name : go
  }
};
