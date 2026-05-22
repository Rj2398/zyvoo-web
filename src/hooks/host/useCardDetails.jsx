import { useMutation } from "@tanstack/react-query";

import { useState } from "react";
import { formDataApi, guestApi } from "../../utils/api";
import { LogoutError } from "../../config/Constant";
import { toast } from "react-toastify";

export default function useCardDetails() {
  const [manualLoading, setManualLoading] = useState(false);

  const { mutateAsync: getCardorBankList } = useMutation({
    mutationKey: ["get_payout_methods", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_payout_methods", payload);
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

  const { mutateAsync: setPrimaryCardorBank } = useMutation({
    mutationKey: ["set_primary_payout_method", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "set_primary_payout_method",
          payload
        );
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

  const { mutateAsync: deletePayoutMethod } = useMutation({
    mutationKey: ["delete_payout_method", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("delete_payout_method", payload);
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

  const { mutateAsync: AddBankDetails } = useMutation({
    mutationKey: ["add_payout_bank", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await formDataApi.post("add_payout_bank", payload);
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
  const { mutateAsync: AddPayoutCard } = useMutation({
    mutationKey: ["add_payout_card", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await formDataApi.post("add_payout_card", payload);
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

  // Get Countries
  const { mutateAsync: getCountry } = useMutation({
    mutationKey: ["get_countries", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await formDataApi.get("get_countries", payload);
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }

        toast.error(errorMessage);
        throw error;
      } finally {
        setManualLoading(false);
      }
    },
  });

  // Get States by country code
  const { mutateAsync: getState } = useMutation({
    mutationKey: ["get_states", "user"],
    mutationFn: async (countryCode) => {
      try {
        setManualLoading(true);
        const response = await formDataApi.get(`get_states/${countryCode}`);
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }

        toast.error(errorMessage);
        throw error;
      } finally {
        setManualLoading(false);
      }
    },
  });

  // Get Cities by country and state code
  const { mutateAsync: getCity } = useMutation({
    mutationKey: ["get_cities", "user"],
    mutationFn: async ({ countryCode, stateCode }) => {
      try {
        setManualLoading(true);
        const response = await formDataApi.get(`get_cities/${countryCode}/${stateCode}`);
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";

        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }

        toast.error(errorMessage);
        throw error;
      } finally {
        setManualLoading(false);
      }
    },
  });

  //
  const isLoading = manualLoading;
  return {
    isLoading,
    getCardorBankList,
    setPrimaryCardorBank,
    deletePayoutMethod,
    AddBankDetails,
    AddPayoutCard,
    getCountry,
    getState,
    getCity
  };
}
