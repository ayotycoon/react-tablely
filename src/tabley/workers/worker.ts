

  export default () => {
    onmessage = function(event: MessageEvent<any>) {
      console.log('Message received from main script', event.data);
  
      //postMessage(workerResult);
    }
  }