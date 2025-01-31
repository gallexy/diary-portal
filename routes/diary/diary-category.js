const express = require('express')
const router = express.Router()
const configProject = require('../../config/configProject')
const utility = require('../../lib/utility')
const ResponseSuccess = require('../../response/ResponseSuccess')
const ResponseError = require('../../response/ResponseError')

const TABLE_NAME = 'diary_category' // 表名
const DATA_NAME = '日记类别'          // 操作的数据名

router.get('/list', (req, res, next) => {
    // query.name_en
    let sqlArray = []
    sqlArray.push(` select * from ${TABLE_NAME} order by sort_id asc`)
    utility
        .getDataFromDB( 'diary', sqlArray)
        .then(data => {
            if (data) { // 没有记录时会返回  undefined
                res.send(new ResponseSuccess(data))
            } else {
                res.send(new ResponseError('', `${DATA_NAME}查询错误`))
            }
        })
        .catch(err => {
            res.send(new ResponseError(err, err.message))
        })
})
router.post('/add', (req, res, next) => {
    checkCategoryExist(req.body.name_en)
        .then(dataCategoryExistanceArray => {
            // email 记录是否已经存在
            if (dataCategoryExistanceArray.length > 0){
                return res.send(new ResponseError('', `${DATA_NAME}已存在`))
            } else {
                utility
                    .verifyAuthorization(req)
                    .then(userInfo => {
                        if (userInfo.email === configProject.adminCount ){
                            let timeNow = utility.dateFormatter(new Date())
                            // query.name_en
                            let sqlArray = []
                            sqlArray.push(`
                                insert into ${TABLE_NAME}(name, name_en, color, sort_id, date_init) 
                                values('${req.body.name}', '${req.body.name_en}', '${req.body.color}', '${req.body.sort_id}', '${timeNow}')`
                            )
                            utility
                                .getDataFromDB( 'diary', sqlArray)
                                .then(data => {
                                    if (data) { // 没有记录时会返回  undefined
                                        utility.updateUserLastLoginTime(userInfo.uid)
                                        res.send(new ResponseSuccess({id: data.insertId}, '添加成功')) // 添加成功之后，返回添加后的日记 id
                                    } else {
                                        res.send(new ResponseError('', `${DATA_NAME}查询错误`))
                                    }
                                })
                                .catch(err => {
                                    res.send(new ResponseError(err, `${DATA_NAME}添加失败`))
                                })
                        } else {
                            res.send(new ResponseError('', '无权操作'))
                        }

                    })
                    .catch(errInfo => {
                        res.send(new ResponseError('', errInfo))
                    })

            }
        })

})
router.put('/modify', (req, res, next) => {
    utility
        .verifyAuthorization(req)
        .then(userInfo => {
            if (userInfo.email === configProject.adminCount ){
                let timeNow = utility.dateFormatter(new Date())
                // query.name_en
                let sqlArray = []
                sqlArray.push(`
                    update ${TABLE_NAME} set 
                    name = '${req.body.name}',
                    count = '${req.body.count}',
                    color = '${req.body.color}',
                    sort_id = ${req.body.sort_id}
                    where name_en = '${req.body.name_en}'
                    `)
                utility
                    .getDataFromDB( 'diary', sqlArray)
                    .then(data => {
                        if (data) { // 没有记录时会返回  undefined
                            utility.updateUserLastLoginTime(userInfo.uid)
                            res.send(new ResponseSuccess({id: data.insertId}, '修改成功')) // 添加成功之后，返回添加后的日记类别 id
                        } else {
                            res.send(new ResponseError('', `${DATA_NAME}操作错误`))
                        }
                    })
                    .catch(err => {
                        res.send(new ResponseError(err, `${DATA_NAME}修改失败`))
                    })
            } else {
                res.send(new ResponseError('', '无权操作'))
            }

        })
        .catch(errInfo => {
            res.send(new ResponseError('', errInfo))
        })
})
router.delete('/delete', (req, res, next) => {
    utility
        .verifyAuthorization(req)
        .then(userInfo => {
            if (userInfo.email === configProject.adminCount ){
                // query.name_en
                let sqlArray = []
                sqlArray.push(`
                    delete from ${TABLE_NAME} 
                               where name_en = '${req.body.name_en}'
                    `)
                utility
                    .getDataFromDB( 'diary', sqlArray)
                    .then(data => {
                        if (data) { // 没有记录时会返回  undefined
                            utility.updateUserLastLoginTime(userInfo.uid)
                            res.send(new ResponseSuccess({id: data.insertId}, '删除成功')) // 添加成功之后，返回添加后的日记类别 id
                        } else {
                            res.send(new ResponseError('', '日记类别删除失败'))
                        }
                    })
                    .catch(err => {
                        res.send(new ResponseError(err, '日记类别删除失败'))
                    })
            } else {
                res.send(new ResponseError('', '无权操作'))
            }

        })
        .catch(errInfo => {
            res.send(new ResponseError('', errInfo))
        })
})

// 检查类别是否存在
function checkCategoryExist(categoryName){
    let sqlArray = []
    sqlArray.push(`select * from ${TABLE_NAME} where name_en='${categoryName}'`)
    return utility.getDataFromDB( 'diary', sqlArray)
}



module.exports = router
