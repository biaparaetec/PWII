// Produtos de Sorvete
const products = [
    {
        id: 1,
        name: 'Morango Clássico',
        description: 'Sorvete de morango fresco e cremoso',
        price: 12.00,
        category: 'fruta',
        gradient: 'linear-gradient(135deg, #FF69B4, #FFB6D9)'
    },
    {
        id: 2,
        name: 'Chocolate Belga',
        description: 'Chocolate premium belga intenso',
        price: 14.00,
        category: 'chocolate',
        gradient: 'linear-gradient(135deg, #8B4513, #D2691E)'
    },
    {
        id: 3,
        name: 'Menta com Chocolate',
        description: 'Menta refrescante com pedaços de chocolate',
        price: 13.50,
        category: 'especial',
        gradient: 'linear-gradient(135deg, #98FF98, #00FA9A)'
    },
    {
        id: 4,
        name: 'Pistache Premium',
        description: 'Sorvete de pistache artesanal',
        price: 15.00,
        category: 'especial',
        gradient: 'linear-gradient(135deg, #9DC183, #A0D995)'
    },
    {
        id: 5,
        name: 'Manga Tropical',
        description: 'Manga fresca com toque de gengibre',
        price: 12.50,
        category: 'fruta',
        gradient: 'linear-gradient(135deg, #FFB300, #FF8C00)'
    },
    {
        id: 6,
        name: 'Limão Siciliano',
        description: 'Limão fresco e refrescante',
        price: 11.50,
        category: 'fruta',
        gradient: 'linear-gradient(135deg, #FFD700, #FFA500)'
    },
    {
        id: 7,
        name: 'Baunilha Francesa',
        description: 'Clássico cremoso com baunilha real',
        price: 10.00,
        category: 'especial',
        gradient: 'linear-gradient(135deg, #F0E68C, #FFFACD)'
    },
    {
        id: 8,
        name: 'Açaí com Granola',
        description: 'Açaí puro com granola crocante',
        price: 13.00,
        category: 'fruta',
        gradient: 'linear-gradient(135deg, #5D3A71, #483D8B)'
    },
    {
        id: 9,
        name: 'Chocolate Branco',
        description: 'Chocolate branco suíço cremoso',
        price: 14.50,
        category: 'chocolate',
        gradient: 'linear-gradient(135deg, #F5DEB3, #FFE4B5)'
    },
    {
        id: 10,
        name: 'Cookies and Cream',
        description: 'Baunilha com pedaços de cookies',
        price: 13.50,
        category: 'especial',
        gradient: 'linear-gradient(135deg, #F5F5DC, #D3D3D3)'
    },
    {
        id: 11,
        name: 'Framboesa Selvagem',
        description: 'Framboesa cultivada com cuidado',
        price: 12.00,
        category: 'fruta',
        gradient: 'linear-gradient(135deg, #E30B5C, #FF69B4)'
    },
    {
        id: 12,
        name: 'Caramelo Salgado',
        description: 'Caramelo com toque de sal marinho',
        price: 14.00,
        category: 'especial',
        gradient: 'linear-gradient(135deg, #CD853F, #DAA520)'
    }
];

// Estado do App
let cart = [];
let currentFilter = 'all';

// Elementos do DOM
const iceCreamGrid = document.getElementById('iceCreamGrid');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cartModal');
const orderModal = document.getElementById('orderModal');
const successModal = document.getElementById('successModal');
const cartCountBadge = document.querySelector('.cart-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const checkoutBtn = document.getElementById('checkoutBtn');
const orderForm = document.getElementById('orderForm');
const closeButtons = document.querySelectorAll('.close-btn');
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const ctaButton = document.querySelector('.cta-button');

// Inicializar App
function init() {
    renderProducts();
    attachEventListeners();
    loadCartFromStorage();
}

// Renderizar Produtos
function renderProducts(filter = 'all') {
    iceCreamGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);

    filteredProducts.forEach(product => {
        const card = createProductCard(product);
        iceCreamGrid.appendChild(card);
    });
}

