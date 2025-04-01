class ApiResponse {
  constructor(statusCode, data, message = "Success") {
      this.statusCode = statusCode; // The HTTP status code of the response (e.g., 200, 404, 500).
      this.data = data; // The actual response data, can be any type (Object, Array, String, etc.).
      this.message = message; // A message describing the response, defaulting to "Success" if not provided.
      this.success = statusCode < 400; // A boolean indicating whether the request was successful (status code < 400 is considered successful).
  }
}

export { ApiResponse };

/* Example Usage: -

const successResponse = new ApiResponse(200, { user: "John Doe" });
console.log(successResponse);
>> Output:
{
statusCode: 200,
data: { user: "John Doe" },
message: "Success",
success: true
}

const errorResponse = new ApiResponse(404, null, "Not Found");
console.log(errorResponse);
>> Output:
{
statusCode: 404,
data: null,
message: "Not Found",
success: false
}

*/
