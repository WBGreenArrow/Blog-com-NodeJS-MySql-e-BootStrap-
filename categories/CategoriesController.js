const express = require("express");

const router = express.Router();

const slugify = require("slugify");

const Category = require("./Category");





//ROTA DE CATEGORIAS

router.get("/categories",function(req, res){

    res.send("rota de categorias")
});






//ROTA DE CADASTRAR METHOD GET

router.get("/admin/categories/new", function(req, res){

    res.render("../views/admin/categories/new")
});





//ROTA DE CADASTRAR METHOD POST

router.post("/categories/save",function(req, res){

    var title = req.body.title;

    if(title != undefined ){

        Category.create({
            title:title,
            slug: slugify(title)
        }).then(() =>{
            console.log("Dados cadastrados com sucesso!");
            
            res.redirect("/admin/categories");

        }).catch((err) =>{
            console.log("Erro ao cadastrar dados " + err)
        });

    }else{

        res.redirect("/admin/categories")
    }
});





//ROTA DE LISTAR CATEGORIAS 

router.get("/admin/categories",function(req, res){

    Category.findAll().then((categories) =>{

        res.render("admin/categories/index",{
            categories:categories
        });

    })

    
});




//ROTA DE DELETAR CATEGORIAS 

router.post("/categories/delete",function(req,res){
    
    var id = req.body.id;

    if(id != undefined){

        if(!isNaN(id)){

            Category.destroy({
                where:{
                    id:id
                }
            }).then(() =>{
                res.redirect("/admin/categories");
            });
            
        }else{
            res.redirect("/admin/categories");
        }
    }else{
        res.redirect("/admin/categories");
    }
});



//ROTA DE ATUALIZAR METHOD GET

router.get("/admin/categories/edit/:id", function(req, res){

    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/categories");
    }

    Category.findByPk(id)
        .then((category) =>{

            if(category != undefined){

                res.render("admin/categories/edit",{
                    category:category
                });

            }else{
                res.redirect("/admin/categories");
            }
        }).catch((err) =>{
            res.redirect("/admin/categories");
        });
});



//ROTA DE ATUALIZAR METHOD POST

router.post("/categories/update",function(req, res){

    var id = req.body.id;

    var title = req.body.title;

    Category.update({title:title, slug:slugify(title)},{
        where:{
            id:id
        }
    }).then(() =>{
        res.redirect("/admin/categories");
    })
    
})

module.exports = router;