const MongoClient = require('mongodb').MongoClient
const { app } = require('./config')

class Db{

  static getInstance(){
    if(!Db.instance){
      Db.instance = new Db()
    }
    return Db.instance
  }

  constructor(){
    this.connect()
    this.dbClient = ''
  }

  connect(){
    let _this = this
    return new Promise((resolve,reject)=>{
        if(!_this.dbClient){
          MongoClient.connect(app.dbUrl,{ useUnifiedTopology: true },(err,client)=>{
            if(err){
              console.log(err)
            }else{
              _this.dbClient = client.db(app.dbName)
              // console.log(_this.dbClient);
              resolve(_this.dbClient)
            }
          })
        }else{
          resolve(_this.dbClient);
  
      }   
    })
  }

  find(collectionName,json){
    // console.log(collectionName,json);
    return new Promise((resolve,reject)=>{
      this.connect().then(db=>{
        const result = db.collection(collectionName).find(json)
        result.toArray((err,docs)=>{
          if(err){
            reject(err)
            return
          }
          resolve(docs)
        })
      })
    })
  }

  update(collectionName,json1,json2){
    return new Promise((resolve,reject)=>{
      this.connect().then(db=>{
        const result = db.collection(collectionName).updateOne(json1,{$set:json2},(err,result)=>{
          if(err){
            reject(err)
          }else{
            resolve(result)
          }
        })
      })
    })
  }

  insert(collectionName,json){
    return new Promise((resolve,reject)=>{
      this.connect().then(db=>{
        const result = db.collection(collectionName).insertOne(json,function(err,result){
          if(err){
            reject(err)
          }else{
            resolve(result)
          }
        })
      })
    })
  }
}


module.exports = Db.getInstance()