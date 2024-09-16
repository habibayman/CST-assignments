const fs = require('node:fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');
require('log-timestamp'); // knew there had to be a better way than hardcoding the date stamp 🤮 https://stackoverflow.com/questions/18814221/adding-timestamps-to-all-console-messages

class FolderMonitor {
  constructor(folderPath) {
    this.folderPath = folderPath;
    this.observers = [];
    this.watcher = null;
    this.changeHistory = []; // Keep store of the changes to create a text log file
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  // Recursive => to keep watching for subfolders
  startMonitoring() {
    this.watcher = fs.watch(
      this.folderPath,
      { recursive: true },
      (eventType, filename) => {
        const fullPath = path.join(this.folderPath, filename);
        if (eventType === 'rename' && !fs.existsSync(fullPath)) {
          this.notifyObservers('delete', fullPath);
        } else {
          this.notifyObservers(eventType, fullPath);
        }
      }
    );
  }

  notifyObservers(eventType, filePath) {
    this.observers.forEach(
      (observer) =>
        this.changeHistory.push(observer.update(eventType, filePath)) // prob breaks SRP
    );
  }

  writeHistory() {
    fsPromises
      .writeFile('changesLog.txt', this.changeHistory.join('\n'))
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = FolderMonitor;
