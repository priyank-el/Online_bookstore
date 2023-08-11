module.exports = (req,res,next) => {
    const admin = req.user
    
    if(!admin){
        return res.json({
            success:false,
            message:'Admin not login..'
        })
    }else{
        next()
    }
}