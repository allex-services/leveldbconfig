function createServicePack(execlib) {
  'use strict';
  return {
    service: {
      dependencies: ['allex_leveldbwithlogservice', 'allex:leveldbconfig:lib']
    },
    sinkmap: {
      dependencies: ['allex_leveldbwithlogservice']
    }, 
    tasks: {
      dependencies: []
    }
  }
}

module.exports = createServicePack;
