class ApiResponse {
  constructor({ success = true, data, message, statusCode = 200 } = {}) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }

  static ok(data, message) {
    return new ApiResponse({ success: true, data, message, statusCode: 200 });
  }

  static created(data, message) {
    return new ApiResponse({ success: true, data, message, statusCode: 201 });
  }

  static error(message, statusCode = 500) {
    return new ApiResponse({ success: false, message, statusCode });
  }

  toJSON() {
    return {
      success: this.success,
      data: this.data,
      message: this.message,
      statusCode: this.statusCode,
    };
  }

  send(res) {
    res.status(this.statusCode).json(this.toJSON());
  }
}

module.exports = ApiResponse;
