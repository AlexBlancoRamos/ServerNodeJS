const cors = require('cors');
const express = require('express');
const app= express()

app.use(express.json());

const admin = require("firebase-admin");

const serviceAccount = require("./projecte-botiga-firebase-adminsdk-uc4li-08e0f8bc9f.json");
const {getFirestore} = require("firebase-admin/firestore");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();




app.use(cors());

port = 3080;

app.listen(port,() => {
    console.log('Server listening on the port ::'+ port);
});

//app.put('/registrea', async (req, res) => {
//    console.log(req.body);
//});

app.post('/registre', cors(), async (req, res) => {
    const user = {
        'nom': req.body.nom,
        'email': req.body.email,
        'contra': req.body.contra
    };
    const cityRef = db.collection('ProjecteTenda').doc(req.body.email);
    const doc = await cityRef.get();

    if (doc.exists) {
        console.log('Usuario ya en la base de datos!');
    } else {
        await db.collection('ProjecteTenda').doc(req.body.email).set(user);
        console.log(user);
    }
});

app.get('/inicisessio', async (req,res)=>{
    let correu = {email: req.query.email}
    let resultat = false;
    const docs = db.collection('ProjecteTenda')
    const snapshot = await docs.where('email', '==', correu.email).get()
    snapshot.forEach(doc =>{
        resultat = true
    })
    res.json(resultat)
});

app.get('/contrasenya', async (req,res)=>{
    let correu = {contra_login: req.query.contra}
    let resultat = false;
    const docs = db.collection('ProjecteTenda')
    const snapshot = await docs.where('contra', '==', correu.contra_login).get()
    snapshot.forEach(doc =>{
        resultat = true
    })
    res.json(resultat)
});




// app.post('/login', cors(), async (req, res) => {
//     const user = {
//         'email_login': req.body.email_login,
//         'contra_login': req.body.contra_login
//     };
//     const cityRef = db.collection('ProjecteTenda').doc(req.body.email);
//     const doc = await cityRef.get();
//
//     if (doc.exists) {
//         console.log('Inicio de sesion es correcto! ');
//     } else {
//         console.log('Inicio de sesion es incorrecto! ');
//     }

//});