var express = require('express');
var router = express.Router();
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
var Project = require('../model/project.js');
var bodyParser = require('body-parser');
var multer  = require('multer');
router.use(multer({ dest: './uploads/'}));
var User = require('../models/user.js');

/* GET home page. */

router.get('/', function(req, res) {
      Project.get(function(err,projects) {
        if (err) {
          return res.redirect('/');
        };
        res.render('index', {
          projects: projects
        });
      })
});
 router.get('/homepage', function(req, res) {
      Project.get(function(err,projects) {
        if (err) {
          return res.redirect('/');
        };
        res.render('homepage', {
          projects: projects
        });
      })
});
//忘记密码
router.post('/findPassword', function(req, res) {
  var user = ({
    email: req.body.useremail,
    password: req.body.userpsd
  });
  //检查用户是否存在
  User.get(req.body.useremail, function (err, user) {
    if (!user) {
      return res.send({
        text: '用户不存在'
      });
    }
    User.updatePsd(user._id,  req.body.userpsd, function(err, collection) {
      if (err) {
        console.log('error');
      };
      res.redirect('/login')//重置成功返回登陆页面
    });
  });
})

router.get('/platform', function(req, res, next) {
  res.render('platform');
});

router.get('/dianpu', function(req, res, next) {
  console.log(req.query.id);
  Project.getonechanging(req.query.id,function(err,project){
    if(!project){
      return res.send({
        text:'没有此状态项目'
      });
    }
    console.log(project[0]);
    res.render('dianpu',{project:project[0],imageper:req.session.user.img});
  }); 
});

router.get('/register', function(req, res, next) {
  res.render('register');
});



router.get('/login', function(req, res, next) {
  res.render('login');
});

//投资页面

router.get('/invest', function(req, res, next) {
 // congsole.log(req.params.type);
 Project.get( function(err,projects) {
  if (err) {
    return res.redirect('/');
  };
  res.render('invest',{
    projects: projects
  })
})
});

router.get('/publish', function(req, res) {
  res.render('publish',{
      displa:'block',
      displb:'none',
      displc:'none',
    });
});
router.get('/publisha', function(req, res) {
  res.render('publisha',{
      displa:'none',
      displb:'block',
      displc:'none',
    });
});
router.get('/publishb', function(req, res) {
  res.render('publishb',{
      displa:'none',
      displb:'none',
      displc:'block',
    });
});
// router.get('/publish00', function(req, res) {
//   res.render('publish00');
// });
// router.get('/publish1', function(req, res) {
//   res.render('publish1');
// });
// router.get('/publish2', function(req, res) {
//   res.render('publish2');
// });
// router.get('/publish3', function(req, res) {
//   res.render('publish3');
// });
//安全退出
router.get('/quitsafe', function(req, res) {
  console.log('dq');
  req.session.destroy(function(err){ 
    if(err) console.log('session销毁失败。');
  });
  res.redirect('/')
});


router.get('/users', function(req, res) {
  Project.getinvest(req.session.user.name,function(err,project){
    if(!project){
      return res.send({
        text:'没有此状态项目'
      });
    }
    return res.render('users',{
    email:req.session.user.email,
       username:req.session.user.name,
      img:req.session.user.img,
     phone:req.session.user.phone,
     password:req.session.user.password,
     projects:project
  });
  });  
  
});

//注册页面
router.post('/reg',function(req,res){
	var newUser = new User({
		user_type:req.body.user_type,
		email:req.body.emails,
		name: req.body.name,
		phone: req.body.phone,
		password: req.body.password,
		isagreement:req.body.agreement,
		
	});
	User.get(newUser.email,function(err,user){
		if(err){
			return res.redirect('/');
		}
		if(user){
			return res.redirect('/register');//用户名已注册，跳到注册页面
		}
		//如果不存在，则新增用户
		newUser.save(function(err,user){
      if(err){
            	return res.redirect('/register');//错误，返回注册页
            }
            res.redirect('/login');//成功，跳到登陆页面
          });
	});
});

//登录页面
router.post('/loginpage',function(req,res){
	//生成密码的md5值
	var password = req.body.password;
  //检查用户是否存在
  User.get(req.body.emails,function(err,user){
    if(!user){
       return res.send({
        text:'用户名不存在'
      });
    }
		//检查密码是否正确
		if(user.password != password){
			return res.send({
				text:'密码错误'
			});
		}
    console.log(user);
    //用户名密码都匹配，用户信息存入session
    req.session.user = user;
    console.log(req.session.user);
    res.redirect('homepage');
  });
});
//不登录，不显示此页，只有登陆成功才会显示此页
// router.get('/homepage', function(req, res, next) {
//   res.render('homepage');
// });

