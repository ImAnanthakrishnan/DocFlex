import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Input,
    SkeletonText,
    Text,
  } from '@chakra-ui/react'
  import { FaLocationArrow, FaTimes } from 'react-icons/fa'
  
  import {
    useJsApiLoader,//checks map loaded or not
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
  } from '@react-google-maps/api'
  import { useRef, useState } from 'react'
  
  const APP_GOOGLE_MAPS_API_KEY = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

  const center = { lat: 48.8584, lng: 2.2945 }
  
  function Maps() {
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: APP_GOOGLE_MAPS_API_KEY,
      libraries: ['places'],
    });
  
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [distance, setDistance] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
  
    const originRef = useRef<HTMLInputElement>(null);
    const destinationRef = useRef<HTMLInputElement>(null);
  
    if (!isLoaded) {
      return <SkeletonText />; // Assuming you have a SkeletonText component
    }
  
    async function calculateRoute() {
      if (!originRef.current || !destinationRef.current || originRef.current.value === '' || destinationRef.current.value === '') {
        return;
      }
  
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
      });
  
      if (results && results.routes.length > 0 && results.routes[0].legs.length > 0) {
        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance?.text || '');
        setDuration(results.routes[0].legs[0].duration?.text || '');
      }
    }
  
    function clearRoute() {
      setDirectionsResponse(null);
      setDistance('');
      setDuration('');
      if (originRef.current) originRef.current.value = '';
      if (destinationRef.current) destinationRef.current.value = '';
    }
  
    return (
<iframe
  width="600"
  height="450"
  style={{border:0}}
  loading="lazy"
  allowFullScreen
  referrerPolicy="no-referrer-when-downgrade"
  src={`https://www.google.com/maps/embed/v1/place?key=${APP_GOOGLE_MAPS_API_KEY}
    &q=Space+Needle,Seattle+WA`}>
</iframe>
    );
  }
  
  export default Maps;