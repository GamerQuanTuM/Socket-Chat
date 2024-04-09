import { useState, useEffect } from 'react';
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: AxiosError<any> | null;
}

type RequestMethod = 'GET' | 'POST';

function useFetch<T>(url: string,
    method: RequestMethod = 'GET',
    body?: any,
    config?: AxiosRequestConfig): FetchState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError<any> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const axiosConfig: AxiosRequestConfig = { ...config };

            try {
                let response: AxiosResponse<T>;

                if (method === 'GET') {
                    response = await axios.get(url, axiosConfig);
                } else {
                    response = await axios.post(url, body, axiosConfig);
                }

                setData(response.data);
                setLoading(false);
            } catch (error: any) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [url, config, body]);

    return { data, loading, error };
}

export default useFetch