const cache: any = {} 
 function isMobileIos() {
   if(cache.isMobileIos != undefined) return cache.isMobileIos;
    const val =  [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)

    cache.isMobileIos = val;
    return val;
  }
  export default {isMobileIos}