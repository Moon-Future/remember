export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  m: string;
}

export interface ApiListResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface COSCredentials {
  credentials: {
    tmpSecretId: string;
    tmpSecretKey: string;
    sessionToken: string;
  };
  bucket: string;
  region: string;
  keyPrefix?: string;
  keyPrefixes?: string[];
  expiredTime: number;
  cdnUrl: string;
}
