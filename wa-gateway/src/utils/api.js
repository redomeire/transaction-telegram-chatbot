export const fetcher = async ({ url, options, onSuccess, onError, onLoading }) => {
    if (onLoading) await onLoading();
    const response = await fetch(url, options);
    const data = await response.json();
    if (onError && !response.ok) {
        await onError(data);
    }
    if (!response.ok) {
        throw new Error(JSON.stringify(data) || 'An error occurred while fetching data.');
    }
    if (onSuccess) await onSuccess(data);
    return data;
}