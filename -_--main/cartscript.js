const products = [
    { 
        id: 1, 
        name: "Часы", 
        price: 3500, 
        image: "часы (1)-min.jpg"
    },
    { 
        id: 2, 
        name: "Часы", 
        price: 4000, 
        image: "часы5.jpg" 
    },
    { 
        id: 3, 
        name: "Часы", 
        price: 3500, 
        image: "часы4.jpg" 
    },
    { 
        id: 4, 
        name: "Часы", 
        price: 3500, 
        image: "часы3.jpg" 
    },
    {
        id: 5, 
        name: "Часы", 
        price: 3500, 
        image: "часы2.jpg" 
    },
    { 
        id: 6, 
        name: "Подвеска", 
        price: 2000, 
        image: "подвеска.jpg" 
    },
    { 
        id: 7, 
        name: "Подвеска", 
        price: 1800, 
        image: "подвеска2.jpg" 
    },
    { 
        id: 8, 
        name: "Подвеска", 
        price: 2000, 
        image: "подвеска4.jpg" 
    },
    { 
        id: 9, 
        name: "Чокер", 
        price: 1000, 
        image: "чекер.jpg" 
    },
    { 
        id: 10, 
        name: "Подвеска", 
        price: 1500, 
        image: "брелок.jpg" 
    },
    { 
        id: 11, 
        name: "Кольцо", 
        price: 1000, 
        image: "кольца3.jpg" 
    },
    { 
        id: 12, 
        name: "Кольцо", 
        price: 2000, 
        image: "кольца.jpg" 
    },
    { 
        id: 13, 
        name: "Кольцо", 
        price: 1800, 
        image: "71280fc3-3321-4d94-93c3-c5dbd2ca2a9d.jpg" 
    },
    { 
        id: 14, 
        name: "Кольцо", 
        price: 1500, 
        image: "кольца2.jpg" 
    },
    { 
        id: 15, 
        name: "Кольцо серебро", 
        price: 5000, 
        image: "кольцо2.jpg" 
    }
];

let sortAscending = true;

let currentFilter = {min: 0, max: Infinity}; //фильтр по диапозону
//извлечение цены
function parsePrice(text) {
    if (!text) return Infinity;
    const match = text.match(/(\d[\d\s]*)/);
    if (!match) return Infinity;
    return Number(match[1].replace(/\s+/g, ''));
}
//извлечение цены из текста overlay
function getItemPrice(item) {
    const overlay = item.querySelector('.overlay span');
    const text = overlay ? overlay.textContent.trim() : '';
    return parsePrice(text);
}

function filterByPriceRange(items,minPrice,maxPrice){
    return items.filter(item=>{
        const price=getItemPrice(item);
        return price >= minPrice&&price <= maxPrice;
    });
}

//применение фильтра
function applyPriceFilter(){
    const minPriceInput = document.getElementById('priceFrom').value;
    const maxPriceInput = document.getElementById('priceTo').value;
    const minPrice = minPriceInput === '' ? 0 : parseInt(minPriceInput);
    const maxPrice = maxPriceInput === '' ? Infinity : parseInt(maxPriceInput);

    if(minPrice>maxPrice){
        alert('Минимальная цена должна быть меньше!');
        return;
    }

    currentFilter = {min: minPrice, max: maxPrice};

    let totalFiltered=0;
    let totalItems=0;


    
    document.querySelectorAll('.image-gallery').forEach(gallery => {
            const allItems = Array.from(gallery.querySelectorAll('.image-item'));
            totalItems += allItems.length;
            
            //массив отфильтрованных
            const filteredItems = filterByPriceRange(allItems, minPrice, maxPrice);
            totalFiltered += filteredItems.length;
            
            //показываем/скрываем товары
            allItems.forEach(item => {
                const price = getItemPrice(item);
                const isVisible = price >= minPrice && price <= maxPrice;
                item.style.display = isVisible ? 'block' : 'none';
            });
        }); 
        showFilterResult(minPrice,maxPrice,totalFiltered,totalItems);
}


