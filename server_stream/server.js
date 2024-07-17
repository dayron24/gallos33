const NodeMediaServer = require('node-media-server');
//const axios = require('axios'); // Asegúrate de tener instalada la librería axios
require('dotenv').config();
//require('dotenv').config();

//const PORT = process.env.PORT || 3000;
const rtmpPort = 1936;
const serverPort = 8001;

const thisffmpeg = require('@ffmpeg-installer/ffmpeg/');

const config = {
    rtmp: {
        port: rtmpPort,
        chunk_size: 60000,
        gop_cache: true,
        ping: 20,
        ping_timeout:60
    },
    http: {
        port: serverPort,
        mediaroot: './media',
        allow_origin: '*'
    },
    https: {
        port: 442,
        key: process.env.KEY,
        cert: process.env.CERT,
    },
    trans: {
        ffmpeg: require('ffmpeg-static'),
        tasks: [
            {
                app: 'live',
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                dash: true,
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]',

       	 }
	]
}
    
};

const nms = new NodeMediaServer(config);

// nms.on('prePublish', (id, args) => {
//     // Verifica que args.streamPath tenga un valor antes de intentar dividirlo


//     const partes = args.split('/');
//     const nombreDelStream = partes[partes.length - 1];
//     console.log("STREAAAAAAAAAAAAAM:::::",nombreDelStream);
//     // Envía la clave del stream a otro servidor usando axios o cualquier otra librería

//     const url = `http://localhost:3000/setClave/${nombreDelStream}`;
//    console.log(url);

//     // Realiza una solicitud HTTP POST al otro servidor
//         axios.post(url)
//         .then(response => {
//             // Imprime la respuesta una vez que esté disponible
//             console.log('Respuesta del servidor:', response.data);
//         })
//         .catch(error => {
//             // Maneja cualquier error que ocurra durante la solicitud
//             console.error('Error al realizar la solicitud:', error);
//         });


// });

nms.run();

