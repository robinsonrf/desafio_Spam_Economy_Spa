// 1. Usar el paquete nodemailer para el envío de correos electrónicos.

const nodemailer = require('nodemailer');
const axios = require('axios');
let template = "";

const prueba = async ()=>{
    const {data} = await axios.get('https://mindicador.cl/api');
    //console.log(data.data);
    let dolar = data.dolar.valor;
    let euro = data.euro.valor;
    let uf = data.uf.valor;
    let utm = data.utm.valor;
     
    return {dolar, euro, uf, utm};
}
prueba()
 .then((results)=>{
    template= `
    <p>El valor del dolar el dia de hoy es: ${results.dolar}</p>
    <p>El valor del euro el dia de hoy es: ${results.euro}</p>
    <p>El valor del uf el dia de hoy es: ${results.uf}</p>
    <p>El valor del utm el dia de hoy es: ${results.utm}</p>
    `
 })


const enviar = (to, subject, text)=>{
    return new Promise ((resolve, reject)=>{
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: 'rabyrez3@gmail.com',
                pass: 'raby1949',
            },
        });
    
        let mailOptions = {
            from: 'rabyrez3@gmail.com',
            to: to,
            subject: subject,
            html:`${text}\n${template}`,
             
        }
    
         transporter.sendMail(mailOptions, (err, data)=>{
            if(err){
                reject(err);
            } 

            if(data) {
                resolve(data);
            }
            
        });
    })
    
}

module.exports = {enviar, prueba}
