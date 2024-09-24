const FolderMonitor = require('./FolderMonitor');

const monitor = new FolderMonitor('./Test');

monitor.addObserver({
  update(eventType, filePath) {
    updateMessage = `${filePath} has been ${eventType}d`;
    console.log(updateMessage);
    return updateMessage;
  },
});

monitor.startMonitoring();
setInterval(() => {
  monitor.writeHistory();
}, 1000);
