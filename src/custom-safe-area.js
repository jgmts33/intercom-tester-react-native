import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';

export default class CustomSafeAreaView extends Component {
    render() {
        return (
            <View style={{ flex: 1}}>
                <SafeAreaView style={{ flex: 0, backgroundColor: this.props.topBackgroundColor }} />
                <SafeAreaView style={{ flex: 1, backgroundColor: this.props.bottomBackgroundColor }}>
                    <View style={{ flex: 1, backgroundColor: '#F5FCFF' }}>
                        {this.props.children}
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}
