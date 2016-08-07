import React, {
    Component,
    StyleSheet,
    Text,
    View,
    WebView
} from 'react-native';

export default class WebViewer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <WebView {...this.props} />;
    }
}