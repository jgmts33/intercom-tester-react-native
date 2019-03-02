import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native';

export default class Button extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    maxWidth: 300,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'darkgray',
    margin: 10,
    padding: 10,
    color: 'black'
  },
});
