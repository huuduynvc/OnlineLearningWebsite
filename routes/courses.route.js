const express = require('express');
const courseModel = require('../models/courses.model');
const teacherModel = require('../models/teacher.model');
const router = express.Router();

router.get('/:index', async (req, res)=>{
    const page = req.query.page||1;
    const offset = (page-1)*6;
    const total = await courseModel.countCourse();
    const nPages = Math.ceil(total/6);
    const page_items = [];
    for(i=1; i<=nPages;i++)
    {
        const item = {
            value: i
        }
        page_items.push(item);
    }
    const listCourse = await courseModel.pageByCourse(offset);
    console.log( listCourse);
    const arrayCourse = [];
    for(let course of listCourse)
    {
        arrayCourse.push({
            id: course.id,
            name: course.name,
            caturl: course.caturl,
            catname: course.catname,
            rating: course.rating,
            num_of_rating: course.num_of_rating,
            img: course.image,
            price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price),
            offer: course.offer,
            current_price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price - course.price * course.offer / 100),
            teacher: await teacherModel.getTeacherByCourseId(course.id)
        });
    }
    // const arrayCourse = listCourse.map( async (x)=>{
    //     const teacher = await teacherModel.getTeacherByCourseId(x.id);
    //     return await {id: x.id,
    //             name: x.name,
    //             caturl: x.caturl,
    //             catname: x.catname,
    //             rating: x.rating,
    //             num_of_rating: x.num_of_rating,
    //             img: x.image,
    //             price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(x.price),
    //             offer: x.offer,
    //             current_price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(x.price - x.price * x.offer / 100),
    //             teacher:  teacher
    //         }
    // });
    
    res.render('course', {
        listCourse: arrayCourse,
        page_items
    });
});

module.exports = router;