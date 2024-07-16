const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');

const path = require('path');

const helperImg = (filePath,fileName,size= 100) => {
    return sharp(filePath)
        .resize(size,size)
        .toFile(`./imagenesUsers/${fileName}`);

}

const storage = multer.diskStorage({
    destination:(req, file,cb) =>{
        cb(null,'./uploadsUsers' )
    },
    filename:(req,file,cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}.png`)
    }

});
const upload = multer({storage
});

router.post('/upload', upload.single('file'), (req, res) => {

    console.log(req.file);
    helperImg(req.file.path, `resize-${req.file.filename}`)
    const path = `resize-${req.file.filename}`;

// Utilizamos split para obtener el nombre sin extensión y la extensión
    const [nombreSinExtension, extension] = path.split('.');

// Construimos el nuevo nombre del archivo
    const pathFinal = `${nombreSinExtension}.png`;

    res.send({ path: pathFinal})
});

//POST /api/users/register
// router.post('/register' , async (req, res) => {

//     console.log(req.body);
//     try{
     
//         const userExists = await  User.findOne({username: req.body.username});
//         if (userExists){
//             return res.json("el nombre de uruario ya existe");
            
//         }
//         req.body.password = bcrypt.hashSync(req.body.password,12);
//         const user = await User.create(req.body);
//         console.log(user);
//         return res.json(user);
     
//     }    
//     catch(error){
//         res.json({error: error.message});
//     }
// });

router.post('/register', upload.single('file'), async (req, res) => {
    try {
        // Proceso de registro
        const userExists = await User.findOne({ username: req.body.username });
        if (userExists) {
            return res.json({data:"El nombre de usuario ya existe"});
        }

        req.body.password = bcrypt.hashSync(req.body.password, 12);
        
     
        // Proceso de carga de archivos
        if (req.file) {
            console.log(req.file);
            helperImg(req.file.path, `resize-${req.file.filename}`);
            const path = `resize-${req.file.filename}`;

            // Utilizamos split para obtener el nombre sin extensión y la extensión
            const [nombreSinExtension, extension] = path.split('.');

            // Construimos el nuevo nombre del archivo
            const pathFinal = `${nombreSinExtension}.png`;
            
            // Enviamos la respuesta
            const newUser = User({
                username: req.body.username,
                password: req.body.password,
                image: pathFinal
            });

            await newUser.save();
            console.log(newUser);
            return res.json({ data:"Usuario ingresado!"} );
            
        } else {
            // No se cargó ningún archivo
            return res.json( {data:"No se envio ningguna imagen"} );
        }
    } catch (error) {
        return res.json({ error: error.message });
    }
});

router.get('/get-image/:username', async (req, res) => {
    try {
        const username = req.params.username;

        // Buscar al usuario en la base de datos
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Obtener el nombre de la imagen del usuario
        const imageName = user.image;

        if (!imageName) {
            return res.status(404).json({ error: 'Imagen no encontrada para este usuario' });
        }

        // Construir la ruta completa al archivo de imagen
        const imagePath = path.join(__dirname, '../../' ,'imagenesUsers', imageName);
        console.log(imagePath);

        // Enviar la imagen como respuesta
        res.sendFile(imagePath, {}, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al enviar el archivo' });
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


router.get('/register' , async (req, res) => {   
    res.json("registro");
 
});



//POST /api/users/login
router.post('/login' , async (req, res) => {

    const user = await User.findOne({username: req.body.username});
    
    if(!user){
        return res.json({error:'Usuario ingresado es incorrecto'});
    }
    if(user.rol === 'baneado'){
        return res.json({error:'Usuario ingresado es incorrecto'});
    }
    const eq = bcrypt.compareSync(req.body.password, user.password);

    if (!eq){
        return res.json({error:'constraseña incorrecta'});
    }
    
    res.json({success:'Login correcto', 
            token: createToken(user)});
});

router.get('/login' , async (req, res) => {   
    return res.json("login");
 
});

function createToken(user){
    const payload={
        username: user.username,
        rol:user.rol,
    }
    return payload;
    // return jwt.sign(payload,'caballos en vivo') //esto es por si se quiere seguridad
}

router.get('/get-all-users', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password from the response
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
   
});


router.put('/edit-user/:username', async (req, res) => {
    try {
        const usernameParam = req.params.username;
        const updatedData = req.body; // Los datos que deseas actualizar

        // Verificar si la nueva contraseña se proporciona y encriptarla si es así
        if (updatedData.password) {
            updatedData.password = bcrypt.hashSync(updatedData.newPassword, 12);
        }

        // Actualiza el usuario en la base de datos
        const updatedUser = await User.findByIdAndUpdate(
            { _id: updatedData._id }, // Puedes cambiarlo según la estructura de tu modelo
            updatedData,
            { new: true } // Para devolver el usuario actualizado
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ success: 'Usuario actualizado', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/edit-user-with-image/:username', upload.single('file'), async (req, res) => {
    try {
        const usernameParam = req.params.username;
        console.log(`Username param: ${usernameParam}`);
        
        if (req.file) {
            console.log(`File received: ${req.file}`);
            helperImg(req.file.path, `resize-${req.file.filename}`);
            const path = `resize-${req.file.filename}`;

            // Utilizamos split para obtener el nombre sin extensión y la extensión
            const [nombreSinExtension, extension] = path.split('.');
            console.log(`File split into name and extension: ${nombreSinExtension}, ${extension}`);

            // Construimos el nuevo nombre del archivo
            const pathFinal = `${nombreSinExtension}.png`;
            console.log(`Final file path: ${pathFinal}`);
            
            // Verificar si la nueva contraseña se proporciona y encriptarla si es así
            let updatedData;
            if (req.body.newPassword) {
                console.log(`Password received: ${req.body.newPassword}`);
                const newPassword = bcrypt.hashSync(req.body.newPassword, 12);
                updatedData = { username: req.body.username, password: newPassword, image: pathFinal };
                console.log(`Updated data with password: ${JSON.stringify(updatedData)}`);
            } else {
                updatedData = { username: req.body.username, image: pathFinal };
                console.log(`Updated data without password: ${JSON.stringify(updatedData)}`);
            }

            // Actualiza el usuario en la base de datos
            const updatedUser = await User.findByIdAndUpdate(
                { _id: req.body._id }, // Puedes cambiarlo según la estructura de tu modelo
                updatedData,
                { new: true } // Para devolver el usuario actualizado
            );
            console.log(`Updated user: ${updatedUser}`);

            if (!updatedUser) {
                console.log(`User not found with id: ${req.body._id}`);
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json({ success: 'Usuario actualizado', user: updatedUser });
        } else {
            console.log('No file received');
            return res.status(400).json({ error: 'No file received' });
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// async function updateUsersRole() {
//     try {
//       const result = await User.updateMany({ rol: { $exists: false } }, { $set: { rol: 'usuario' } });
//       console.log(`Usuarios actualizados: ${result.nModified}`);
      
//     } catch (error) {
//       console.error('Error actualizando los usuarios:', error);
//     }
//   }

router.put('/ban-user/:username', async (req, res) => {
try {
    const usernameParam = req.params.username;
    console.log('baneando a ',usernameParam);
    // Encontrar y actualizar el rol del usuario
    const updatedUser = await User.findOneAndUpdate(
        { username: usernameParam },
        { $set: { rol: 'baneado' } },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: 'Usuario baneado', user: updatedUser });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

router.put('/desban-user/:username', async (req, res) => {
    try {
        const usernameParam = req.params.username;
    
        // Encontrar y actualizar el rol del usuario
        const updatedUser = await User.findOneAndUpdate(
            { username: usernameParam },
            { $set: { rol: 'usuario' } },
            { new: true }
        );
    
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    
        res.json({ success: 'Usuario baneado', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });

// GET /api/users/check-ban/:username
router.get('/check-ban/:username', async (req, res) => {
    try {
        const usernameParam = req.params.username;
        // Buscar al usuario en la base de datos
        const user = await User.findOne({ username: usernameParam });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si el usuario tiene el rol "baneado"
        if (user.rol == 'baneado') {
            return res.json({ isBanned: true });
        } else {
            return res.json({ isBanned: false });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;