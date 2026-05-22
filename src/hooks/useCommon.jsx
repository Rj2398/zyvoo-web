import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { setUserInfo } from "../store/slices/userSlice";

import { api, guestApi } from "../utils/api";

import { useState } from "react";
import { KEYS, LogoutError } from "../config/Constant";
import {
  setGuestHome,
  setGuestWishlistData,
} from "../store/slices/commonSlice";
import { toast } from "react-toastify";

export default function useCommon() {
  const dispatch = useDispatch();
  const [manualLoading, setManualLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { mutateAsync: guestHomeData } = useMutation({
    mutationKey: ["get_home_data", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await api.post("get_home_data", payload);
        const { data } = response;
        if (data) {
          await dispatch(setGuestHome(data?.data));
        }

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        if(error.message=="No properties found for the given filters."){
           await dispatch(setGuestHome([]));
        }
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        // toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: getPropertyDetails } = useMutation({
    mutationKey: ["get_home_property_details", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "get_home_property_details",
          payload
        );
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: getPropertyReviews } = useMutation({
    mutationKey: ["filter_property_reviews", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "filter_property_reviews",
          payload
        );
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: guestWishlistData } = useMutation({
    mutationKey: ["get_wishlist", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_wishlist", payload);
        const { data } = response;

        if (data?.data) {
          setTimeout(() => {
            dispatch(setGuestWishlistData(data?.data));
          }, 1000);
        }

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: saveItemInWishlist } = useMutation({
    mutationKey: ["save_item_in_wishlist", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("save_item_in_wishlist", payload);
        const { data } = response;

        if (data?.data) {
          setTimeout(() => {
            dispatch(setGuestWishlistData(data?.data));
          }, 1000);
        }

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: createNewWishlist } = useMutation({
    mutationKey: ["create_wishlist", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("create_wishlist", payload);
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: getSavedItemsInWishlist } = useMutation({
    mutationKey: ["get_saved_item_wishlist", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "get_saved_item_wishlist",
          payload
        );
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: deleteWishlist } = useMutation({
    mutationKey: ["delete_wishlist", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("delete_wishlist", payload);
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: removeItemFromWishlist } = useMutation({
    mutationKey: ["remove_item_from_wishlist", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "remove_item_from_wishlist",
          payload
        );
        const { data } = response;
        console.log(data);

        if (data) {
          toast.success(data?.message);
        }

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          error.response?.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });


  const { mutateAsync: getAllSavedCard } = useMutation({
    mutationKey: ["get_user_cards", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_user_cards", payload);
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  //

  const { mutateAsync: saveCardStripe } = useMutation({
    mutationKey: ["save_card_stripe", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("save_card_stripe", payload);
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: setPrefferCard } = useMutation({
    mutationKey: ["set_preferred_card", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("set_preferred_card", payload);
        const { data } = response;

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: deleteSavedCard } = useMutation({
    mutationKey: ["delete_card_stripe", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("delete_card_stripe", payload);
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

  const { mutateAsync: getSavedAddress } = useMutation({
    mutationKey: ["same_as_mailing_address", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "same_as_mailing_address",
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

  const { mutateAsync: getArticleList } = useMutation({
    mutationKey: ["get_article_list", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_article_list", payload);
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

  const { mutateAsync: bookHostProverty } = useMutation({
    mutationKey: ["book_property", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("book_property", payload);
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

  const { mutateAsync: check_host_property_availability } = useMutation({
    mutationKey: ["check_host_property_availability", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "check_host_property_availability",
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

  const { mutateAsync: homeDataFilters } = useMutation({
    mutationKey: ["get_home_data_filter", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_home_data_filter", payload);
        const { data } = response;

        if (data?.data) {
          setTimeout(() => {
            dispatch(setGuestHome(data?.data));
          }, 1000);
        }

        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred";
        console.error(errorMessage);
        if (error?.response?.data?.message === "Unauthenticated.") {
          LogoutError();
        }
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: get_booking_extension_time_amount } = useMutation({
    mutationKey: ["get_booking_extension_time_amount", "extention_time"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "get_booking_extension_time_amount",
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

  const { mutateAsync: helpCenter } = useMutation({
    mutationKey: ["get_help_center", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_help_center", payload);
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
  const { mutateAsync: getGuideList } = useMutation({
    mutationKey: ["get_guide_list", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_guide_list", payload);
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

  const { mutateAsync: guestNotifications } = useMutation({
    mutationKey: ["get_notification_guest", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_notification_guest", payload);
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

  const { mutateAsync: hostNotifications } = useMutation({
    mutationKey: ["get_notification_host", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_notification_host", payload);
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

  const { mutateAsync: markNotification } = useMutation({
    mutationKey: ["mark_notification_read", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("mark_notification_read", payload);
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

  const { mutateAsync: cancelBooking } = useMutation({
    mutationKey: ["guest_cancel_booking", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("guest_cancel_booking", payload);
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

  const { mutateAsync: removeNotification } = useMutation({
    mutationKey: ["remove_notifications", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.get("remove_notifications", payload);
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

  const { mutateAsync: joinNewsLetter } = useMutation({
    mutationKey: ["newsletter_subscribe", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("newsletter_subscribe", payload);
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

  const { mutateAsync: host_listing } = useMutation({
    mutationKey: ["host_listing", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("host_listing", payload);
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

  const { mutateAsync: filter_host_reviews } = useMutation({
    mutationKey: ["filter_host_reviews", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("filter_host_reviews", payload);
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

  const { mutateAsync: getGuideDetail } = useMutation({
    mutationKey: ["get_guide_details", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_guide_details", payload);
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

  const { mutateAsync: getArticleDetails } = useMutation({
    mutationKey: ["get_article_details", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_article_details", payload);
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

  const { mutateAsync: guestUnReadBookings } = useMutation({
    mutationKey: ["guest_unread_bookings", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("guest_unread_bookings", payload);
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
        // if (error?.response?.data?.message === "Unauthenticated.") {
        //   LogoutError();
        // }
        // toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: guestMarkBookings } = useMutation({
    mutationKey: ["mark_guest_bookings", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("mark_guest_bookings", payload);
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

  const { mutateAsync: hostUnReadBookings } = useMutation({
    mutationKey: ["host_unread_bookings", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("host_unread_bookings", payload);
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

  const { mutateAsync: hostMarkBookings } = useMutation({
    mutationKey: ["mark_host_bookings", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("mark_host_bookings", payload);
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

  const { mutateAsync: getPropertyPriceRange } = useMutation({
    mutationKey: ["get_property_price_range", "user"],
    mutationFn: async () => {
      try {
        setManualLoading(true);
        const response = await guestApi.get("get_property_price_range");
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
    guestHomeData,
    getPropertyDetails,
    getPropertyReviews,
    guestWishlistData,
    saveItemInWishlist,
    getArticleList,
    createNewWishlist,
    helpCenter,
    getGuideList,
    getSavedItemsInWishlist,
    deleteWishlist,
    removeItemFromWishlist,
    getAllSavedCard,
    saveCardStripe,
    setPrefferCard,
    deleteSavedCard,
    getSavedAddress,
    bookHostProverty,
    homeDataFilters,
    showMap,
    setShowMap,
    get_booking_extension_time_amount,
    guestNotifications,
    hostNotifications,
    markNotification,
    removeNotification,
    cancelBooking,
    joinNewsLetter,
    host_listing,
    filter_host_reviews,
    check_host_property_availability,
    getGuideDetail,
    getArticleDetails,
    guestUnReadBookings,
    guestMarkBookings,
    hostUnReadBookings,
    hostMarkBookings,
    getPropertyPriceRange,
  };
}
