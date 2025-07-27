


export class PreviewImg {

  static requiredParams = [
    'selRoot',
    'selBox',
    'selImage'
  ]



  static init = (params) => {
    const selRoot = `${params.selRoot}:not(.has-previewImg)`;
    const allRoots = document.querySelectorAll(selRoot);

    allRoots.forEach(root => new PreviewImg(root, params));
  }



  constructor(root, params) {
    this.root = root;
    this.selBox = params.selBox;
    this.selImage = params.selImage;

    this.markInitialized();
    this.findAlreadyLoadedImages();
    this.startListening();
  }



  markInitialized = () => {
    this.root.classList.add('has-previewImg');
  }



  findAlreadyLoadedImages = () => {
    const allBoxes = this.root.querySelectorAll(this.selBox);

    allBoxes.forEach(box => {
      const image = box.querySelector(this.selImage);
      if (!image) this.handleMissingImage(box);
      if (image && image.complete) this.markLoaded(image);
    })
  }



  startListening = () => {
    this.root.addEventListener('load', (e) => {
      if (e.target.matches(this.selImage)) this.markLoaded(e.target);
    }, true);
  }



  markLoaded = (image) => {
    image.classList.add('is-loaded');
  }



  handleMissingImage = (box) => {
    console.warn(`Missing image inside previewImg box ${box}`);
  }
}