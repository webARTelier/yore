


// classes
import { Accordion } from '../modules/classes/accordion.js';
import { ColorThemeSwitch } from '../modules/classes/colorthemeswitch.js';
import { Dialogs } from '../modules/classes/dialogs.js';
import { FilledInputs } from '../modules/classes/filledinputs.js';
import { FormProgress } from '../modules/classes/formprogress.js';
import { FormValidation } from '../modules/classes/formvalidation.js';
import { Lightbox } from '../modules/classes/lightbox.js';
import { MoreLess } from '../modules/classes/moreless.js';
import { PreviewImg } from '../modules/classes/previewimg.js';
import { ResponsiveVideo } from '../modules/classes/responsivevideo.js';
import { ScrollbarObserver } from '../modules/classes/scrollbarobserver.js';
import { Scrollspy } from '../modules/classes/scrollspy.js';
import { SelectfieldColor } from '../modules/classes/selectfieldcolor.js';
import { Slider } from '../modules/classes/slider.js';
import { StickyObserver } from '../modules/classes/stickyobserver.js';
import { SwipeEvents } from '../modules/classes/swipeevents.js';
import { Tabcordion } from '../modules/classes/tabcordion.js';
import { Tabs } from '../modules/classes/tabs.js';

// functions for depenency injection
import { debounceThenExecute } from '../modules/functions/debounce.js';
import { generateRandomString } from '../modules/functions/randomstring.js';
import { getScrollbarWidth} from '../modules/functions/scrolling.js';
import { isViewportOrUp} from '../modules/functions/viewport.js';
import { getCssCustomProperty } from '../modules/functions/csscustomproperty.js';



