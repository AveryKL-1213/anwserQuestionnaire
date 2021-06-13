/**
 * Created by Amy on 2018/8/9.
 */
$(function () {
    isLoginFun();
    header();
    $("#ctl01_lblUserName").text(getCookie('userName'));
    var oTable = new TableInit();
    oTable.Init();
});

//回车事件
$(document).keydown(function (event) {
    if (event.keyCode == 13) {
        getUserList();
    }
});

$('#userManager').on("keydown", function (event) {
    var keyCode = event.keyCode || event.which;
    if (keyCode == "13") {
        //console.log("1111")
        event.preventDefault();
    }
});

function getUserList() {
    $("#userTable").bootstrapTable('refresh');
}

function TableInit() {

    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#userTable').bootstrapTable({
            url: httpRequestUrl + '/admin/queryUserList',         //请求后台的URL（*）
            method: 'POST',                      //请求方式（*）
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortOrder: "asc",                   //排序方式
            queryParamsType: '',
            dataType: 'json',
            paginationShowPageGo: true,
            showJumpto: true,
            pageNumber: 1, //初始化加载第一页，默认第一页
            queryParams: queryParams,//请求服务器时所传的参数
            sidePagination: 'server',//指定服务器端分页
            pageSize: 10,//单页记录数
            pageList: [10, 20, 30, 40],//分页步进值
            search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            silent: true,
            showRefresh: false,                  //是否显示刷新按钮
            showToggle: false,
            minimumCountColumns: 2,             //最少允许的列数
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列

            columns: [{
                checkbox: true,
                visible: false
            }, {
                field: 'id',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
                {
                    field: 'username',
                    title: '用户账号',
                    align: 'center',
                    width: '230px'
                },
                {
                    field: 'password',
                    title: '用户密码',
                    align: 'center'
                }, {
                    field: 'startTime',
                    title: '开始时间',
                    align: 'center'
                }, {
                    field: 'endTime',
                    title: '结束时间',
                    align: 'center'
                },
                {
                    field: 'operation',
                    title: '操作',
                    align: 'center',
                    events: operateEvents,//给按钮注册事件
                    formatter: addFunctionAlty//表格中增加按钮
                }],
            responseHandler: function (res) {
                //console.log(res);
                if (res.code == "666") {
                    var userInfo = res.data.list;
                    var NewData = [];
                    if (userInfo.length) {
                        for (var i = 0; i < userInfo.length; i++) {
                            var dataNewObj = {
                                'id': '',
                                "username": '',
                                'password': '',
                                "startTime": '',
                                'endTime': '',
                                'status': ''
                            };

                            dataNewObj.id = userInfo[i].id;
                            dataNewObj.username = userInfo[i].username;
                            dataNewObj.password = userInfo[i].password;
                            dataNewObj.startTime = userInfo[i].startTime.replace(/-/g, '/');
                            dataNewObj.endTime = userInfo[i].stopTime.replace(/-/g, '/');
                            dataNewObj.status = userInfo[i].status;
                            NewData.push(dataNewObj);
                        }
                        //console.log(NewData)
                    }
                    var data = {
                        total: res.data.total,
                        rows: NewData
                    };

                    return data;
                }

            }

        });
    };

    // 得到查询的参数
    function queryParams(params) {
        var userName = $("#keyWord").val();
        //console.log(userName);
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageNum: params.pageNumber,
            pageSize: params.pageSize,
            userName: userName
        };
        return JSON.stringify(temp);
    }

    return oTableInit;
}


window.operateEvents = {
    //编辑
    'click #btn_count': function (e, value, row, index) {
        id = row.id;
        $.cookie('questionId', id);
    }
};

function addUserFromFile() {
    $("#getUserFile").trigger("click");
}

