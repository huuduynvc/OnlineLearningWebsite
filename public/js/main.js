// $(document).ready(function() {

//     // $('a').on('click', function(){
//     //     var cate = $(this).attr('id');
//     //     if (cate != -1) {
//     //         $.ajax({
//     //                 method: 'post',
//     //                 url: '/course',
//     //                 data: { cate: cate, key: "", check: undefined, page: "1" },
//     //                 dataType: 'json'
//     //             })
//     //             .done(async function(data) {
//     //                  //window.location.href = await '/course';
//     //                  $("#sort").val(cate);
//     //                  $('#sort').change();
//     //                  console.log(data.html);
//         //             $('.col-lg-8 .row').html(data.html);
//         //             // show pagination
//         //             let nPage = data.nPages;
//         //             let html = `
//         //     <li class="page-item prev disabled">
//         //       <a style="cursor: pointer;" class="page-link">Prev</a>
//         //     </li>
//         //     <li class="page-item page1 active">
//         //     <a style="cursor: pointer;" class="page-link">1</a>
//         //   </li>`;
//         //             for (let i = 0; i < nPage - 1; i++) {
//         //                 html += `<li class="page-item page${i+2}">
//         //         <a style="cursor: pointer;" class="page-link">${i+2}</a>
//         //       </li>`
//         //             }
//         //             if (nPage != 1)
//         //                 html += ` <li class="page-item next">
//         //     <a style="cursor: pointer;" class="page-link">Next</a>
//         //   </li>`;
//         //             else
//         //                 html += ` <li class="page-item next disabled">
//         //     <a style="cursor: pointer;" class="page-link">Next</a>
//         //   </li>`;
//         //             $('.pagination').html(html);
//         //             jsWatchList();
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 });
//         } else {
//             location.reload();
//         }
//      });
// })




// $('#formcate')
//     .ajaxForm({
//         url : '/course', // or whatever
//         dataType : 'json',
//         success : function (response) {
//             $('.col-lg-8 .row').html(response.html);
//         }
//     })