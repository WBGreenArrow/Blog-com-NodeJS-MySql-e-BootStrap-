const express = require("express");

const connection = require("./database/connection");

const session = require("express-session");

const app = express();

const bodyParser = require("body-parser");


const categoriesController = require("./categories/CategoriesController");

const articlesController = require("./articles/ArticlesController");

const usersController  = require("./user/UserController");

const Article = require("./articles/Article");

const Category = require("./categories/Category");

const User = require("./user/User")



app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use(express.static("public"));

app.set("view engine", "ejs");




//EXPRESS SESSION

//REDIS Banco de dados para salvamento de sessões

app.use(session({
    secret:"qualquercoisa",
    cookie:{
        maxAge:30000000
    }
}))

connection.authenticate()
    .then(() =>{
        console.log("Conexão com banco de dados foi um sucesso")
    }).catch((erro) =>{
        console.log(erro)
    });

app.use("/",categoriesController);


app.use("/", articlesController);


app.use("/",  usersController);



app.get("/", function(req, res){

    Article.findAll({
        limit:4
    }).then((articles) =>{

        Category.findAll().then((categories) =>{

            res.render("index",{articles:articles, categories:categories});

        });
      
    });
   
});



app.get("/:slug",function(req, res){

    var slug = req.params.slug;

    Article.findOne({
        where:{
            slug:slug
        }
    }).then((article) =>{

        if(article != undefined){

            Category.findAll().then((categories) =>{

                res.render("article",{article:article, categories:categories});
    
            });
        }else{

            res.redirect("/")
        }

    }).catch((err) =>{

        res.redirect("/")
    }); 
           
});


app.get("/category/:slug",function(req, res){

    var slug = req.params.slug

        Category.findOne({
            
            where:{
                slug:slug
            },
            include:[{model:Article}]

        }).then((category) =>{

            if(category != undefined){

                Category.findAll().then((categories) =>{

                    res.render("articlesByCategorie",{article:category.articles, categories:categories})

                })
            

            }else{
                res.redirect("/")
            }

        }).catch((err) =>{
        
            res.redirect("/");
        })



})


app.listen(3000, () =>{

    console.log("O servidor está rodando");
});

