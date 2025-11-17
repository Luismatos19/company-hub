import { useState, useEffect } from "react";
import { companiesApi } from "@/lib/api";
import type { Company } from "@/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface UseCompaniesOptions {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useCompanies(options: UseCompaniesOptions = {}) {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, enabled = true } = options;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const loadCompanies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await companiesApi.getAll(page, pageSize);
        setCompanies(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Erro ao carregar empresas");
        setError(error);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, [page, pageSize, enabled]);

  return { companies, isLoading, error, refetch: () => {} };
}

