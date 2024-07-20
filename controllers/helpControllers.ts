require('dotenv').config();
import { Article } from './database';
import { myDataSource } from './database';


const create = async (req, res) => {
  try {
    const { title, content, author} = req.body;

    //Validate Input
    if (!title || !content || !author) {
        return res.status(422).json({
            errors: [
                { field: 'title', message: 'Title is required' },
                { field: 'author', message: 'Author is required' },
                { field: 'content', message: 'Content is required' }
            ]
        });
    };

    //Check for Existing Title
    const articleRepository = myDataSource.getRepository(Article);
    const existingTitle = await articleRepository.findOne({ where: { title }});
    if (existingTitle) {
        return res.status(422).json({
            errors: [{field: 'title', message: 'Article already exists'}]
        });
    };
    
    const articleEntity = await articleRepository.create({title, content, author});
    const article = await articleRepository.save(articleEntity);

    res.status(201).json({
        success: true,
        message: 'Topic Created Successfully',
        data: {
          article_id: article.article_id,
          content: article.content,
          author: article.author,
          title: article.title,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt
        },
        status_code: 201
      });
  } catch (error) {
    res.status(400).json({ 
        status: 'error',
        message: error.message,
        status_code: 400
  });
}

};

const update = async (req, res) => {
  try {
    const { title, content, author} = req.body;
    const article_id = req.params.id;

    //Get article repo
    const articleRepository = myDataSource.getRepository(Article);
    
    // Check if article exists
    const existingArticle = await articleRepository.findOne({ where: { article_id } });
    
    if (!existingArticle) {
      return res.status(404).json({
        status: 'error',
        message: 'Article not found',
        status_code: 404
      });
    };

    // Update only provided fields
    if (title) existingArticle.title = title;
    if (content) existingArticle.content = content;
    if (author) existingArticle.author = author;

    // Save updated article
    await articleRepository.save(existingArticle);

    res.status(201).json({
        success: true,
        message: 'Topic Updated Successfully',
        data: {
          article_id: existingArticle.article_id,
          content: existingArticle.content,
          author: existingArticle.author,
          title: existingArticle.title,
          createdAt: existingArticle.createdAt,
          updatedAt: existingArticle.updatedAt
        },
        status_code: 200
      });
  } catch (error) {
    res.status(400).json({ 
        status: 'error',
        message: error.message,
        status_code: 400
  });
}

};

module.exports = {create, update};