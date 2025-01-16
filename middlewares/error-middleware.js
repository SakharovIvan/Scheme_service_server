import SchemeErrors from "../exceptions/scheme-error";

export default function (err, req,res,next){
    if(err instanceof SchemeErrors){
        return res.status(err.status)
        .json({message:err.message,errors: err.errors})
    }
    return res.status(500).json({message: `Непредвиденная ошибка ${err}`})

}