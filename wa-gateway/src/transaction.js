const baseUrl = process.env.VERCEL_API_URL;

const createTransaction = async ({
    text,
    sender,
    onSuccess,
    onError
}) => {
    const response = await fetch(`${baseUrl}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.VERCEL_API_KEY
        },
        body: JSON.stringify({ text, sender })
    })

    const data = await response.json();
    if (response.ok) {
        if (onSuccess) onSuccess(data);
    } else {
        if (onError) onError(data);
    }
    return { response, data };
}
const updateTransaction = async (id) => {}
const deleteTransaction = async (id) => { }

export { createTransaction, updateTransaction, deleteTransaction };