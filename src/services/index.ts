import axios from "axios";

export const getUnsplashImage = () => {
  return axios({
    method: "get",
    url: "https://api.unsplash.com/photos/random?count=40",
    headers: {
      Authorization: "Client-ID g0hjw__H3OZAnfkzXMs4GpZZ9MvTmLsRzRufJMQnljI",
    },
  });
};
