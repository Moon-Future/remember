import { useCallback, useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = useCallback(async (): Promise<LocationCoords> => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const error = '位置权限被拒绝，请在设置中开启位置权限';
        setErrorMsg(error);
        throw new Error(error);
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(coords);
      return coords;
    } catch (e) {
      const error = e instanceof Error ? e.message : '获取位置失败';
      setErrorMsg(error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const watchPosition = useCallback(() => {
    let subscription: Location.LocationSubscription | null = null;

    const start = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (currentLocation) => {
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
        }
      );
    };

    start();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    return watchPosition();
  }, [watchPosition]);

  return {
    location,
    errorMsg,
    loading,
    getCurrentPosition,
  };
}
