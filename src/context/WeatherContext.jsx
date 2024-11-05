import { createContext, useState, useEffect } from "react";
import { dbUrl } from "../constants/constants";

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState({
    id: 0,
    temperature: 0,
    humidity: 0,
    barometricPressure: 0,
    windDirection: 0,
    avgWindSpeed: 0,
    maxWindSpeed: 0,
    rainfallOneHour: 0,
    rainfallTwentyFourHour: 0,
    time: "",
    date: "",
  });
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await fetch(`${dbUrl}/api/weathers`);
        if (!response.ok) throw new Error("Issue fetching weather data!");
        const responseData = await response.json();
        setCurrentWeather(responseData[responseData.length - 1]);
        setWeatherData(responseData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();

    const fetchIntervalId = setInterval(() => {
      fetchWeatherData();
    }, 30000);

    return () => clearInterval(fetchIntervalId);
  }, []);

  const providerValue = {
    currentWeather,
    weatherData,
    loading,
    error,
  };

  return (
    <WeatherContext.Provider value={providerValue}>
      {children}
    </WeatherContext.Provider>
  );
};