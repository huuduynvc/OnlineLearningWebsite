var key = "";
var sort = undefined;
var page = "1";
var cate = -1;

$("input[type='radio']").click(function() {
    cate = $("#sort option:selected").val();
    sort = $(this).val();
    $.ajax({
            method: 'post',
            url: '/course',
            data: { cate: cate, key: key, check: sort, page: page },
            dataType: 'json'
        })
        .done(function(data) {
            $('.col-lg-8 .row').html(data.html);
            jsWatchList();
        })
        .catch(err => {
            console.log(err);
        });
    // this.checked = this.check;
    // this.check = !this.check;      

});
// search enter
$('.search').keypress(function(event) {
    if (event.keyCode == '13') {

        event.preventDefault();
        $('.btnsearch').click();
    }
});
$('.btnsearch').click(function(event) {
    cate = $("#sort option:selected").val();
    key = $('.search').val();
    $.ajax({
            method: 'post',
            url: '/course',
            data: { cate: cate, key: key, check: sort, page: page },
            dataType: 'json'
        })
        .done(function(data) {
            $('.col-lg-8 .row').html(data.html);
            let nPage = data.nPages;
            let html = `
        <li class="page-item prev disabled">
          <a style="cursor: pointer;" class="page-link">Prev</a>
        </li>
        <li class="page-item page1 active">
        <a style="cursor: pointer;" class="page-link">1</a>
      </li>`;
            for (let i = 0; i < nPage - 1; i++) {
                html += `<li class="page-item page${i+2}">
            <a style="cursor: pointer;" class="page-link">${i+2}</a>
          </li>`
            }
            if (nPage != 1)
                html += ` <li class="page-item next">
        <a style="cursor: pointer;" class="page-link">Next</a>
      </li>`;
            else
                html += ` <li class="page-item next disabled">
        <a style="cursor: pointer;" class="page-link">Next</a>
      </li>`;
            $('.pagination').html(html);
            jsWatchList();
        })
        .catch(err => {
            console.log(err);
        });
    // this.checked = this.check;
    // this.check = !this.check;      

});

$("body").delegate('.pagination li a', 'click', function() {
    $('.active').removeClass('active');
    sort = $('input[type = "radio"]:checked').val();
    p = $(this).text();
    if (p != "Prev" && p != "Next") {
        $(this).parent().addClass('active')
    }
    if (p == "Prev") {
        p = (parseInt(page) - 1) + "";
        $('.page' + p).addClass('active');
    }
    if (p == "Next") {
        p = (parseInt(page) + 1) + "";
        $('.page' + p).addClass('active');
    }
    page = p;
    if (page == "1")
        $('.prev').addClass('disabled');
    else
        $('.prev').removeClass('disabled');
    cate = $("#sort option:selected").val();
    $.ajax({
            method: 'post',
            url: '/course',
            data: { cate: cate, key: key, check: sort, page: page },
            dataType: 'json'
        })
        .done(function(data) {
            $('.col-lg-8 .row').html(data.html);
            if (data.disable)
                $('.next').addClass('disabled');
            else
                $('.next').removeClass('disabled');

            jsWatchList();
        })
        .catch(err => {
            console.log(err);
        });
});



$('.content').on('click', function() {
    var id = parseInt($('.item').attr('id'));
    $.ajax({
            method: 'get',
            url: '/course/' + id,
            data: { id: id },
        })
        .done(function() {
            window.location.href = '/course/' + id;
            jsWatchList();
        });
});
$('.btnreset').on('click',function(){
    window.location.href = "/course"; 
});
$('#sort').on('change', function() {
    cate = $(this).val();
    if (cate != -1) {
        $.ajax({
                method: 'post',
                url: '/course',
                data: { cate: cate, key: key, check: sort, page: "1" },
                dataType: 'json'
            })
            .done(function(data) {
                $('.col-lg-8 .row').html(data.html);
                // show pagination
                let nPage = data.nPages;
                let html = `
        <li class="page-item prev disabled">
          <a style="cursor: pointer;" class="page-link">Prev</a>
        </li>
        <li class="page-item page1 active">
        <a style="cursor: pointer;" class="page-link">1</a>
      </li>`;
                for (let i = 0; i < nPage - 1; i++) {
                    html += `<li class="page-item page${i+2}">
            <a style="cursor: pointer;" class="page-link">${i+2}</a>
          </li>`
                }
                if (nPage != 1)
                    html += ` <li class="page-item next">
        <a style="cursor: pointer;" class="page-link">Next</a>
      </li>`;
                else
                    html += ` <li class="page-item next disabled">
        <a style="cursor: pointer;" class="page-link">Next</a>
      </li>`;
                $('.pagination').html(html);
                jsWatchList();
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        window.location.href = "/course";
    }
});
// change route detail course
// $('.item').on('click', function() {
//     var id = parseInt($(this).attr('id'));
//     $.ajax({
//             method: 'get',
//             url: '/course/' + id,
//             data: { id: id },
//         })
//         .done(function() {
//             window.location.href = '/course/' + id;
//             jsWatchList();
//         });
// });
$(document).ready(function() {

    // $("#sort").val(3);
    // $('#sort').change();

    jsWatchList();

});

function jsWatchList() {
    $(".course-card").hover(
        function() {
            $(this).children('.badge.badge-danger').css({ "opacity": "1" });
        },
        function() {
            $(this).children('.badge.badge-danger').css({ "opacity": "0" });
        }
    );

    $(".item").hover(
        function() {
            let id = $(this).attr("id");
            let a = $(this).children('.course-card').children('.badge.badge-danger').children('a');
            $.getJSON(`/account/watchlist/is-available?id_course=${id}`, function(data) {
                if (data === false) {
                    a.attr('href', `/account/delwatchlist/${id}`);
                    a.children('i').removeClass('fa-heart-o').addClass('fa-times');
                }
            });
        }
    );

    // $(".bleft").css({
    //     "position": "absolute!important",
    //     "left": "2%!important",
    //     "top": "2%!important",
    //     "width": "20%",
    //     "opacity": "1",
    //     "z-index": "2",
    //     "background-color": "rgb(189, 55, 55)",
    //     "border-radius": "5px"
    // })




}


function search(event) {
    cate = $("#sort option:selected").val();
    key = $('.search').val();
    $.ajax({
            method: 'post',
            url: '/course',
            data: { cate: cate, key: key, check: sort, page: "1" },
            dataType: 'json'
        })
        .done(function(data) {
            $('.col-lg-8 .row').html(data.html);
            let nPage = data.nPages;
            let html = `
        <li class="page-item prev disabled">
          <a style="cursor: pointer;" class="page-link">Prev</a>
        </li>
        <li class="page-item page1 active">
        <a style="cursor: pointer;" class="page-link">1</a>
      </li>`;
            for (let i = 0; i < nPage - 1; i++) {
                html += `<li class="page-item page${i+2}">
            <a style="cursor: pointer;" class="page-link">${i+2}</a>
          </li>`
            }
            if (nPage != 1)
                html += ` <li class="page-item next">
        <a style="cursor: pointer;" class="page-link">Next</a>
      </li>`;
            else
                html += ` <li class="page-item next disabled">
        <a style="cursor: pointer;" class="page-link">Next</a>
      </li>`;
            $('.pagination').html(html);
            jsWatchList();
        })
        .catch(err => {
            console.log(err);
        });
    // this.checked = this.check;
    // this.check = !this.check;      
    event.preventDefault();
}