import SignaturePad from 'signature_pad'

export interface SigPadTypes extends SignaturePad {
  getCanvas: () => HTMLCanvasElement | null
  getTrimmedCanvas: () => HTMLCanvasElement
  getDataUrl: () => string | undefined
  getTrimmedDataUrl: () => Promise<string>
  rotateBase64Img: (src: string, edg: number) => Promise<string>
}
