#!/usr/bin/env node
class Spinner {
    text;
    constructor() {
        this.text = "";
    this.frames = [
      "\x1b[34m⣾\x1b[0m",
      "\x1b[35m⣽\x1b[0m",
      "\x1b[36m⣻\x1b[0m",
      "\x1b[33m⢿\x1b[0m",
      "\x1b[32m⡿\x1b[0m",
      "\x1b[31m⣟\x1b[0m",
      "\x1b[30m⣯\x1b[0m",
      "\x1b[34m⣷\x1b[0m",
    ];
    this.interval = null;
  }

  start() {
    let i = 0;
    this.interval = setInterval(() => {
      process.stdout.write("\r" + this.frames[7-i]+" " + this.text);
      i = (i + 1) % this.frames.length;
    }, 100);
  }

  stop() {
    clearInterval(this.interval);
    process.stdout.clearLine();  
    process.stdout.cursorTo(0);
    }
    addData(data) {
        this.stop();
        this.text = data; 
        this.start();
    }
    removeData(data) {
        
        this.stop();
        this.text = ""; 
        this.start();
    }

}

module.exports = Spinner;
