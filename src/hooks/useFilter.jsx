// import { guestApi } from "../utils/api";

// const { mutateAsync: guestHomeData } = useMutation({
//     mutationKey: ["get_home_data", "user"],
//     mutationFn: async (payload) => {
//       try {
//         setManualLoading(true);
//         const response = await guestApi.post("get_home_data", payload);
//         const { data } = response;
//         if (data?.data) {
//           setTimeout(() => {
//             dispatch(setGuestHome(data?.data));
//           }, 1000);
//         }

//         return {
//           ...data,
//           message: data?.message,
//         };
//       } catch (error) {
//         const errorMessage =
//           error.response?.data?.message ||
//           error.message ||
//           "An unknown error occurred";
//         throw new Error(errorMessage);
//       } finally {
//         setManualLoading(false);
//       } 
//     },
//   });
