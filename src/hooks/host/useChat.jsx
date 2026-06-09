import { useMutation } from "@tanstack/react-query";

import { useState } from "react";
import { guestApi } from "../../utils/api";
import { LogoutError } from "../../config/Constant";
import { toast } from "react-toastify";

export default function useChat() {
  const [manualLoading, setManualLoading] = useState(false);

  const { mutateAsync: getTwilioToken } = useMutation({
    mutationKey: ["chat_token", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("chat_token", payload);
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

        LogoutError(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  //get_user_channels

  const { mutateAsync: getChannelUser } = useMutation({
    mutationKey: ["get_user_channels", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("get_user_channels", payload);
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
          // LogoutError();
        }
        LogoutError(errorMessage);
        // toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  }); //

  const { mutateAsync: JoinChannel } = useMutation({
    mutationKey: ["join_channel", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("join_channel", payload);
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
          // LogoutError();
        }
        LogoutError(errorMessage);
        // toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: muteUmuteUser } = useMutation({
    mutationKey: ["mute_chat", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("mute_chat", payload);
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
          // LogoutError();
        }
        LogoutError(errorMessage);
        // toast.error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  const { mutateAsync: blockUnblockUser } = useMutation({
    mutationKey: ["block_user", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("block_user", payload);
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
          // LogoutError();
        }
        // toast.error(errorMessage);
        LogoutError(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: archieveUnarchieveUser } = useMutation({
    mutationKey: ["toggle_archive_unarchive", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "toggle_archive_unarchive",
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
          // LogoutError();
        }
        // toast.error(errorMessage);
        LogoutError(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: deleteChatUser } = useMutation({
    mutationKey: ["delete_chat", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("delete_chat", payload);
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
          // LogoutError();
        }
        // toast.error(errorMessage);
        LogoutError(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: favoriteChatUser } = useMutation({
    mutationKey: ["mark_favorite_chat", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("mark_favorite_chat", payload);
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
          // LogoutError();
        }
        // toast.error(errorMessage);
        LogoutError(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: getReportList } = useMutation({
    mutationKey: ["list_report_reasons", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.get("list_report_reasons", payload);
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
          // LogoutError();
        }
        // toast.error(errorMessage);
        LogoutError(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  const { mutateAsync: reportUser } = useMutation({
    mutationKey: ["report_chat", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post("report_chat", payload);
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
          // LogoutError();
        }
        // toast.error(errorMessage);
        LogoutError(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const { mutateAsync: saveChatTimeStamp } = useMutation({
    mutationKey: ["save_channel_timestamps", "user"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          "save_channel_timestamps",
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
          // LogoutError();
        }
        // toast.error(errorMessage);
        LogoutError(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const isLoading = manualLoading;
  return {
    isLoading,
    getChannelUser,
    getTwilioToken,
    JoinChannel,
    muteUmuteUser,
    blockUnblockUser,
    archieveUnarchieveUser,
    deleteChatUser,
    favoriteChatUser,
    getReportList,
    reportUser,
    saveChatTimeStamp,
  };
}
