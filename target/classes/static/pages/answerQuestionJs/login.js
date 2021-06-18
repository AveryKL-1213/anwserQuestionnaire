var UserName = document.getElementById("UserName");
var Password = document.getElementById("Password");
var LoginButton = document.getElementById("LoginButton");
var UserNameText = '';

// isLoginFun();
//登录
function login() {
    if (!UserName.value) {
        alert("请先输入用户名");
        UserName.focus();
        return;
    }
    if (!Password.value) {
        alert("请输入密码");
        Password.focus();
        return;
    }

    UserNameText = $("#UserName").val();
    var PasswordTest = $("#Password").val();

    var da = {
        "username": UserNameText,
        "password": PasswordTest
    };
    commonAjaxPost(true, "/admin/userLogin", da, loginSuccess)
}

var windowsOpen = {};//定义全局变量

function faceLogin() {
    //alert("Test FaceLogin Button");
    windowsOpen = window.open('FaceRec.html', 'newwindow', 'height=600, width=1400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
}

var loop = setInterval(function () {//监听子页面关闭事件,轮询时间100毫秒
    if (windowsOpen.closed) {
        clearInterval(loop);
        layer.msg("登陆中···", {icon: 0});
        faceRecLoginSuccess();
    }
}, 100);


//登录成功回调
function loginSuccess(result) {
    if (result.code == '666') {
        layer.msg(result.message, {icon: 1});
        setCookie('isLogin', '1');
        setCookie('userId', result.data.id);
        setCookie('userName', UserNameText);
        setCookie('power', result.data.role);
        setCookie('modelId', result.data.modelId)
        window.location.href = "myQuestionnaires.html"
    } else {
        layer.msg("此用户不存在", {icon: 2});
    }
}

//登录成功回调
function faceRecLoginSuccess() {
    var code = window.localStorage.getItem("code");
    var id = window.localStorage.getItem("id");
    var userName = window.localStorage.getItem("username");
    var role = window.localStorage.getItem("role");
    var modelId = window.localStorage.getItem("modelId");
    var message = window.localStorage.getItem("message");
    if (code == '666') {
        layer.msg(message, {icon: 1});
        setCookie('isLogin', '1');
        setCookie('userId', id);
        setCookie('userName', userName);
        setCookie('power', role);
        setCookie('modelId', modelId)
        window.location.href = "myQuestionnaires.html"
    } else {
        layer.msg("此用户不存在", {icon: 2});
    }
}

//回车事件
$(document).keydown(function (event) {
    if (event.keyCode == 13) {
        login();
    }
});