// Criar Card do Produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'ice-cream-card';
    card.innerHTML = `
        <div class="ice-cream-image" style="background: ${product.gradient};">
            <i class="fas fa-ice-cream"></i>
        </div>
        <h3 class="ice-cream-name">${product.name}</h3>
        <p class="ice-cream-description">${product.description}</p>
        <div class="ice-cream-footer">
            <span class="price">R$ ${product.price.toFixed(2)}</span>
            <button class="add-btn" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Adicionar
            </button>
        </div>
    `;
    return card;
}

// Adicionar ao Carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    saveCartToStorage();
    showAddedNotification();
}

// Remover do Carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
}

// Aumentar Quantidade
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        updateCartUI();
        saveCartToStorage();
    }
}

// Diminuir Quantidade
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity--;
        updateCartUI();
        saveCartToStorage();
    }
}

// Atualizar UI do Carrinho
function updateCartUI() {
    // Atualizar Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;

    // Atualizar Modal
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        document.getElementById('checkoutBtn').disabled = true;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-quantity">
                        <button onclick="decreaseQuantity(${item.id})" style="width: 25px; height: 25px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px;">-</button>
                        <span style="margin: 0 8px;">${item.quantity}</span>
                        <button onclick="increaseQuantity(${item.id})" style="width: 25px; height: 25px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px;">+</button>
                    </div>
                </div>
                <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        document.getElementById('checkoutBtn').disabled = false;
    }

    // Atualizar Totais
    updateCartTotals();
}

// Atualizar Totais
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal === 0 ? 0 : 5.00;
    const total = subtotal + delivery;

    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('delivery').textContent = `R$ ${delivery.toFixed(2)}`;
    document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
}

// Abrir Carrinho
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
});

// Fechar Modais
closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.cart-modal');
        if (modal) modal.classList.remove('active');
    });
});

// Fechar Modais ao Clicar Fora
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        closeOrderModal();
    }
});

// Abrir Modal de Pedido
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        orderModal.classList.add('active');
    }
});

// Fechar Modal de Pedido
function closeOrderModal() {
    orderModal.classList.remove('active');
}

// Fechar Modal de Sucesso
function closeSuccessModal() {
    successModal.classList.remove('active');
    cart = [];
    updateCartUI();
    saveCartToStorage();
    cartModal.classList.remove('active');
    orderModal.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Enviar Pedido
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(orderForm);
    const nome = orderForm.querySelector('input[type="text"]').value;
    const email = orderForm.querySelector('input[type="email"]').value;

    // Valores dos inputs
    const inputs = orderForm.querySelectorAll('input, textarea');
    let allFilled = true;
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            allFilled = false;
        }
    });

    if (allFilled) {
        // Fechar modais
        orderModal.classList.remove('active');
        cartModal.classList.remove('active');

        // Mostrar sucesso
        successModal.classList.add('active');
        
        // Preparar mensagem de sucesso
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = (subtotal + 5.00).toFixed(2);
        const items = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
        
        document.getElementById('successMessage').innerHTML = `
            Obrigado ${nome}! Seu pedido foi confirmado.<br>
            <br>
            <strong>Itens:</strong> ${items}<br>
            <strong>Total:</strong> R$ ${total}<br>
            <br>
            Você receberá um email em ${email} com os detalhes do seu pedido.
        `;

        // Limpar formulário
        orderForm.reset();
    }
});

// Filtros
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderProducts(currentFilter);
    });
});

// Menu Mobile
hamburger.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.style.display = 'none';
    });
});

// CTA Button
ctaButton.addEventListener('click', () => {
    document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
});

// Notificação de Itens Adicionados
function showAddedNotification() {
    // Criar notificação temporária
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = '✓ Adicionado ao carrinho!';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// LocalStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// Iniciar App
init();

console.log('Sorveteria carregada com sucesso!');
