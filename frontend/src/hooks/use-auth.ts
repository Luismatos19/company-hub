import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { authApi, companiesApi } from "@/lib/api";

export function useAuth() {
  const router = useRouter();
  const {
    user,
    setUser,
    setActiveCompany,
    setCompanies,
    logout: logoutStore,
  } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      const loggedUser = await authApi.login(email, password);
      setUser(loggedUser);

      if (loggedUser.activeCompanyId) {
        const companies = await companiesApi.getAll();
        setCompanies(companies);

        const activeCompany = companies.find(
          (c) => c.id === loggedUser.activeCompanyId
        );
        if (activeCompany) {
          setActiveCompany(activeCompany);
        }
      }

      router.push("/dashboard");
      return loggedUser;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const newUser = await authApi.signup(email, password, name);
      setUser(newUser);
      router.push("/dashboard");
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }

    logoutStore();

    if (typeof window !== "undefined") {
      window.location.href = "/";
    } else {
      router.push("/");
    }
  };

  const loadUserCompanies = async () => {
    try {
      const companies = await companiesApi.getAll();
      setCompanies(companies);

      if (user?.activeCompanyId) {
        const activeCompany = companies.find(
          (c) => c.id === user.activeCompanyId
        );
        if (activeCompany) {
          setActiveCompany(activeCompany);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserCompanies();
    }
  }, [user?.id]);

  return {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loadUserCompanies,
  };
}
