// Fungsi untuk menambahkan produk ke keranjang
const addToCart = (item_id, productName, productPrice) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({
        item_id, // Gunakan item_id sebagai kunci
        name: productName,
        price: productPrice,
        quantity: 1, // Default quantity untuk setiap item
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} berhasil ditambahkan ke keranjang!`);
    window.location.href = 'cart.html';
};
