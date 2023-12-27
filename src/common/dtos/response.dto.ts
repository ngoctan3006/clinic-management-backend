export class IResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}
