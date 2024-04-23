const express = require('express');
const bodyParser = require('body-parser');
const app = express()

const port=3000

app.get('/',(req,res)=>{
    res.send("Service Operate")
})



app.use(bodyParser.json()); 


const promotion_rules = [
    {
    rule : "Nx$",
    discount_percentage : 20,
    n : 4
    },
    {
    rule : "AyA",
    discount_percentage : 15,
    n : 1
    }
    ]

    for (let i=0; i< promotion_rules.length; i++){
        if (promotion_rules[i].rule=="Nx$"){
            var cantidad_NProducts = promotion_rules[i].n;
            var porcentaje_N = promotion_rules[i].discount_percentage;
          
        }else{
            var cantidad_AyA= promotion_rules[i].n;
            var porcentaje_AyA= promotion_rules[i].discount_percentage;
         
        }
    }
    
  function promotionNx$(amount, unit_base_price){
    var total_final=0;
    var total = amount*unit_base_price;
    var descuento = total*porcentaje_N/100;
    total_final = total - descuento;
    return total_final;
    }
    function promotionAyA(amount, unit_base_price){
    var total_final=0;
    var total = amount*unit_base_price;
    var descuento = total*porcentaje_AyA/100;
    total_final = total - descuento;
    return total_final;
    }

   
    // format data cart_id e items
    // item_id, promotion, amount, unit_base_price
var final =[]
var items=[]
    app.post('/api/get-promotions', (req, res) => {
  

        const newData = req.body;
        
        for (let i=0; i< newData.items.length; i++){
            
            if (newData.items[i].promotion=='Nx$' || newData.items[i].promotion=='AyA'){
                if (newData.items[i].amount <= 0 || newData.items[i].unit_base_price <=0){
                    var respuesta2=[{
                        "status": "NOK",
                        "error_message": "AMOUNT OR PRICE SHOULD BE GREATER THAN ZERO"
                        }]
                    res.send(respuesta2) 
                } 
                else{
                    
                    if (newData.items[i].promotion=='Nx$'){
                        if (newData.items[i].amount%cantidad_NProducts==0){
                            var total_final = promotionNx$(newData.items[i].amount, newData.items[i].unit_base_price);
                            items.push({
                                "item_id": newData.items[i].item_id,
                                "amount": newData.items[i].amount,
                                "total_price": total_final,
                                "promotion_applied": true
                            })
                        }
                        else{
                            var total_final = newData.items[i].amount*newData.items[i].unit_base_price;
                            items.push({
                                "item_id": newData.items[i].item_id,
                                "amount": newData.items[i].amount,
                                "total_price": total_final,
                                "promotion_applied": false
                            })

                        }if (newData.items[i].promotion=='AyA'){
                            if (newData.items[i].amount==cantidad_AyA){
                                var total_final = promotionAyA(newData.items[i].amount, newData.items[i].unit_base_price);
                                items.push({
                                    "item_id": newData.items[i].item_id,
                                    "amount": newData.items[i].amount,
                                    "total_price": total_final,
                                    "promotion_applied": true
                                })
                            }
                            else{
                                var total_final = newData.items[i].amount*newData.items[i].unit_base_price;
                                items.push({
                                    "item_id": newData.items[i].item_id,
                                    "amount": newData.items[i].amount,
                                    "total_price": total_final,
                                    "promotion_applied": false
                                })
    
                            }
                        }
                                               
                        
                    }
                var precio_total=0;
                for (let i=0; i<items.length; i++){
                    precio_total += items[i].total_price;
                }
                   final =[{"status":"OK",
                   "cart_id": newData.cart_id,
                   "total_cart_amount": precio_total,
                   "details":[{
                        items
                    }]
                    }]
                    
                }
                res.send(final)
                
    
                }   
            else{
                var respuesta=[{
                    "status": "NOK",
                    "error_message": "RULE DOES NOT EXIST"
                    }]
                res.send(respuesta)
            }
            
        }
        
       
    });
   
app.listen(port, ()=>{
    console.log(`Server running in port: ${port}`)
})