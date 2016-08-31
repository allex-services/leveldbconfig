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
  qlib = lib.qlib;
  confsink.call('getConfig').then(
    console.log.bind(console,'GET CONFIG'),
    console.error.bind(console,'GET CONFIG ERROR')
  );
  confsink.call('put','width',10).then(
    console.log.bind(console,'PUT WIDTH OK'),
    console.error.bind(console,'PUT WIDTH ERROR')
  );
  confsink.call('put','height',30).then(
    console.log.bind(console,'PUT WIDTH OK'),
    console.error.bind(console,'PUT WIDTH ERROR')
  );
  confsink.call('put','weight',100).then(
    console.log.bind(console,'PUT WIDTH OK'),
    console.error.bind(console,'PUT WIDTH ERROR')
  );
}

module.exports = {
  sinkname: 'Config',
  identity: {name: 'user', role: 'user'},
  task: {
    name : go
  }
};
