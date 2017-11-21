
class StopWatch {

  start() {
    this.startDate = new Date();
  }

  stop() {
    const stopDate = new Date();
    const diffData = stopDate - this.startDate;
    return diffData;
  }
}

module.exports = StopWatch;
