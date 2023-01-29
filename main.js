import {productsData} from './assets/productsArray.js';
import { toggleCart, openMenu, closeMenu} from './assets/js-functions.js';


export const mobileMenu = document.querySelector(".mobile-menu");
const hamburger = document.querySelector(".hamburguer");
const closeIcon= document.querySelector(".fa-xmark");
const cartIcon = document.querySelector(".cart-icon");
export const cartMenu = document.querySelector(".cart-menu");
export const glassmorphism = document.querySelector(".glassmorphism");
const addCartBtn = document.querySelector(".row");
const cartTxt = document.querySelector(".cart-text");
const cartBtn = document.querySelector(".cart-btn");
const novContainer = document.querySelector(".novedades-container");
const prodContainer = document.querySelector(".prod-container");
const cartBubble = document.querySelector(".cart-bubble");
const todos = document.getElementById("todos");
const adultosMayores = document.getElementById("adultos-mayores");
const adultos = document.getElementById("adultos");
const adolescentes = document.getElementById("adolescentes");
const niños = document.getElementById("ninios");


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
    prodContainer.innerHTML =  `""`;  //Agrego esta linea porque, de otro modo, el array con productos filtrados se renderiza añadiéndose (y no reemplazando) a lo anteriormente renderizado. Además, por algún motivo que no logro encontrar, tanto la función para crear array con filtros vigentes como la función para crear nuevo array de productos con dichos filtros, se ejecuta 2 veces (duplicadamente), primero, con el estado anterior, y luego, con el nuevo estado del array (Ver consola para comprender mejor)
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
    cartTxt.innerHTML = `<h2>Carrito (0)</h2> 
    <p>No hay productos en el carrito.</p>`;
    cartBtn.innerHTML = `<button type="button" class="boton-productos" href=""><a class="boton-productos" href="./productos.html">Ver productos</a></button>`
    bubbleNumber(); 
    return;
  }
  let count = countAddedProducts();  
  cartTxt.innerHTML = `<h2>Carrito (${count})</h2>` + cart.map(renderCartProduct).join("");
  bubbleNumber(); 
  displayTotal();
};

//FUNCIÓN QUE CREA UN ARRAY CON LAS CATEGORÍAS APLICADAS PARA EL FILTRO.
function filterArray(){
  let checkboxesArray = []
  let checkedCheckboxes =  document.querySelectorAll("input[type='checkbox']:checked");
  for (let i = 0; i < checkedCheckboxes.length; i++) {
    checkboxesArray.push(checkedCheckboxes[i].dataset.category.split(" "))
  }
  return checkboxesArray.flat();
}

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
    <p class="card-text">$${cost}*${quantity}= $${cost*quantity}</p>
    </div>
    <div class="cart-item-count">
    <i id="minusIcon" class="fa-regular fa-square-minus cart-container-icon" data-id='${id}'></i>
    <h4 id="quantity-txt">${quantity}</h4>
    <i id="plusIcon" class="fa-regular fa-square-plus cart-container-icon" data-id='${id}'></i>
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
//Se lo attacheamos al body, y activamos la función sólo en caso de que se trate del icono trash-
function deleteCartProduct (event) {
  if( event.target.id == 'trash-icon'){   
    const { id } = event.target.dataset;
    const deletedProduct = productConstructor(id);
    cart = cart.filter(cartProduct => cartProduct.id != deletedProduct.id); 
    saveLocalStorage(cart);
    renderCart(cart); 
  };
} 

//FUNCIÓN QUE ANALIZA QUÉ BOTÓN SE TOCÓ (+) O (-) Y EJECUTA FUNCIÓN CORRESPONDIENTE.
//LUEGO GUARDA EN LS Y ACTUALIZA CARRITO
function cartUnits(e){
  if (e.target.id == "plusIcon"){
    addUnit(e);
  }else if(e.target.id == "minusIcon"){
    substractUnit(e)
  }
  saveLocalStorage(cart);
  renderCart(cart);
}

//FUNCIÓN PARA AGREGAR UNA UNIDAD AL ATRIBUTO QUANTITY DEL OBJETO RECIBIDO
function addUnit(e){
    const { id } = e.target.dataset;
    let receivedId = productConstructor(id);
    const result = cart.find(({ id }) => id === receivedId.id);
    result.quantity+=1;
      }
