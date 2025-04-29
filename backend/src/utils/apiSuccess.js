class ApiSuccess extends Error {
  constructor(status, data, message = 'Success') {
    super(message); 
    this.status = status;
    this.data = data;
    this.sucess=status<400;
  }
}

export default ApiSuccess;