import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";

const WeatherCard = ({ data, unit, forecast }) => {
  const temperature = Math.round(data.main.temp);
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const date = forecast ? new Date(data.dt * 1000).toLocaleDateString() : null;

  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        {forecast && (
          <Typography variant="h6" gutterBottom>
            {date}
          </Typography>
        )}
        <Typography variant="h5">{data.name || ""}</Typography>
        <Typography variant="h6">
          {temperature}° {unit === "metric" ? "C" : "F"}
        </Typography>
        <CardMedia
          component="img"
          sx={{ width: 80, height: 80 }}
          image={iconUrl}
          alt={data.weather[0].description}
        />
        <Typography variant="subtitle1">{data.weather[0].description}</Typography>
        <Typography variant="body2">Humidity: {data.main.humidity}%</Typography>
        <Typography variant="body2">Wind: {data.wind.speed} {unit === "metric" ? "m/s" : "mph"}</Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