//сброс фильтра
function resetPriceFilter() {
    document.getElementById('priceFrom').value = '';
    document.getElementById('priceTo').value = '';
    currentFilter = { min: 0, max: Infinity };
    
    document.querySelectorAll('.image-gallery').forEach(gallery => {
        const items = Array.from(gallery.querySelectorAll('.image-item'));
        items.forEach(item => {
            item.style.display = 'block';
        });
    });
    showResetMessage();
}
//сортировка с вводом
function sortByPrice() {
    document.querySelectorAll('.image-gallery').forEach(gallery => {
        const items = Array.from(gallery.querySelectorAll('.image-item'));
        

        //массив с данными для сортировки
        const itemsWithData = items.map(item => {
            const overlay = item.querySelector('.overlay span');
            const text = overlay ? overlay.textContent.trim() : '';
            const price = parsePrice(text);
            
            return {
                element: item,
                price: price
            };
        });

        itemsWithData.sort((a, b) => {
            return sortAscending ? a.price - b.price : b.price - a.price;
        });

        //переставляем элементы
        gallery.innerHTML = '';
        itemsWithData.forEach(item => {
            gallery.appendChild(item.element);
        });
        
    });

    updateSortButtonText();
}
//переключение сортировки
function toggleSort() {
    sortAscending = !sortAscending;
    sortByPrice();
}
//обновление текста кнопки
function updateSortButtonText() {
    const sortBtn = document.getElementById('sortPriceBtn');
    if (sortBtn) {
        sortBtn.textContent = sortAscending 
            ? 'Фильтр по возрастанию' 
            : 'Фильтр по убыванию';
    }
}


class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addItem(product) {
        const existItem = this.items.find(item => item.id === product.id);
        if (existItem) {
            this.removeItem(product.id);
            return false;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
            this.saveToLocalStorage();
            return true;
        }
    }
    
    //убрать товар
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToLocalStorage();
    }







    
    getTotalPrice() {
        const baseTotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        return baseTotal + 1000000;
    }








    isInCart(productId) {
        return this.items.some(item => item.id === productId);
    }
    
    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
}

const cart = new Cart();


//галерея
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth >= 768) {
        document.querySelector('.price-filter').style.display = "flex";
    }
    //обработчики для сердечек
    const hearts = document.querySelectorAll('.heart');
    //начальные цвета сердечек
    hearts.forEach((heart, index) => {
        const product = products[index];
        if (product && cart.isInCart(product.id)) {
            heart.src = heart.getAttribute('data-red');
        } else {
            heart.src = heart.getAttribute('data-white');
        }
    });
    //обработчики кликов на сердечки
    hearts.forEach((heart, index) => {
        heart.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const product = products[index];
            if (product) {
                const wasAdded = cart.addItem(product);




                // ААААА ОШИБКА ААААА
                if (wasAdded) {
                    this.src = this.getAttribute('data-white');
                } else {
                    this.src = this.getAttribute('data-white');
                }
                updateCartCount();   
            }




        });
    });
    //обработчик для иконки корзины
    const cartIcon = document.getElementById('fixedCartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    } else {
        
        createCartIcon();
    }
    //обработчик для кнопки сортировки
    const sortBtn = document.getElementById('sortPriceBtn');
    if (sortBtn) {
        
        updateSortButtonText();
        sortBtn.addEventListener('click', toggleSort);
    } 
    //кнопка фильтра
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyPriceFilter);
    }



    // ААААА ОШИБКА ААААА
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click',  applyPriceFilter);
    }





    
    updateCartCount();
});

//создание иконки корзины
function createCartIcon() {
    const cartIcon = document.createElement('div');
    cartIcon.id = 'fixedCartIcon';
    cartIcon.innerHTML = `
        <div style="
            background: #420410;
            color: white;
            padding: 15px;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Source Serif 4', serif;
            transition: transform 0.3s ease;
            width: 50px;
            height: 50px;
            cursor: pointer;
        ">
            🛒
            <span id="cartCount" style="
                position: absolute;
                top: -5px;
                right: -5px;
                background: red;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            ">0</span>
        </div>
    `;
    
    cartIcon.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        cursor: pointer;
    `;
    
    cartIcon.addEventListener('click', function() {
        window.location.href = 'cart.html';
    });
    
    document.body.appendChild(cartIcon);
}

//обновления счетчика корзины
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}




document.head.appendChild(style);