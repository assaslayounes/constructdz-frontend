import { api } from "./api";
import type { AccountType, User } from "@/types/domain";

export interface LoginDto {
  identifier: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  role: AccountType;
  otp?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  address?: string;
}

type ApiUser = User & {
  password?: string;
  accessToken?: string;
};

const AUTH_TOKEN_KEY = "constructdz_token";
const AUTH_USER_KEY = "constructdz_user";
export { AUTH_TOKEN_KEY, AUTH_USER_KEY };

function persistAuth(user: ApiUser): User {
  const token = user.token ?? user.accessToken ?? `local-token-${user.id}`;
  const { password: _password, accessToken: _accessToken, ...safeUser } = user;
  const authUser: User = { ...safeUser, token };
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
  return authUser;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "حدث خطأ غير متوقع";
}

export async function login(dto: LoginDto): Promise<User> {
  try {
    const identifier = dto.identifier.trim().toLowerCase();
    const { data } = await api.get<ApiUser[]>("/users");

    const user = data.find((item) => {
      const emailMatch = item.email?.toLowerCase() === identifier;
      const phoneMatch = item.phone === dto.identifier.trim();
      return emailMatch || phoneMatch;
    });

    if (!user) {
      throw new Error("لا يوجد حساب مطابق لهذه البيانات");
    }

    if (!user.password || user.password !== dto.password) {
      throw new Error("كلمة المرور غير صحيحة");
    }

    return persistAuth(user);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function register(dto: RegisterDto): Promise<User> {
  try {
    const email = dto.email.trim().toLowerCase();
    const existing = await api.get<ApiUser[]>("/users", { params: { email } });

    if (existing.data.length > 0) {
      throw new Error("هذا البريد الإلكتروني مستخدم مسبقًا");
    }

    const payload: RegisterDto & { email: string; createdAt: string } = {
      ...dto,
      email,
      createdAt: new Date().toISOString()
    };

    const { data } = await api.post<ApiUser>("/users", payload);
    return persistAuth(data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    logout();
    return null;
  }
}
