/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDelete, usePatch, usePost } from "@/hooks/useFetch";

const basePath = "/events";
export const useGetProductPostApi = () => {
  const { loading, fetchData: post, error } = usePost(`${basePath}/get-all`);

  const getProductsApi = async (
    limit: number,
    offset = 0,
    categories: string[]
  ) => {
    try {
      const res = await post({
        limit,
        offset,
        categories,
      });
      return res || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  return { loading, getProductsApi, error };
};

export const useAddEventPostApi = () => {
  const { fetchData: post, error, loading } = usePost(`${basePath}`);
  const addEventApi = async (payload: any) => {
    const res = await post(payload);
    return res;
  };
  return { loading, addEventApi, error };
};

export const useUpdateEventApi = (id?: string) => {
  const { fetchData, error, loading } = usePatch(`${basePath}/update/${id}`);
  const updateEventApi = async (payload: any) => {
    const res = await fetchData(payload);
    return res;
  };
  return { loading, updateEventApi, error };
};

export const useDeleteEventAPi = (id?: string) => {
  const { fetchData, error, loading } = useDelete(`${basePath}/${id}`);
  const deleteEventApi = async () => {
    const res = await fetchData();
    return res;
  };
  return { loading, deleteEventApi, error };
};
