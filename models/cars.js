const mongoose = require('mongoose')
const Joi = require('Joi')

const driverSchema = new mongoose.Schema({
    name: {type: String, required: true}
})

const carSchema = new mongoose.Schema({
    car_model: String,
    driver_name: driverSchema,
    location: String,
    plate_id: String,
    status: String,
    url: String
})

//Worksheet 6 
function ValidateCar(car)
{
  const driverJoiSchema = Joi.object({
      name: Joi.string().min(2).required()
  })

  const carJoiSchema = Joi.object({
    car_model: Joi.string().min(3).required(),
    driver_name: driverJoiSchema,
    location: Joi.string(),
    plate_id: Joi.string(),
    status: Joi.string(),
    url: Joi.string()
  })
  
  return carJoiSchema.validate(car);
}

const Car = mongoose.model('Car', carSchema);

module.exports = {Car, ValidateCar}

