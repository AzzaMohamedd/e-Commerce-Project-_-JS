////////// scrolling //////////
let bottom = window.innerHeight //end of the window
window.addEventListener('scroll', function () {
    if(window.scrollY>=bottom){   //window.scrollY->top of the window
        document.getElementById("upicon").style.display="flex"
    }
    else{
        document.getElementById("upicon").style.display="none"
    }
});
document.getElementById("upicon").addEventListener('click',function(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
})


//////////// search input /////////////
function searchOptions(inputvalue){
    fetch('https://productsapi-sigma.vercel.app/products')
            .then(res=>res.json())
            .then(json=>{
                let arr =json.filter(function(element) {
                    return element.name.toLowerCase().startsWith(inputvalue.toLowerCase());
                });

                let tag;
                let div;
                let parentelement = document.getElementById("searchresults")
                parentelement.textContent="";
                arr.forEach(function(element){
                    div = document.createElement('div')
                    let d = '<div class"row '+element.id+'" onclick="search('+element.id+')" data-bs-toggle="modal" data-bs-target="#searchPopup">'+element.name+'</div>'
                    div.innerHTML=d;
                    parentelement.append(div)
                });
            });
}

document.getElementById("inputsearch").addEventListener("input",function(){
    let val =document.getElementById("inputsearch").value;

    if(val==""){
        document.getElementById("searchresults").style.display="none";
    }
    else{
        document.getElementById("searchresults").style.display="block";
        searchOptions(val)
    }
})

document.getElementsByClassName("searchbtn")[0].addEventListener("click",function(e){
    e.preventDefault();
})

function search(element_id){
    var container = document.getElementsByClassName("fromSearch")[0]
    if(element_id != undefined){
        //come here when clicked on one of the search options
        //open product details
        if($(".collapse").css('display')=='block'){
            document.getElementsByClassName("navbar-toggler")[0].click();
        }
        productDetails(element_id);
    }
    else{
        //come here when clicked on the Search button
        let searchval = document.getElementById("inputsearch").value;
        
        //open all products with this name -> (from displayProducts function in home.js)
        window.location.href = "../html/search.html?searchval="+searchval;
    }
    
}
let searchInput=document.getElementById("inputsearch")
searchInput.addEventListener('blur', function() {
    document.addEventListener('click', function(event) {
        if(event.target != document.getElementById("searchresults")){
            document.getElementById("searchresults").style.display="none";
        }
    })
});



//product details popup
function productDetails(element_id){
    var container = document.getElementsByClassName("fromSearch")[0]
    document.getElementById("searchLabel").textContent = "Product Details"
    fetch('https://productsapi-sigma.vercel.app/products/'+element_id)
            .then(res=>res.json())
            .then(row=>{
                container.textContent="";
                let div = document.createElement('div')
                div.classList="col-6 col-sm-4 col-md-3 col-lg-2"
                div.style.width="100%"
                div.style.textAlign="center"
                div.innerHTML='<div class="card" style="border:none;"><img src="'+row.image+'" class="card-img-top" style="width: 150px;display: flex;margin: auto;"><div class="card-body" style="width: 100%;"><h5 class="card-title">'+row.name+'</h5><p>'+row.description+'</p><div id="price_with_cart"><h5 class="card-price">'+row.price+'$</h5><button class="nav-link" style="cursor:pointer" onclick="addToCart('+row.id+')" title="Cart"><i class="fa-regular fa-cart-shopping">&#xf07a;</i></button></div></div></div>';
                container.append(div)
            });
}

let catsLinks = document.getElementsByClassName("categoriesLink");
for (var linktag of catsLinks) {
    linktag.addEventListener("mousedown", function(e){
        if($(".collapse").css('display')=='block'){
            document.getElementsByClassName("navbar-toggler")[0].click();
        }
        setTimeout(function(){
            window.location.href=`/html/home.html#${e.target.textContent}`
        },500)
        if(linktag.textContent != "All"){
            document.getElementById(e.target.textContent).click();
        }
        
    });
}


