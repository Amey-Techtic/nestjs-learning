interface ResponseType{
    status: boolean,
    statusCode: number,
    message?: string,
    data?: any,
    error?: string,
}
export function returnSuccessResponse({status, statusCode, data, message}: ResponseType){
    return {status: status, statusCode: statusCode, data: data, message: message};
}
export function returnErrorResponse({status, statusCode, error, data=null}: ResponseType){
    return {status: status, statusCode: statusCode, error: error, data: data};
}

