import { useMutation, useQuery } from "@tanstack/react-query";
import { api, guestApi } from "../utils/api";
import { useState } from "react";
import { LogoutError } from "../config/Constant";
import { toast } from "react-toastify";

export default function useContent() {
  const [manualLoading, setManualLoading] = useState(false);
  const { data: PrivacyData, isLoading: isPrivacyLoading } = useQuery({
    queryKey: ["get_privacy_policy", "user"],
    queryFn: async () => {
      try {
        const response = await guestApi.get("get_privacy_policy");
        const { data } = response;
        return data.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        toast.error(errorMessage);
      }
    },
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache persists for 10 minutes
    refetchOnWindowFocus: false, // Prevent auto-refetch when window regains focus
  });

  const { data: TermConditionData, isLoading: isTermConditionLoading } =
    useQuery({
      queryKey: ["get_term_condition", "user"],
      queryFn: async () => {
        try {
          const response = await guestApi.get("get_term_condition");
          const { data } = response;

          return data?.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "An unknown error occurred";
          if (error?.response?.data?.message === "Unauthenticated.") {
            LogoutError();
          }
          toast.error(errorMessage);
        }
      },
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    });

  const { data: FaqData, isLoading: isFaqLoading } = useQuery({
    queryKey: ["get_faq", "user"],
    queryFn: async () => {
      try {
        const response = await guestApi.get("get_faq");
        const { data } = response;

        return data?.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        toast.error(errorMessage);
      }
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const { data: AboutUsData, isLoading: isAboutUsLoading } = useQuery({
    queryKey: ["get_about_us", "user"],
    queryFn: async () => {
      try {
        const response = await guestApi.get("get_about_us");
        const { data } = response;

        return data?.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
      }
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: contact_us } = useMutation({
    mutationKey: ["contact_us", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("contact_us", payload);
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
    PrivacyData,
    isPrivacyLoading,
    TermConditionData,
    isTermConditionLoading,
    FaqData,
    isFaqLoading,
    AboutUsData,
    contact_us,
    isAboutUsLoading,
    isLoading,
  };
}
