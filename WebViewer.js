import React, {
    Component,
    StyleSheet,
    Text,
    View,
    WebView,
    Animated,
    Dimensions
} from 'react-native';

class Loading extends Component {
    constructor(props) {
        super(props);

        this.state = {
            widthValue:new Animated.Value(0),
            opacityValue:new Animated.Value(1)
        };
    }

    start() {
        if(this.animated) {
            this.animated.stop();
        }

        this.state.widthValue.setValue(0);
        this.state.opacityValue.setValue(1);
        this.animated = Animated.parallel([
            Animated.timing(
                this.state.widthValue,
                {
                    toValue: Dimensions.get('window').width * .8,
                    duration: 5000
                }
            )
        ]);
        this.animated.start();
    }

    end() {
        if(this.animated) {
            this.animated.stop();
        }

        this.animated = Animated.sequence([
            Animated.timing(
                this.state.widthValue,
                {
                    toValue: Dimensions.get('window').width,
                    duration: 300
                }
            ),
            Animated.timing(
                this.state.opacityValue,
                {
                    toValue: 0,
                    duration: 100
                }
            )
        ]);
        this.animated.start();
    }

    render() {
        return <Animated.View ref="main" style={[styles.loading, {width:this.state.widthValue, opacity:this.state.opacityValue}]} />;
    }
}

export default class WebViewer extends Component {
    constructor(props) {
        super(props);

        this.onLoadStart = this.onLoadStart.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);
        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    }

    static defaultProps = {
        showLoading:true,
        loading:Loading
    }

    componentDidMount() {

    }

    onLoadStart(e) {
        this.refs.loading.start(e);
    }

    onLoadEnd(e) {
        this.refs.loading.end(e);
    }

    onNavigationStateChange(stack) {

    }

    render() {
        var Loading = this.props.loading;

        var props = Object.assign({}, this.props);
        props.onLoad = this.onLoadStart;
        props.onLoadEnd = this.onLoadEnd;
        props.onNavigationStateChange = this.onNavigationStateChange;

        return <View style={styles.container}>
            <View style={styles.content}>
                <WebView ref="main" {...props}/>
                {this.props.showLoading && <Loading ref="loading" />}
            </View>
        </View>;
    }
}

const styles = StyleSheet.create({
    loading:{
        position:'absolute',
        backgroundColor:'green',
        height:2,
        top:0,
        left:0
    },
    container:{
        flex:1
    },
    content:{
        flex:1
    }
});