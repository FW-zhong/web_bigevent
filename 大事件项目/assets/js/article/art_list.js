$(function () {
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());
        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //定义一个查询的参数对象，将来请求数据的时候
    //需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1,  //页码值
        pagesize: 3, //默认每页显示四条
        cate_id: '', //文章分类id
        state: '',   //文章的发布状态
    };
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // layer.msg('获取文章列表成功')
                //使用模板引擎渲染页面数据

                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                //调用渲染分页
                renderPage(res.total);
            }
        })
    }
    initTable();
    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // layer.msg('获取分类数据成功')
                let htmlStr = template('tpl-cate', res);
                $('#cate_id_select').html(htmlStr);
                form.render();
            }
        })
    }
    initCate();

    //为筛选表单绑定submit
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        let cate_id = $('#cate_id_select').val();
        let state = $('#state_select').val();
        q.cate_id = cate_id;
        q.state = state;
        // let data2 = $(this).serialize();
        // console.log(data2);  
        //重新渲染
        initTable();
    })

    //定义渲染分页
    function renderPage(total) {
        // 调用laypage.render渲染分页结构
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换的时候，触发jump回调
            jump: function (obj, first) {
                //obj包含了当前分页所有的参数
                //first表示是何种方式触发的jump 
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // initTable();
                if (!first) {
                    initTable();
                }
            }
        });
    }

    //为编辑按钮绑定


    //为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        let len = $('.btn-delete').length;
        let id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    //当数据删除完成后，需要判断当前页面是否还有剩余数据
                    if (len <= 1) {
                        //如果len为1，说明删除完后页面就没有数据了
                        q.pagenum = q.pagenum === 1 ? 1 : (q.pagenum - 1);
                      
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })

})