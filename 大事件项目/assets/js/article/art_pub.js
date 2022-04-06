$(function () {
    let layer = layui.layer;
    let form = layui.form;
    //加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败');
                }
                layer.msg('初始化文章分类成功');
                //调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //一定要记得调用form.render()方法重新渲染表单
                //不然看不到select的可选项
                form.render();
            }
        })
    }
    initCate();
    //初始化富文本编辑器
    initEditor();

    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮，绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    //监听coverFile的change事件，获取选择的图片
    $('#coverFile').on('change', function (e) {
        let files = e.target.files[0];
        if (files.length === 0) {
            return layer.msg('没有选择图片')
        }
        let newImgURL = URL.createObjectURL(files);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    //定义文章的发布状态
    let art_state = '已发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
        console.log(art_state);
    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //1.基于form表单，快速创建一个FormData对象
        let fd = new FormData($(this)[0]);
        //2.将文章的发布状态存到fd里
        fd.append('state', art_state);
        // fd.forEach(function(k,v){
        //     console.log(k,v);
        // })
        // 3.将封面裁剪过后的图片，输出为一个对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 4.将文件对象存到fd中
                fd.append('cover_img',blob);
                // 6.发起ajax请求
                publishArticle(fd);
            })
    })
    //定义一个发布文章的方法
    function publishArticle(fd){
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意，如果向服务器提交的是FormData格式的数据
            // 必须添加以下两个配置
            contentType: false,
            processData: false,
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = 'art_list.html'
            }
        })
    }
})