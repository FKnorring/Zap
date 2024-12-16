import { useState, useCallback, useEffect } from "react";
import { BaseService, FirebaseResponse } from "@/services/base";
import useGetAuthenticatedUser from "./useGetAuthenticatedUser";

interface BaseModel {
  id: string;
  user_id?: string;
}

interface UseOptimisticResourceOptions<T> {
  api: BaseService<T>;
  userScoped?: boolean; // Whether the resource is scoped to the user
  enrichResource?: (id: string) => Promise<FirebaseResponse<T>>; // Optional function to enrich a resource with additional data
}

export type OptimisticResponse<T> = Promise<{
  data: null;
  error: Error;
} | {
  data: T | null;
  error: null;
}>

export type OptimisticCreate<T> = (newResource: Partial<T>, const_id?: string) => OptimisticResponse<T>

export type OptimisticUpdate<T> = (id: string, updates: Partial<T>, skipDatabase?: boolean) => OptimisticResponse<T>

export type OptimisticDelete = (id: string) => OptimisticResponse<void>

interface UserScopedService<T> extends BaseService<T> {
  getByUserId: (userId: string) => Promise<FirebaseResponse<T[]>>;
}

export function createOptimisticResourceHook<T extends BaseModel>(options: UseOptimisticResourceOptions<T>) {
  return function useOptimisticResource() {
    const { user } = useGetAuthenticatedUser();
    const [resources, setResources] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const enrichResource = useCallback(async (id: string) => {
      if (!options.enrichResource) return;
      
      const { data, error } = await options.enrichResource(id);
      if (!error && data) {
        setResources(prev => 
          prev.map(resource => 
            resource.id === id ? { ...resource, ...data } : resource
          )
        );
      }
    }, []);

    const fetchResources = useCallback(() => {
      if (options.userScoped && !user) return;
      
      setIsLoading(true);
      
      const promise = options.userScoped && user
        ? (options.api as UserScopedService<T>).getByUserId(user.id)
        : options.api.list();

      return promise
        .then(response => {
          const { data, error } = response;
          if (!error && data) {
            setResources(data);
          }
          return response;
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [user]);

    useEffect(() => {
      fetchResources();
    }, [fetchResources]);

    const optimisticCreate = useCallback(async (newResource: Partial<T>, const_id?: string) => {
      const tempId = `temp_${Date.now()}`;
      const optimisticResource = {
        id: tempId,
        ...newResource,
      } as T;

      setResources(prev => [optimisticResource, ...prev]);

      const { data, error } = await options.api.create(newResource, const_id);

      if (error) {
        setResources(prev => prev.filter(resource => resource.id !== tempId));
        return { data: null, error };
      }

      setResources(prev => prev.map(resource => 
        resource.id === tempId ? data! : resource
      ));

      return { data, error: null };
    }, []);

    const optimisticUpdate = useCallback(async (id: string, updates: Partial<T>, skipDatabase?: boolean) => {
      setResources(prev => prev.map(resource =>
        resource.id === id ? { ...resource, ...updates } : resource
      ));

      if (skipDatabase) {
        return { data: resources.find(r => r.id === id) || null, error: null };
      }

      const { data, error } = await options.api.update(id, updates);

      if (error) {
        await fetchResources();
        return { data: null, error };
      }

      return { data, error: null };
    }, [fetchResources, resources]);

    const optimisticDelete = useCallback(async (id: string) => {
      const previousResources = [...resources];
      setResources(prev => prev.filter(resource => resource.id !== id));

      const { data, error } = await options.api.delete(id);

      if (error) {
        setResources(previousResources);
        return { data: null, error };
      }

      return { data, error: null };
    }, [resources]);

    if (options.userScoped && !user) {
      return { 
        resources: [], 
        isLoading, 
        optimisticCreate, 
        optimisticUpdate, 
        optimisticDelete,
        enrichResource 
      };
    }

    return { 
      resources, 
      isLoading, 
      optimisticCreate, 
      optimisticUpdate, 
      optimisticDelete,
      enrichResource 
    };
  };
} 