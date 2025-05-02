import { FormInstance } from "antd";
import { AxiosError } from "axios";

export interface User {
  id: number;
  name: string;
  email: string;
}

export type ServerErrorResponse = AxiosError & {
  status: number;
  code: string;
  response: {
    data: {
      message: string;
      errors?: Record<string, string[]>;
    };
  };
};

export type PaginatedData<T> = {
  from: number;
  to: number;
  page: number;
  rows: T[];
  total: number;
};

export type AxiosErrorResponseType = {
  message: string;
  errors?: Record<string, string[]>;
};

export type RecursivePartial<T> = NonNullable<T> extends object
  ? {
      [P in keyof T]?: NonNullable<T[P]> extends (infer U)[]
        ? RecursivePartial<U>[]
        : NonNullable<T[P]> extends object
        ? RecursivePartial<T[P]>
        : T[P];
    }
  : T;

export type CustomFormProps<T> = {
  visible: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onOk: (values: T) => void;
  errors: { [key: string]: string[] };
  form: FormInstance<T>;
};

export type UserType = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

export type CustomerType = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export type FileType = {
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  url: string;
  size: number;
};

export const colors = {
  submitted: "default",
  in_review: "warning",
  in_progress: "blue",
  resolved: "success",
  rejected: "error",
  low: "default",
  medium: "warning",
  high: "error",
  critical: "black",
  other: "default",
  accident: "error",
  criminal: "error",
  environment: "green",
  infrastructure: "blue",
  congestion: "warning",
  extortion: "default",
};

export const dictionary = {
  submitted: "Diajukan",
  in_review: "Dalam Tinjauan",
  in_progress: "Tindak Lanjut",
  resolved: "Selesai",
  rejected: "Ditolak",
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
  critical: "Kritis",
  other: "Lainnya",
  accident: "Kecelakaan",
  criminal: "Tindak Kriminal",
  environment: "Masalah Lingkungan",
  infrastructure: "Masalah Infrastruktur",
  congestion: "Kemacetan",
  extortion: "Pungli",
};
