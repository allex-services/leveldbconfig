function createTasks(execlib) {
  return [{
    name: 'hookToLevelDBConfig',
    klass: require('./tasks/hookToLevelDBConfig')(execlib)
  }];
};

module.exports = createTasks;
