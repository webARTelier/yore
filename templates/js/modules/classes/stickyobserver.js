


export class StickyObserver {

  static init = (params) => {
    const selSticky = `${params.selSticky}:not(.is-initialized)`;
    const allStickies = document.querySelectorAll(selSticky);

    allStickies.forEach(sticky => new StickyObserver(sticky));
  }


  
  constructor(sticky) {
    this.sticky = sticky;
    this.scrollWatcher = null;
    
    this.markInitialized();
    this.createScrollWatcher();
    this.observeStickyPosition();
  }



  markInitialized = () => {
    this.sticky.classList.add('is-initialized');
  }



  createScrollWatcher = () => {
    this.scrollWatcher = document.createElement('div');
    this.scrollWatcher.setAttribute('data-scrollwatcher', '');
    this.sticky.before(this.scrollWatcher);
  }



  observeStickyPosition = () => {
    const observer = new IntersectionObserver((entries) => {
      this.sticky.classList.toggle('is-stuck', !entries[0].isIntersecting);
    });
    observer.observe(this.scrollWatcher);
  }
}