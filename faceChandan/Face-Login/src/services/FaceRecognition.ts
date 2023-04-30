import { canvas } from '../common/env'
import * as faceapi from 'face-api.js'

class FaceRecognition {
  constructor(public imageInput: any | string, public label: string) { }

  /**
   * recognize
   */
  public async recognize() {
    try {
      const imgInput = await canvas.loadImage(this.imageInput)
      const faceInput = await faceapi.detectAllFaces(imgInput).withFaceLandmarks().withFaceDescriptors()

      if (!faceInput) {
        throw (`no faces detected for ${this.label}`)
      }

      const imageReference = `./images/${this.label}.jpg`
      const imgReference = await canvas.loadImage(imageReference)
      const faceReference = await faceapi.detectAllFaces(imgReference).withFaceLandmarks().withFaceDescriptors()

      const faceDescriptors = faceReference.map(x => x.descriptor)

      const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(this.label, faceDescriptors)

      const threshold = 0.6
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold)

      const results = faceInput.map(fd => faceMatcher.findBestMatch(fd.descriptor))

      return results
    } catch (error) {
      throw (`Error while detecting ${this.label}, ${error}`)
    }

  }
}

export default FaceRecognition
