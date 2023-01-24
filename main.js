import {productsData} from './assets/productsArray.js';
import { toggleCart, openMenu, closeMenu, } from './assets/js-functions.js';


export const mobileMenu = document.querySelector(".mobile-menu");
const hamburger = document.querySelector(".hamburguer");
const closeIcon= document.querySelector(".fa-xmark");
const cartIcon = document.querySelector(".cart-icon");
export const cartMenu = document.querySelector(".cart-menu");
export const glassmorphism = document.querySelector(".glassmorphism");
const addCartBtn = document.querySelector(".row");
const cartTxt = document.querySelector(".cart-text");
const novContainer = document.querySelector(".novedades-container");
const prodContainer = document.querySelector(".prod-container");
//const trashIcon = document.querySelector(".fa-trash-can");
//const quantityTxt = document.querySelector(".quantity-txt");

// FUNCIÓN FLECHA QUE ALMACENA EN LOCAL STORAGE UN ARRAY DE OBJETOS (PARA CARRITO)
let saveLocalStorage = (cartList) => {
  localStorage.setItem("cart", JSON.stringify(cartList));
};

export let cart = JSON.parse(localStorage.getItem("cart")) || [];


//FUNCIÓN PARA RENDERIZAR los últimos 4 objetos del array en la sección "Novedades"
function renderNovedades(arr){
  if(novContainer !== null){
      for (let i = (arr.length-4); i < arr.length; i++) {
        let obj = arr[i];
        novContainer.innerHTML +=  
        `<div class="col">
        <div class="card" style="width: 15rem;">
          <img src="./img/portadas fake/1.png" class="card-img-top" alt="...">
          <div class="card-body">
            <h6>${obj.category}</h6>
            <h4 class="card-title">${obj.name}</h4>
            <h7>${obj.type}</h7>
            <p class="card-text">$${obj.cost}</p>
            <button type="button" id="add-cart-btn" class="boton" 
            data-id='${obj.id}'
            data-name='${obj.name}'
            data-cost='${obj.cost}'
            data-type='${obj.type}'
            data-img='${obj.cardImg}'
            data-quantity='${obj.quantity}'
            >Agregar al carrito</button>
          </div>
        </div>
      </div>`
      }
  }
  }

//FUNCIÓN PARA RENDERIZAR todos los objetos del array en la sección "Productos"  
function renderProd(arr){
  if(prodContainer !== null){
      for (let i = 0; i < arr.length; i++) {
        let obj = arr[i];
        prodContainer.innerHTML +=  
        `<div class="col">
        <div class="card" style="width: 15rem;">
          <img src="./img/portadas fake/1.png" class="card-img-top" alt="...">
          <div class="card-body">
            <h6>${obj.category}</h6>
            <h4 class="card-title">${obj.name}</h4>
            <h7>${obj.type}</h7>
            <p class="card-text">$${obj.cost}</p>
            <button type="button" id="add-cart-btn" class="boton" 
            data-id='${obj.id}'
            data-name='${obj.name}'
            data-cost='${obj.cost}'
            data-type='${obj.type}'
            data-img='${obj.cardImg}'
            data-quantity='${obj.quantity}'
            >Agregar al carrito</button>
          </div>
        </div>
      </div>`
      }
    }
  }

// Funcion para renderizar el carrito
// Analiza array "cart" del Local Storage. Si es un array vacío, renderiza msj de "carrito vacío".
// De otro modo, ejecutamos función renderCartProduct para c/u de los elementos del array.
const renderCart = () => {
  if (!cart.length) {
    cartTxt.innerHTML = `<h2>Carrito(0)</h2> 
    <p>No hay productos en el carrito.</p>`;
    return;
  }
  cartTxt.innerHTML = cart.map(renderCartProduct).join("");
};

//FUNCIÓN QUE RECIBE UN OBJETO (del array Cart) E IMPRIME en carrrito. Recibe, desestructura, y retorna código html para renderizar en el carrito
const renderCartProduct = (product) => {
  const { name, id, type, cost, img, quantity } = product;
  return   `<div class="added-product-card">
  <img src="${img}" class="added-img" alt="...">
  <div class="added-card-body">
    <div class="added-container1">
    <h4 class="added-card-title">${name}</h4>
    <div><i id="trash-icon" data-id='${id}' class="fa-regular fa-trash-can cart-container-icon"></i></div>
    </div>
    <div class="added-container1">
    <div>
    <h7>${type}</h7>
    <p class="card-text">$${cost}</p>
    </div>
    <div class="cart-item-count">
    <i class="fa-regular fa-square-minus cart-container-icon"></i>
    <h4 id="quantity-txt">${quantity}</h4>
    <i class="fa-regular fa-square-plus cart-container-icon"></i>
    </div>
    </div>
  </div>
</div>`;
}

  //FUNCIÓN PARA AGREGAR ARTÍCULO AL LOCAL STORAGE. Al clicar el btn de agregar, desestructura los datos seteados en el mismo
  //Crea obj con dichos valores, abre carro.
  //Analiza si ya existe dichoa artículo en carrito. Si existe, le agrega una unidad a quantity.
  //De otro modo, crea el producto en el array Cart y renderiza obj. Guarda en LS y actualiza la renderización del carrito.
  function addToCart(e){
      if (e.target.id == "add-cart-btn"){
          const { id, name, cost, type, img } = e.target.dataset;
          let product = productConstructor(id, name, cost, type, img);
          toggleCart();
          console.log(product.img);
          
          if (cart.some(e => e.id === product.id)) {
            cart.map(function(arrObj){
              if(arrObj.id === product.id){
              arrObj.quantity += 1;
              }
            });       
            
          }else{
              createCartProduct(product) ;                           
          }   
          saveLocalStorage(cart);
          renderCart(cart);  
      }
  }    

  //FUNCIÓN QUE CREA PRODUCTO(objeto) EN EL CART(array) del LS Y CREA PROPIEDAD "quantity" con valor 1.
  const createCartProduct = (product) => {
    cart = [...cart, { ...product, quantity: 1 }];
  };

//CONSTRUCTOR DE PRODUCTO PARA AGREGAR AL CARRITO
export const productConstructor = (id, name, cost, type, img, quantity) => {
  return { id, name, cost, type, img, quantity };
};

  
//FUNCIÓN PARA ELIMINAR PRODUCTO DE CARRITO DE COMPRA Y DE LS
//Como el trash-icon es creado de manera dinámica, no podemos attachearle directamente un addEventList. 
//Se lo attacheamos al body, y activamos la función sólo en caso de que se trate del icono requerido-
function deleteCartProduct (event) {
  if( event.target.id == 'trash-icon'){   
    const { id } = event.target.dataset;
    const deletedProduct = productConstructor(id);
    cart = cart.filter(cartProduct => cartProduct.id != deletedProduct.id);
    saveLocalStorage(cart);
    renderCart(cart); 
  };
} 


  


//FUNCIÓN INICIALIZADORA
function init(){
cartIcon.addEventListener("click", toggleCart);
hamburger.addEventListener("click", openMenu);
closeIcon.addEventListener("click", closeMenu);
glassmorphism.addEventListener("click", toggleCart);
renderNovedades(productsData);
renderProd(productsData);
addCartBtn.addEventListener("click", addToCart);
document.body.addEventListener( 'click', deleteCartProduct);
renderCart()
}


init();



//Renderizar carrito vacío    <h2>Carrito(0)</h2> <!--<h4 class="cart-empty">Tu carrito está vacío</h4>-->



//hasta acá