$(function () {
  $("#link_reg").on('click', function () {
    $(".login-box").hide();
    $(".reg-box").show();
  })
  $("#link_login").on('click', function () {
    $(".login-box").show();
    $(".reg-box").hide();
  })
  let form = layui.form;
  let layer = layui.layer;
  //作为模板字符串拼接，但实测貌似会降低响应速度
  let mod_url = 'http://www.liulongbin.top:3007';
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6-12位,不能出现空格'],
    repwd: function (value) {
      let pwd = $(".reg-box [name=password]").val()
      if (pwd !== value) {
        return '两次密码不一致';
      }
    }
  })
  $('#form_reg').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/reguser',
      // url: 'http://api-breakingnews-web.itheima.net/api/reguser',
      data: {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val(),
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg('注册成功,请登录');
        $('#link_login').click();
      }
    })
  })
  $('#form_login').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/login',
      // url: `${mod_url}/api/login`,
      
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败');
        }
        layer.msg('登录成功');
        localStorage.setItem('token', res.token);
        location.href = 'index.html';
      }
    })
  })
})