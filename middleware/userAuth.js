module.exports = (req,res,next) => {
    const user = req.user
    
    if(!user){
        return res.json({
            success:false,
            message:'User not login..'
        })
    }else{
        next()
    }
}