const express = require("express");

const router = express.Router();

const User = require("./User");

const bCrypt = require("bcryptjs");








router.get("/admin/users",function(req, res){

    User.findAll().then((users) =>{
        res.render("users/users", {users:users});
    }).catch((err) =>{
        res.redirect("/")
    })

    
});





router.get("/admin/users/create",function(req, res){

    res.render("admin/users/create");
});






router.post("/users/create",function(req, res){

    var email = req.body.email;
    var password = req.body.password;

    var salt = bCrypt.genSaltSync(10);
    var hash = bCrypt.hashSync(password, salt);

    User.findOne({
        where:{
            email:email
        }
    }).then((user) =>{
        
        if(user == undefined){

            User.create({
                email:email,
                password:hash
            }).then(() =>{
                res.redirect("/");
            }).catch((err) =>{
                res.redirect("/")
            });

        }else{
            res.redirect("/admin/users/create")
        }
    })
  
});








router.get("/login",function(req, res){

    res.render("admin/users/login");

});







router.post("/authenticate", function(req, res){
    
    var email = req.body.email;
    var password = req.body.password;


    User.findOne({
        where:{
            email:email
        }
    }).then((user) =>{

        if(user != undefined){
            
            var correct = bCrypt.compareSync(password, user.password);

            if(correct){

                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles")

            }else{
                res.redirect("/login")
            }

        }else{
            res.redirect("/login");
        }
    })

});


router.get("/logout", function(req, res){

    req.session.user = undefined;

    res.redirect("/")
})


// User.sync({force:false});


module.exports = router;