export const classParams = {

  'Accordion': {
    'ref': Accordion,
    'event': 'dom',
    'params': {
      'selAccordion': '.js-accordion',
      'selTitle': '.js-navWidgetTitle',
      'selContent': '.js-navWidgetContent',
      'getCssCustomProperty': getCssCustomProperty
    }
  },



  'ColorThemeSwitch': {
    'ref': ColorThemeSwitch,
    'event': 'dom',
    'params': {
      'selClassRoot': 'html',
      'selSwitch': '.js-colorSwitch',
      'selOptionsParent': '.js-colorSwitchOptions',
      'selOption': '.js-setColorTheme',
      'themes': {
        'light': 't-velvetLight',
        'dark': 't-velvetDark'
      }
    }
  },



  'Dialogs': {
    'ref': Dialogs,
    'event': 'load',
    'params': {
      'selDialog': '.js-dialog',
      'selTriggerOpen': '.js-openDialog',
      'selTriggerClose': '.js-closeDialog'
    }
  },



  'FilledInputs': {
    'ref': FilledInputs,
    'event': 'load',
    'params': {
      'selForm': '.js-markFilledInputs',
      'selItem': '.js-formItem'
    }
  },



  'FormProgress': {
    'ref': FormProgress,
    'event': 'load',
    'params': {
      'selForm': '.js-showProgress',
      'selBar': '.js-progressBar',
      'selValue': '.js-progressValue',
      'selField': '.js-progressField'
    }
  },



  'FormValidation': {
    'ref': FormValidation,
    'event': 'load',
    'params': {
      'selForm': '.js-validate',
      'availableLocales': [
        'de',
        'en'
      ],
      'config': {
        'classTo': 'c-form__item',
        'errorClass': 'is-invalid',
        'successClass': 'is-valid',
        'errorTextParent': 'c-form__item',
        'errorTextTag': 'div',
        'errorTextClass': 'text-help'
      }
    }
  },



  'Lightbox': {
    'ref': Lightbox,
    'event': 'load',
    'params': {
      'requiredElements': [
        'close',
        'prevButton',
        'nextButton',
        'image',
        'title',
        'description'
      ],
      'selBox': '.js-lightbox',
      'selClose': '.js-lightboxClose',
      'selPrevButton': '.js-lightboxPrev',
      'selNextButton': '.js-lightboxNext',
      'selImage': '.js-lightboxImage',
      'selTitle': '.js-lightboxTitle',
      'selDescription': '.js-lightboxDescription',
      'selGalleryParent': '.js-lightboxGallery',
      'selGalleryImage': '.js-showInLightbox'
    }
  },



  'MoreLess': {
    'ref': MoreLess,
    'event': 'dom',
    'params': {
      'selTrigger': '.js-showMoreLess',
      'textTriggerClosed': 'Show more',
      'textTriggerOpen': 'Show less'
    }
  },



  'PreviewImg': {
    'ref': PreviewImg,
    'event': 'dom',
    'params': {
      'selRoot': '.js-preview',
      'selBox': '.js-previewBox',
      'selImage': '.js-previewImg'
    }
  },



  'ResponsiveVideo': {
    'ref': ResponsiveVideo,
    'event': 'dom',
    'params': {
      'selVideo': '.js-responsiveVideo',
      'viewportMap': {
        'tiny': 'mobile',
        'small': 'mobile',
        'medium': 'tablet',
        'large': 'desktop',
        'xxl': 'desktop'
      },
      'getCssCustomProperty': getCssCustomProperty,
      'debounceThenExecute': debounceThenExecute
    }
  },



  'ScrollbarObserver': {
    'ref': ScrollbarObserver,
    'event': 'load',
    'params': {
      'useResizeObserver': true,
      'useMutationObserver': true,
      'useBodyObserver': false,
      'useWindowResize': true,
      'getScrollbarWidth': getScrollbarWidth,
      'getCssCustomProperty': getCssCustomProperty
    }
  },



  'Scrollspy': {
    'ref': Scrollspy,
    'event': 'load',
    'params': {
      'selNav': '.js-scrollspyNav',
      'selNavItem': '.js-scrollspyNavItem',
      'selContentArea': '.js-scrollspyContent',
      'selContentItem': '.js-scrollspyContentItem'
    }
  },



  'SelectfieldColor': {
    'ref': SelectfieldColor,
    'event': 'load',
    'params': {
      'selSelect': '.js-setSelectColor'
    }
  },



  'Slider': {
    'ref': Slider,
    'event': 'dom',
    'params': {
      'selSlider': '.js-slider',
      'generateRandomString': generateRandomString,
      'config': {

        'demoA': {
          'speed': 800,
          'slidesPerView': '1',
          'spaceBetween': 10,

          'keyboard': {
            'enabled': true
          },

          'navigation': {
            'nextEl': '.swiper-button-next',
            'prevEl': '.swiper-button-prev'
          },

          'breakpoints': {

            768: {
              'slidesPerView': '2'
            },

            990: {
              'slidesPerView': '3'
            }
          }
        },

        'demoB': {
          'speed': 800,
          'slidesPerView': '1',
          'spaceBetween': 75,

          'keyboard': {
            'enabled': true
          },

          'navigation': {
            'nextEl': '.swiper-button-next',
            'prevEl': '.swiper-button-prev'
          },

          'pagination': {
            'el': '.swiper-pagination'
          },

          'breakpoints': {

            990: {
              'slidesPerView': '2'
            }
          }
        }
      }
    }
  },



  'StickyObserver': {
    'ref': StickyObserver,
    'event': 'load',
    'params': {
      'selSticky': '.js-markWhenStuck'
    }
  },



  'SwipeEvents': {
    'ref': SwipeEvents,
    'event': 'load',
    'params': {
      'selSwipeElement': '.js-addSwipeEvents',
      'swipeTimeout': '500',
      'swipeUnit': 'px',
      'swipeThreshold': 20,
      'debounceThenExecute': debounceThenExecute
    }
  },



  'Tabcordion': {
    'ref': Tabcordion,
    'event': 'dom',
    'params': {
      'selModule': '.js-tabcordion',
      'selTabcordionTitle': '.js-tabcordionTitle',
      'selTabcordionContent': '.js-tabcordionContent',
      'isViewportOrUp': isViewportOrUp,
      'debounceThenExecute': debounceThenExecute
    }
  },



  'Tabs': {
    'ref': Tabs,
    'event': 'dom',
    'params': {
      'selModule': '.js-tabs',
      'selTabTitle': '.js-tabTitle',
      'selTabContent': '.js-tabContent'
    }
  }
}