const {enviar, prueba} = require('./mailer');
const http = require('http');
const url = require('url');
const fs = require('fs');
const {v4:uuidv4} = require('uuid');
port = 3000;
let indicadores = "";
let id_u = uuidv4().slice(0,6)

prueba().then((results)=>{
    indicadores =`
    El valor del dolar el dia de hoy es: ${results.dolar}\n
    El valor del euro el dia de hoy es: ${results.euro}\n
    El valor del uf el dia de hoy es: ${results.uf}\n
    El valor del utm el dia de hoy es: ${results.utm}\n
    `
})

http.createServer((req, res)=>{
    let {correos, asunto, contenido} = url.parse(req.url, true).query;
    
    if(req.url === '/'){
        res.setHeader('Content-Type', 'text/html')
        fs.readFile('index.html', 'utf8', (err, data) => {
            res.end(data)
            })
    }

    if(req.url.startsWith('/mailing')){
        res.setHeader('Content-Type', 'text/html')
        correosTotal = correos.split(',')
        enviar(correosTotal, asunto, contenido)
        .then((response)=>{
            console.log('Correo enviado con exito')
            let alert = `<div class="container w-25 m-auto text-center">
            <div class="alert alert-success" role="alert">
                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                Correo enviado Con exito
            </div>
            </div>`
            fs.readFile('index.html', 'utf8', (err, html)=>{
                html += alert;
                res.end(html);
            })
            fs.writeFile(`./correos/${id_u}.txt`, `${correosTotal}\n${asunto}\n${contenido.substring(3, contenido.length-4)}\n${indicadores}`, 'utf8', (err) => {
                err? res.end('Correo no enviado'): res.write('Correo enviado con exito')
                console.log('Se ha creado con exito el archivo')
            });
        }).catch((err) =>{
            console.log('Correo no enviado')
            let alert = `<div class="container w-25 m-auto text-center">
            <div class="alert alert-danger" role="alert">
                Correo no enviado :(
            </div>
            </div>`
            fs.readFile('index.html', 'utf8', (err, html)=>{
                html += alert;
                res.end(html);
            })
        })
    }
}).listen(port,() => console.log('escuchando puerto 3000'))