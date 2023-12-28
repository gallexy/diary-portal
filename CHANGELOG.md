# CHANGELOG



### v1.00 `2022-06-22`
- 添加账单数据，月份分类


### 创建 docker-ready 分支
-把utility.js从config目录剥离到lib目录，config目录只保留需要的配置信息，启动docker时用户可以提供自己的配置
-mysql更新到mysql2,避免认证错误
-增加Dockerfile和docker-compose.yml，用户可以以docker方式启动服务，甚至可以制作自己的docker镜像
