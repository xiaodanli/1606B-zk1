$(function() {


    $.ajax({
        url: '/api/swiper',
        dataType: 'json',
        success: function(res) {
            console.log(res);
            if (res.code === 1) {
                var str = '';

                res.data.forEach(function(item) {
                    str += `
                    <div class="swiper-slide">
                        <img src="${item.url}" alt="">
                    </div>
                        `;
                })
                $('.swiper-wrapper').html(str);
                new Swiper('.swiper-container');
            }
        },
        error: function(error) {
            console.warn(error);
        }
    })


    $('#ipt').on('input', function() {
        var val = $(this).val();

        if (!val) {
            $('.result').html('');
            return
        } else {
            $.ajax({
                url: '/api/search?key=' + val,
                dataType: 'json',
                success: function(res) {
                    console.log(res);
                    if (res.code === 1) {
                        var liStr = '';

                        res.data.forEach(function(item) {
                            liStr += ` <li>${item.title}</li>`
                        })

                        $('.result').html(liStr);
                    }
                },
                error: function(error) {
                    console.warn(error)
                }
            })
        }
    })
})