function getFilePath() {
    var file = $("#getUserFile")[0].files[0];
    var name = file.name;
    var size = file.size;
    var type = file.type;
    if (type != "application/json")
        layer.msg("文件类型错误[.xlsx]", {icon: 2});
    else {
        var reader = new FileReader(); //这是核心,读取操作就是由它完成.
        reader.readAsText(file); //读取文件的内容,也可以读取文件的URL
        reader.onload = function () {
            var userListJSON = JSON.parse(this.result);
            var jsLength = 0;
            for (var js2 in userListJSON) {
                jsLength++;
            }
            // for (var i = 0; i < jsLength; i++)
            //     console.log(userListJSON[i].username + " " + userListJSON[i].password);
            var userList = new Array();
            for (var i = 0; i < jsLength; i++) {
                var data = {
                    "username": userListJSON[i].username,
                    "password": userListJSON[i].password,
                    "startTime": dateChange(userListJSON[i].startTime),
                    "stopTime": dateChange(userListJSON[i].stopTime)
                };
                userList[i] = data;
            }
            var url = '/admin/addUserInfoList';
            var mapData = {
                "userList": userList
            }
            commonAjaxPost(true, url, mapData, function (result) {
                if (result.code == "666") {
                    layer.msg("用户批量导入成功", {icon: 1});
                    setTimeout(function () {
                        window.location.href = 'userManage.html';
                    }, 1000)
                } else if (result.code == "50003") {
                    //用户名已存在
                    layer.msg(result.message, {icon: 2});
                } else if (result.code == "333") {
                    layer.msg(result.message, {icon: 2});
                    setTimeout(function () {
                        window.location.href = 'login.html';
                    }, 1000)
                } else {
                    layer.msg(result.message, {icon: 2});
                }
            })
        }
    }
}

function downLoadUserList() {
    var url = '/admin/selectUserListToExcel';
    commonAjaxPost(true, url, "", function (result) {
        if (result.code == "666") {
            alert("文件保存在：" + result.data);
            layer.msg("导出成功", {icon: 1});
        }
    })


}

// 表格中按钮
function addFunctionAlty(value, row, index) {
    var btnText = '';

    btnText += "<button type=\"button\" id=\"btn_look\" onclick=\"resetPassword(" + "'" + row.id + "'" + ")\" style='width: 77px;' class=\"btn btn-default-g ajax-link\">重置密码</button>&nbsp;&nbsp;";

    btnText += "<button type=\"button\" id=\"btn_look\" onclick=\"editUserPage(" + "'" + row.id + "')\" class=\"btn btn-default-g ajax-link\">编辑</button>&nbsp;&nbsp;";

    if (row.status == "1") {
        btnText += "<button type=\"button\" id=\"btn_stop" + row.id + "\" onclick=\"changeStatus(" + "'" + row.id + "'" + ")\" class=\"btn btn-danger-g ajax-link\">关闭</button>&nbsp;&nbsp;";
    } else if (row.status == "0") {
        btnText += "<button type=\"button\" id=\"btn_stop" + row.id + "\" onclick=\"changeStatus(" + "'" + row.id + "'" + ")\" class=\"btn btn-success-g ajax-link\">开启</button>&nbsp;&nbsp;"
    }
    btnText += "<button type=\"button\" id=\"btn_stop" + row.id + "\" onclick=\"deleteUser(" + "'" + row.id + "'" + ")\" class=\"btn btn-danger-g ajax-link\">删除</button>&nbsp;&nbsp;";

    return btnText;
}

//重置密码
function resetPassword(id) {
    alert("重置密码")

}

// 打开创建用户页
function openCreateUserPage(id, value) {

    deleteCookie("userTitle");
    setCookie("userTitle", value);
    if (id != '') {
        deleteCookie("userId");
        setCookie("userId", id);
    }
    window.location.href = 'createNewUser.html';
}

function editUserPage() {

    alert("编辑用户")
}

// 修改用户状态（禁用、开启）
function changeStatus(index) {

    alert("修改用户状态")
}

//删除用户
function deleteUser(id) {

    alert("删除用户")
}

