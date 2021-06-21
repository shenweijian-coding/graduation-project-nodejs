const request = require('./tool/request')
const cheerio = require('cheerio')
const DB = require('./DB/DB')
const { ObjectId } = require('bson')
const { sleep } = require('./tool/util')

// let rule = new schedule.RecurrenceRule()
// rule.hour =1;
// rule.minute =0;
// rule.second =0;
// schedule.scheduleJob(rule, async function(){
//   graspNews()
// })

// 每日请求校园官网数据 填充至本地数据库
async function graspNews(){
  const source = await request({
    url: 'http://jwc.hebeinu.edu.cn/webPage/index.html',
    method: 'get'
  })
  const newsTime = []
  const newsTitle = []
  const newsHref = []
  const $ = cheerio.load(source)
  $('.pptArticle ul li b').map((i,m)=>{
    newsTime.push($(m).text())
  })
  $('.pptArticle ul li a').map((i,m)=>{
    newsTitle.push($(m).text())
  })
  $('.pptArticle ul li a').map((i,m)=>{
    newsHref.push("http://jwc.hebeinu.edu.cn/webPage/" + $(m).attr('href'))
  })
  let newsList = []
  for (let i = 0; i < newsTime.length; i++) {
    const item = {
      time:newsTime[i],
      title:newsTitle[i],
      href: newsHref[i]
    }
    newsList.push(item)
  }
  // console.log(newsList);
  getNewsDetail(newsHref)
  DB.update('schoolInfo', { "_id": ObjectId('604b48c29382b35c705b387c') }, { "newsList":newsList })
}
async function getNewsDetail(newsHref) {
  for (let i = 0; i < newsHref.length; i++) {
    const url = newsHref[i]
    const source = await request({
      url: url,
      method: 'get'
    })
    const $ = cheerio.load(source)
    // let title
    let detail = []
    // $('.articleTitle').map((i,m)=>{
    //   title = $(m).html()
    // })
    $('.pageArticleContent p').map((i,m)=>{
      detail.push($(m).text())
    })
    const curInfo = DB.find('schoolInfo', { href:newsHref[i]})
    if(!curInfo.length){
      await DB.insert('schoolInfo',{ href:newsHref[i], detail })
    }
    await sleep(2000)
  }
}
graspNews()
// getNewsDetail()