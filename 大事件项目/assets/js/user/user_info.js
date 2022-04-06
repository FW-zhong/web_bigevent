
$(function () {
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间';
            }
        }
    })
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                form.val("formUserInfo", res.data);
            }
        })
    }
    initUserInfo();
    //重置表单数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    //监听表单的提交事件

    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        // console.log(form.val("formUserInfo"));
        // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 以下两种提交表单数据方式都可以
            data: $(this).serialize(),
            // data: form.val("formUserInfo"),

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 修改昵称后不能及时渲染到页面上，需要刷新才行
                // 这里采用调用父页面的方法，重新渲染用户的头像和信息
                //window就代表iframe的窗口 parent就是整个页面
                window.parent.getUserInfo();
            }
        })
    })
})

  