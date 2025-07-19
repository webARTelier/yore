


export class Lightbox {

  static init = (params) => {
    const selGalleryParent = `${params.selGalleryParent}:not(.is-initialized)`;
    const allGalleries = document.querySelectorAll(selGalleryParent);

    allGalleries.forEach(gallery => new Lightbox(gallery, params));
  }



  constructor(gallery, params) {
    this.lightbox = document.querySelector(params.selBox);

    if (!this.lightbox) {
      this.handleMissingElement('lightbox');
      return;
    }

    this.gallery = gallery;
    this.selGalleryImage = params.selGalleryImage;
    this.requiredElementKeys = params.requiredElements;
    this.requiredElements = {};

    this.imageMap = [];
    this.currentMapIndex = 0;
    this.lastFocusedElement = null;

    this.markInitialized();
    this.setRequiredElements(params);

    if (!this.hasRequiredElements()) return;
    if (!this.isDialog(this.lightbox)) return;

    this.createImagesMap();
    this.preload();
    this.checkNavigationAvailable();
    this.startListening();
  }



  markInitialized = () => {
    this.gallery.classList.add('is-initialized');
  }



  setRequiredElements = (params) => {
    this.requiredElementKeys.forEach(el => {
      const selector = params[`sel${el.charAt(0).toUpperCase() + el.slice(1)}`];
      this.requiredElements[el] = this.lightbox.querySelector(selector);
    })
  }



  hasRequiredElements = () => {
    let isComplete = true;

    this.requiredElementKeys.forEach(el => {
      if (!this.requiredElements[el]) {
        this.handleMissingElement(el);
        isComplete = false;
      }
    })

    return isComplete;
  }



  isDialog = () => {
    const isDialog = this.lightbox.nodeName === 'DIALOG';
    if (!isDialog) this.handleMissingDialogElement();

    return !!isDialog;
  }



  createImagesMap = () => {
    const allImages = this.gallery.querySelectorAll(this.selGalleryImage);
    if (allImages.length === 0) this.handleMissingGalleryImages();

    allImages.forEach(image => {
      const imageData = {
        'image': image,
        'largeImage': image.dataset.largeimage,
        'title': image.dataset.title,
        'description': image.dataset.description
      }

      this.imageMap.push(imageData);
    })
  }



  preload = () => {
    this.imageMap.forEach(image => {
      const img = new Image();
      img.src = image['largeImage'];
    })
  }



  checkNavigationAvailable = () => {
    if (this.imageMap.length === 1) {
      this.requiredElements['prevButton'].style.display = 'none';
      this.requiredElements['nextButton'].style.display = 'none';
    }
  }



  startListening = () => {
    if (this.imageMap.length === 0) return;

    this.gallery.addEventListener('click', (e) => {
      const clickedIndex = this.imageMap.findIndex(x => x.image === e.target);

      if (clickedIndex != -1) {
        this.currentMapIndex = clickedIndex;
        this.setLightboxData(this.imageMap[clickedIndex]);
        this.openLightbox();
      }
    })

    this.requiredElements['close'].addEventListener('click', () => {
      this.closeLightbox();
    })

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.closeLightbox();
    })

    this.requiredElements['prevButton'].
      addEventListener('click', () => this.changeImage(-1));

    this.requiredElements['nextButton'].
      addEventListener('click', () => this.changeImage(1));

    document.addEventListener('keydown', this.checkKey);
  }



  setLightboxData = (imageData) => {
    this.requiredElements['image'].src = imageData.largeImage;
    this.requiredElements['title'].innerHTML = imageData.title;
    this.requiredElements['description'].innerHTML = imageData.description;
  }



  openLightbox = () => {
    this.lastFocusedElement = document.activeElement;
    this.lightbox.showModal();
  }



  openLightboxOnEnter = () => {
    const img = document.activeElement;
    const index = this.imageMap.findIndex(x => x.image === img);
    this.currentMapIndex = index;

    this.setLightboxData(this.imageMap[index]);
    this.openLightbox();
  }



  closeLightbox = () => {
    this.lastFocusedElement.focus();
    this.lightbox.close();
  }



  checkKey = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        this.changeImage(-1)
        break

      case 'ArrowRight':
        this.changeImage(1)
        break

      case 'Escape':
        this.closeLightbox()
        break

      case 'Enter':
        if (this.lightbox.contains(e.target)) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        this.openLightboxOnEnter()
        break

      default:
        return
    }
  }



  changeImage(step) {
    this.currentMapIndex = (this.currentMapIndex + step + this.imageMap.length) % this.imageMap.length;
    this.setLightboxData(this.imageMap[this.currentMapIndex]);
  }



  handleMissingElement = (element) => {
    console.warn(`Lightbox element '${element}' is missing!`);
    console.warn('Initialising lightbox was stopped!');
  }



  handleMissingDialogElement = () => {
    this.lightbox.style.display = 'none';
    console.warn('Lightbox element is not a <dialog>!');
    console.warn('Initialising lightbox was stopped!');
  }



  handleMissingGalleryImages = () => {
    console.warn('No gallery images found!');
  }
}