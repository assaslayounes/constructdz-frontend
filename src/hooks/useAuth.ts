import { useMutation } from "@tanstack/react-query";
import { login, register, type LoginDto, type RegisterDto } from "@/services/auth.service";

export function useLogin() {
  return useMutation({ mutationFn: (dto: LoginDto) => login(dto) });
}

export function useRegister() {
  return useMutation({ mutationFn: (dto: RegisterDto) => register(dto) });
}
