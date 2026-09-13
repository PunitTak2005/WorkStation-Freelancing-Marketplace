export class ApiResponse {
  constructor(messageOrStatus = 'Success', data = null, message = 'Success') {
    this.success = true;
    if (typeof messageOrStatus === 'number') {
      this.statusCode = messageOrStatus;
      this.data = data;
      this.message = message;
    } else {
      this.statusCode = 200;
      this.message = messageOrStatus;
      this.data = data;
    }
  }

  static success(arg1, arg2 = 200, arg3 = 'Success', arg4 = null) {
    // If called like: ApiResponse.success('Logged in successfully', { user, accessToken })
    if (typeof arg1 === 'string') {
      return {
        success: true,
        message: arg1,
        data: arg2 !== 200 ? arg2 : null,
      };
    }
    // If called like: ApiResponse.success(res, 200, 'Success', data)
    const res = arg1;
    const statusCode = typeof arg2 === 'number' ? arg2 : 200;
    const message = typeof arg3 === 'string' ? arg3 : 'Success';
    const data = arg4 !== null ? arg4 : (typeof arg3 !== 'string' ? arg3 : null);

    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(arg1, arg2 = 'Created successfully', arg3 = null) {
    if (typeof arg1 === 'string') {
      return {
        success: true,
        message: arg1,
        data: arg2 !== 'Created successfully' ? arg2 : null,
      };
    }
    return this.success(arg1, 201, arg2, arg3);
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

export default ApiResponse;
