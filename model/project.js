var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;
//定义Project类
function Project(project) {
    this.issuer = project.issuer;
    this.contant = project.contant;
    this.remarkName = project.remarkName;
    this.wholeMoney= project.money;
    this.lowestMoney= project.lowestMoney;
    this.type = project.type;
    this.province = project.province;
    this.logo = project.logo;
    this.simpleDescription= project.simpleDescription;
    this.background= project.background;
    this.images= project.images;
    this.state= '0';
    this.raisedfunds=0
}
//输出Project
module.exports = Project;
//存储项目信息
Project.prototype.save = function(callback) {
    var project ={
        issuer: this.issuer,
        contant: this.contant,
        remarkName: this.remarkName,
        wholeMoney: this.wholeMoney,
        lowestMoney: this.lowestMoney,
        type: this.type,
        province: this.province,
        logo: this.logo,
        state: this.state,
        raisedfunds:this.raisedfunds,
        simpleDescription: this.simpleDescription,
        background: this.background,
        images: this.images
    }
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err)//错误，返回err信息
        };
        //读取projects集合
        db.collection('projects', function(err, collection){
            if (err) {
                mongodb.close();//错误，关闭数据库
                return callback(err);//错误，返回err信息
            };
            //将数据插入到projects集合
            collection.insert(project,{ 
                safe: true
            }, function (err, project) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                };
                callback(null, project);//成功，err为null，并返回用户存储后的文档
            })
        })
    })
}

//读取项目信息
Project.get = function(callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //查找state值为0的project
            collection.find({}).toArray(function(err,projects){
                mongodb.close();
                if(err){
                    return callback(err);//失败！返回err信息
                }
                callback(null,projects);//成功。返回查询到的项目
            });
        });
    });
};
//读取有此投资人的项目
Project.getinvest = function(name,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //查找state值为0的project
            collection.find({im: name}).toArray(function(err,projects){
                mongodb.close();
                if(err){
                    return callback(err);//失败！返回err信息
                }
                callback(null,projects);//成功。返回查询到的项目
            });
        });
    });
};


//读取正在修改的项目信息
Project.getonechanging = function(proid,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //查找state值为0的project
            collection.find({
                _id:ObjectID(proid)
            }).toArray(function(err,projects){
                mongodb.close();
                if(err){
                    return callback(err);//失败！返回err信息
                }
                callback(null,projects);//成功。返回查询到的项目
            });
        });
    });
};

//读取当前用户发布的项目
Project.getusepro = function(issuer,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //查找state值为0的project
            collection.find({
                issuer:issuer
            }).toArray(function(err,projects){
                mongodb.close();
                if(err){
                    return callback(err);//失败！返回err信息
                }
                callback(null,projects);//成功。返回查询到的项目
            });
        });
    });
};

//更改项目的大背景图片
Project.updatabiglogo = function(proid,path,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(proid)},
            {$set:{background:path}},
            {w:1},function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                };
                callback(null, result);//成功，err为null，并返回更新的数据条数
            }
            //没用回调函数
            );

        });
    });
};

//通过更改保存项目出资信息
Project.updatafinaninf = function(proid,wholeMoney,pubMoney,pubEarn,buyParts,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(proid)},
            {$set:{wholeMoney:wholeMoney,pubMoney:pubMoney,pubEarn:pubEarn,buyParts:pubEarn}},
            {w:1},function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                };
                callback(null, result);//成功，err为null，并返回更新的数据条数
            }
            //没用回调函数
            );

        });
    });
};

//修改封面展示图
Project.updatacoverimg = function(proid,path,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(proid)},
            {$set:{logo:path}},
            {w:1},function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                };
                callback(null, result);//成功，err为null，并返回更新的数据条数
            }
            //没用回调函数
            );

        });
    });
};

//修改项目基本信息
Project.updatabainf = function(proid,name,oneword,protype,province,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(proid)},
            {$set:{remarkName:name,simpleDescription:oneword,type:protype,province:province}},
            {w:1},function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                };
                callback(null, result);//成功，err为null，并返回更新的数据条数
            }
            //没用回调函数
            );

        });
    });
};

