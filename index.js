function createServicePack(execlib) {
  'use strict';
  return {
    service: {
      dependencies: ['allex:leveldbwithlog', 'allex:leveldbconfig:lib']
    },
    sinkmap: {
      dependencies: ['allex:leveldbwithlog']
    }, 
    tasks: {
      dependencies: []
    }
  }
}

module.exports = createServicePack;
