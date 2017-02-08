import React, {
    Component,
    StyleSheet,
    Text,
    View,
    WebView,
    Animated,
    Dimensions
} from 'react-native';

export default class Loading extends Component {
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
            )
        ]);
        this.animated.start(()=>this.state.opacityValue.setValue(0));
    }

    render() {
        return <Animated.View ref="main" style={[styles.loading, {width:this.state.widthValue, opacity:this.state.opacityValue}]} />;
    }
}

const styles = StyleSheet.create({
    loading:{
        position:'absolute',
        backgroundColor:'green',
        height:2,
        top:0,
        left:0
    }
});
