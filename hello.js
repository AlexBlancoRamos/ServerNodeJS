const cors = require('cors');
const express = require('express');
const app= express()

app.use(express.json());

const admin = require("firebase-admin");

const serviceAccount = require("./projecte-botiga-firebase-adminsdk-uc4li-f20664a256.json");
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



const axios = require('axios');

async function sendEmail(name, email, subject, message, pass) {



    const data = JSON.stringify({
        "Messages": [{
            "From": {"Email": "alex.blanco@institutvidreres.cat", "Name": "ComponentsElectronics"},
            "To": [{"Email": email, "Name": name}],
            "Subject": 'Nova contrasenya',
            "TextPart": 'L a tev a nova contrasenya es :  ' + pass
        }]
    });

    const config = {
        method: 'post',
        url: 'https://api.mailjet.com/v3.1/send',
        data: data,
        headers: {'Content-Type': 'application/json'},
        auth: {username: '01b2f2add2c78afa65cd50a3581fb87f', password: 'b96bd36ed3448ff10ea9b89bb9a96965'},
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });


    return pass;
}
//Guardar info a la bdD:


// define your own email api which points to your server.
app.post('/api/sendemail/', async function (req, res) {
    console.log("funcio feta")



    const generarString = (longitud) => {
        let result = "";
        const abc = "a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 * - . ".split(" "); // Espacios para convertir cara letra a un elemento de un array
        for (i = 0; i <= longitud; i++) {
            const random = Math.floor(Math.random() * abc.length);
            result += abc[random]
        }
        return result
    };

    const pass = generarString(8);
    console.log(pass)





    const {name, email, subject, message  } = req.body;
    await sendEmail(name, email, subject, message , pass  );

    //Logica contra:

    const cityRef = db.collection('ProjecteTenda').doc(req.body.email);
    const doc = await cityRef.get();
    console.log('Funciona1')
    if (doc.exists){
        await db.collection('ProjecteTenda').doc(req.body.email).set({contra: pass}, {merge: true});
        console.log('Funciona2')}
    else console.log('no existeix')
});


