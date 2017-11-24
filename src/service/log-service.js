
const azure = require("azure-storage");
const Guid = require("guid");

class LogService {

  constructor() {
    this.tableService = azure.createTableService()
    this.logTable = process.env.LOG_TABLE || "log";
  }

  init() {
    return new Promise((resolve, reject) => {
      this.tableService.createTableIfNotExists(this.logTable, (err, result, response) => {
        if (err) {
          reject(err);
        } else {
          resolve()
        }
      });
    });
  }

  addData(key, val) {
    return new Promise((resolve, reject) => {
      const data = {
        PartitionKey: key,
        RowKey: Guid.raw(),
        Val: val,
        "Val@odata.type": "Edm.Double"
      }

      this.tableService.insertEntity(this.logTable, data, (err, result, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.RowKey);
        }
      })
    })
  }



  getData(key) {
    return new Promise((resolve, reject) => {
      const query = new azure.TableQuery()
        .where('PartitionKey eq ?', key)
      this.tableService.queryEntities(this.logTable, query, null, (err, result, response) => {
        if (err) {
          reject(err);
        } else {
          console.log(result)
          resolve(result.entries.map(r => {
            return {
              "RowKey": r.RowKey._,
              "Val": r.Val._,
              "TimeStamp": r.Timestamp._
            }
          }));
        }
      })
    })
  }
}

module.exports = new LogService()
