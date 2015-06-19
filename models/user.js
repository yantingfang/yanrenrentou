var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;
function User(user){
	this.usermold = user.usermold;
	this.email = user.email;
	this.name = user.name;
	this.phone = user.phone;
	this.password = user.password;
	this.isagreement = user.isagreement;
	this.img = '/img/default-header.png';
}
//输出User
module.exports = User;

//存储用户信息
User.prototype.save = function(callback){
	//要存入数据库的用户文档
	var user = {
		usermold: this.usermold,
	    email: this.email,
	    name: this.name,
	    phone: this.phone,
	    password: this.password,
	    isagreement: this.isagreements,
	    img:this.img
	}
	//打开数据库
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误。返回err信息
		}
		//读取users集合
		db.collection('users',function(err,collection){
            if(err){
            	mongodb.close();
            	return callback(err);//错误，返回err信息
            }
            //将用户数据插入users集合
            collection.insert(user,function(err,user){
            	mongodb.close();
            	if(err){
            		return callback(err);//错误，返回err信息
            	}
            	callback(null,user[0]);//成功！err为null,并返回存储后的用户文档
            });
		});
	});
};

//读取用户信息（用户注册邮箱）
User.get = function(email,callback){
	//打开数据库
	mongodb.open(function(err,db){
		if(err){
			return callback(err);//错误，返回err信息
		}
		//读取users集合
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);//错误，返回err信息
			}
			//查找邮箱值为email的一个文档
			collection.findOne({
				email:email
			},function(err,user){
				mongodb.close();
				if(err){
					return callback(err);//失败！返回err信息
				}
				callback(null,user);//成功！返回查询到的用户信息
			});
		});
	});
};
//忘记密码-重置密码
User.updatePsd = function(_id, password, callback) {

    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新用户密码
            collection.update({
                "_id": ObjectId(_id)
            },
             {
                $set: {
                    password: password
                }
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};


//修改用户个人信息
User.updatepersoninf = function(user,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取project集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //更新id为proid的数据
            collection.update({
            _id:ObjectID(user._id)},
            {$set:{
            	name:user.name,
            	email:user.email,
            	phone:user.phone,
            	password:user.password,
            	img:user.img}},
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