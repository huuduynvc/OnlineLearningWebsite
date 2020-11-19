const express = require('express');

const router = express.Router();

router.get('/about', async(req,res) =>{
    
    res.render("about",{
        title: 'About US',
        breadcrumb: 'About',
        layout: 'sub' });
});

router.get('/blog', async(req,res) =>{
    
    res.render("blog",{
        title: 'Lasted News',
        breadcrumb: 'Blog',
        layout: 'sub' });
});

router.get('/tutor', async(req,res) =>{
    
    res.render("tutor",{
        title: 'Our Expert Tutors',
        breadcrumb: 'Find Tutor',
        layout: 'sub' });
});

router.get('/course', async(req,res) =>{
    
    res.render("course",{
        title: 'Explore Course',
        breadcrumb: 'Course',
        layout: 'sub' });
});

router.get('/login', async(req,res) =>{
    
    res.render("sign-up",{
        layout: null });
});



module.exports = router;