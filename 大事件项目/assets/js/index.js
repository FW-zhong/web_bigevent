//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',

        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // localStorage.setItem('user_pic',res.data.user_pic);
            renderAvatar(res.data);
        },
        
    })
}
function renderAvatar(user) {
    let name = user.nickname || user.username;
    // let user_pic = localStorage.getItem('user_pic');
    $("#welcome").html(`欢迎 ${name}`);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}
$(function () {
    getUserInfo();
    let layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            //清空本地存储的token
            localStorage.removeItem('token');
            //重新跳转页面  注意这里不能 /login.html
            location.href = 'login.html';
            layer.close(index);
        });
    })
})
