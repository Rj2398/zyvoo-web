import { formDataApi } from "../utils/api";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function useTimer() {
  const [manualLoading, setManualLoading] = useState(false);


  const { mutateAsync: getTimerDetails } = useMutation({
    mutationKey: [`get_user_bookings`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await formDataApi.post("get_user_bookings", payload);

        const { data } = response;

        return {
          ...data,
        };
      } catch (error) {
        setManualLoading(false);
        const errorMessage =
          error.response?.data?.message || // Custom error from API
          error.message || // Default error message
          "An unknown error occurred";
      } finally {
        setManualLoading(false);
      }
    },
  });
  //

  const isLoading = manualLoading;
  return {
    isLoading,
    getTimerDetails,
  };
}
