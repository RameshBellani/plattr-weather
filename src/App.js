import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
  CssBaseline,
  Box,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import WeatherCard from "./components/WeatherCard";
import axios from "axios";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const API_KEY = "16bf99c68c5cb8ea48f7f482ceafaba9";
const API_URL = "https://api.openweathermap.org/data/2.5";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchWeatherData = useCallback(
    async (cityName) => {
      setLoading(true);
      setError("");
      try {
        const currentWeatherResponse = await axios.get(
          `${API_URL}/weather?q=${cityName}&appid=${API_KEY}&units=${unit}`
        );
        const forecastResponse = await axios.get(
          `${API_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=${unit}`
        );

        setWeatherData(currentWeatherResponse.data);
        setForecastData(
          forecastResponse.data.list.filter((_, index) => index % 8 === 0)
        );
      } catch (err) {
        setError("City not found or API error.");
      } finally {
        setLoading(false);
      }
    },
    [unit]
  );

  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setLoading(true);
        setError("");
        try {
          const { latitude, longitude } = position.coords;
          const response = await axios.get(
            `${API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`
          );
          setWeatherData(response.data);
          fetchWeatherData(response.data.name);
        } catch (err) {
          setError("Location error or API error.");
        } finally {
          setLoading(false);
        }
      });
    }
  };

  const handleSearch = () => {
    if (city) {
      fetchWeatherData(city);
    } else {
      setError("Please enter a city name.");
      setShowSnackbar(true);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  useEffect(() => {
    if (weatherData?.name) {
      fetchWeatherData(weatherData.name);
    }
  }, [unit, fetchWeatherData]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <WbSunnyIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Weather Dashboard
            </Typography>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 5, flex: 1 }}>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item>
              <TextField
                label="Enter City"
                variant="outlined"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleSearch}>
                Search
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<LocationOnIcon />}
                onClick={fetchWeatherByLocation}
              >
                Use My Location
              </Button>
            </Grid>
            <Grid item>
              <Button variant="text" onClick={toggleUnit}>
                Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
              </Button>
            </Grid>
          </Grid>
          {loading ? (
            <Grid container justifyContent="center" sx={{ mt: 5 }}>
              <CircularProgress />
            </Grid>
          ) : error ? (
            <Typography color="error" align="center" sx={{ mt: 5 }}>
              {error}
            </Typography>
          ) : weatherData ? (
            <Grid container spacing={4} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <WeatherCard data={weatherData} unit={unit} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  5-Day Forecast
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  {forecastData.map((day, index) => (
                    <Grid item key={index}>
                      <WeatherCard data={day} unit={unit} forecast />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          ) : null}
          <Snackbar
            open={showSnackbar}
            onClose={() => setShowSnackbar(false)}
            message={error}
            autoHideDuration={3000}
          />
        </Container>
        <Box
          component="footer"
          sx={{
            py: 2,
            textAlign: "center",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            &copy; {new Date().getFullYear()} Weather Dashboard. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
