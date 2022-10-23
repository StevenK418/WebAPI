const express = require('express');
const router = express.Router();

const {Car, ValidateCar} = require('../models/cars');

// Get routes
//New get using db
router.get('/', async (req, res) => {
  
      //Worksheet 5 Filtering functionality
      const { car_model, location, plateid, status, limit, pagesize } = req.query;

      let filter = {};

      if(car_model)
      {
        filter.car_model = {$regex: `${car_model}`, $options: `i`}
      }

      if(location)
      {
        filter.location = location
      }

      if(plateid)
      {
        filter.plate_id = plateid
      }

      if(status)
      {
        filter.status = status
      }

      let pageSizeNumber = parseInt(pagesize);

      if(isNaN(pageSizeNumber))
      {
        pageSizeNumber = 0;
      }

      let limitNumber = parseInt(limit);

      if(isNaN(limitNumber))
      {
        limitNumber = 0;
      }

      //Print a table of the filtered results. 
      console.table(filter);

      //Get list of cars
      const cars = await Car.
                          find(filter).
                          limit(pageSizeNumber).
                          sort({plate_id: 1, status : -1}).
                          skip(limit, pageSizeNumber).
                          select('car_model driver location plateid status');
      res.json(cars);
      //end of testing
})

//Get car by id
router.get('/:id', async (req,res) => {
  try
  {
    const car = await Car.findById(req.params.id);
    if(car)
    {
      res.json(car);
    }
    else{
      res.status(404).send("Car not found!");
    }
  }
  catch(error)
  {
    res.status(404).send("Not found! ID was Not valid format!" + error);
  }
})

//Post routes
//Post new car to the database
router.post('/', async (req, res) => {

  let car = new Car(req.body);
  let result = ValidateCar(req.body)
  
  if (result.error) {
    res.status(400).json(result.error);
    return;
  }

  try {
      car = await car.save()
      res
      .location(`${car._id}`)
      .status(201)
      .json(car)
  }
  catch (error){
      res.status(500).send('db_error ' + error)
  }
});

//Delete routes using explicit car id
router.delete('/:id', async (req, res) => {
  try 
  {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (car)
      res.status(204).send();
    else
      res.status(404).json(`car with that ID ${req.params.id} was not found`)
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
    let car = await Car.findByIdAndUpdate(req.params.id, req.body);
    car = await car.save();
    res
    .location(`${car._id}`)
    .status(200)
    .json(car)
  } 
  catch (error) 
  {
    res.status(500).send("dbError" + error);
  }
})

module.exports = router;