const express = require('express')
const router = express.Router()
const utility = require('../config/utility')
const ResponseSuccess = require('../response/ResponseSuccess')
const ResponseError = require('../response/ResponseError')


router.get('/list', (req, res, next) => {
    let sqlArray = []
    sqlArray.push(`select * from diaries where uid = ${req.query.uid}`)
    if (req.query.timeStart) sqlArray.push(`and date_modify BETWEEN '${req.query.timeStart}' and '${req.query.timeEnd}'`)
    sqlArray.push(`limit 200`)

    utility.getDataFromDB(sqlArray)
        .then(data => {
            res.send(new ResponseSuccess(data))
        })
        .catch(err => {
            res.send(new ResponseError(err))
        })
})

router.get('/detail/:diaryId', (req, res, next) => {
    let sqlArray = []
    sqlArray.push(`select * from diaries where id = ${req.params.diaryId}`)
    utility.getDataFromDB(sqlArray, true)
        .then(data => {
            res.send(new ResponseSuccess(data))
        })
        .catch(err => {
            res.send(new ResponseError(err))
        })
})

router.post('/add', (req, res, next) => {
    let sqlArray = []
    // TODO: 添加到 CSDN 关于不同请求中的数据，在 req 中的位置
    // TODO: 处理 title content 进行转义
    let parsedTitle = req.body.title
    let parsedContent = req.body.content

    let timeNow = utility.dateFormatter(new Date())
    sqlArray.push(`
        INSERT into diaries(title,content,category,weather,temperature,temperature_outside,date_create,date_modify,date,uid, is_public )
        VALUES('${parsedTitle}','${parsedContent}','${req.body.category}','${req.body.weather}','${req.body.temperature}','${req.body.temperature_outside}','${timeNow}','${timeNow}','${req.body.date}','${req.body.uid}','${req.body.is_public}')`
    )

    utility.getDataFromDB(sqlArray, true)
        .then(data => {
            res.send(new ResponseSuccess(data))
        })
        .catch(err => {
            res.send(new ResponseError(err))
        })
})
router.put('/edit', (req, res, next) => {
    utility.getDataFromDB(res)
        .then(data => {
            res.send(new ResponseSuccess(data))
        })
        .catch(err => {
            res.send(new ResponseError(err))
        })
})

router.delete('/delete', (req, res, next) => {
    let sqlArray = []
    sqlArray.push(`
        DELETE from diaries
        WHERE id='${req.query.diaryId}'
        and uid='${req.query.uid}'
    `)
    utility.getDataFromDB(sqlArray)
        .then(data => {
            if (data.affectedRows > 0) {
                res.send(new ResponseSuccess('', '删除成功'))
            } else {
                res.send(new ResponseError('', '删除失败'))
            }
        })
        .catch(err => {
            res.send(new ResponseError(err))
        })
})




module.exports = router
