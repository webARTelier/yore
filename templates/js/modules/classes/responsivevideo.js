


export class ResponsiveVideo {

  static init = (params) => {
    const selVideo = `${params.selVideo}:not(.is-initialized)`;
    const allVideos = document.querySelectorAll(selVideo);

    allVideos.forEach(video => new ResponsiveVideo(video, params));
  }



  constructor(video, params) {
    this.video = video;
    this.viewportMap = params.viewportMap;
    this.getCssCustomProperty = params.getCssCustomProperty;
    this.debounceThenExecute = params.debounceThenExecute;
    this.srcAttribute = this.video.querySelector('source');

    this.srcs = {};
    this.versions = [];
    this.missingVersions = [];
    this.bestGivenSource = '';

    this.lastUsedFile = '';

    this.markInitialized();

    if (!this.getSrcs()) return;

    this.qualityOrder = Object.keys(this.srcs);
    this.createVersionArray();

    if (this.versions.length === 0) {
      this.handleMissingVersions();
      return;
    }

    this.setBestGivenSource();
    this.findMissingVersions();
    this.prepareVideo();
    this.watchResize();
  }



  markInitialized = () => {
    this.video.classList.add('is-initialized');
  }



  getSrcs = () => {
    if (!this.video.dataset.srcs) {
      this.handleMissingSources();
      return false;
    }

    try {
      this.srcs = JSON.parse(this.video.dataset.srcs);
      return true;
    } catch {
      this.handleInvalidJSON();
      return false;
    }
  }



  createVersionArray = () => {
    Object.values(this.viewportMap).forEach(value => {
      this.versions.push(value, `${value}Retina`);
    })

    this.versions = [...new Set(this.versions)];
  }



  setBestGivenSource = () => {
    this.versions.forEach(version => {
      if (this.srcs[version]) this.bestGivenSource = this.srcs[version];
    })
  }



  findMissingVersions = () => {
    this.versions.forEach(version => {
      if (!this.srcs[version]) this.missingVersions.push(version);
    })

    if (this.missingVersions.length > 0) this.createFallback();
  }



  createFallback = () => {
    this.missingVersions.forEach(version => {
      this.srcs[version] = this.getNextHigherVersion(version);
    })
  }



  getNextHigherVersion = (version) => {
    const versionIndex = this.versions.indexOf(version);

    for (let i = versionIndex + 1; i < this.versions.length; i++) {
      if (this.srcs[this.versions[i]]) return this.srcs[this.versions[i]];
    }

    return this.bestGivenSource;
  }



  prepareVideo = () => {
    const { viewport, density } = this.getDeviceData();
    const densitySuffix = density === 'normal' ? '' : this.capitalizeFirstLetter(density);
    const srcKey = this.viewportMap[viewport] + densitySuffix;
    const file = this.srcs[srcKey];
    
    if (!this.needsUpgrade(file, this.lastUsedFile)) return;
    
    const type = file.split('.').pop();
    this.srcAttribute.src = file;
    this.srcAttribute.type = `video/${type}`;

    this.video.load();

    if (this.video.autoplay) {
      try {
        this.video.play();
      } catch {
        this.handleFailedPlay();
      }
    }

    this.lastUsedFile = file;
  }



  getDeviceData = () => {
    const scope = document.body;
    return {
      density: this.getCssCustomProperty(scope, '--density'),
      viewport: this.getCssCustomProperty(scope, '--viewportName')
    }
  }



  needsUpgrade = (file, lastUsedFile) => {
    if (file === lastUsedFile) return false;

    const fileIndex =
      this.qualityOrder.findIndex(key => this.srcs[key] === file);
    const lastUsedFileIndex =
      this.qualityOrder.findIndex(key => this.srcs[key] === lastUsedFile);

    return fileIndex >= lastUsedFileIndex;
  }



  watchResize = () => {
    const resizeDebounced = this.debounceThenExecute(this.prepareVideo, 300);
    window.addEventListener('resize', resizeDebounced);
  }



  handleMissingSources = () => {
    console.warn('Video data missing! (path/types/files required)');
    console.warn('Video initializing was stopped!');
  }



  handleInvalidJSON = () => {
    console.warn('Invalid JSON in data-srcs!');
    console.warn('Video initializing was stopped!');
  }



  handleMissingVersions = () => {
    console.warn('No valid video sources found!');
    console.warn('Video initializing was stopped!');
  }



  handleFailedPlay = () => {
    console.warn('Failed auto-play. Video not muted …?');
  }



  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}