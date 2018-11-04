import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';

export default class Cell extends React.Component {

	render() {
		let item = this.props.item;

    let setAnimationOpprt = () => {
      if(!this.props.access) return [styles.button, {opacity: this.props.style}];
      return styles.button
    }

		return (<TouchableOpacity 
                   onPress={() => {this.props.checkStep(item.id)}}
                   key={`cell${item.id}`}
                   color='#fff'>

                <Animated.View style={setAnimationOpprt()}>
                    <Animated.Text style={{color: '#000', fontSize: 36, fontWeight: '600', textAlign: 'center',opacity: this.props.style}}>{item.title}</Animated.Text>
                </Animated.View>
            </TouchableOpacity>)
	}
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 5,
    marginTop: 5,
    width: 80,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    maxHeight: 80,
    height: 80,
    paddingTop: 20
  }
})