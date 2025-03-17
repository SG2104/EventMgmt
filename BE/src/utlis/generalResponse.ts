import { Response } from "express";

interface ApiResponse<T> {
  data?: Object | null;
  message: string;
  toast: boolean;
  success: boolean;
}

const generalResponse = <T>(
  res: Response,
  statusCode: number,
  data: Object | null,
  message: string,
  toast: boolean = false,
  success: boolean = true
): void => {
  const response: ApiResponse<T> = {
    data,
    message,
    toast,
    success,
  };

  res.status(statusCode).json(response);
};

export default generalResponse;
