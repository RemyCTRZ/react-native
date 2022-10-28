import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default function App() {

  const API_KEY = "5376cdeaea2e1e44ac99017fd955d8ad"
  const LAT = 50.742504
  const LON = 2.295816

  // Changement de page
  const [home, setHome] = useState(true)
  // Chargement
  const [loading, setLoading] = useState(true)

  // Localisation
  const [location, setlocation] = useState({})
  // Données récupérées
  const [data, setData] = useState(null)

  // Numéro du jour pour sélection
  const [dayNumber, setDayNumber] = useState(0)
  // Switch pour sélection
  const [currentWeather, setCurrentWeather] = useState({
    first_day: true,
    second_day: false,
    third_day: false,
    fourth_day: false,
  })

  function setAllDaysFalse() {
    setCurrentWeather({
      first_day: false,
      second_day: false,
      third_day: false,
      fourth_day: false,
    })
  }

  const dayList = Object.keys(currentWeather)

  function setDay(i) {
    const selectedDay = dayList[i]
    setAllDaysFalse()
    setDayNumber(i)
    setCurrentWeather({
      first_day: false,
      second_day: false,
      third_day: false,
      fourth_day: false,
      [selectedDay]: true
    })
  }

  const getLocation = async () => {
    await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}&lang=fr`)
      .then(response => {
        setData(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let location = await Location.getCurrentPositionAsync({});
      if (status !== 'granted') setErrorMsg('...');
      setLocation(location.coords)
    })();
  }, [loading])

  useEffect(() => {
    getLocation()
      .then(setLoading(false))
  }, [])

  // Page de chargement
  if (loading || data == null) return (
    <View style={styles.main}>
      <Text style={styles.text}>CHARGEMENT</Text>
    </View>
  )

  // Options pour formatter les dates
  const options = { weekday: 'short', month: 'long', day: 'numeric' };
  const options_two = { hour: "2-digit", minute: "2-digit" };


  return (
    <>
      {home ? (
        <View style={styles.container}>
          <LinearGradient style={styles.div} colors={['#10b2fc', '#1075f5']} start={{ y: 1 }} end={{ y: 0 }}>
            <View style={styles.header}>
              <Pressable onPress={() => setHome(true)}>
                <Entypo style={styles.icon} name='home' />
              </Pressable>
              <Text style={styles.city}><FontAwesome style={styles.icon} name="map-pin" /> {data.city.name}</Text>
              <Entypo style={styles.icon} name="dots-three-vertical" />
            </View>
            <Image style={styles.img} source={{ uri: `http://openweathermap.org/img/wn/${data.list[dayNumber].weather[0].icon}@4x.png` }} />
            <Text style={styles.temp}>{Math.floor(data.list[dayNumber].main.temp)}°</Text>
            <Text style={styles.desc}>{data.list[dayNumber].weather[0].description}</Text>
            <Text style={styles.date}>{new Date(data.list[dayNumber].dt_txt).toLocaleDateString("fr-FR", options)}</Text>
            <View style={styles.infos}>
              <View style={styles.infobox}>
                <MaterialCommunityIcons style={styles.info_icon} name="windsock" />
                <Text style={styles.infotxt}>{Math.round((data.list[dayNumber].wind.speed * 3.6))} km/h</Text>
                <Text style={styles.infodesc}>Vent</Text>
              </View>
              <View style={styles.infobox}>
                <Entypo style={styles.info_icon} name="water" />
                <Text style={styles.infotxt}>{data.list[dayNumber].main.humidity}%</Text>
                <Text style={styles.infodesc}>Humidité</Text>
              </View>
              <View style={styles.infobox}>
                <FontAwesome5 style={styles.info_icon} name="cloud-rain" />
                <Text style={styles.infotxt}>{data.list[dayNumber].rain ? data.list[dayNumber].rain * 100 + ' %' : '0 %'}</Text>
                <Text style={styles.infodesc}>Chance de pluie</Text>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.div_2}>
            <View style={styles.second_container}>
              <Text style={styles.today}>Aujourd'hui</Text>
              <Pressable style={styles.seven} onPress={() => setHome(false)}>
                <Text style={styles.seventxt}>7 jours</Text>
                <FontAwesome style={styles.right} name="angle-right" />
              </Pressable>
            </View>
          </View>
          <View style={styles.div_3}>
            <Pressable style={currentWeather.first_day ? styles.day_active : styles.day} onPress={() => setDay(0)}>
              <Text style={styles.day_temp}>{Math.floor(data.list[0].main.temp)}°</Text>
              <Image style={styles.day_img} source={{ uri: `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@4x.png` }} />
              <Text style={styles.day_date}>{new Date(data.list[0].dt_txt).toLocaleTimeString("fr-FR", options_two)}</Text>
            </Pressable>
            <Pressable style={currentWeather.second_day ? styles.day_active : styles.day} onPress={() => setDay(1)}>
              <Text style={styles.day_temp}>{Math.floor(data.list[1].main.temp)}°</Text>
              <Image style={styles.day_img} source={{ uri: `http://openweathermap.org/img/wn/${data.list[1].weather[0].icon}@4x.png` }} />
              <Text style={styles.day_date}>{new Date(data.list[1].dt_txt).toLocaleTimeString("fr-FR", options_two)}</Text>
            </Pressable>
            <Pressable style={currentWeather.third_day ? styles.day_active : styles.day} onPress={() => setDay(2)}>
              <Text style={styles.day_temp}>{Math.floor(data.list[2].main.temp)}°</Text>
              <Image style={styles.day_img} source={{ uri: `http://openweathermap.org/img/wn/${data.list[2].weather[0].icon}@4x.png` }} />
              <Text style={styles.day_date}>{new Date(data.list[2].dt_txt).toLocaleTimeString("fr-FR", options_two)}</Text>
            </Pressable>
            <Pressable style={currentWeather.fourth_day ? styles.day_active : styles.day} onPress={() => setDay(3)}>
              <Text style={styles.day_temp}>{Math.floor(data.list[3].main.temp)}°</Text>
              <Image style={styles.day_img} source={{ uri: `http://openweathermap.org/img/wn/${data.list[3].weather[0].icon}@4x.png` }} />
              <Text style={styles.day_date}>{new Date(data.list[3].dt_txt).toLocaleTimeString("fr-FR", options_two)}</Text>
            </Pressable>
          </View>
        </View>

      ) : (

        <View style={styles.container}>
          <LinearGradient style={styles.div} colors={['#10b2fc', '#1075f5']} start={{ y: 1 }} end={{ y: 0 }}>
            <View style={styles.header}>
              <Pressable onPress={() => setHome(true)}>
                <FontAwesome style={styles.icon} name='chevron-left' />
              </Pressable>
              <Text style={styles.city}><FontAwesome style={styles.icon} name="map-pin" /> {data.city.name}</Text>
              <Entypo style={styles.icon} name="dots-three-vertical" />
            </View>
            <Image style={styles.img} source={{ uri: `http://openweathermap.org/img/wn/${data.list[dayNumber].weather[0].icon}@4x.png` }} />
            <Text style={styles.temp}>{Math.floor(data.list[dayNumber].main.temp)}°</Text>
            <Text style={styles.desc}>{data.list[dayNumber].weather[0].description}</Text>
            <Text style={styles.date}>{new Date(data.list[dayNumber].dt_txt).toLocaleDateString("fr-FR", options)}</Text>
            <View style={styles.infos}>
              <View style={styles.infobox}>
                <MaterialCommunityIcons style={styles.info_icon} name="windsock" />
                <Text style={styles.infotxt}>{Math.round((data.list[dayNumber].wind.speed * 3.6))} km/h</Text>
                <Text style={styles.infodesc}>Vent</Text>
              </View>
              <View style={styles.infobox}>
                <Entypo style={styles.info_icon} name="water" />
                <Text style={styles.infotxt}>{data.list[dayNumber].main.humidity}%</Text>
                <Text style={styles.infodesc}>Humidité</Text>
              </View>
              <View style={styles.infobox}>
                <FontAwesome5 style={styles.info_icon} name="cloud-rain" />
                <Text style={styles.infotxt}>{data.list[dayNumber].rain ? data.list[dayNumber].rain * 100 + ' %' : '0 %'}</Text>
                <Text style={styles.infodesc}>Chance de pluie</Text>
              </View>
            </View>
          </LinearGradient>
        </View >
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '110%',
  },
  day_img: {
    height: 50,
    width: 50,
  },
  day_temp: {
    color: '#F9F9F9',
    fontSize: 20,
    fontWeight: '800',
  },
  day_date: {
    color: '#F9F9F9',
    opacity: 0.6,
    fontWeight: '700',
  },
  div_3: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#999',
    borderRadius: 30,
    borderWidth: 1,
    width: 'auto',
    padding: 10,
    marginHorizontal: 5,
  },
  day_active: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#20b8f9',
    borderRadius: 30,
    borderWidth: 1,
    width: 'auto',
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#10b2fc',
    shadowColor: "#20b8f9",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    transform: [{ scale: 1.15 }],
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: '#000A18',
    paddingBottom: 20,
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000A18',
  },
  text: {
    color: '#F9F9F9',
    textTransform: 'capitalize',
    fontWeight: '700',
    fontSize: 30,
  },
  info_icon: {
    color: '#F9F9F9',
    fontSize: 20,
    marginBottom: 10,
  },
  infotxt: {
    color: '#F9F9F9',
    fontWeight: '700',
  },
  infos: {
    marginTop: 30,
    borderTopColor: 'rgba(249, 249, 249, 0.2)',
    borderTopWidth: 1,
    paddingTop: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  infobox: {
    display: 'flex',
    alignItems: 'center',
  },
  div: {
    display: 'flex',
    padding: 40,
    alignItems: 'center',
    width: "100%",
    backgroundColor: '#14BEF6',
    borderBottomLeftRadius: 75,
    borderBottomRightRadius: 75,
  },
  icon: {
    color: '#F9F9F9',
    fontSize: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#F9F9F9',
    padding: 10,
  },
  right: {
    color: '#F9F9F9',
    opacity: 0.60,
    fontSize: 20,
  },
  city: {
    color: '#F9F9F9',
    fontWeight: '800',
    fontSize: 25,
  },
  temp: {
    color: '#F9F9F9',
    fontWeight: '800',
    fontSize: 70,
  },
  desc: {
    color: '#F9F9F9',
    fontWeight: '600',
    fontSize: 30,
    textTransform: 'capitalize',
  },
  date: {
    color: '#F9F9F9',
    opacity: 0.60,
    fontSize: 15,
    textTransform: 'capitalize',
  },
  img: {
    height: 115,
    width: 200,
    resizeMode: 'cover',
  },
  second_container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  today: {
    color: '#F9F9F9',
    fontWeight: '700',
    fontSize: 17,
  },
  seven: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seventxt: {
    color: '#F9F9F9',
    opacity: 0.60,
    marginRight: 5,
  },
  infodesc: {
    color: '#F9F9F9',
    opacity: 0.60,
  },
});