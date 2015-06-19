//不为空验证
$(document).ready(function(){
    function focusHidden(dom) {
        dom.next('.errMsg').hide();
    }
    function blurShow(dom,tips) {
        dom.next('.errMsg').html(tips).css({
            display: 'inline-block'
        }).show();
        return false;
    }
    $('.validate').each(function() {
     $(this).focus(function() {
        focusHidden($(this));
    })
 })
    $('.validate').each(function() {
       $(this).blur(function() {
           if ($(this).val() =='' || $(this).val() =='undefiend') {
               blurShow($(this),'此项内容不能为空');
           }
       })
   })
    $('.number-validate').focus(function() {
        focusHidden($(this));
    })
    $('.number-validate').blur(function() {
      if ($(this).val() =='' || $(this).val() =='undefiend') {
        blurShow($(this),'此项内容不能为空');
    }
    else if (!$.isNumeric($(this).val())) {
        blurShow($(this),'此项内容必须为数字');
    };
})
    $('.address').each(function() {
        $(this).focus(function() {
            $('#addressErr').hide();
        })
    })
    $('.address').each(function() {
        $(this).blur(function() {
            if ($(this).val() =='0') {
                $('#addressErr').html('此项必须选择').css({
                    display: 'inline-block'
                }).show();
            }
        })
    })
    $('select').each(function() {
        $(this).focus(function() {
            focusHidden($(this));
        })
    })
    $('select').each(function() {
        $(this).blur(function() {
            if ($(this).val() == '0') { 
                blurShow($(this),'此项必须选择');
            };

        })
    })
    $('#buyParts').focus(function() {
     focusHidden($(this));
 })
    $('#buyParts').blur(function() {
        validateConfirm();
    })
    $('#buyParts').change(function() {
        changingParts();
    })
    $('#wholeMoney').change(function() {
        changingParts();
    })
    $('#pubEarn').change(function() {
        changingPercent();
    })
    $('input[type = "file"]').blur(function() {
        $('.errChoice').hide();
    });
    $('input[type = "file"]').focus(function() {
        $('.errChoice').hide();
        if ($(this).val() == "" || $(this).val() == 'undefiend') {
            $('.errChoice').html('您还没选择何文件').css({
                display: 'inline-block'
            }).show();
            return false;
        };
    })
    // $('#nextSecond').click(function() {

    //   if (!validateForm()) {
    //     alert('温馨提示：请填写相关字段');
    //   }
    //   else{
    //     $('#first-form').hide();
    //     $('#second-form').show();
    //   }
    // })
    // $('#nextThird').click(function() {
    //     $('#second-form').hide();
    //     $('#third-form').show();
    // })
    // $('#nextFourth').click(function() {
    //     $('#threeForms').hide();
    //     $('#fourth-form').show();
    // })
    // $('#preFirst').click(function() {
    //     $('#first-form').show();
    //     $('#second-form').hide();
    // })
    // $('#preSecond').click(function() {
    //     $('#second-form').show();
    //     $('#third-form').hide();
    // })
    // $('#preThird').click(function() {
    //     $('#third-form').show();
    //     $('#fourth-form').hide();
    // })
$('#pubProportion').change(function() {
  changingPercent();
})
$('#wholeMoney').change(function() {
   changingPercent();
})
//表单中的表单失去焦点
$('#wholemoney').blur(function() {
    editchangeparts();
});
$('#pubmoney').blur(function() {
    editchangeparts();
});
$('#buyparts').blur(function() {
    editchangeparts();
});
$('#pubearn').blur(function() {
    editchangeparts();
});
$("#edit-div").blur(function() {
    $("#edit-code").val($("#edit-div").html());
});
    // $('#edit-code').DOMNodeInserted(function() {
    //     $("#edit-code").val($("#edit-div").text());
    // });
})
function validateConfirm() {
    var confirmDom = $('#buyParts');
    var parts = parseInt(confirmDom.val());
    if (confirmDom.val() == '' || confirmDom.val() == 'undefiend') {
        confirmDom.next('.errMsg').html('此项内容不能为空！').css({
            display: 'inline-block'
        }).show();
        if ($('#partsLst').children('p').length > 0) {
            $('#partsLst').empty();
        }
        return false;
    }
    else if (!$.isNumeric(confirmDom.val())) {
        confirmDom.next('.errMsg').html('此项内容必须为数字').show();
        return false;
    }
    else if(parts> 199) {
        confirmDom.next('.errMsg').html('您输入的份数超出最大份额').css({
            display: 'inline-block'
        }).show();
        return false;
    }
    else
        return true;
}
//页面中第二个表单的自动计算
function changingParts() {
    var sumMoney = parseInt($('#wholeMoney').val()),
    pubPro = parseInt($('#pubProportion').val()),
    pubEarn = parseInt($('#pubEarn').val()),
    perParts = parseInt($('#buyParts').val());
    if ( validateConfirm()) {
        if ($('#partsLst').children('p').length > 0) {
            $('#partsLst').empty();
        }
        if (sumMoney!=0 && pubPro!=0 && pubEarn!=0 && perParts!=0) {
            var i,len;
            for(i=1,len=perParts; i<=len; i++){
                var p = $('<p></p>'),
                span1 = $('<span></span>').text('份数: ' + i),
                span2 = $('<span></span>').text('金额: ' + parseInt(sumMoney/i));
                p.append(span1, span2);
                $('#partsLst').append(p);
            }
            $('#perLowset').text(parseInt(sumMoney/perParts));
        };
        if (sumMoney==0) {
            $('#perLowset').text('0');
        };
    };
}
function changingPercent() {
    var all = $('#wholeMoney').val(),
    pub = $('#pubProportion').val(),
    pubEarn = $('#pubEarn').val();
    if (!$.isNumeric(all) || !$.isNumeric(pub)) {
      $('#pubPercent').text(0+ '%');
      $('#invPropotion').text(0 +'%');
  }
  else {
      $('#pubPercent').text(parseInt(pub/all*100) + '%');
      $('#invPropotion').text(parseInt(100-pub/all*100)  + '%');
  };
  if ($.isNumeric(pubEarn)) {
      $('#invEarn').text(100- parseInt(pubEarn) + '%');
  };
  if (parseInt(all) == 0) {
     $('#pubPercent').text(0+ '%');
     $('#invPropotion').text(0 +'%');
     $('#pubEarn').text(0 +'%');
     $('#invEarn').text(0 +'%');
     $('#perLowset').text(0 +'%');
 };
}
//第三个表单中的表单
function editchangeparts(){
    var summoney = parseInt($('#wholemoney').val()),
    pubmoney = parseInt($('#pubmoney').val()),
    buyparts = parseInt($('#buyparts').val()),
    pubearn = parseInt($('#pubearn').val());
    $("#investmoney").val(parseInt(summoney-pubmoney));
    $("#perpart").val(parseInt(summoney/buyparts));
    $("#pubrate").val(parseInt(pubmoney/summoney*100));
    $("#investrate").val(parseInt((summoney-pubmoney)/summoney*100));
    $("#investearn").val(parseInt(100-pubearn));
}

