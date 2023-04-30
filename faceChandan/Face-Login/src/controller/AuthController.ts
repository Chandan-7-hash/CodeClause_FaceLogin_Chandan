import { Request, Response } from 'express'
import FaceRecognition from '../services/FaceRecognition'
import { nanoid } from 'nanoid'
import fs from 'fs'
// import db from '../common/db_connection'

class AuthController {
  static async register(req: Request, res: Response) {
    // const idcamera = req.body.idcamera
    const name = req.body.name
    console.log(name)
    // const email = req.body.email
    // const password = req.body.password
    const image = req.body.photos

    const data = image.replace(/^data:image\/\w+;base64,/, "")
    const buf = Buffer.from(data, 'base64')
    const fileName = name

    fs.writeFile(`./images/${fileName}.jpg`, buf, async function (err : any) {
        if (err) return res.status(401).send('error')
        return res.status(200).send('ok')
          
        // const imageInput = `./uploads/${fileName}.jpg`
        // const recognize = new FaceRecognition(imageInput, user)

        // const resultRecognize = await recognize.recognize()
        
        // res.sendStatus(200)
    // return res.send(req.file)
      })
    // }

    // let dbfullname = req.body.fullname;
    // let dbemail = req.body.email;
    // let dbpassword = req.body.password;
    // let sql = `insert into user (full_name, email, password, status_approval, status) values ( '${dbfullname}', '${dbemail}', '${dbpassword}', 0, 1 )`

    // db.query(sql,(err, result) => {
    //       if (err) throw err;
        
    //     if(result.affectedRows == 1){
    //       res.end(JSON.stringify({message: 'success'}));  
    //     }else{
    //     res.end(JSON.stringify({message: 'gagal'}));  
    //     }
        
    //   });     
    // return res.status(200).send('ok')

  }

  static async login(req: Request, res: Response) {
    try {
      console.log('run')
      const user = req.body.user
      const image = req.body.photos
  
      const data = image.replace(/^data:image\/\w+;base64,/, "")
      const buf = Buffer.from(data, 'base64')
      const fileName = user + '-' + nanoid()
  
      fs.writeFile(`./uploads/${fileName}.jpg`, buf, async function (err : any) {
        if (err) console.log(err)
        const imageInput = `./uploads/${fileName}.jpg`
        const recognize = new FaceRecognition(imageInput, user)
  
        const resultRecognize = await recognize.recognize().catch(e=> res.status(401).send(e.message))
        
        return res.send(resultRecognize)
      })
    } catch (error: any) {
      return res.status(401).send(error.message)
    }
  }
}

export default AuthController