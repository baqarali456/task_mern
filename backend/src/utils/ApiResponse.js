class ApiResponse{
    constructor(data,message,status){
       this.data = data;
       this.message = message;
       this.status = status;
       this.success = true;
    }
}

export {
    ApiResponse,
}