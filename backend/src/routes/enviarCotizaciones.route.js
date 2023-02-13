const { Router } = require('express');
const generador = require('../services/GenerarCotizacionPDF');
const sendMail = require('../services/sendMail');
const Cotizacion = require('../models/cotizaciones.model');
const Cliente = require('../models/clientes.model');
const fs = require('fs');

const router = Router();

const enviar = async(req, res)=>{

    var exito = true;

    const id = req.params.id;
    const cotizacion = await Cotizacion.findById(id);
    const cliente = await Cliente.findById(cotizacion.id_cliente);


    await generador.cotizacion1(id, async()=>{
        await sendMail(cliente.correo, 'Cotizacion '+id, '<h1>Hola mundo</h1>', id+'.pdf', ()=>{
            try {
                fs.unlinkSync('src/pdf/'+id+'.pdf');
                res.json({exito: exito});
            } catch(err) {
                console.error('Something wrong happened removing the file', err);
                res.json({exito: false})
            }
        }).catch(err => console.log(err))
    })
    .catch(err => res.json({
        exito: false,
        error: err
    }));
    
}

router.route('/:id')
    .post(enviar)




module.exports = router;