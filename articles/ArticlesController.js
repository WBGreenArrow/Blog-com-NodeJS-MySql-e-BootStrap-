const express = require("express");

const router = express.Router();

const Category = require("../categories/Category");

const Article = require("./Article");

const Slugfy = require("slugify");

const adminAuth = require("../midlewares/adminAuth");






//ROTAS




//ROTA INDEX DOS ARTIGOS


router.get("/admin/articles",adminAuth, function(req, res){


    Article.findAll({
        include:[{model: Category}]    // Fazendo Join da tabela Artigos com a tabela Categoria
    }).then((articles) =>{

        res.render("admin/articles/index",{articles:articles} );

    })
    
});




//ROTA DE CADASTRO DE UM NOVO ARTIGO METHOD GET


router.get("/admin/articles/new", adminAuth, function(req, res){

    Category.findAll().then((categories) =>{

        res.render("admin/articles/new", {categories:categories})

    });    
});



//ROTA DE CADASTRO DE UM NOVO ARTIGO METHOD POST


router.post("/articles/save",adminAuth, function(req, res){
    
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title:title,
        slug:Slugfy(title),
        body:body,
        categoryId:category
    }).then(() =>{
        res.redirect("/admin/articles");
    })

});


router.post("/articles/delete",adminAuth,function(req, res){

    var id = req.body.id

    if(!isNaN(id)){

        if(id != undefined){

            Article.destroy({
                where:{
                    id:id
                }      
            }).then(() =>{

                res.redirect("/admin/articles");
            });

        }else{

            res.redirect("/admin/articles");
     }

    }else{
        res.redirect("/admin/articles");
    }
  
});


router.get("/admin/articles/update/:id",adminAuth,function(req,res){

    var id = req.params.id;

    if(id != undefined){

        if(!isNaN(id)){

            Article.findByPk(id).then((article) =>{

                Category.findAll().then((categories) =>{

                    res.render("admin/articles/update",{article:article, categories:categories})

                });
            });

        }else{
            res.redirect("/admin/articles");
        }
    }else{
        res.redirect("/admin/articles");
    }
});
       

router.post("/articles/update/save",adminAuth,function(req, res){

    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({
        title:title,
        body:body,
        categoryId:category,
        slug:Slugfy(title)
    },{
        where:{
            id:id
        }
    }).then(() =>{      
        res.redirect("/admin/articles");

    }).catch((err) =>{
        res.redirect("/");
    })

});


router.get("/articles/page/:num",function(req, res){
    
    var page = req.params.num;

    var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = parseInt((page) -1) * 4;
    }

    Article.findAndCountAll({
        limit:4,
        offset:offset,
        order:[["id", "DESC"]]
    }).then((articles) =>{

        var next;

        if(offset + 4 >= articles.count){

            next = false;

        }else{

            next = true;
        }

        var result = {
            page:parseInt(page),
            next:next,
            articles : articles 

        } 

        Category.findAll().then((categories) =>{

            res.render("admin/articles/page",{
                result:result,
                categories:categories});

        })
        
    })

});
                
                

module.exports = router;