//homepage搜索项目信息
router.post('/project-info',function(req,res){
  //return res.send({text:req.body.state});
  //搜索项目
  Project.get(function(err,project){
    if(!project){
      return res.send({
        text:'没有此状态项目'
      });
    }
    return res.send(project);
  });  
});
//检索正在修改的项目信息
router.post('/pro-publish-info',function(req,res){
  //return res.send({text:req.body.state});
  //搜索项目
  Project.getonechanging(req.body.proid,function(err,project){
    if(!project){
      return res.send({
        text:'没有此状态项目'
      });
    }
    return res.send(project);
  });  
});
//检索当前用户发布的项目
router.post('/per-publish-info',function(req,res){
  //return res.send({text:req.body.state});
  //搜索项目
  Project.getusepro(req.body.issuer,function(err,project){
    if(!project){
      return res.send({
        text:'没有此状态项目'
      });
    }
    console.log(project);
    return res.send(project);
  });  
});

router.post('/first-publish-form', function(req, res) {
  // 上传文件的临时路径
  var tmp_path = req.files.logofiles.path;
  // 移动至硬盘路径
  var target_path = './public/upload-images/' + req.files.logofiles.name;
  // 移动文件
  fs.rename(tmp_path, target_path, function(err) {
    if (err) throw err;
    // 删除临时文件
    fs.unlink(tmp_path, function() {
       if (err) throw err;
    });
  });
  var project = new Project({
    issuer:req.session.user.name,
    contant:req.session.user.phone,
    remarkName: req.body.remarkName,
    money: req.body.money,
    type: req.body.protype,
    province: req.body.province,
    logo: '/upload-images/'+req.files.logofiles.name
  });
  project.save(function(err, project) {
    if (err) {
      return res.redirect('/publish'); //错误，留在当前页面
    };
    //  req.session.project = project; //
    res.redirect('publisha?id='+project.ops[0]._id);
  })
});

router.post('/second-publish-forms', function(req, res) {
  var wholeMoney = req.body.wholeMoney,
  pubMoney = req.body.pubMoney,
  pubEarn = req.body.pubEarn,
  buyParts = req.body.buyParts;
  Project.updatafinaninf(req.body.hideinf,wholeMoney,pubMoney,pubEarn,buyParts,function(err,result){
    if(err) throw err;
    if(!result){
      return res.send({
        text:'没有更新数据'
      });
    }
    console.log(result);
    return res.redirect('publishb?id='+req.body.hideinf);
  });
});

//店铺详情上传或更新大背景图片
router.post('/up-bigimg',function (req,res,next) { 
  // 上传文件的临时路径
  
  var tmp_path = req.files.biglogo.path;
  // 移动至硬盘路径
  var target_path = './public/upload-images/' + req.files.biglogo.name;   
  var path = '/upload-images/' + req.files.biglogo.name;
  //移动文件
  fs.rename(tmp_path,target_path,function(){
    
    //删除临时文件夹文件
    fs.unlink(tmp_path,function(){});
  });
  Project.updatabiglogo(req.body.hideinf,path,function(err,result){
    if(!result){
      return res.send({
        text:'没有更新数据'
      });
    }
    console.log(result);
    return res.redirect('back');
  });
});

//修改项目封面展示图
router.post('/up-coverimg',function (req,res,next) { 
  // 上传文件的临时路径
  var tmp_path = req.files.coverimg.path;
  
  // 移动至硬盘路径
  var target_path = './public/upload-images/' + req.files.coverimg.name;   
  var path = '/upload-images/' + req.files.coverimg.name;
  //移动文件
  fs.rename(tmp_path,target_path,function(){
    
    //删除临时文件夹文件
    fs.unlink(tmp_path,function(){});
  });
  Project.updatacoverimg(req.body.hideinf,path,function(err,result){
    if(!result){
      return res.send({
        text:'没有更新数据'
      });
    }
    console.log(result);
    return res.redirect('back');
  });
});

//修改项目基本信息
router.post('/edit-bainf', function(req, res) {
  var name = req.body.name,
  oneword = req.body.oneword,
  protype = req.body.protype,
  province = req.body.province;
  Project.updatabainf(req.body.hideinf,name,oneword,protype,province,function(err,result){
    if(err) throw err;
    if(!result){
      return res.send({
        text:'没有更新数据'
      });
    }
    console.log(result);
    return res.redirect('back');
  });
});

//添加出资数和出资人
router.post('/financialnum', function(req, res) {
  var proid = req.body.proid;
  var spon=({
    pubnum: req.body.numplus,
    sponsor:req.session.user.name
  });
  console.log(req.session.user.name);
  console.log(proid);
  Project.addnumaper(proid,spon,function(err){
    if(err) {
     res.send('error');//错误！返回用户界面
    }
    return res.redirect('back');
  });
});

