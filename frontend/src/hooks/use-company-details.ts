import { useState, useEffect } from "react";
import { companiesApi } from "@/lib/api";
import type { Company, Membership } from "@/types";
import { AUTH_CHECK_DELAY } from "@/lib/constants";

export function useCompanyDetails(companyId: string, enabled = true) {
  const [company, setCompany] = useState<Company | null>(null);
  const [members, setMembers] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, AUTH_CHECK_DELAY);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isCheckingAuth || !enabled) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const companyData = await companiesApi.getById(companyId);
        setCompany(companyData);
        const memberships = Array.isArray(companyData.memberships)
          ? companyData.memberships
          : [];
        setMembers(memberships);
      } catch (err) {
        setError("Erro ao carregar dados da empresa. Tente novamente.");
        setCompany(null);
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [companyId, enabled, isCheckingAuth]);

  const refetch = async () => {
    if (!companyId) return;
    setIsLoading(true);
    setError(null);
    try {
      const companyData = await companiesApi.getById(companyId);
      setCompany(companyData);
      const memberships = Array.isArray(companyData.memberships)
        ? companyData.memberships
        : [];
      setMembers(memberships);
    } catch (err) {
      setError("Erro ao recarregar dados da empresa.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    company,
    members,
    isLoading: isLoading || isCheckingAuth,
    error,
    refetch,
  };
}

