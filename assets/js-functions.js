import { mobileMenu, cartMenu, glassmorphism } from "../main.js";

//FUNCIÓN PARA ABRIR MOBILE MENU
export function openMenu() {
    mobileMenu.style.display = "flex";
}
//FUNCIÓN PARA CERRAR MOBILE MENU
export function closeMenu() {
  mobileMenu.style.display = "none";
}

//FUNCIÓN PARA ABRIR Y CERRAR CARRITO DE COMPRAS
export function toggleCart() {
      
  if(cartMenu.style.display == "flex") { 
    cartMenu.style.display = "none";
    glassmorphism.style.display = "none";

  }
  else { 
    cartMenu.style.display = "flex";
    glassmorphism.style.display = "flex";
  }
}


