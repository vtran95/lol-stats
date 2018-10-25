const BASE_URL = '/matchinfo';

async function show(sumName) {
    const res = await fetch(BASE_URL + '/' + sumName);
    if (res.ok)
        return res.json();
    throw new Error('Retrieval of match history failed');
};

export default {
    show
};