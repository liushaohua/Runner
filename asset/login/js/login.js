$(function () {
    var $queryPlat = $('.service a'),
        onlyShow = false,
        $queryBtn = $('.service_open a,.service_try a');

    $('[place]').each(function () {
        var $this = $(this);
        $this.on('click focus', function () {
            $this.prev('.c_tip').hide();
            $('.error_tip').fadeOut(500,function () {
                $(this).css('right','-200px');
            });
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

    $queryPlat.hover(function() {
        var $this = $(this);
        $($this.attr('position')).stop().fadeIn(700);
    }, function () {
        var $this = $(this);
        $($this.attr('position')).fadeOut(700);
    });


    $queryBtn.hover(function () {
        $(this).parent().stop().show();
    }, function () {
        $(this).parent().stop().fadeOut(700);
    });

    $('.login_form').submit(function (ev) {
        ev.preventDefault();
        var base64 = new Base64().encode,
            userName = decodeURIComponent($('#name').val()),
            password = base64($('#password').val());

        $.ajax({
            url: 'http://10.9.17.55:8080/user_login.php',
            type: 'post',
            async: true,
            data: {
                'username': userName,
                'password': password
            },
            dataType: 'json',
            success: function(data, textStatus) {
                if (data['status'] == 'ok') {
                    window.location.href = '/Runner/main.html';
                    sessionStorage._user = userName;
                } else {
                    $('.error_tip').css('display','inline-block').animate({'right': '-140'});
                }
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
            'top': $cImgH * 0.20,
        });
    });
    var $login_wrap = $('.login_wrap')[0];
    $login_wrap.style.transform = 'scale(1)';
    $login_wrap.style.webkitTransform = 'scale(1)';
    $login_wrap.style.webkitTransform = 'scale(1)';
    $login_wrap.style.msTransform = 'scale(1)';
});
