const key = '94ff4afe84d27ef6d71886d34dbdc98b';
const requestCity = async city => {
  const baseURL = `https://api.openweathermap.org/data/2.5/weather`;
  const query = `?q=${city}&appid=${key}`;
  const response = await fetch(baseURL + query);
  const data = await response.json();
  console.log(data)
  return data;
};
