module.exports = (req,res,next) => {
    const user = req.user
    
    if(!user){
        return res.status(401).json({
            success:false,
            message:'User not login..'
        })
    }else{
        next()
    }
}