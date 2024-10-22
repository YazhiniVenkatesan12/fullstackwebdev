let products = [];
let cart = [];

// Initial products array
products = [
    // Your existing product objects...
];

// Load products from localStorage if available
if (localStorage.getItem('products')) {
    products = JSON.parse(localStorage.getItem('products'));
} else {
    // Store initial products in localStorage
    localStorage.setItem('products', JSON.stringify(products));
}

// Load cart from localStorage if available
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
}

// Function to display products
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach((product, index) => {
        const div = document.createElement('div');
        div.classList.add('product-card');
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: ₹${product.price}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            <div class="reviews">
                <h4>Reviews:</h4>
                ${getProductReviews(product)}
                <form onsubmit="addReview(${index}); return false;">
                    <label>Rating (1-5):</label>
                    <input type="number" min="1" max="5" id="rating-${index}" required>
                    <textarea id="review-${index}" placeholder="Write a review" required></textarea>
                    <button type="submit">Submit Review</button>
                </form>
            </div>
        `;
        productList.appendChild(div);
    });
}

function getProductReviews(product) {
    if (product.reviews.length === 0) return '<p>No reviews yet.</p>';
    return product.reviews
        .map(review => `<p>${review.rating}/5 - ${review.comment}</p>`)
        .join('');
}

function addReview(productIndex) {
    const rating = document.getElementById(`rating-${productIndex}`).value;
    const comment = document.getElementById(`review-${productIndex}`).value;

    const newReview = { rating: parseInt(rating), comment };
    products[productIndex].reviews.push(newReview);

    // Update the product list
    displayProducts();
    // Save updated products to localStorage
    localStorage.setItem('products', JSON.stringify(products));
}

function showCheckout() {
    const address = prompt("Enter your delivery address:");
    const paymentMethod = prompt("Enter your payment method (e.g., Credit Card):");
    alert(`Your order has been placed!\nDelivery Address: ${address}\nPayment Method: ${paymentMethod}`);
    cart = []; // Clear the cart after checkout
    updateCart();
}

function toggleSellProductForm() {
    const form = document.getElementById('sell-product-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function filterProducts() {
    const maxPrice = parseFloat(document.getElementById('price-filter').value);
    document.getElementById('price-display').textContent = `$${maxPrice}`;
    
    const filteredProducts = products.filter(product => product.price <= maxPrice);
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productList.innerHTML = '<p>No products found in this price range.</p>';
    } else {
        filteredProducts.forEach(product => {
            const div = document.createElement('div');
            div.classList.add('product-card');
            div.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: ₹${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            `;
            productList.appendChild(div);
        });
    }
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const address = document.getElementById('address').value;

    alert(`Registered Successfully!\nUsername: ${username}\nAddress: ${address}`);
    window.location.href = 'index.html';
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('An item is added to your cart!');
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElem = document.getElementById('total-price');
    const cartCount = document.getElementById('cart-count');
    cartItems.innerHTML = '';

    let total = 0;
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} - ₹${item.price}
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(li);
        total += item.price;
    });
    totalPriceElem.textContent = `Total: ₹${total.toFixed(2)}`;
    cartCount.textContent = cart.length;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('An item is removed from your cart!');
}

function proceedToPayment() {
    window.location.href = "payment.html";
}

function addProduct() {
    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productDescription = document.getElementById('product-description').value;
    const productImage = document.getElementById('product-image').files[0];

    const reader = new FileReader();
    reader.onload = function(e) {
        const newProduct = {
            name: productName,
            price: parseFloat(productPrice),
            description: productDescription,
            image: e.target.result,
            reviews: []
        };

        products.push(newProduct);
        displayProducts();
        // Save updated products to localStorage
        localStorage.setItem('products', JSON.stringify(products));
    };

    reader.readAsDataURL(productImage);
    document.getElementById('sell-product-form').reset();
}

// Function to show different sections
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// Initialize product display
displayProducts();
updateCart(); // Initialize cart display