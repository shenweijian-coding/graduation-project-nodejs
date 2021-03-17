const request = require('./tool/request')
const cheerio = require('cheerio')
// 每日请求校园官网数据 填充至本地数据库
async function graspNews(){
  const source = await request({
    url: 'http://jwc.hebeinu.edu.cn/webPage/index.html',
    method: 'get'
  })
  const newsTime = []
  const newsList = []
  const $ = cheerio.load(source)
  $('.pptArticle ul li b').map((i,m)=>{
    newsTime.push($(m).text())
  })
  $('.pptArticle ul li a').map((i,m)=>{
    newsList.push($(m).text())
  })
  console.log(newsTime);
  console.log(newsList);
}
graspNews()