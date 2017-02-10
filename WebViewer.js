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

export default class WebViewer extends Component {
    constructor(props) {
        super(props);

        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
        this.lastNav = {};

        this.state = {
            url:props.source ? props.source.url : ""
        };
    }

    static defaultProps = {
        showLoading:true,
        loadingRender:Loading,
        onMessage:null,
        onChange:null,
        onMediaTest:null
    }

    componentDidMount() {
        var net = require('react-native-tcp');
        var server = net.createServer(function(socket) {
            socket.write('excellent!');
        }).listen(8082);
    }

    componetnWillRecieveProps(props) {
        this.setState({
            url:props.source ? props.source.url : "",
            toWebCommand:""
        });
    }

    onNavigationStateChange(nav) {
        if(nav && nav.url) {
            var result = this.onHashBridge(nav.url);
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
        this.setState({
            toWebCommand:data
        });
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
            if(data.hash && data.hash.indexOf('#bridgeToRN=') == 0) {
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
        if(props.source) {
            props.source.url = this.state.url;
            if(this.state.command) {
                var parse = url.parse
            }
        }

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
