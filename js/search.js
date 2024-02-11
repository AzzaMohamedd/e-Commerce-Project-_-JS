let search_values = window.location.search;
const urlParams = new URLSearchParams(search_values);
const search_val = urlParams.get('searchval')

fetch('https://productsapi-sigma.vercel.app/products')
        .then(res=>res.json())
        .then(json=>{
            let parentelement =document.getElementsByClassName("searchResult")[0]
            let element;
            let counter=0;
            if(search_val !=""){
                json.forEach(value => {
                    if(value.name.toLowerCase().startsWith(search_val)){
                        let p = document.createElement('div')
                        p.classList="col-6 col-sm-4 col-md-3 col-lg-2 productCard"
                        element ='<div class="card"><img src="'+value.image+'" class="card-img-top" style="height: 150px;"><div class="card-body"><h5 class="card-title">'+value.name+'</h5><p class="card-text" >'+value.description+'</p><div id="price_with_cart"><h5 class="card-price">'+value.price+'$</h5><button class="nav-link" style="cursor:pointer" onclick="addToCart('+value.id+')" title="Cart"><i class="fa-regular fa-cart-shopping">&#xf07a;</i></button></div><button onclick="productDetails('+value.id+')" class="btn btn-outline-dark" type="submit" data-bs-toggle="modal" data-bs-target="#searchPopup">More Details</button></div></div>'
                        p.innerHTML=element;
                        parentelement.append(p)
                        counter++;
                    }
                });
            }
            
            if(counter==0){
                document.getElementsByClassName("nodata_search")[0].style.display="block"
                document.getElementById("search_word").textContent=search_val;
                // document.getElementById("searchResult").style.display="none"
            }
            document.getElementById("search_num").textContent=counter
        }).catch(function(){
            document.getElementById("wrongWithConAPI").style.display="block"
        });