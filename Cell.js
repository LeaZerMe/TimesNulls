import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class Cell extends React.Component {

	render() {
		let item = this.props.item;

		return (<TouchableOpacity 
                   onPress={() => {this.props.checkStep(item.id)}}
                   key={`cell${item.id}`}
                   color='#fff'>

                <View style = {styles.button}>
                    <Text style={{color: '#000', fontSize: 36, fontWeight: '600', textAlign: 'center'}}>{item.title}</Text>
                </View>
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