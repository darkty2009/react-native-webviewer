import {
    Platform
} from 'react-native';

let os = Platform.OS;
let javascript = `
(function() {
    window.receiveMessage = function(data) {
        if(data == '__ready__') {
            window.dispatchEvent(new Event('bridgeReady'));
        }else {
            var event = new Event('bridgeMessage');
            event.data = data;
            window.dispatchEvent(event);
        }
    };
    window.postMessage = function(data) {
        if('${os}' == 'ios') {
            location.href = 'bridge://content?d=' + encodeURIComponent(JSON.stringify(data));
        }
        else {
            location.hash = 'bridgeToRN=' + encodeURIComponent(JSON.stringify(data));
        }
    };

    window.addEventListener('hashchange', function() {
        
    });
})();
`;

export default javascript;