//页面加载后向数据库请求本项目相关信息  
$(document).ready(function(){
    var url=document.location.search; 
    var proid = url.substr(4);
    
    $(".hideinf").attr("value",proid);
    $.ajax({
        url : "/pro-publish-info",
        async : true,
        type : 'post',
        data : {
            "proid" : proid
        },
        dataType : 'json',
        success : function(data) {

            var result;
            try {
                result = eval(data);
            } catch (e) {
                result = JSON.parse(data);
            }

            $("#name").val(result[0].remarkName);
            $("#moneytotal").val(result[0].wholeMoney);
            $("#protype").val(result[0].type);
            $("#province").val(result[0].province);
            $("#wholeMoney").val(result[0].wholeMoney);
            $("#pubProportion").val(result[0].pubMoney);
            $("#pubEarn").val(result[0].pubEarn);
            $("#buyParts").val(result[0].buyParts);
            $("#editname").val(result[0].remarkName);
            $("#oneword").val(result[0].simpleDescription);
            $("#editprotype").val(result[0].type);
            $("#editprovince").val(result[0].province);
            $("#wholemoney").val(result[0].wholeMoney);
            $("#pubmoney").val(result[0].pubMoney);
            $("#buyparts").val(result[0].buyParts);
            $("#pubearn").val(result[0].pubEarn);
            var str = "";
            for (var i = 0; i < result[0].image.length; i++) {
                var row = result[0].image[i];
                str +='<img src="'+result[0].image[i]+'"/>';
            }
            $("#edit-div").html(str+"");
            $("#edit-code").val($("#edit-div").html());

            changingParts();
            changingPercent();
            editchangeparts();
            $("#draft-img").attr("style",'background:url('+result[0].image[0]+') no-repeat;')
        }
    });   
});

  //submit 提交表单验证
    // function validateForm() {
    //     if ($('#checkBox').checked == false) return false
    //         else if ($('#name').val() == "" || $('#name').val() == 'undefiend') return false;
    //     else if ($('#money').val() == "" || $('#money').val() == 'undefiend') return false;
    //     else if ($('#province-lst').val() == 0 ) return false;
    //     else return true;
    // }
