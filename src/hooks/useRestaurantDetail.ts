import { useEffect, useState } from "react";
import axios from "@/services/api/axios";

type RestaurantDetail = {
  id: number;
  name: string;
  coordinates: {
    lat: number;
    long: number;
  };
};

export function useRestaurantDetail(id: number) {
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`/resto/${id}`).then((res) => {
      setRestaurant(res.data.data);
    });
  }, [id]);

  return restaurant;
}