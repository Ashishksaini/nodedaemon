#!/usr/bin/env node

const process = require("process");
const Spinner = require("./Spinner");
const { spawn } = require("child_process");
const fs = require("fs");
const logWithGradient = require("./logWithGradient");
const path = process.cwd();
//spinner
const spinner = new Spinner();
// colors
const redColor = "\x1b[31m";
const greenColor = "\x1b[32m";
const grayColor = "\x1b[90m";
const resetColor = "\x1b[0m";
const blueColor = "\x1b[34m";

process.stdin.setEncoding("utf-8");

const cmds = process.argv;

logWithGradient(`
███╗░░██╗░█████╗░██████╗░███████╗  ██████╗░░█████╗░███████╗███╗░░░███╗░█████╗░███╗░░██╗
████╗░██║██╔══██╗██╔══██╗██╔════╝  ██╔══██╗██╔══██╗██╔════╝████╗░████║██╔══██╗████╗░██║
██╔██╗██║██║░░██║██║░░██║█████╗░░  ██║░░██║███████║█████╗░░██╔████╔██║██║░░██║██╔██╗██║
██║╚████║██║░░██║██║░░██║██╔══╝░░  ██║░░██║██╔══██║██╔══╝░░██║╚██╔╝██║██║░░██║██║╚████║
██║░╚███║╚█████╔╝██████╔╝███████╗  ██████╔╝██║░░██║███████╗██║░╚═╝░██║╚█████╔╝██║░╚███║
╚═╝░░╚══╝░╚════╝░╚═════╝░╚══════╝  ╚═════╝░╚═╝░░╚═╝╚══════╝╚═╝░░░░░╚═╝░╚════╝░╚═╝░░╚══╝`)
console.log(`\n\n\n\n`);
cmds.shift()
cmds.shift();
spinner.start();

const stdoutCallback = (data) => {
    console.log(grayColor + data.toString("utf-8"));
    console.log(resetColor);
};

const stderrCallback = (data) => {
    logWithGradient("Erorr :");
    console.log(redColor +"\n " + data.toString("utf-8"));
    console.log(resetColor);
};

const closeCallback = (i) => {
    logWithGradient("completed Execution  : " + i);
    console.log(resetColor);
};
const processes = cmds.map((cmd, i) => {
    let currpath = path + "\\" + cmd;
    spinner.start();
    spinner.addData(logWithGradient("Loading " + cmd, false));
    if (!fs.existsSync(currpath)) {
      return console.log(redColor + "Cannot find the File " + cmd + "at this path\n");
    }
  return spawn("node", [currpath]);
});
spinner.removeData();
spinner.stop();
const listenEvents = (pr,i) => {
    if (!pr) { 
        console.log(redColor+"cannot listen to process" + i);
        return; 
    }
    pr.on("data",stdoutCallback)
  pr.stdout.on("data", stdoutCallback);
  pr.stderr.on("data", stderrCallback);
  pr.on("close", () => closeCallback(i));
}
spinner.stop();
processes.map((pr, i) => {
    let  currpath = path + "\\" + cmds[i];
    if (!pr) { 
        console.log("cannot listen to process" + currpath);
        return; 
    }
    listenEvents(pr,path+"\\"+cmds[i]);
});

cmds.map((cmd, i) => {
  let currpath = path + "\\" + cmd;
    fs.watchFile(currpath, { persistent: true, interval: 100 }, () => {
        if (!fs.existsSync(currpath)) { 
            return console.log(redColor + "Cannot find the File "+cmd + " at this path\n");
        }
        processes[i].stdout.removeListener("data", stderrCallback);
        processes[i].stderr.removeListener("data", stderrCallback);
        processes[i].removeListener("close", closeCallback);
        processes[i].kill();
        spinner.start();
        spinner.addData("Restarting " + cmd);
        processes[i] = spawn("node", [currpath]);
        spinner.removeData();
        spinner.stop();
        logWithGradient("Recompiled  : " + cmd);
        console.log(resetColor);
    listenEvents(processes[i], currpath);
  });
});
process.on("uncaughtException", () => {
    console.log(redColor + "\nSomething Went Wrong 😭😭");
    console.log(resetColor);
    process.kill(1);
})
process.on("SIGINT", () => {
    logWithGradient("Good Bye 🙂🙂🙂")
    console.log(resetColor);
    process.kill(0);
})