//FUNCIÓN PARA RESTAR UNA UNIDAD AL ATRIBUTO QUANTITY DEL OBJETO RECIBIDO. En caso de que quantity tenga un valor
//menor a 1, el objeto se elimina del array cart.
function substractUnit(e){
  if (e.target.id == "minusIcon"){
    const { id } = e.target.dataset;
    let receivedId = productConstructor(id);
    const result = cart.find(({ id }) => id === receivedId.id);
    result.quantity-=1;
    if(result.quantity<1){
      cart = cart.filter(cartProduct => cartProduct.id != result.id);
    }
      }}

  //FUNCIÓN PARA COLOCAR NÚMERO EN LA BURBUJA DEL CARRITO. Va sumando en un contador todos los quantity de los objetos del array cart.
  function bubbleNumber(){
      let count = countAddedProducts();
      cartBubble.innerHTML  = `${count}`;
    }

    //FUNCIÓN QUE CONTABILIZA LA CANTIDAD DE PRODUCTOS TOTALES AGREGADOS AL CARRITO.
    function countAddedProducts(){
      let count = 0;
      cart.map(function(obj){
        count = count + obj.quantity;
      })
      return count;
    }
  
//FUNCIÓN QUE RENDERIZA EL COSTO TOTAL DE LOS PRODUCTOS AÑADIDOS AL CARRITO Y EL BOTÓN "COMPRAR".
//Si hay productos en el carrito, comienza un contador en 0 al que se le suma el costo de cada producto, multiplicado por la cantidad de veces
//que dicho producto se haya agregado al carrito.
  function displayTotal(){
    if(cart.length>0){
      let count = 0;
      cart.map(function(obj){
        count = count + (obj.cost*obj.quantity);
  cartBtn.innerHTML = `<h2>Total = $${count}</h2>
  <button type="button" class="boton-productos" href="./productos"><a class="boton-productos" href="./">COMPRAR</a></button>`;
      })
    }
  }

//FUNCIÓN ACTIVADA AL CLICAR CASILLAS DE FILTRO. 
function filterCheckboxes(e){
  let activeFilterArray = filterArray(); // Primero, crea array con categorías de filtro activas. 
  console.log(activeFilterArray);
  atLeastOneFilterChecked(activeFilterArray, e); //Segundo, garantiza el correcto funcionamiento de los botones filtro.
  renderFilteredArray(activeFilterArray);  //Tercero, renderiza el array de productos filtrados.
}

//FUNCIÓN PARA RENDERIZAR PRODUCTOS. 
function renderFilteredArray(arr){  //Recibe array de categorías de filtro activa.
  let filteredProductsData = [];    //Crea nuevo array vacío. 
  arr.forEach(element => {          //Toma cada elemento del array de categorías de filtro activa y compara con el array de productos
   let matchingCases = productsData.filter(product => product.ageRange == element); //Crea un nuevo array con las coincidencias.
   filteredProductsData = filteredProductsData.concat(matchingCases);   //Actualiza el array creado anteriormente sumando, a sus antiguos elementos, las nuevas coincidencias.
  });
  renderProd(filteredProductsData);   //Envía array de productos filtrados para su renderización.
  console.log(filteredProductsData);
}


//FUNCIÓN QUE ESTABLECE FUNCIONAMIENTO DE BOTONES DE FILTRO. Se invoca al clicar en cualquiera de estos botones (checkboxes).
  //Primero, chequea que haya al menos un botón con estado "checked". Si todos están "unchecked", cambia el estado del botón "Todos" a "checked".
  //Luego, corrobora qué botón se clickea. Si el botón "Todos" cambia su estado a "checked", el resto de los botones lo hacen a "unchecked"
  //Si se clickea en cualquiera del resto de los botones, entonces "Todos" cambia su estado a "unchecked"
function atLeastOneFilterChecked(arr, e){
    if(prodContainer !== null){ 
        if(arr.length == 0){
          todos.checked = true;
        }else{
          if(e.target.classList.contains('btn-filtro')){  
            if(!(e.target.classList.contains("btn-f-no-todos"))){
               adultosMayores.checked = false;
               adultos.checked = false;
               adolescentes.checked = false;
               niños.checked = false;
           }else{
             todos.checked = false;
           }
       }
      }
}}



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
document.body.addEventListener( 'click', cartUnits);
document.body.addEventListener( 'click', filterCheckboxes);
displayTotal();
renderCart();
}


init();
