$(function () {
    $('[place]').each(function () {
        var $this = $(this);
        $this.click(function () {
            $this.prev('.c_tip').hide();
        });
        $this.blur(function () {
            if ($this.val() == '') {
                $this.prev('.c_tip').show();
            }
        });
    });

    $('.login_wrap').hover(function () {
        var wing = $(this).find('.wing')[0];
        wing.style['transition'] = "all 1s ease";
        wing.style.webkitTransform = 'rotateY(360deg)';
        wing.style.transform = 'rotateY(360deg)';
    },function () {
        var wing = $(this).find('.wing')[0];
        wing.style['transition'] = "none";
        wing.style.webkitTransform = 'rotateY(0deg)';
        wing.style.transform = 'rotateY(0deg)';
    });

    $('.login_form').submit(function (ev) {
        ev.preventDefault();
        var base64 = new Base64().encode,
            userName = decodeURIComponent($('#name').val()),
            password = $('#password').val(),
            appsecret = hex_md5("e2601155a7f9455c0fadde7f2ed31c30test0.3.3" + base64(password) + userName),
            login_str = 'appkey=test&auth_version=0.3.3&username='+ userName +
            '&password='+base64(password) +
            '&appsecret=' + appsecret;
        $.ajax({
            url: 'http://t.union.vip.58.com/bsp/cuser/getuserbypassword?'+ login_str,
            type: 'get',
            async: true,
            dataType: 'json',
            success: function(data, textStatus) {

            },
            error: function () {
                alert('fail');
            }
        });
    });

    $(window).resize(function () {
        var $cImg = $('#imgbg'),
            $cImgH = $cImg.height();
        if ($cImgH >= $(window).height()) {
            $cImgH = $(window).height();
        }

        $('.login_wrap').css({
            'top': $cImgH * 0.27,
        });
    });
    var $login_wrap = $('.login_wrap')[0];
    $login_wrap.style.transform = 'scale(1)';
    $login_wrap.style.webkitTransform = 'scale(1)';
});