///////////// cart //////////////
//start of cart popup

function openCart(refresh){
    if(refresh!="refresh" && $(".collapse").css('display')=='block'){
        document.getElementsByClassName("navbar-toggler")[0].click();
    }
    let chooseditems = JSON.parse(localStorage.getItem("cartitems") || "[]");
    let choosedIds=[];
    chooseditems.forEach(obj=>{
        choosedIds.push(obj.productId);
    })
    document.getElementsByClassName("cart_body")[0].textContent=""

    if(chooseditems.length==0){
        //cart is empty 
        document.getElementById("nodata").style.display="block";
        document.getElementById("cartdata").style.display="none";
    }
    else{
        document.getElementById("cartdata").style.display="block";
        document.getElementById("nodata").style.display="none";
        let parentelement =document.getElementsByClassName("cart_body")[0]
        fetch('https://productsapi-sigma.vercel.app/products')
                .then(res=>res.json())
                .then(json=>{
                    let element;
                    let sum=0;
                    json.forEach(value => {
                        if(choosedIds.includes(value.id)){
                            chooseditems.forEach(obj=>{
                                if(obj.productId==value.id){
                                    let p = document.createElement('div')
                                    p.classList="row cartproduct"
                                    element ='<div style="text-align:left" class="card container"><div class="row"><div class="col-4 imgcart"><img src="'+value.image+'" class="card-img-top"></div><button class="nav-link btnremove" style="cursor:pointer;display:none;" onclick="removeFromCart('+value.id+')" title="Remove From Cart"><i class="fa-light fa-trash-can"></i></button><div class="col-8"><div class="card-body"><h5 class="card-title">'+value.name+'</h5><p class="card-text" >'+value.description+'</p><div class="pricewithicons"><div><h5 class="card-price">'+value.price+'$</h5></div><div><button class="nav-link" style="cursor:pointer" onclick="decreaseAmount('+value.id +','+ value.price+')" title="Decrease"><i class="fa-solid fa-minus"></i></button><span class="amount'+value.id+'">'+obj.amount+'</span><button class="nav-link" style="cursor:pointer" onclick="addToCart('+value.id+','+value.price+')" title="Increase"><i class="fa-regular fa-plus"></i></button></div></div></div></div></div></div>'
                                    p.innerHTML=element;
                                    parentelement.append(p)
                                    sum += value.price * obj.amount;
                                }
                            })
                            
                        }
                    });
                    document.getElementById("sum_price").textContent=sum.toFixed(2);
                }).then(x=>{
                    //when hover on item, the remove icon appear 
                    let products = document.querySelectorAll('.cartproduct');
                    
                    products.forEach(product => {
                        let icon = product.querySelector('.btnremove');
                        product.addEventListener('mouseenter', () => {
                            icon.style.display="block"
                        });
                        product.addEventListener('mouseleave', () => {
                            icon.style.display="none"
                        });
                    });
                })
    }
}


