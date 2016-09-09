function createServicePack(execlib) {
  'use strict';
  return {
    service: {
      dependencies: ['allex:leveldbwithlog']
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
