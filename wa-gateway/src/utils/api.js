export const fetcher = async ({ url, options, onSuccess, onError, onLoading }) => {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), 10000);
    if (onLoading) await onLoading();
    try {
        const response = await fetch(url, {
            ...options,
            signal: abortController.signal
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'An error occurred while fetching data.');
        }
        if (onSuccess) await onSuccess(data);
        return data;
    } catch (error) {
        console.log('Fetch error:', error);
        if (onError) await onError(error);
        throw error;
    }
}