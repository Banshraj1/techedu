const asyncHandler=(fxn)=>async (err,req,res,next)=>{
    try{
        await fxn(req,res,next)
    }catch(error){
        res.status(error.code||500).json({
            success:false,
            message:error.message||"Some error occured"
        })
    }
}

export {asyncHandler}