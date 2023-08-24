exports.errorResponse = ( message , status , res ) => {
    return res.status(status).json({
        success : false,
        errors : message
    })
}

exports.successResponce = (message ,status, res) => {
    return res.status(status).json({
        success:true,
        message
    })
}