const mobileMenu = document.querySelector(".mobile-menu");
const hamburger = document.querySelector(".hamburguer");
const closeIcon= document.querySelector(".fa-xmark");
const cart = document.querySelector(".cart-icon");
const cartMenu = document.querySelector(".cart-menu");
const glassmorphism = document.querySelector(".glassmorphism");
const addCartBtn = document.querySelector(".add-cart-btn");
const cartTxt = document.querySelector(".cart-text");

//FUNCIÓN PARA ABRIR MOBILE MENU
function openMenu() {
    mobileMenu.style.display = "flex";
}
//FUNCIÓN PARA CERRAR MOBILE MENU
function closeMenu() {
  mobileMenu.style.display = "none";
}

//FUNCIÓN PARA ABRIR Y CERRAR CARRITO DE COMPRAS
function toggleCart() {
      
  if(cartMenu.style.display == "flex") { 
    cartMenu.style.display = "none";
    glassmorphism.style.display = "none";

  }
  else { 
    cartMenu.style.display = "flex";
    glassmorphism.style.display = "flex";
  }
}



//FUNCIÓN INICIALIZADORA
function init(){
cart.addEventListener("click", toggleCart);
hamburger.addEventListener("click", openMenu);
closeIcon.addEventListener("click", closeMenu)

}

init();
