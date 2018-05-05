const fs = require('fs');
const { debuglog } = require('util');

const log = debuglog('fs-cache');

class FsCache {
  constructor(maxSize=10000000) {
    this.maxSize = maxSize;
    this.currentCacheSize = 0;
    this.queue = [];
    this.cache = new Map();
    this.statsCache = new Map();
  }

  readFileSync(pwd) {
    const stats = this.statSync(pwd);
    const size = stats.size;

    if(this.cache.has(pwd)) {
      log('read from fs cache %s', pwd);
      return this.cache.get(pwd);
    }

    this.freeCacheSpaceIfNeeded(size);

    if(size >= this.maxSize) {
      return fs.readFileSync(pwd, 'utf-8');
    }

    let content = fs.readFileSync(pwd, 'utf-8');
    this.cache.set(pwd, content);
    log('added to fs cache %s size: +%dB', pwd, size);
    this.currentCacheSize+=size;
    return content;
  }

  freeCacheSpaceIfNeeded(size) {
    while(this.currentCacheSize > (this.maxSize - size)) {
      const excludeCandidate = this.queue.shift();
      const freedSize = Buffer.byteLength(this.cache.get(excludeCandidate));
      this.cache.delete(excludeCandidate);
      log('exclude from fs cache to free space %s', excludeCandidate);
      this.currentCacheSize -= freedSize;
    }
  }

  statSync(pwd) {
    if(this.statsCache.has(pwd)) {
      log('get stats from cache %s', pwd);
      return this.statsCache.get(pwd);
    }
    const stats = fs.statSync(pwd);
    this.statsCache.set(pwd, stats);
    log('add stats to cache %s', pwd);
    return stats;
  }

}

module.exports = new FsCache();