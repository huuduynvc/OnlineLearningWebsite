$(document).ready(function() {

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
    // get value selected
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
            location.reload();
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

    jsWatchList();

    function jsWatchList() {
        $(".course-card").hover(
            function() {
                $(this).children('.badge.badge-danger').css({ "opacity": "1" });
            },
            function() {
                $(this).children('.badge.badge-danger').css({ "opacity": "0" });
            }
        );
    }

});

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