//修改项目出资信息
router.post('/finan-need', function(req, res) {
  var wholeMoney = req.body.wholemoney,
  pubMoney = req.body.pubmoney,
  buyParts = req.body.buyparts,
  pubEarn = req.body.pubearn;
  Project.updatafinanneed(req.body.hideinf,wholeMoney,pubMoney,buyParts,pubEarn,function(err,result){
    if(err) throw err;
    if(!result){
      return res.send({
        text:'没有更新数据'
      });
    }
    console.log(result);
    return res.redirect('back');
  });
});

//上传项目详细图片
router.post('/up-detailimg',function (req,res,next) { 
  // 上传文件的临时路径
  
  var tmp_path = req.files.detailimg.path;
  // 移动至硬盘路径
  var target_path = './public/upload-images/' + req.files.detailimg.name;   
  var path = '/upload-images/' + req.files.detailimg.name;

  //移动文件
  fs.rename(tmp_path,target_path,function(){
    
    //删除临时文件夹文件
    fs.unlink(tmp_path,function(){});
  });
  console.log(req.body.hideinf);
  Project.updatadetailimg(req.body.hideinf,path,function(err){
    
    return res.redirect('back');
  });
});

//上传项目详细图文代码
router.post('/edit-proj',function (req,res,next) { 
  Project.updataeditcodeinf(req.body.hideinf,req.body.editcode,function(err,result){
    if(!result){
      return res.send({
        text:'没有更新数据'
      });
    }
    console.log(result);
    return res.redirect('back');
  });
});

//平台方审核通过并修改项目状态
router.post('/examine-pass', function(req, res) {
  Project.updatastate(req.body.id,function(err,result){
    if(err) throw err;
    if(!result){
      return res.send({
        text:'没有更新数据'
      });
    }
    console.log(result);
    return res.send(result);
  });
});
//平台方结束预热并修改项目状态
router.post('/examine-passaaa', function(req, res) {
  Project.updatastateaaa(req.body.id,function(err,result){
    if(err) throw err;
    if(!result){
      return res.send({
        text:'没有更新数据'
      });
    }
    console.log(result);
    return res.send(result);
  });
});
//平台方结束融资并修改项目状态
router.post('/examine-passbbb', function(req, res) {
  Project.updatastatebbb(req.body.id,function(err,result){
    if(err) throw err;
    if(!result){
      return res.send({
        text:'没有更新数据'
      });
    }
    console.log(result);
    return res.send(result);
  });
});
//平台方通知分红并修改项目状态
router.post('/examine-passccc', function(req, res) {
  Project.updatastateccc(req.body.id,function(err,result){
    if(err) throw err;
    if(!result){
      return res.send({
        text:'没有更新数据'
      });
    }
    console.log(result);
    return res.send(result);
  });
});

//平台方pass掉项目
router.post('/examine-nopass', function(req, res) {
  Project.removeproject(req.body.id,function(err,result){
    if(err) throw err;
    if(!result){
      return res.send({
        text:'没有删除数据'
      });
    }
    return res.send(result);
  });
});

//个人信息修改
router.post('/updateusersifo', function(req, res) {
  // 上传文件的临时路径
  var tmp_path = req.files.personimg.path;
  // 移动至硬盘路径
  var target_path = './public/upload-images/' + req.files.personimg.name;
  // 移动文件
  fs.rename(tmp_path, target_path, function(err) {
    if (err) throw err;
    // 删除临时文件
    fs.unlink(tmp_path, function() {
       if (err) throw err;
    });
  });
  console.log(req.session.user._id);
  var user = ({
      _id : req.session.user._id,
      email : req.body.email,
      name :  req.body.name,
      phone : req.body.phone,
      password : req.body.password,
      img :  '/upload-images/'+req.files.personimg.name
  });
  req.session.user=user;
  console.log('33');
  console.log(req.session.user);
  User.updatepersoninf(user,function (err, user) {
    if(err) {
     res.send('error');//错误！返回用户界面
    }
    else{
       return res.redirect('users');//成功！返回用户界面
     }
  });
  
})
//项目信息关键字修改
router.post('/searchProject', function(req, res) {
  console.log(req.body.keyValue);
  Project.getKeyProjects(req.body.keyValue, function (err, project) {
    if (err) {
    //  res.redirect('/');
    }
    //console.log(project);
  res.render('invest',{
    projects: project
  })
  })
})

//投资页面分类请求
router.get('/invest/:type', function(req, res, next) {
  //console.log(req.params.type);
  Project.sort(req.params.type, function(err,projects) {
    if (err) {
      return res.redirect('/');
    };
    res.render('invest', {
      projects: projects
    });
  })
});

//投资页面状态分类

router.get('/invest/:state', function(req, res, next) {
  //console.log(req.params.state);
  Project.sortState(req.params.state, function(err,projects) {
    if (err) {
      return res.redirect('/');
    };
    res.render('invest', {
      projects: projects
    });
  })
});

module.exports = router;

