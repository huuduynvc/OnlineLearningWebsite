$(document).ready(function(){
    // $('#sort').on('change', function(){
        
    // }),
    var key = "";
    var sort = "";
    var page ="1";


   
    $('input').click(function(){
       
         sort = $(this).val();       
        $.ajax({
            method: 'post',
            url: '/course',
            data: {key: key, check: sort, page: page},
            dataType: 'json'
        })
        .done(function(data){
            $('.col-lg-8 .row').html(data.test);
        })
        .catch(err =>{
            console.log(err);
        });
        // this.checked = this.check;
        // this.check = !this.check;      

    });
    $('.btnsearch').click(function(){
       
         key = $('.search').val();       
        $.ajax({
            method: 'post',
            url: '/course',
            data: {key: key, check: sort, page: page},
            dataType: 'json'
        })
        .done(function(data){
            $('.col-lg-8 .row').html(data.test);
        })
        .catch(err =>{
            console.log(err);
        });
        // this.checked = this.check;
        // this.check = !this.check;      

    });

    $('.pagination li a').on('click', function(){
        $('.active').removeClass('active');
        $(this).parent().addClass('active')
        sort = $('input[type = "radio"]:checked').val();
         p = $(this).text();
         if(p == "Prev")          
            p = (parseInt(page)-1) + "";
         if(p == "Next")          
            p = (parseInt(page)+1) + "";
        page = p;

        $.ajax({
            method: 'post',
            url: '/course',
            data: {key: key, check: sort, page: page},
            dataType: 'json'
        })
        .done(function(data){
            $('.col-lg-8 .row').html(data.test);
        })
        .catch(err =>{
            console.log(err);
        });
    });
});
