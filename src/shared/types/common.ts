export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  details?: any;
}

export interface SuccessResponse<T> {
  message: string;
  data: T;
}