const router = require('express').Router();
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const Stream = require('./../../models/stream.model');

const helperImg = (filePath,fileName,x=1280,y=720) => {
    return sharp(filePath)
        .resize(x,y)
        .toFile(`./imagenesStreams/${fileName}`);

}

const storage = multer.diskStorage({
    destination:(req, file,cb) =>{
        cb(null,'./uploadsStreams' )
    },
    filename:(req,file,cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}.png`)
    }

});
const upload = multer({storage// Aumenta el tamaño máximo de archivo a 50MB
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

router.post('/setClave/:id', upload.single('file'), async (req, res) => {
    try {
        if (req.file) {
            console.log(req.file);
            helperImg(req.file.path, `resize-${req.file.filename}`);
            const path = `resize-${req.file.filename}`;

            // Utilizamos split para obtener el nombre sin extensión y la extensión
            const [nombreSinExtension, extension] = path.split('.');

            // Construimos el nuevo nombre del archivo
            const pathFinal = `${nombreSinExtension}.png`;
            
            const id = req.params.id;
            const titulo = req.body.tituloStream;
            const clave = req.body.clave;
            const image = pathFinal;

            // Usamos findOneAndUpdate con upsert: true para crear un nuevo documento si no existe
            const registroActualizado = await Stream.findOneAndUpdate(
                { id },
                { titulo, clave, image },
                { new: true, upsert: true }
            );

            return res.json({ data: "Stream Configurado!" });
        } else {
            // No se cargó ningún archivo
            return res.json({ data: "No se envio ningguna imagen" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/getClave/:id', async (req, res) => {
    try {
        // Busca el stream con el ID igual a 1
        const idBuscado = req.params.id;
        const stream = await Stream.findOne({ id: idBuscado });

        // Si no se encuentra ningún stream con el ID igual a 1, devuelve un mensaje de error
        if (!stream) {
            return res.status(404).json({ error: 'Stream no encontrado' });
        }

        // Envía los datos del stream como respuesta
        res.send({
            stream: stream

        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.get('/getImagen/:id', async (req, res) => {
    try {
        // Busca el stream con el ID igual a 1
        const idBuscado = req.params.id;
        const stream = await Stream.findOne({ id: idBuscado });

        // Si no se encuentra ningún stream con el ID igual a 1, devuelve un mensaje de error
        if (!stream) {
            return res.status(404).json({ error: 'Stream no encontrado' });
        }

        // Construye la ruta del archivo de imagen
        const imagePath = path.join(__dirname, '../../imagenesStreams', stream.image);

        // Envía los datos del stream como respuesta
        res.sendFile(imagePath, {}, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al enviar el archivo' });
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router;
