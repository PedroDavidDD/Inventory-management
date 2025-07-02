import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir URL con parámetros
      let url = `${process.env.EXPO_PUBLIC_API_URL}/${endpoint}`;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          searchParams.append(key, value);
        });
        url += `?${searchParams.toString()}`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return { data, loading: false, error: null };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return { data: null, loading: false, error: err instanceof Error ? err.message : 'An error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Métodos específicos para cada tipo de petición
  const get = useCallback(async <T>(endpoint: string, params?: Record<string, string>) => {
    return request<T>(endpoint, 'GET', undefined, params);
  }, [request]);

  const post = useCallback(async <T>(endpoint: string, body: any, params?: Record<string, string>) => {
    return request<T>(endpoint, 'POST', body, params);
  }, [request]);

  const put = useCallback(async <T>(endpoint: string, body: any, params?: Record<string, string>) => {
    return request<T>(endpoint, 'PUT', body, params);
  }, [request]);

  const del = useCallback(async <T>(endpoint: string, params?: Record<string, string>) => {
    return request<T>(endpoint, 'DELETE', undefined, params);
  }, [request]);

  return {
    get,
    post,
    put,
    del,
    loading,
    error,
  };
};