//修改项目出资信息
Project.updatafinanneed = function(proid,wholeMoney,pubMoney,buyParts,pubEarn,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(proid)},
            {$set:{wholeMoney:wholeMoney,pubMoney:pubMoney,buyParts:buyParts,pubEarn:pubEarn}},
            {w:1},function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                };
                callback(null, result);//成功，err为null，并返回更新的数据条数
            }
            //没用回调函数
            );

        });
    });
};

//上传项目详细图片
Project.updatadetailimg = function(proid,path,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(proid)},
            {$push:{image:path}}
            //没用回调函数
            );
            return callback();

        });
    });
};
//添加出资数和出资人
Project.addnumaper = function(proid,spon,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //寻找当前项目的已出资额
             collection.find({
                _id:ObjectID(proid)
            }).toArray(function(err,projects){
                //mongodb.close();
                if(err){
                    return callback(err);//失败！返回err信息
                }
                 console.log(spon.pubnum);
                collection.update({
                _id:ObjectID(proid)},
                {$set:{raisedfunds:parseInt(spon.pubnum)+parseInt(projects[0].raisedfunds)}},
                {w:1},function (err, result) {
                    //mongodb.close();
                    if (err) {
                        console.log(projects[0].raisedfunds);
                       console.log(err);//错误，返回err信息
                    };
                });
                //callback(null,projects);//成功。返回查询到的项目
            });
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(proid)},
            {$push:{'im':spon.sponsor}}
            //没用回调函数
            );
            collection.update({
            _id:ObjectID(proid)},
            {$push:{'ims':spon}}
            //没用回调函数
            );
            
            return callback();

        });
    });
};
//上传项目详细图文代码
Project.updataeditcodeinf = function(proid,editcode,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(proid)},
            {$set:{editcode:editcode}},
            {w:1},function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                };
                callback(null, result);//成功，err为null，并返回更新的数据条数
            }
            //没用回调函数
            );

        });
    });
};

//更改项目状态为通过审核
Project.updatastate = function(proid,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(proid)},
            {$set:{state:'1'}},
            {w:1},function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                };
                callback(null, result);//成功，err为null，并返回更新的数据条数
            }
            //没用回调函数
            );

        });
    });
};
//更改项目状态为融资
Project.updatastateaaa = function(proid,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(proid)},
            {$set:{state:'2'}},
            {w:1},function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                };
                callback(null, result);//成功，err为null，并返回更新的数据条数
            }
            //没用回调函数
            );

        });
    });
};
//更改项目状态为成功
Project.updatastatebbb = function(proid,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(proid)},
            {$set:{state:'3'}},
            {w:1},function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                };
                callback(null, result);//成功，err为null，并返回更新的数据条数
            }
            //没用回调函数
            );

        });
    });
};
//更改项目状态为分红
Project.updatastateccc = function(proid,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(proid)},
            {$set:{state:'4'}},
            {w:1},function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                };
                callback(null, result);//成功，err为null，并返回更新的数据条数
            }
            //没用回调函数
            );

        });
    });
};

//平台方pass掉项目
Project.removeproject = function(proid,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.remove({
            _id:ObjectID(proid)},
            function (err, result) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                };
                callback(null, result);//成功，err为null，并返回更新的数据条数
            }
            //没用回调函数
            );

        });
    });
};
//搜索框关键字检索项目
Project.getKeyProjects = function(keyValue, callback) {
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //查找state值为0的project
            collection.find({
                'remarkName': keyValue
            }).toArray(function(err,project){
                mongodb.close();
                if(err){
                    return callback(err);//失败！返回err信息
                }
                callback(null,project);//成功。返回查询到的项目
            });
        });
    });
};
//项目类别检索排序
Project.sort = function(type, callback) {
    console.log(type);
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //查找state值为0的project
            collection.find({
                type: type
            }).toArray(function(err,projects){
                mongodb.close();
                if(err){
                    return callback(err);//失败！返回err信息
                }
                callback(null,projects);//成功。返回查询到的项目
            });
        });
    });
}

//项目状态检索排序
Project.sortStatus = function(state, callback) {
    console.log(state);
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('projects',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //查找state值为0的project
            collection.find({
                state: state
            }).toArray(function(err,projects){
                mongodb.close();
                if(err){
                    return callback(err);//失败！返回err信息
                }
                callback(null,projects);//成功。返回查询到的项目
            });
        });
    });
}
