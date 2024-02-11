
/////////// slider /////////////
//start of slider
// var imagslide = document.getElementsByClassName("imgSlider")[0];

// function prevImg(){
//     imagslide.style.display="none";
//     if(imagslide == document.getElementById('imgs').firstElementChild){
//         imagslide = document.getElementById('imgs').lastElementChild;
//     }
//     else{
//         imagslide = imagslide.previousElementSibling;
//     }
//     imagslide.style.display="block"
// }
// function nextImg(){
//     imagslide.style.display="none";
//     if(imagslide == document.getElementById('imgs').lastElementChild){
//         imagslide = document.getElementById('imgs').firstElementChild;
//     }
//     else{
//         imagslide = imagslide.nextElementSibling;
//     }
//     imagslide.style.display="block"
// }


                
let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    if (index < 0) {
    //يعني انا كنت واقفه على الاولى و عاوزه ارجع ويوديني على التالته
        currentIndex = totalSlides - 1; //لاني بدأت من الصفر و بالتالي التالت هيكون الاندكس بتاعه 2
    } else if (index >= totalSlides) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }

    const transformValue = -currentIndex * 100 + '%';
    document.querySelector('.slider').style.transform ="translateX("+transformValue+")"; //`translateX(${transformValue})`;
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

//end of slider




///////// categories /////////
//start of categories sections
//1.categories bar
var catsOptions = document.getElementsByClassName("aCats");

for (var linktag of catsOptions) {
    linktag.addEventListener("click", function(e){
        document.getElementsByClassName("aCats active")[0].classList.remove("active");
        let parentelement =document.getElementsByClassName("allproducts")[0]
        parentelement.textContent="";
        e.target.classList.add("active");
        if(e.target.textContent=="All"){
            displayProducts();
        }
        else{
            fetch('https://productsapi-sigma.vercel.app/products?category='+e.target.text)
                .then(res=>res.json())
                .then(json=>{
                    let element;
                    json.forEach(value => {
                        let p = document.createElement('div')
                        p.classList="col-6 col-sm-4 col-md-3 col-lg-2 productCard"
                        element ='<div class="card"><img src="'+value.image+'" class="card-img-top" style="height: 150px;"><div class="card-body"><h5 class="card-title">'+value.name+'</h5><p class="card-text" >'+value.description+'</p><div id="price_with_cart"><h5 class="card-price">'+value.price+'$</h5><button class="nav-link" style="cursor:pointer" onclick="addToCart('+value.id+')" title="Cart"><i class="fa-regular fa-cart-shopping">&#xf07a;</i></button></div><button onclick="productDetails('+value.id+')" class="btn btn-outline-dark" type="submit" data-bs-toggle="modal" data-bs-target="#searchPopup">More Details</button></div></div>'
                        p.innerHTML=element;
                        parentelement.append(p)
                    });
                })
                .catch(function(){
                    document.getElementById("wrongGetDataAPI").style.display="block"
                });
        }
    });
}

//2.categories cards
function displayProducts(){
    if(window.location.hash=="#Electronics" || window.location.hash=="#Wearables" || window.location.hash=="#Gaming" || window.location.hash=="#Appliances" || window.location.hash=="#Audio" || window.location.hash=="#Security" || window.location.hash=="#Computers")
    {
        fetch('https://productsapi-sigma.vercel.app/products?category='+window.location.hash)
            .then(res=>res.json())
            .then(json=>{
                let parentelement =document.getElementsByClassName("allproducts")[0]
                let element;
                parentelement=""
                json.forEach(value => {
                    let p = document.createElement('div')
                    p.classList="col-6 col-sm-4 col-md-3 col-lg-2 productCard"
                    element ='<div class="card"><img src="'+value.image+'" class="card-img-top" style="height: 150px;"><div class="card-body"><h5 class="card-title">'+value.name+'</h5><p class="card-text" >'+value.description+'</p><div id="price_with_cart"><h5 class="card-price">'+value.price+'$</h5><button class="nav-link" style="cursor:pointer" onclick="addToCart('+value.id+')" title="Cart"><i class="fa-regular fa-cart-shopping">&#xf07a;</i></button></div><button onclick="productDetails('+value.id+')" class="btn btn-outline-dark" type="submit" data-bs-toggle="modal" data-bs-target="#searchPopup">More Details</button></div></div>'
                    p.innerHTML=element;
                    parentelement.append(p)
                });
            })
            .then(x=>{
                setTimeout(function(){
                    if(window.location.hash=="#Electronics"){
                        document.getElementById('Electronics').click();

                    }
                    if(window.location.hash=="#Wearables"){
                        document.getElementById('Wearables').click();
                    }
                    if(window.location.hash=="#Gaming"){
                        document.getElementById('Gaming').click();
                    }
                    if(window.location.hash=="#Appliances"){
                        document.getElementById('Appliances').click();
                    }
                    if(window.location.hash=="#Audio"){
                        document.getElementById('Audio').click();
                    }
                    if(window.location.hash=="#Security"){
                        document.getElementById('Security').click();
                    }
                    if(window.location.hash=="#Computers"){
                        document.getElementById('Computers').click();
                    }
                },1000)
            })
            .catch(function(){
                document.getElementById("wrongGetDataAPI").style.display="block"
            });
    }
    else{
        fetch('https://productsapi-sigma.vercel.app/products')
            .then(res=>res.json())
            .then(json=>{
                let parentelement =document.getElementsByClassName("allproducts")[0];
                parentelement.textContent=""
                let element;
                json.forEach(value => {
                    let p = document.createElement('div')
                    p.classList="col-6 col-sm-4 col-md-3 col-lg-2 productCard"
                    element ='<div class="card"><img src="'+value.image+'" class="card-img-top" style="height: 150px;"><div class="card-body"><h5 class="card-title">'+value.name+'</h5><p class="card-text" >'+value.description+'</p><div id="price_with_cart"><h5 class="card-price">'+value.price+'$</h5><button class="nav-link" style="cursor:pointer" onclick="addToCart('+value.id+')" title="Cart"><i class="fa-regular fa-cart-shopping">&#xf07a;</i></button></div><button onclick="productDetails('+value.id+')" class="btn btn-outline-dark" type="submit" data-bs-toggle="modal" data-bs-target="#searchPopup">More Details</button></div></div>'
                    p.innerHTML=element;
                    parentelement.append(p)
                });
            })
            .catch(function(){
                document.getElementsByClassName("wrongGetDataAPI")[0].style.display="block"
            });
    }
    
}

displayProducts()

setInterval(function(){  //to auto slide
                    nextSlide()
                },2500)

                
//end of categories section
