module.exports = (req,res,next) => {
    const admin = req.user
    
    if(!admin){
        return res.status(401).json({
            success:false,
            message:'Admin not login..'
        })
    }else{
        next()
    }
}