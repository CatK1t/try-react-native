import React from 'react';
import { StyleSheet, Image, Text,Dimensions, Button, ImageBackground, View } from 'react-native';
import { TextInput } from 'react-native';

import axios from 'axios';


const ApiKey = '4988e7fffdd9ffc40b9fec93a289e27e';
const window = Dimensions.get('window');

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      name: 'Kiev',
      weather:[]
     };
  }

  getForAPI (name) {
    const request_url = 'http://api.openweathermap.org/data/2.5/weather?q=' + name + '&appid='+ ApiKey + '&lang=ru' +'.json';
    axios.get(request_url).then ( (response)=>{
      if ( response.status == 200 ){

        var weatherData = [response.data];
        var forecast = [];

        weatherData.forEach((element, index) => {

          forecast = forecast.concat([
            {
              humidity:               element.main.humidity,
              pressure:               element.main.pressure,
              cityName:               element.name,
              currentTemperature:     element.main.temp -273.15,
              highTemperature:        element.main.temp_max -273.15,
              lowTemperature:         element.main.temp_min -273.15,
              description:            element.weather[0].description,
              icon:                   element.weather[0].icon,
              windDeg:                element.wind.deg,
              windSpeed:              element.wind.speed,
            }
          ]);
        });

        this.setState({weather: forecast});
      }

    }).catch( (error)=>{
      console.log(error);
    });

  }

  render() {
    if( this.state.weather.length <= 0 ){
      this.getForAPI(this.state.name);
    }
    return (
      <ImageBackground source={require('./img/images.jpg')} style={styles.container}>

        <TextInput
        style={{height: 40, fontSize: 22, color: 'green', borderColor: 'gray', borderWidth: 1, width: window.width, textAlign: 'center', backgroundColor: 'white'}}
        onChangeText={(name) => this.setState({name})}
        value={this.state.name}
        />
      {
        this.state.weather.map((element, index)=>{
          var urlIcon = "http://openweathermap.org/img/w/" + element.icon + ".png";
          return (
            <View key={index}>
              <Button
                onPress={()=>{
                  this.getForAPI(this.state.name)
                }}
                title="Weather"
                color="#841584"
                accessibilityLabel="Show the current city weather"
                buttonStyle={{
                  backgroundColor: "rgba(92, 99,216, 1)",
                  width: 100,
                  height: 45,
                  borderColor: "transparent",
                  borderWidth: 0,
                  borderRadius: 5
                }}
              />
              <View style={{flexDirection: 'row',padding: 10, alignItems: 'center', justifyContent: 'center'}}>
                <Image
                  style={{width: 66, height: 58, zIndex: 10}}
                  source={{uri: urlIcon }}
                  />
                <Text style={{fontSize: 22, color: 'yellow'}}>{Math.round(element.currentTemperature)}C</Text>
              </View>
              <Text style={{fontSize: 18, width: window.width, textAlign: 'center', color: '#e63900', padding: 10}}>{element.description}</Text>
              <Text style={{fontSize: 18, width: window.width, textAlign: 'center', color: '#e63900', padding: 10}}>High: {Math.round(element.highTemperature)}C | Low: {Math.round(element.lowTemperature)}C</Text>
              <Text style={{fontSize: 18, width: window.width, textAlign: 'center', color: '#e63900', padding: 10}}>Humidity | Влажность: {Math.round(element.humidity)}%</Text>
              <Text style={{fontSize: 18, width: window.width, textAlign: 'center', color: '#e63900', padding: 10}}>Pressure | Давление: {element.pressure} мм рт. ст</Text>
              <Text style={{fontSize: 18, width: window.width, textAlign: 'center', color: '#e63900', padding: 10}}>Wind Speed | Скорость ветра: {element.windSpeed} км/ч</Text>
            </View>
          )
        })
      }
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

