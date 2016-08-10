/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';

import WebViewer from './WebViewer.js';

class Index extends Component {
    constructor(props) {
        super(props);
        this.open = this.open.bind(this);
    }

    open() {
        this.props.navigator.push({
            name:'demo'
        });
    }

    render() {
        return <View style={styles.container}>
            <Text style={styles.welcome}>
                Welcome to react-native-webviewer!
            </Text>
            <Text style={styles.instructions} onPress={this.open}>
                To get started, click to open a webviewer
            </Text>
        </View>;
    }
}

class Demo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <WebViewer source={{uri:"http://npmjs.com"}} />;
    }
}

let Pages = {
    index:Index,
    demo:Demo
};

class reactnativewebviewer extends Component {
    constructor() {
        super();
        this.renderScene = this.renderScene.bind(this);
        this.configureScene = this.configureScene.bind(this);
    }

    renderScene(router, navigator) {
        var Comp = Pages[router.name];
        return <Comp router={router} navigator={navigator} />;
    }

    configureScene(route, routerStack) {
        return Navigator.SceneConfigs.FloatFromRight;
    }

    render() {
        return (
            <View style={styles.container}>
                <Navigator
                    ref="nav"
                    initialRoute={{name: "index"}}
                    configureScene={this.configureScene}
                    renderScene={this.renderScene} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: 'blue',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('reactnativewebviewer', () => reactnativewebviewer);