document.getElementById("checkout").addEventListener("click",function(){
    swal({
        icon: "success", 
        text:"Done.. Your Order Will be Shipped Soon",
        button: {
          text: "OK",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        className: null,
        closeOnClickOutside: true,
        closeOnEsc: true,
  })
  .then((value) => {
    document.getElementById("lblCartCount").textContent=getItem("cart");
    document.getElementsByClassName("close_home")[0].click();
  })   
  setItem("counter",0);
  removeItem("cartitems");
})



function removeFromCart(element_id){
    let arritems = JSON.parse(localStorage.getItem("cartitems") || "[]");
    let itemsAfterDelete=[];
    arritems.forEach(obj=>{
        if(obj.productId != element_id){
            itemsAfterDelete.push(obj);
        }
    })
    setItem("cartitems",itemsAfterDelete);
    setItem("counter",Number(getItem("counter"))-1);
    openCart("refresh")
    toastr.success('This product is removed from the Cart Successfully.', "Remove")
    document.getElementById("lblCartCount").textContent=getItem("counter");
}


function decreaseAmount(product_id , price){
    let items = JSON.parse(localStorage.getItem("cartitems") || "[]");
    let newitems=[];
    items.forEach(obj=>{
        if(obj.productId == product_id){
            if(obj.amount > 1){
                obj.amount--;
                document.getElementsByClassName("amount"+product_id)[0].textContent=obj.amount;
                document.getElementById("sum_price").textContent = (Number(document.getElementById("sum_price").textContent) - price).toFixed(2);
            }
            else{
                toastr.error("can't decrease, if you don't need this item please delete it.", "decrease");
            }  
        }
        newitems.push(obj);
    }) 
    setItem("cartitems",newitems);
}
//end of cart popup


//start of cart icon
document.getElementById("lblCartCount").textContent=localStorage.getItem("counter")
//end of cart icon


//start of add to cart icon
function addToCart(element_id,price){
    let arritems = JSON.parse(localStorage.getItem("cartitems") || "[]");
    let counter=0;
    if(arritems.length==0){
        //there is no cart
        setItem("cartitems",[{productId:element_id,amount:1}]);
        toastr.success('This product is added to the Cart.', "To Cart");
        setItem("counter",1);        
        document.getElementById("lblCartCount").textContent=getItem("counter");
    }
    else{
        //cart has data -> so check if this product already exists (to increase) or doesn't exist (to add)
        arritems.forEach(obj=>{
            if(obj.productId != element_id){
                counter++;
            }
        })
        if(counter==arritems.length){
            // add for the first time (product doesn't exist)
            let newarritems =[...arritems,{"productId":element_id,"amount":1}]
            setItem("cartitems",newarritems);
            setItem("counter",Number(getItem("counter"))+1);
            document.getElementById("lblCartCount").textContent=getItem("counter");
            toastr.success('This product is added to the Cart.', "To Cart")
        }
        else{
            //product exists so increase amount
            let newitems=[];
            arritems.forEach(obj=>{
                if(obj.productId == element_id){
                    obj.amount++;
                    if(document.getElementById("cartPopup").classList.contains("show")){
                        document.getElementsByClassName("amount"+element_id)[0].textContent=obj.amount;
                        document.getElementById("sum_price").textContent = (Number(document.getElementById("sum_price").textContent) + price).toFixed(2); 
                    }
                }
                newitems.push(obj);
            })
            setItem("cartitems",newitems);
            if(! document.getElementById("cartPopup").classList.contains("show")){
                toastr.warning('This product is already exist and increased by one.', "To Cart")
            }
        }
    }
    
}

//end of add to cart icon












////////// signin / register popup ///////////
function displayNoneAll(){
    console.log("here");
    //signin spans
    document.getElementById("spansigninEmail").style.display="none";
    document.getElementById("spanValidsigninEmail").style.display="none";
    document.getElementById("spansigninexistEmail").style.display="none";
    document.getElementById("spansigninPass").style.display="none";
    document.getElementById("spansigninwrongPass").style.display="none";
    //register spans
    document.getElementById("spanregistername").style.display="none";
    document.getElementById("spanregisteremail").style.display="none";
    document.getElementById("spanValidregisterEmail").style.display="none";
    document.getElementById("spanregisterexistEmail").style.display="none";
    document.getElementById("spanregisterreqPass").style.display="none";
    document.getElementById("spanShortregisterPass").style.display="none";
    document.getElementById("spanregisterconfPass").style.display="none";
    document.getElementById("spanregistermatchPass").style.display="none";
}

function clearInputs(){
    displayNoneAll()
    // if($(".collapse").css('display')=='block'){
    //     document.getElementsByClassName("navbar-toggler")[0].click();
    // }
}



//start of signin popup
let correct_email = getItem("email")
let correct_pass = getItem("password")
document.getElementById("btnSignin").addEventListener("click",function(e){
    e.preventDefault(); //to prevent refreshing the page after click submit input
    displayNoneAll();
    let inputemail = document.getElementById("Inputsigninemail")
    let inputpass = document.getElementById("Inputsigninpassword")
    let regex=/^[a-zA-Z]*@[a-zA-Z]*.com*$/;
 
    if(inputemail.value=="" || (! inputemail.value.match(regex)) || '"'+inputemail.value+'"'  != correct_email || '"'+inputpass.value+'"'  != correct_pass || inputpass.value==""){
        if(inputemail.value==""){
            //email is required
            document.getElementById("spansigninEmail").style.display="block";
        }
        else if(! inputemail.value.match(regex)){ 
            //email isn't valid
            document.getElementById("spanValidsigninEmail").style.display="block";
        }
        else if('"'+inputemail.value+'"' != correct_email){
            //email isn't exist
            document.getElementById("spansigninexistEmail").style.display="block";
        }
        if(inputpass.value==""){
            //pass is required
            document.getElementById("spansigninPass").style.display="block";
        }
        else if('"'+inputpass.value+'"' != correct_pass){
            //wrong Password
            document.getElementById("spansigninwrongPass").style.display="block";
        }
    }
    else{
        console.log("hi");
        document.getElementById("blackscreensignin").style.display="flex"
        setTimeout(function(){
            document.getElementById("blackscreensignin").style.display="none"
            window.location.href = "../html/home.html";  // location.reload()
        },1500)
    }
})

//end of signin popup

//start of register popup
document.getElementById("btnRegister").addEventListener("click",function(e){
    e.preventDefault(); //to prevent refreshing the page after click submit input
    displayNoneAll();
    let inputname = document.getElementById("InputregisterFullName")
    let inputemail = document.getElementById("InputregisterEmail")
    let inputpass = document.getElementById("InputregisterPassword")
    let inputconfirmpass = document.getElementById("InputConfirmPassword")
    let regex=/^[a-zA-Z]*@[a-zA-Z]*.com*$/;
 
    if(inputname.value=="" || inputemail.value=="" || (! inputemail.value.match(regex)) || inputemail.value == correct_email || inputpass.value=="" || inputpass.value.length < 8 || inputconfirmpass.value=="" || inputconfirmpass.value != inputpass.value){
        if(inputname.value==""){
            //fullname is required
            document.getElementById("spanregistername").style.display="block";
        }
        if(inputemail.value==""){
            //email is required
            document.getElementById("spanregisteremail").style.display="block";
        }
        else if(! inputemail.value.match(regex)){ 
            //email isn't valid
            document.getElementById("spanValidregisterEmail").style.display="block";
        }
        else if(inputemail.value == correct_email){
            //email is already exist
            document.getElementById("spanregisterexistEmail").style.display="block";
        }
        if(inputpass.value==""){
            //pass is required
            document.getElementById("spanregisterreqPass").style.display="block";
        }
        else if(inputpass.value.length < 8){ 
            //pass must be more than 8
            document.getElementById("spanShortregisterPass").style.display="block";
        }
        if(inputconfirmpass.value==""){
            //confirm pass is required
            document.getElementById("spanregisterconfPass").style.display="block";        
        }
        else if(inputconfirmpass.value != inputpass.value){ 
            //confirm pass doesn't match
            document.getElementById("spanregistermatchPass").style.display="block";
        }
    }
    else{
        setItem("email",inputemail.value);
        setItem("password",inputpass.value);
        document.getElementById("blackscreenregister").style.display="flex"
        setTimeout(function(){
            document.getElementById("blackscreenregister").style.display="none"
            window.location.href = "../html/home.html";
        },1500)
    }

    
})
//end of register popup




//start of functions local storage
function getItem(key){
    return localStorage.getItem(key);
}
function setItem(key,value_obj){
    localStorage.setItem(key,JSON.stringify(value_obj));
}
function removeItem(key){
    localStorage.removeItem(key);
}
function clearStorage(){
    localStorage.clear();
}

//end of functions local storage







