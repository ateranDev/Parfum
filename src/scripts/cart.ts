const emptyCart = document.querySelector("#emptyCart");
let cartList = document.querySelector("#cart-list");
let cartItems: any[] = [];
let total = 0;

chargingEventListeners();

function chargingEventListeners() {
  empty();
  document.addEventListener("click", (e: Event) => {
    // Le decimos a TypeScript que e.target es un HTMLElement o usamos casting
    const target = e.target as HTMLElement;

    // Buscamos si el clic ocurrió dentro o sobre un botón .btn-add
    const selected = target?.closest(".btn-add") as HTMLElement;
    if (selected) {
      readData(selected);
    }
  });
}

function empty() {
  if (cartItems.length === 0) {
    if (cartList) {
      cartList.innerHTML = `
          <div class="text-center text-sm text-gray-500 py-4">No tienes productos agregados al carrito</div>
        `;
    }
  }
}

// Vaciar carrito
emptyCart?.addEventListener("click", () => {
  cartItems = [];
  cartHTML();
  updateTotal();
  updateBadge();
  empty();
});

function updateBadge() {
  const badge = document.querySelector(".absolute.top-0.right-0");
  if (badge) {
    badge.textContent = cartItems.length > 0 ? `${cartItems.length}` : "";
    badge.classList.toggle("hidden", cartItems.length === 0);
  }
}

// Lee el contenido del HTML y extrae la información del curso
function readData(data: HTMLElement) {
  // Crear objeto con el contenido del producto
  const infoProduct = {
    img: data.querySelector("img")?.src ?? "",
    title: data.querySelector("h3")?.textContent ?? "",
    price: data.querySelector("p")?.textContent ?? "",
    id: data.querySelector("button")?.getAttribute("id") ?? "",
    amount: 1,
  };

  // Verificar si el producto ya existe en el carrito
  const existingProduct = cartItems.find(
    (item) => item.title === infoProduct.title,
  );

  if (existingProduct) {
    // Si existe, aumentar la cantidad
    existingProduct.amount += 1;
  } else {
    // Si no existe, agregar nuevo
    cartItems = [...cartItems, infoProduct];
  }

  cartHTML();
}

// Actualizar total
function updateTotal() {
  const totalElement = document.getElementById("cart-total");
  if (totalElement) {
    total = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.price.replace("$", ""));
      return acc + price * item.amount;
    }, 0);
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
  updateBadge();
}

// Muestra el carrito de compras en el HTML
function cartHTML() {
  // Limpiar el HTML
  if (cartList) {
    cartList.innerHTML = "";
  }

  cartItems.forEach((item, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="py-3 flex items-center justify-between gap-3">
      <img
        src=${item.img}
        alt=${item.title}
        class="w-12 h-12 rounded-md object-cover border border-gray-100 flex-shrink-0"
      />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">${item.title}</p>
        <p class="text-xs text-gray-500">${item.price} - x ${item.amount}</p>
      </div>
      <button
        class="text-gray-400 hover:text-red-500 text-sm p-1 transition-colors delete-item"
        data-index="${index}"
      >
        ✕
      </button>
    </div>
    `;

    // Agrega el HTML en el carrito
    cartList?.appendChild(div);
    updateTotal();
    toggleBtnPagar();
  });

  // Agregar event listeners a los botones de eliminar
  document.querySelectorAll(".delete-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const index = parseInt(target.getAttribute("data-index") || "0");
      deleteItem(index);
      empty();
    });
  });
}

// Función para eliminar un item específico
function deleteItem(index: number) {
  // Eliminar el item del array
  cartItems.splice(index, 1);

  // Actualizar la vista
  cartHTML();
  updateTotal();
  updateBadge();
}

// Claude

const btnPagar = document.querySelector("#btn-pagar") as HTMLButtonElement;

btnPagar?.addEventListener("click", () => {
  if (cartItems.length === 0) return;

  const phone = btnPagar.getAttribute("data-phone");

  let mensaje = "¡Hola! Quiero hacer el siguiente pedido:\n\n";
  cartItems.forEach((item) => {
    mensaje += `• ${item.title} — x${item.amount} — ${item.price}\n`;
  });
  mensaje += `\nTotal: $${total.toFixed(2)}`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
});

// Deshabilita el botón "Pagar" si el carrito está vacío
function toggleBtnPagar() {
  if (btnPagar) btnPagar.disabled = cartItems.length === 0;
}

