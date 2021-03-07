export class MediaCompletionContext {
  isGemImageComplete: boolean
  isTemplateImageComplete: boolean
  isSignatureImageComplete: boolean
  isQRImageComplete: boolean

  constructor() {
    this.isGemImageComplete = false
    this.isTemplateImageComplete = false
    this.isSignatureImageComplete = false
    this.isQRImageComplete = false
  }

  isAllCompleted() {
    return this.isTemplateImageComplete && this.isGemImageComplete
      && this.isQRImageComplete && this.isSignatureImageComplete
  }

  isAllCompletedExecptQR() {
    return this.isTemplateImageComplete && this.isGemImageComplete && this.isSignatureImageComplete
  }
}