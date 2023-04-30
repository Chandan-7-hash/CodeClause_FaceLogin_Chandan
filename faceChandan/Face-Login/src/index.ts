import express from 'express'
import * as faceapi from 'face-api.js'
import AuthController from './controller/AuthController'
import bodyParser from 'body-parser'
import { upload } from './common/multer'
import cors from 'cors'

const app = express()
const port = 8081

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true, limit:'10mb' }))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/signup', function(req, res){
  res.sendFile(__dirname + '/signup.html');
});

app.get('/home', function(req, res){
  res.sendFile(__dirname + '/home.html');
});

app.listen(port, async () => {
  console.log(`Your application is running on port ${port}.`)
  const MODEL_URL = './models'

  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL)
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL)
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL)

  } catch (e) {
    console.log(e)
  }
});

app.post('/login', AuthController.login)
app.post('/register', upload.single('photos') ,AuthController.register)

