import { useMutation } from "@tanstack/react-query";

import { useState } from "react";
import { guestApi } from "../../utils/api";
import { LogoutError } from "../../config/Constant";
import { toast } from "react-toastify";

export default function useHome() {
  const [manualLoading, setManualLoading] = useState(false);

  const { mutateAsync: getHomeList } = useMutation({
    mutationKey: ["get_properties_lists", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_properties_lists", payload);
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        if(errorMessage != "No properties found for this user."){
          toast.error(errorMessage);
        }
      } finally {
        setManualLoading(false);
      }
    },
  });
  //

  const { mutateAsync: addPropertyHost } = useMutation({
    mutationKey: ["store_property_details", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("store_property_details", payload);
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });


  const { mutateAsync: getPropertyDetails } = useMutation({
    mutationKey: ["get_property_details", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_property_details", payload);
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  //

  const { mutateAsync: updateProperyDetails } = useMutation({
    mutationKey: ["update_property_details", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.put("update_property_details", payload);
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: deleteProperyDetails } = useMutation({
    mutationKey: ["delete_property", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("delete_property", payload);
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: earnings } = useMutation({
    mutationKey: ["earnings", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("earnings", payload);
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const isLoading = manualLoading;
  return {
    isLoading,
    getHomeList,
    addPropertyHost,
    getPropertyDetails,
    updateProperyDetails,
    deleteProperyDetails,
    earnings,
  };
}
