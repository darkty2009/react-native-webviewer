import React, {
    Component,
    StyleSheet,
    Text,
    View,
    WebView,
    Animated,
    Dimensions,
    Platform
} from 'react-native';

import Loading from './lib/loading.js';
import inject from './web/inject.js';
import url from 'url';
import event from './lib/event.js';

console.warn(JSON.stringify(url.parse('bridge://content?{32423423432423}')));

export default class WebViewer extends Component {
    constructor(props) {
        super(props);

        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
        this.lastNav = {};
    }

    static defaultProps = {
        showLoading:true,
        loadingRender:Loading,
        onMessage:null,
        onChange:null,
        onMediaTest:null
    }

    onNavigationStateChange(nav) {
        if(nav && nav.url) {
            var result = this.onHashBridge(nav.url);
            console.warn('result', result, nav.url);
            if(result === false) {
                return false;
            }
        }

        if(nav.loading && nav.url != this.lastNav.url) {
            this.lastNav = nav;
            this.refs.loading.start();
        }else {
            this.lastNav = {};
            this.refs.loading.end();
        }
    }

    sendMessage(data) {

    }

    onBridgeMessage(event) {
        console.warn(event.nativeEvent.data);
    }

    onHashBridge(navUrl) {
        var data = url.parse(navUrl);
        if(Platform.OS == 'ios') {
            if(data.protocol == 'bridge:') {
                data = data.query.d;
                this.onBridgeMessage(event.create('', decodeURIComponent(data)));
                return false;
            }
        }else {
            if(data.hash && data.hash.indexOf('#bridge=') == 0) {
                data = data.hash.replace(/^\#bridge=/, '');
                this.onBridgeMessage(event.create('', decodeURIComponent(data)));
                return false;
            }
        }
    }

    loadEndHandler() {
        this.sendMessage('__ready__');
    }

    loadStartHandler() {

    }

    render() {
        var Loading = this.props.loadingRender;

        var props = Object.assign({}, this.props);
        props.javaScriptEnabled = true;
        props.onNavigationStateChange = this.onNavigationStateChange;
        if(Platform.OS == 'ios') {
            props.onShouldStartLoadWithRequest = this.onHashBridge.bind(this);
        }
        props.onMessage = this.onBridgeMessage.bind(this);
        props.onLoadEnd = this.loadEndHandler.bind(this);
        props.onLoadStart = this.loadStartHandler.bind(this);

        return <View style={styles.container}>
            <View style={styles.content}>
                <WebView ref="main" {...props} injectedJavaScript={inject}/>
                {(this.props.showLoading && Loading) && <Loading ref="loading" />}
            </View>
        </View>;
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    content:{
        flex:1
    }
});
