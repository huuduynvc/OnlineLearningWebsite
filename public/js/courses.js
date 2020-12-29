$(document).ready(function(){

    var key = "";
    var sort = "";
    var page ="1";
    var cate = -1;
   
    $('input').click(function(){
        cate = $( "#sort option:selected" ).val();
         sort = $(this).val();       
        $.ajax({
            method: 'post',
            url: '/course',
            data: { cate: cate, key: key, check: sort, page: page},
            dataType: 'json'
        })
        .done(function(data){
            $('.col-lg-8 .row').html(data.html);
        })
        .catch(err =>{
            console.log(err);
        });
        // this.checked = this.check;
        // this.check = !this.check;      

    });
    $('.btnsearch').click(function(){
        cate = $( "#sort option:selected" ).val();
         key = $('.search').val();       
        $.ajax({
            method: 'post',
            url: '/course',
            data: { cate: cate, key: key, check: sort, page: page},
            dataType: 'json'
        })
        .done(function(data){
            $('.col-lg-8 .row').html(data.html);
        })
        .catch(err =>{
            console.log(err);
        });
        // this.checked = this.check;
        // this.check = !this.check;      

    });

    $("body").delegate('.pagination li a', 'click', function(){
        $('.active').removeClass('active');
        sort = $('input[type = "radio"]:checked').val();
        p = $(this).text();
        if(p != "Prev" && p != "Next")
         {
            $(this).parent().addClass('active')
         }
         if(p == "Prev")
         {        
            p = (parseInt(page)-1) + "";
            $('.page'+p).addClass('active');
         }
         if(p == "Next")    
         {      
            p = (parseInt(page)+1) + "";
            $('.page'+p).addClass('active');
         }
        page = p;
        if(page == "1")
        $('.prev').addClass('disabled');
        else
        $('.prev').removeClass('disabled');
        cate = $( "#sort option:selected" ).val();
        $.ajax({
            method: 'post',
            url: '/course',
            data: { cate: cate, key: key, check: sort, page: page},
            dataType: 'json'
        })
        .done(function(data){
            $('.col-lg-8 .row').html(data.html);
            if(data.disable)
            $('.next').addClass('disabled');
            else
            $('.next').removeClass('disabled');
        })
        .catch(err =>{
            console.log(err);
        });
    });
    // get value selected
        $('#sort').on('change', function(){
        cate = $(this).val();
        if(cate != -1)
        {
        $.ajax({
            method: 'post',
            url: '/course',
            data: { cate: cate, key: key, check: sort, page: "1"},
            dataType: 'json'
        })
        .done(function(data){
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
            for(let i = 0; i<nPage-1;i++)
            {
                html+=`<li class="page-item page${i+2}">
                <a style="cursor: pointer;" class="page-link">${i+2}</a>
              </li>`
            }
            if(nPage !=1)
            html+=` <li class="page-item next">
            <a style="cursor: pointer;" class="page-link">Next</a>
          </li>`;
          else
          html+=` <li class="page-item next disabled">
            <a style="cursor: pointer;" class="page-link">Next</a>
          </li>`;
            $('.pagination').html(html);
        })
        .catch(err =>{
            console.log(err);
        });
    }
    else
    {
        location.reload();
    }
    });
    
});

