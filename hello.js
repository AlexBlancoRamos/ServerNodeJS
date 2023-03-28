const cors = require('cors');
const express = require('express');
const app= express()
const fs1 = require('node:fs'); 

app.use(express.json());

let connexio;

fs1.readFile("base_de_dades", "utf-8", function (error,data) {
    if (error){
        console.log(error)
    } else {
        connexio = data;
        console.log(connexio)
    }
})

const admin = require("firebase-admin");
const {getFirestore} = require("firebase-admin/firestore");


//setTimeout(function (){connexio_bd()},5000);

function connexio_bd(){
    console.log(connexio)
    const serviceAccount = require(connexio);
    console.log("funciona")

    if(admin.apps.length === 0) {
        console.log("funciona2")
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
}



app.use(cors());

port = 3080;

app.listen(port,() => {
    console.log('Server listening on the port ::'+ port);
});

//app.put('/registrea', async (req, res) => {
//    console.log(req.body);
//});

app.post('/registre', cors(), async (req, res) => {
    connexio_bd();
    const db = getFirestore();
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
    connexio_bd();
    const db = getFirestore();
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
    connexio_bd();
    const db = getFirestore();
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
    connexio_bd();
    const db = getFirestore();
    const cityRef = db.collection('ProjecteTenda').doc(req.body.email);
    const doc = await cityRef.get();
    console.log('Funciona1')
    if (doc.exists){
        await db.collection('ProjecteTenda').doc(req.body.email).set({contra: pass}, {merge: true});
        console.log('Funciona2')}
    else console.log('no existeix')
});

app.post('/contacte', (req, res)=>{
    let data = new Date();
    let dia = data.getDate();
    let mes = data.getMonth() + 1;
    let any = data.getFullYear();
    let hora = data.getHours();
    let minuts = data.getMinutes();
    let segons = data.getSeconds();
    let data_completa = `${dia}${"-"}${mes}${"-"}${any}${"-"}${hora}${"-"}${minuts}${"-"}${segons}`;
    let fitxerContacte = fs1.createWriteStream(`contacte/${data_completa}${req.body.nom}.txt`);
    fitxerContacte.write(req.body.nom+"\n");
    fitxerContacte.end(req.body.recomanacio+"\n");
    console.log("Funciona")
})

app.post('/registres', (req, res)=>{
    let data = new Date();
    let dia = data.getDate();
    let mes = data.getMonth() + 1;
    let any = data.getFullYear();
    let hora = data.getHours();
    let minuts = data.getMinutes();
    let segons = data.getSeconds();
    let data_completa = `${dia}${"/"}${mes}${"/"}${any}${"|"}${hora}${"-"}${minuts}${"-"}${segons}`;
    fs1.writeFileSync("log/log.txt",`${data_completa} ${req.body.text}\n`, {flag:'a+'})
    console.log("FuncionaRegistre")
})

app.post('/login', (req, res)=>{
    let data = new Date();
    let dia = data.getDate();
    let mes = data.getMonth() + 1;
    let any = data.getFullYear();
    let hora = data.getHours();
    let minuts = data.getMinutes();
    let segons = data.getSeconds();
    let data_completa = `${dia}${"/"}${mes}${"/"}${any}${"|"}${hora}${"-"}${minuts}${"-"}${segons}`;
    fs1.writeFileSync("log/log.txt",`${data_completa} ${req.body.texto}\n`, {flag:'a+'})
    console.log("FuncionaLogin")
})

app.post('/cesta', (req, res)=>{
    let data = new Date();
    let dia = data.getDate();
    let mes = data.getMonth() + 1;
    let any = data.getFullYear();
    let hora = data.getHours();
    let minuts = data.getMinutes();
    let segons = data.getSeconds();
    let data_completa = `${dia}${"/"}${mes}${"/"}${any}${"|"}${hora}${"-"}${minuts}${"-"}${segons}`;
    fs1.writeFileSync("log/log.txt",`${data_completa} ${req.body.text}\n`, {flag:'a+'})
    console.log("FuncionaCesta")
})


app.post('/logout', (req, res)=>{
    let data = new Date();
    let dia = data.getDate();
    let mes = data.getMonth() + 1;
    let any = data.getFullYear();
    let hora = data.getHours();
    let minuts = data.getMinutes();
    let segons = data.getSeconds();
    let data_completa = `${dia}${"/"}${mes}${"/"}${any}${"|"}${hora}${"-"}${minuts}${"-"}${segons}`;
    fs1.writeFileSync("log/log.txt",`${data_completa} ${req.body.text}\n`, {flag:'a+'})
    console.log("FuncionaLogout")
})

app.post('/comprar', (req, res)=>{
    let data = new Date();
    let dia = data.getDate();
    let mes = data.getMonth() + 1;
    let any = data.getFullYear();
    let hora = data.getHours();
    let minuts = data.getMinutes();
    let segons = data.getSeconds();
    let data_completa = `${dia}${"/"}${mes}${"/"}${any}${"|"}${hora}${"-"}${minuts}${"-"}${segons}`;
    fs1.writeFileSync("log/log.txt",`${data_completa} ${req.body.texto}\n`, {flag:'a+'})
    console.log("FuncionaComprar")
})

//imatges
app.get('/fotos/cascos1',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\cascos.png")
})

app.get('/fotos/ComponentsElectrics',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\ComponentsElectrics.png")
})

app.get('/fotos/periferic1',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\periferic1.png")
})

app.get('/fotos/periferic2',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\periferic2.png")
})

app.get('/fotos/periferic3',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\periferic3.png")
})

app.get('/fotos/periferic4',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\periferic4.png")
})

app.get('/fotos/periferic5',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\periferic5.png")
})

app.get('/fotos/placa',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\placabase1.png")
})

app.get('/fotos/ram1',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\ram1.png")
})

app.get('/fotos/ratoli1',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\ratoli1.png")
})

app.get('/fotos/teclat1',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\teclat1.png")
})

app.get('/fotos/torre1',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\torre1.png")
})

app.get('/fotos/torre2',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\torre2.png")
})

app.get('/fotos/torre3',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\torre3.png")
})

app.get('/fotos/torre4',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\torre4.png")
})

app.get('/fotos/torre5',async (req, res)=>{
    res.sendFile(__dirname + "\\fotos\\torre5.png")
})
