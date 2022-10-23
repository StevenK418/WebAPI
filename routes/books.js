const express = require('express');
const router = express.Router();

const {Book, ValidateBook} = require('../models/books');

// Get routes
//New get using db
router.get('/', async (req, res) => {
  
      //Worksheet 5 Filtering functionality
      const { title, year, limit, pageNumber, pagesize } = req.query;

      let filter = {};

      if(title)
      {
        filter.title = {$regex: `${title}`, $options: `i`}
      }

      const yearNumber = parseInt(year)

      if(!isNaN(yearNumber))
      {
        Number.isInteger(year)
        filter.year_written = yearNumber
      }

      let limitNumber = parseInt(limit);

      if(isNaN(limitNumber))
      {
        limitNumber = 0;
      }

      let pageSizeNumber = parseInt(pagesize);

      if(isNaN(pageSizeNumber))
      {
        pageSizeNumber = 0;
      }

      let pageNumberNumber = parseInt(pageNumber);

      if(isNaN(pageNumberNumber))
      {
        pageNumberNumber = 1;
      }

      //Print a table of the filtered results. 
      console.table(filter);

      //Get list of books
      const books = await Book.
                          find(filter).
                          limit(pageSizeNumber).
                          sort({price: 1, year_written : -1}).
                          skip((pageNumberNumber -1)*pageSizeNumber).
                          select('price year_written title');
      res.json(books);
      //end of testing
})

//Get book by id
router.get('/:id', async (req,res) => {
  try
  {
    const book = await Book.findById(req.params.id);
    if(book)
    {
      res.json(book);
    }
    else{
      res.status(404).send("Book not found!");
    }
  }
  catch(error)
  {
    res.status(404).send("Not found! ID was weird!" + error);
  }
})

//Post routes
//Post new book to the database
router.post('/', async (req, res) => {

  let book = new Book(req.body);
  let result = ValidateBook(req.body)
  
  if (result.error) {
    res.status(400).json(result.error);
    return;
  }

  try {
      book = await book.save()
      res
      .location(`${book._id}`)
      .status(201)
      .json(book)
  }
  catch (error){
      res.status(500).send('db_error ' + error)
  }
});

//Delete routes using explicit book id
router.delete('/:id', async (req, res) => {
  try 
  {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (book)
      res.status(204).send();
    else
      res.status(404).json(`book with that ID ${req.params.id} was not found`)
  }
  catch 
  {
    res.status(404).json(`funny id ${req.params.id} was not found`);
  }
})

//PUT routes
router.put('/:id', async (req, res)=>{
  try 
  {
    let book = await Book.findByIdAndUpdate(req.params.id, req.body);
    book = await book.save();
    res
    .location('${book._id}')
    .status(200)
    .json(book)
  } 
  catch (error) 
  {
    res.status(500).send("dbError" + error);
  }
})

module.exports = router;