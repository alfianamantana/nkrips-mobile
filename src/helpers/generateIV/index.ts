export const generateRandomIV = () => {
    const length = 9; // Panjang IV dalam digit hex
    const characters = '0123456789abcdef';
    let iv = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        iv += characters[randomIndex];
    }
    return iv;
};