const ADMIN = require("../models/adminSchema");
const validators = require("./validators/index");

module.exports = (validator) => async (req, res, next) => {
  
  //*  hasOwnProperty checks validator which comes in parameter exist on validators */
  if (validators.hasOwnProperty(validator)) {
      try {
        //TODO: validateAsync is use for validation process
        const validated = await validators[validator].validateAsync(req.body);
        req.body = validated;

        if(validator == 'adminRegister'){
          try {
            const email = req.body.email;
            const isExist = await ADMIN.findOne({email})
        
            if(isExist){
              throw Error('This email is already exist..')
            }
    
            next()
          } catch (error) {
            return res.json({
              success : false , 
              message : error.message
            })
          }
        }

        next();
      } catch (error) {
        console.log(error);
          return res.status(401).json({
              success:false,
              message:error.details
          })
      }
  } else {
    return res.json({
      success: false,
      message: `${validator} not have permission..`,
    })
  }
}
