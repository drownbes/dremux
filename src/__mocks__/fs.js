const MemoryFileSystem = require('memory-fs');

const fs = jest.genMockFromModule('fs');

module.exports = new MemoryFileSystem();