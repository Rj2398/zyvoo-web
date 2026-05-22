import { toast } from "react-toastify";
import { LogoutError } from "../config/Constant";
import { api } from "../utils/api";

export default function useContent() {
  const { mutateAsync: searchData } = useMutation({
    mutationKey: [`signup_email`, "logout"],
    mutationFn: async (payload) => {
      try {
        setManualLoading(true);
        const response = await api.post("signup_email", payload);

        const { data } = response;

        if (data?.data) {

          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 1000);
        }

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        const errorMessage =
          error.response?.data?.message || // Custom error from API
          error.message || // Default error message
          "An unknown error occurred";
        if (error?.response?.data?.message == "Unauthenticated.") {
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
    searchData,
  };
}
