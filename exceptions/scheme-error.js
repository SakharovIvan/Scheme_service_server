class SchemeErrors extends Error {
    status;
    errors;
    constructor(status, message, errors = []) {
      super(message);
      this.status = status;
      this.errors = errors;
    }
    static SearchError() {
      return new ApiErrors(400, "Данные не найдены");
    }

    static BadRequest(message, errors = []) {
      return new ApiErrors(400, message, errors);
    }
  }
  
  export default ApiErrors;