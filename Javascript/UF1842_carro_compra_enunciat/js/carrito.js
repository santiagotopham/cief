/*
Hay que programar un carrito de compra de fruta.

El cliente eligirá que fruta quiere haciendo click sobre la imagen.
Un mensaje emergente le preguntará qué cantidad quiere.

Esta información se mostrará a la derecha, bajo "Total carrito", 
en <p id="carrito"></p>, de esta forma:
 Kiwi 2 kg x 4,20€/kg = 8,40 €

El total se actualizará con cada compra
 Total Compra: 8,40€
 
Se dará la opción de añadir o no más productos que se mostrarán
a continuación de los anteriores, y se sumará todo en el total. 
Por ejemplo:  
 Kiwi 2 kg x 4, 20€/kg = 8, 40€
 Pomelo 1 kg x 2,50€/kg = 2,50€
 Total Compra: 10,90€

Puedes modificar el código facilitado si ello te ayuda con el ejercicio,
pero deberás justificarlo.

Recuerda la importancia comentar con detalle el código.

 Lo importante es el cálculo, no los estilos css
 */

//Se adapta el codigo para utilizar la lista de productos de forma dinamica y como objetos, permitiendo asi un manejo mas comodo y expandible que trabajar sobre html estatico - S.Topham

const fruitsList = [
	{ Id: 1, DisplayName: "Pomelo", Price: 2.5, ImageName: "aranja.png" },
	{ Id: 2, DisplayName: "Kiwi", Price: 4.2, ImageName: "kiwi.png" },
	{ Id: 3, DisplayName: "Limón", Price: 1.2, ImageName: "llimones.png" },
	{ Id: 4, DisplayName: "Piña", Price: 2.8, ImageName: "pinya.png" },
	{ Id: 5, DisplayName: "Sandía", Price: 1.2, ImageName: "sindria.png" },
	{ Id: 6, DisplayName: "Aguacate", Price: 2.5, ImageName: "aguacates.jpg" },
	{ Id: 7, DisplayName: "Fresón", Price: 6.2, ImageName: "freson.jpg" },
	{ Id: 8, DisplayName: "Mandarina", Price: 1.9, ImageName: "mandarina.jpg" },
	{
		Id: 9,
		DisplayName: "Manzana Fuji",
		Price: 4.2,
		ImageName: "manzana_fuji.jpg",
	},
	{ Id: 10, DisplayName: "Plátanos", Price: 3.2, ImageName: "platans.png" },
	{ Id: 11, DisplayName: "Pera", Price: 1.8, ImageName: "pera.jpg" },
	{
		Id: 12,
		DisplayName: "Manzana Golden",
		Price: 3.5,
		ImageName: "manzana_golden.jpg",
	},
];

const cartList = [];

displayProducts(fruitsList);
calculateCartTotal();

function displayProducts(productList) {
	let productsHtmlArray = productList.map(buildProductDisplayItem);
	let htmlToRender = "";

	productsHtmlArray.forEach((currentProduct) => {
		htmlToRender += currentProduct;
	});

	renderHtml("productList", htmlToRender);
}

function buildProductDisplayItem(product) {
	let result = `<div id="${product.Id}" onclick="addProduct(${product.Id})">
    <img
        loading="lazy"
        class="imatges"
        src="img/${product.ImageName}"
        alt="${product.DisplayName}"
    />
    <p>${product.DisplayName} : ${product.Price}€/kg</p>`;

	result += "</div>";
	return result;
}

function renderHtml(htmlId, htmlToRender, shouldOverride) {
	let divElement = document.getElementById(htmlId);

	if (shouldOverride) {
		divElement.innerHTML = htmlToRender;
	} else {
		divElement.innerHTML += htmlToRender;
	}
}

function addProduct(id) {
	let quantityString = prompt("Que cantidad desea? en Kg");

	if (isNaN(quantityString)) {
		alert(
			"Hubo un error, pruebe intercambiar comas por puntos o viceversa"
		);
		return;
	}

	let quantity = parseInt(quantityString);

	let product = fruitsList.find((x) => x.Id == id);
	let alreadyInCart = cartList.find((x) => x.Id == id);

	if (alreadyInCart != null) {
		deleteCartItem(product.Id);
		buildCartItem(product, quantity + alreadyInCart.Quantity);
	} else {
		buildCartItem(product, quantity);
	}

	refreshCartHtml();
}

function refreshCartHtml() {
	let cartHtml = buildCartHtml();
	renderHtml("carrito", cartHtml, true);
	calculateCartTotal();
}

function buildCartItem(product, quantity) {
	const carItem = {
		Id: product.Id,
		DisplayName: product.DisplayName,
		Price: product.Price,
		Quantity: quantity,
		Total: +(quantity * product.Price).toFixed(2),
	};
	cartList.push(carItem);
}

function buildCartHtml() {
	let result = "";

	cartList.forEach((currentCartItem) => {
		result += `<li>
			<span>
				<img class="deleteIcon" src="../img/trash_can_red.png"
				onClick="deleteCartItem(${currentCartItem.Id})" />
				${currentCartItem.DisplayName} ${currentCartItem.Quantity} x ${currentCartItem.Price}/Kg = ${currentCartItem.Total}€
			</span>
		</li>`;
	});

	return result;
}

function calculateCartTotal() {
	let total = 0;

	cartList.forEach((currentProdut) => {
		total += currentProdut.Total;
	});

	total = +total.toFixed(2);

	renderHtml("preuFinal", `${total}€`, true);
}

function deleteCartItem(id) {
	let cartItemIndex = cartList.findIndex((x) => x.Id == id);

	cartList.splice(cartItemIndex, 1);

	refreshCartHtml();
}