//submit 提交表单验证
function validateForm() { 
    if ($('#name').val() == "" || $('#name').val() == 'undefiend') return false;
    if ($('#money').val() == "" || $('#money').val() == 'undefiend') return false;
    if ($('#province-lst').val() == '0') {
        $('#addressErr').html('此项必须选择！').css({
            display: 'inline-block'
        }).show();
        return false;
    }   
    if ($('#checkBox').checked == false) return false;
}
//第一个修改js（显示或隐藏弹出层）
// var showuploadbigimg=function(){
//     document.getElementById("publishuploadbigimg").setAttribute('style','display:block;')
// }
// var hideuploadbigimg=function(){
//     document.getElementById("publishuploadbigimg").setAttribute('style','display:none;')
// }
//第二个修改js（显示或隐藏弹出层）
// var showuploadcoverimg=function(){
//     document.getElementById("publishuploadcoverimg").setAttribute('style','display:block;')
// }
// var hideuploadcoverimg=function(){
//     document.getElementById("publishuploadcoverimg").setAttribute('style','display:none;')
// }
//第三个修改js（显示或隐藏弹出层）
// var showuploadbasicinf=function(){
//     document.getElementById("publishuploadbasicinf").setAttribute('style','display:block;')
// }
// var hideuploadbasicinf=function(){
//     document.getElementById("publishuploadbasicinf").setAttribute('style','display:none;')
// }
//第四个修改js（显示或隐藏弹出层）
// var showuploadeditproj=function(){
//     document.getElementById("publishuploadeditproj").setAttribute('style','display:block;')
// }
// var hideuploadeditproj=function(){
//     document.getElementById("publishuploadeditproj").setAttribute('style','display:none;')
// }
//第四个修改js中的修改（显示或隐藏弹出层）
var showuploaddetailimg=function(){
   document.getElementById("publishuploaddetailimg").setAttribute('style','display:block;')
}
var hideuploaddetailimg=function(){
   document.getElementById("publishuploaddetailimg").setAttribute('style','display:none;')
}
//第五个修改js（显示或隐藏弹出层）
// var showuploadfinanneed=function(){
//     document.getElementById("publishuploadfinanneed").setAttribute('style','display:block;')
// }
// var hideuploadfinanneed=function(){
//     document.getElementById("publishuploadfinanneed").setAttribute('style','display:none;')
//}

//第一个表单的上一步
var first2=function(){
    $("#firstdiv").hide();
    $("#seconddiv").show();
    $("#dtt1").removeClass('dtt');
    $("#dtt2").addClass('dtt');
}
//第二个表单的上一步
var second1=function(){
    $("#seconddiv").hide();
    $("#firstdiv").show();
    $("#dtt2").removeClass('dtt');
    $("#dtt1").addClass('dtt');
}
//第二个表单的下一步
var second2=function(){
    $("#seconddiv").hide();
    $("#thirddiv").show();
    $("#dtt2").removeClass('dtt');
    $("#dtt3").addClass('dtt');
}

//第三个表单的上一步
var third1=function(){
    $("#thirddiv").hide();
    $("#seconddiv").show();
    $("#dtt3").removeClass('dtt');
    $("#dtt2").addClass('dtt');
}
//第三个表单的下一步
var third2=function(){
    $("#thirddiv").hide();
    $("#fouthdiv").show();
    $("#dtt3").removeClass('dtt');
    $("#dtt4").addClass('dtt');
}
//第四个表单的返回
var fouth1=function(){
    $("#fouthdiv").hide();
    $("#thirddiv").show();
    $("#dtt4").removeClass('dtt');
    $("#dtt3").addClass('dtt');
}



