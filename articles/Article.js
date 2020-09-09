const Sequelize = require('sequelize')
const connection = require("../database/connection");
const Category = require("../categories/Category")

const Article = connection.define("articles",{

    title:{
        type: Sequelize.STRING,
        allowNull:false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull:false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull:false
    }
})

Category.hasMany(Article);  // Relacionamento 1 P/ N
Article.belongsTo(Category)   // Relacionamento 1 P/ 1 

// Article.sync({force:true})

module.exports = Article;