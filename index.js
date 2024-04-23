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
          
        }if(promotion_rules[i].rule=="AyA" ){
            var cantidad_AyA= promotion_rules[i].n;
            var porcentaje_AyA= promotion_rules[i].discount_percentage;
         
        }
        else{
            continue
        }
    }
function promotionNx$(amount, unit_base_price){
    let total_final=0;
    total_final=cantidad_NProducts*Math.trunc(amount/cantidad_NProducts)*unit_base_price*(1-(porcentaje_N/100)) + (amount%cantidad_NProducts)*unit_base_price;
    return total_final;
    }
function promotionAyA(amount, unit_base_price){
    let total_final=0;
    total_final=cantidad_AyA*Math.trunc(amount/cantidad_AyA)*unit_base_price*(1-(porcentaje_AyA/100)) + (amount%cantidad_AyA)*unit_base_price;
    return total_final;
    }
   
    // format data cart_id e items
    // item_id, promotion, amount, unit_base_price
    app.post('/api/get-promotions', (req, res) => {
    const final =[]
    const items=[]
  

    const newData = req.body;
        
    for (let i=0; i< newData.items.length; i++){
        if (newData.items[i].promotion==undefined || newData.items[i].amount==undefined || newData.items[i].unit_base_price==undefined){
    
                let respuestax=[{
                    "status": "NOK",
                    "error_message": "INTERNAL SERVER ERROR"
                    }]
                
                res.send(respuestax)
                break
            
            
        }else{    
            if (newData.items[i].promotion=='Nx$' || newData.items[i].promotion=='AyA' ||newData.items[i].promotion==''){
                if (newData.items[i].amount <= 0 || newData.items[i].unit_base_price <=0){
                    let respuesta2=[{
                        "status": "NOK",
                        "error_message": "AMOUNT OR PRICE SHOULD BE GREATER THAN ZERO"
                        }]
                    res.send(respuesta2) 
                } 
                else{    
                    if (newData.items[i].promotion=='Nx$'){
                        let total_price = promotionNx$(newData.items[i].amount, newData.items[i].unit_base_price)
                        items.push({
                            "item_id": newData.items[i].item_id,
                            "amount": newData.items[i].amount,                         
                            "total_price": total_price,
                            "promotion_applied": Math.trunc(newData.items[i].amount/cantidad_NProducts)>=1? true:false
                        })
                    }
                    else if (newData.items[i].promotion=='AyA'){
                        let total_price = promotionAyA(newData.items[i].amount, newData.items[i].unit_base_price)
                        items.push({
                            "item_id": newData.items[i].item_id,
                            "amount": newData.items[i].amount,                         
                            "total_price": total_price,
                            "promotion_applied": Math.trunc(newData.items[i].amount/cantidad_AyA)>=1? true:false
                        })
                    }
                    else{
                        let total_price = newData.items[i].amount * newData.items[i].unit_base_price
                        items.push({
                            "item_id": newData.items[i].item_id,
                            "amount": newData.items[i].amount,                         
                            "total_price": total_price,
                            "promotion_applied": false
                        })
            }}
    
                }   
            else{
                let respuesta=[{
                    "status": "NOK",
                    "error_message": "RULE DOES NOT EXIST"
                    }]
                res.send(respuesta)
            }
        }
            
            
    }
    
                let precio_total_t=0;
                for (let i=0; i<items.length; i++){
                    precio_total_t += items[i].total_price;
                }
                   final.push([{"status":"OK",
                   "cart_id": newData.cart_id,
                   "total_cart_amount": precio_total_t,
                   "details":[{
                        items
                    }]
                    }])
    res.send(final)
                
        
       
    });
   
app.listen(port, ()=>{
    console.log(`Server running in port: ${port}`)
})