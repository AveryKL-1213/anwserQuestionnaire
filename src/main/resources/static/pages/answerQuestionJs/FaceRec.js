navigator.getUserMedia({video: true}, gotStream, noStream);
var video = document.getElementById('monitor');
var canvas = document.getElementById('photo');

function gotStream(stream) {
    try {
        video.src = URL.createObjectURL(stream);
    } catch (e) {
        console.log(e);
        video.srcObject = stream;
    }

    video.onerror = function () {
        stream.stop();
    };
    stream.onended = noStream;
    video.onloadedmetadata = function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        document.getElementById('splash').hidden = true;
        document.getElementById('app').hidden = false;
    };
}

function noStream() {
    document.getElementById('errorMessage').textContent = 'No camera available.';
}

function snapshot() {
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, video.videoWidth, video.videoHeight);
    var imgData = canvas.toDataURL("image/png");
    imgDataStr = imgData.substr(22);

    console.log(imgDataStr);

    var data = {
        "image": imgDataStr
    };
    commonAjaxPost(true, "/admin/faceRecLogin", data, function (result) {
        if (result.code == "666") {
            layer.msg("识别成功，欢迎登陆", {icon: 1});
            setTimeout(function () {
                //将localStorage传递到哪个页面
                location.href = 'login.html'
                //设置localStorage
                window.localStorage.setItem('code', result.code);
                window.localStorage.setItem('id', result.data.id);
                window.localStorage.setItem('username', result.data.username);
                window.localStorage.setItem('role', result.data.role);
                window.localStorage.setItem('modelId', result.data.modelId);
                window.localStorage.setItem('message', result.message);
                if (window.opener) {//判断是否有父窗口,即打开本页面的窗口
                    window.close();
                }
            }, 1000);
        } else if (result.code == "333") {
            layer.msg("识别失败", {icon: 2});
        } else {
            layer.msg(result.message, {icon: 2});
        }
    });
}