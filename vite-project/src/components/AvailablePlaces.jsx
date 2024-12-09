import { useState } from 'react';
import Places from './Places.jsx';
import ErrorPage from './Error.jsx';
import {sortedPlacesByDiastance} from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    setIsFetching(true);
    async function fetchPlaces() {
      setIsFetching(true);
      try {
       
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortedPlacesByDiastance(places, position.coords.latitude, position.coords.longitude);
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        })
        
      } catch (error){
        setError({message: error.message || "Could not fetch places"});
        setIsFetching(false);
      }
      
    }
    fetchPlaces();
    // fetch('http://localhost:3000/places')
    // .then((response) => {
    //   return response.json()
    // }).then((resData) => {
    //   setAvailablePlaces(resData.places);
    // });
  }, []); 

  if (error) {
    return <ErrorPage title="Error occured" message = {error.message} />
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading = {isFetching}
      loadingText = "Fetching place data"
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
