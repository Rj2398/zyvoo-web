// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Card, Button, Image, Dropdown, FormControl, InputGroup, Container, Modal, Form, } from "react-bootstrap";
// import { PiClockCountdownFill } from "react-icons/pi";
// import { LuSend } from "react-icons/lu";
// import { ImAttachment } from "react-icons/im";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Client as TwilioClient } from "@twilio/conversations";

// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import { FaSearch, FaCaretDown, FaStar, FaRegStar } from "react-icons/fa";
// import useBook from "../../hooks/host/useBook";
// import { KEYS, imageBase } from "../../config/Constant";
// import useChat from "../../hooks/host/useChat";
// import { Client as ConversationsClient } from "@twilio/conversations";
// import useCommon from "../../hooks/useCommon";
// import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
// import ReportBookingModal from "../../components/host/ReportBookingModal";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { IoSearch } from "react-icons/io5";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import { containsInappropriateWord } from "../../config/ReusableFn";

// const HostChat = () => {
//   const { getTwilioToken, getChannelUser, JoinChannel, muteUmuteUser, blockUnblockUser, archieveUnarchieveUser, deleteChatUser, favoriteChatUser, reportUser, getReportList, isLoading, saveChatTimeStamp } = useChat();
//   const { hostMarkBookings } = useCommon();
//   const { fetchGuestReview } = useBook();
//   const navigate = useNavigate();
//   const { userInfo } = useSelector(({ user }) => user)
//   const profileData = useSelector((state) => state.profile);

//   const location = useLocation();
//   const [targetUser, setTargetUser] = useState(null);
//   const [targetUserStatus, setTargetUserStatus] = useState("offline");
//   const selectedMsg = location?.state?.selectedReason;
//   const senderDetail = (location?.state?.data?.sender_detail || location?.state?.sender_detail);
//   const property_id = (location?.state?.data?.property_id || location?.state?.property_id);
//   const fallbackImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"

//   const [showDropdown, setShowDropdown] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [showSearch, setShowSearch] = useState(false);
//   const [showModal, setShowModal] = useState(false); // For show the dropdown of chat option
//   const [showReportForm, setShowReportForm] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState("All Conversations");
//   const [twilioToken, setTwilioToken] = useState(null)
//   const sendChannelOnceRef = useRef(false); // Place this in your React component
//   const [guestReview, setGuestReview] = useState(null)
//   const hasSentAutoMessage = useRef(false);
//   const isInitializingRef = useRef(false); // ADD THIS LINE
//   const twilioClientRef = useRef(null); // ADD THIS LINE TOO
//   const [getList, setGetList] = useState([]);
//   // console.log(getList, "getList@@@")
//   const [searchQuery, setSearchQuery] = useState("");
//   const [twilioLoading, setTwilioLoading] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [chatClient, setChatClient] = useState(null); // Fixed state variable
//   const [channel, setChannel] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");

//   const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO)) || JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
//   const userTypes = localStorage.getItem(KEYS.USER_TYPE);


//   const userId = userInfo?.user_id ? String(userInfo?.user_id) : null || userData?.user_id ? String(userData?.user_id) : null;
//   const messagesContainerRef = React.useRef(null);

//   // NEW STATES FOR FIXES
//   const [lastMessages, setLastMessages] = useState({});
//   const [unreadStatus, setUnreadStatus] = useState({});
//   const [userStatuses, setUserStatuses] = useState({});
//   const [conversationTimestamps, setConversationTimestamps] = useState({});

//   const scrollToBottom = () => {
//     const container = messagesContainerRef.current;
//     if (container) {
//       container.scrollTop = container.scrollHeight; // ✅ Scrolls only the container
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Fetch user list
//   useEffect(() => {
//     getUserList();
//     if (selectedBooking) {
//       guestReviewDetail(selectedBooking)
//     }
//   }, [senderDetail, userId, userTypes]);

//   const guestReviewDetail = async (data) => {
//     if (userTypes == "host") {
//       const response = await fetchGuestReview({ user_id: data?.sender_id })
//       // const response = await fetchGuestReview({user_id : data?.receiver_id})

//       if (response?.success) {
//         setGuestReview(response?.data?.total_rating)
//       }
//     }
//   }

//   const getUserList = async () => {
//     try {
//       if (!senderDetail?.user_id && !senderDetail?.host_id) {
//         const response = await getChannelUser({
//           user_id: String(userId),
//           type: userTypes,
//         });
//         if (response?.data) {
//           setGetList(response.data);
//         } else {
//           setGetList([]);
//           setSelectedBooking(null)
//         }
//       } else {
//         // If sender detail exists, filter for specific user
//         const response = await getChannelUser({
//           user_id: String(userId),
//           type: userTypes,
//         });
//         if (response?.data) {
//           setGetList(response.data);
//         }
//       }
//     } catch (error) {
//       setGetList([]);
//       console.error("Error fetching user list:", error);
//     }
//   };

//   useEffect(() => {
//     const markMessagesRead = async () => {
//       if (!userData || !userData.user_id) return;
//       const response = await getTwilioToken({
//         user_id: String(userData.user_id),
//         role: userTypes || "host",
//       });
//       setTwilioToken(response?.data?.token)

//       // const client = await ConversationsClient.create(response?.data?.token);

//       const client = new ConversationsClient(response?.data?.token);

//       // Wait for client to be initialized
//       await new Promise((resolve, reject) => {
//         client.on('stateChanged', (state) => {
//           if (state === 'initialized') {
//             resolve();
//           } else if (state === 'failed') {
//             reject(new Error('Client failed to initialize'));
//           }
//         });
//       });


//       const paginator = await client.getSubscribedConversations();

//       for (const convo of paginator.items) {
//         // This marks all messages as read
//         await convo.setAllMessagesRead();
//       }
//     };

//     markMessagesRead();
//   }, []);

//   // Filter bookings based on search query AND SORT BY LATEST MESSAGE
//   const filteredBookings = useMemo(() => {
//     let filtered = getList || [];

//     // Apply search filter
//     filtered = filtered.filter((booking) =>
//       userTypes == "host"
//         ? booking?.sender_name?.toLowerCase().includes(searchQuery?.toLowerCase())
//         : booking?.receiver_name?.toLowerCase().includes(searchQuery?.toLowerCase())
//     );

//     // filtered = filtered.filter(
//     //   (booking) =>
//     //     booking?.is_blocked !== 1 &&
//     //     (
//     //       userTypes === "host"
//     //         ? booking?.sender_name
//     //         : booking?.receiver_name
//     //     )?.toLowerCase().includes(searchQuery?.toLowerCase())
//     // )

//     if (selectedFilter == "Archived") {    // Apply selected filter logic
//       filtered = filtered.filter((booking) => booking?.is_archived);
//     }

//     // ✅ FIXED: UNREAD FILTER (using unreadStatus state)
//     if (selectedFilter === "Unread") {
//       filtered = filtered.filter((booking) => {
//         return unreadStatus[booking.group_name] === true;
//       });
//     }

//     // ✅ FIXED: SORT BY LATEST MESSAGE TIMESTAMP (most recent first)
//     filtered.sort((a, b) => {
//       const timeA = conversationTimestamps[a.group_name]
//         ? new Date(conversationTimestamps[a.group_name]).getTime()
//         : new Date(a.booking_date || 0).getTime();

//       const timeB = conversationTimestamps[b.group_name]
//         ? new Date(conversationTimestamps[b.group_name]).getTime()
//         : new Date(b.booking_date || 0).getTime();

//       return timeB - timeA; // Latest messages first
//     });

//     // setShowDropdown(false);
//     return filtered;
//   }, [getList, searchQuery, selectedFilter, unreadStatus, conversationTimestamps]);


//   // console.log(filteredBookings, "let get stated ");

//   // NEW: Fetch last messages and unread status
//   // useEffect(() => {
//   //   const fetchConversationDetails = async () => {
//   //     if (!filteredBookings?.length || !twilioToken) return;

//   //     if (!filteredBookings?.length || !twilioToken || isInitializingRef.current) return;

//   //     isInitializingRef.current = true;

//   //     try {
//   //       if (!twilioClientRef.current) {
//   //         twilioClientRef.current = new ConversationsClient(twilioToken);

//   //         // Wait for initialization
//   //         await new Promise((resolve, reject) => {
//   //           twilioClientRef.current.on('stateChanged', (state) => {
//   //             if (state === 'initialized') {
//   //               resolve();
//   //             } else if (state === 'failed') {
//   //               reject(new Error('Twilio client failed to initialize'));
//   //             }
//   //           });
//   //         });
//   //       }

//   //       // const client = twilioClientRef.current;
//   //       const client = await ConversationsClient.create(twilioToken);
//   //       // const client = new ConversationsClient(twilioToken);
//   //       const messagesData = {};
//   //       const statuses = {};
//   //       const unreadData = {};
//   //       const timestamps = {};

//   //       for (const booking of filteredBookings) {
//   //         try {
//   //           const convo = await client.getConversationByUniqueName(booking.group_name);

//   //           // Get the current user's participant info
//   //           const participant = await convo.getParticipantByIdentity(userId);
//   //           const lastReadIndex = participant?.lastReadMessageIndex ?? -1;

//   //           // Get the last message
//   //           const messagesResponse = await convo.getMessages(1);
//   //           const lastMsg = messagesResponse.items[0];

//   //           // Check if unread
//   //           // const isUnread = lastMsg && lastMsg.index > lastReadIndex;
//   //           // Check if unread (only if message is from someone else)
//   //           const isUnread = lastMsg && lastMsg.index > lastReadIndex && lastMsg.author !== userId;

//   //           // Store last message data
//   //           messagesData[booking.group_name] = {
//   //             body: lastMsg?.body || "No message",
//   //             timestamp: lastMsg?.dateCreated ? new Date(lastMsg.dateCreated).toLocaleString() : "N/A",
//   //             unread: isUnread,
//   //             lastMessageDate: lastMsg?.dateCreated || booking.booking_date || new Date(0)
//   //           };

//   //           // Store unread status
//   //           unreadData[booking.group_name] = isUnread;

//   //           // Store timestamp for sorting
//   //           timestamps[booking.group_name] = lastMsg?.dateCreated || booking.booking_date || new Date(0);

//   //           // Get online status for other user
//   //           const otherUserId = userTypes === "host" ? booking.sender_id : booking.receiver_id;
//   //           const otherParticipant = await convo.getParticipantByIdentity(otherUserId);
//   //           const isOnline = otherParticipant?.isOnline ?? false;
//   //           statuses[booking.group_name] = isOnline ? "online" : "offline";

//   //         } catch (err) {
//   //           console.error(`Error fetching conversation for ${booking.group_name}`, err);
//   //           messagesData[booking.group_name] = {
//   //             body: "Error loading",
//   //             timestamp: "N/A",
//   //             unread: false,
//   //             lastMessageDate: booking.booking_date || new Date(0)
//   //           };
//   //           unreadData[booking.group_name] = false;
//   //           timestamps[booking.group_name] = booking.booking_date || new Date(0);
//   //         }
//   //       }

//   //       setLastMessages(messagesData);
//   //       setUnreadStatus(unreadData);
//   //       setUserStatuses(statuses);
//   //       setConversationTimestamps(timestamps);
//   //     } catch (err) {
//   //       console.error("Error initializing Twilio Conversations client:", err);
//   //     }
//   //   };

//   //   fetchConversationDetails();
//   // }, [filteredBookings, twilioToken, userId, userTypes]);


//   useEffect(() => {
//     const fetchConversationDetails = async () => {
//       if (!filteredBookings?.length || !twilioToken || isInitializingRef.current) return;

//       isInitializingRef.current = true;

//       try {
//         // Initialize Twilio client if not already done
//         if (!twilioClientRef.current) {
//           twilioClientRef.current = new ConversationsClient(twilioToken);

//           // Wait for initialization
//           await new Promise((resolve, reject) => {
//             twilioClientRef.current.on('stateChanged', (state) => {
//               if (state === 'initialized') {
//                 resolve();
//               } else if (state === 'failed') {
//                 reject(new Error('Twilio client failed to initialize'));
//               }
//             });
//           });
//         }

//         const client = twilioClientRef.current;
//         const messagesData = {};
//         const statuses = {};
//         const unreadData = {};
//         const timestamps = {};

//         for (const booking of filteredBookings) {
//           try {
//             const convo = await client.getConversationByUniqueName(booking.group_name);

//             // Get the current user's participant info
//             const participant = await convo.getParticipantByIdentity(userId);
//             const lastReadIndex = participant?.lastReadMessageIndex ?? -1;

//             // Get the last message
//             const messagesResponse = await convo.getMessages(1);
//             const lastMsg = messagesResponse.items[0];

//             // Check if unread (only if message is from someone else)
//             const isUnread = lastMsg && lastMsg.index > lastReadIndex && lastMsg.author !== userId;

//             // Store last message data
//             messagesData[booking.group_name] = {
//               body: lastMsg?.body || "No message",
//               timestamp: lastMsg?.dateCreated ? new Date(lastMsg.dateCreated).toLocaleString() : "N/A",
//               unread: isUnread,
//               lastMessageDate: lastMsg?.dateCreated || booking.booking_date || new Date(0)
//             };

//             // Store unread status
//             unreadData[booking.group_name] = isUnread;

//             // Store timestamp for sorting
//             timestamps[booking.group_name] = lastMsg?.dateCreated || booking.booking_date || new Date(0);

//             // Get online status for other user
//             const otherUserId = userTypes === "host" ? booking.sender_id : booking.receiver_id;
//             const otherParticipant = await convo.getParticipantByIdentity(otherUserId);
//             const isOnline = otherParticipant?.isOnline ?? false;
//             statuses[booking.group_name] = isOnline ? "online" : "offline";

//           } catch (err) {
//             console.error(`Error fetching conversation for ${booking.group_name}`, err);
//             messagesData[booking.group_name] = {
//               body: "No messages yet",
//               timestamp: "N/A",
//               unread: false,
//               lastMessageDate: booking.booking_date || new Date(0)
//             };
//             unreadData[booking.group_name] = false;
//             timestamps[booking.group_name] = booking.booking_date || new Date(0);
//           }
//         }

//         setLastMessages(messagesData);
//         setUnreadStatus(unreadData);
//         setUserStatuses(statuses);
//         setConversationTimestamps(timestamps);

//         isInitializingRef.current = false;
//       } catch (err) {
//         console.error("Error initializing Twilio Conversations client:", err);
//         isInitializingRef.current = false;
//       }
//     };

//     if (filteredBookings?.length && twilioToken) {
//       fetchConversationDetails();
//     }
//   }, [filteredBookings, twilioToken, userId, userTypes]);


//   useEffect(() => {
//     let isMounted = true;

//     if (selectedBooking) {
//       guestReviewDetail(selectedBooking)
//     }

//     const initializeChat = async () => {
//       try {
//         const targetUserId = selectedBooking
//           ? userTypes == "host" ? selectedBooking.sender_id : selectedBooking.receiver_id
//           : senderDetail?.user_id || senderDetail?.host_id;
//         const targetPropertyId = property_id || selectedBooking?.property_id;

//         if (property_id) {
//           if (!targetUserId || !targetPropertyId) {

//             return;
//           }
//         }

//         // Get fresh token
//         const response = await getTwilioToken({
//           user_id: String(userId),
//           role: userTypes || "host",
//         });

//         if (!response?.data?.token) {
//           console.error("Failed to get Twilio token");
//           return;
//         }

//         // Clean up existing client
//         if (chatClient) {
//           await chatClient.shutdown();
//           setChatClient(null);
//           setChannel(null);
//         }

//         // Initialize new client
//         const client = new TwilioClient(response?.data?.token);

//         client.on("stateChanged", async (state) => {
//           if (state == "initialized" && isMounted) {
//             setChatClient(client);
//             try {
//               const chatChannel = await getOrCreateChannel(
//                 client,
//                 String(targetUserId),
//                 String(userId),
//                 String(targetPropertyId)
//               );
//               if (chatChannel && isMounted) {
//                 setChannel(chatChannel);
//                 setMessages([]);

//                 // ✅ Update unread status when selecting a conversation
//                 if (chatChannel.uniqueName) {
//                   setUnreadStatus(prev => ({
//                     ...prev,
//                     [chatChannel.uniqueName]: false
//                   }));
//                 }
//               }
//             } catch (error) {
//               console.error("Channel creation error:", error);
//             }
//           }
//         });
//         const user = await client.getUser(targetUserId);
//         setTargetUser(user);
//         setTargetUserStatus(user.isOnline ? "Online" : "Offline");


//         user.on("updated", ({ user: updatedUser, updateReasons }) => {
//           if (updateReasons.includes("reachabilityOnline")) {
//             const newStatus = updatedUser.isOnline ? "Online" : "Offline";
//             setTargetUserStatus(newStatus);

//           }
//         });

//         client.on("connectionError", (error) => {
//           console.error("Twilio connection error:", error);
//         });

//         client.on("tokenAboutToExpire", async () => {
//           try {
//             const newToken = await getTwilioToken({
//               user_id: String(userId),
//               role: userTypes || "host",
//             });
//             if (newToken?.data?.token) {
//               await client.updateToken(newToken.data.token);
//             }
//           } catch (error) {
//             console.error("Token refresh error:", error);
//           }
//         });
//       } catch (error) {
//         console.error("Chat initialization error:", error);
//       }
//     };

//     initializeChat();

//     return () => {
//       isMounted = false;
//       if (chatClient) {
//         chatClient.shutdown();
//       }

//       if (targetUser) {
//         targetUser.removeAllListeners("updated");
//       }
//     };
//   }, [selectedBooking, userId, userTypes, property_id]); // Update dependencies

//   const getOrCreateChannel = async (client, guestId, hostId, propertyId) => {
//     try {
//       if (!client || !guestId || !hostId || !propertyId) {
//         console.error("Missing required parameters for channel creation");
//         return null;
//       }

//       // Create channel name based on senderDetail presence
//       let channelName;
//       if (senderDetail && !selectedBooking?.group_name) {
//         // If senderDetail exists but no group_name found in getList
//         channelName = `ZYVOOPROJ_${Math.min(guestId, hostId)}_${Math.max(
//           guestId,
//           hostId
//         )}_${propertyId}`;
//       } else {
//         // Use existing group_name if available
//         channelName = selectedBooking?.group_name ||
//           `ZYVOOPROJ_${Math.min(guestId, hostId)}_${Math.max(guestId, hostId)}_${propertyId}`;
//       }

//       let chatChannel;
//       let retryCount = 0;
//       const maxRetries = 1;

//       while (retryCount < maxRetries) {
//         try {
//           chatChannel = await client.getConversationByUniqueName(channelName);
//           break;
//         } catch (error) {
//           console.error("Error getting channel:", error);
//           try {
//             chatChannel = await client.createConversation({
//               uniqueName: channelName,
//               friendlyName: `Chat for Property ${propertyId}`,
//             });
//             break;
//           } catch (createError) {
//             console.error("Error creating channel:", createError);
//             if (
//               createError.message.includes("Conflict") &&
//               retryCount < maxRetries - 1
//             ) {
//               await new Promise((resolve) => setTimeout(resolve, 1000));
//               retryCount++;
//               continue;
//             }
//             throw createError;
//           }
//         }
//       }

//       if (!chatChannel) {
//         console.error("Failed to get or create channel after retries");
//         return null;
//       }

//       const addParticipant = async (identity) => {
//         let attempts = 0;
//         while (attempts < 3) {
//           try {
//             const participants = await chatChannel.getParticipants();
//             const isAlreadyParticipant = participants.some(
//               (p) => p.identity == identity
//             );

//             if (!isAlreadyParticipant) {
//               await chatChannel.add(identity);
//             }
//             return true;
//           } catch (error) {
//             if (error.message.includes("Conflict") && attempts < 2) {
//               await new Promise((resolve) => setTimeout(resolve, 1000));
//               attempts++;
//               continue;
//             }
//             console.warn(`Failed to add participant ${identity}:`, error);
//             return false;
//           }
//         }
//       };

//       // Try to add both participants
//       await Promise.all([addParticipant(guestId), addParticipant(hostId)]);

//       // Try to join the channel
//       try {
//         if (!chatChannel.joined) {
//           await chatChannel.join();
//         }
//       } catch (joinError) {
//         console.warn("Error joining channel:", joinError);
//       }

//       // Notify backend about the channel
//       try {
//         if (property_id && !sendChannelOnceRef.current) {
//           sendChannelOnceRef.current = true;

//           await sendCreatedChannel({
//             guestId,
//             hostId,
//             channelName,
//           });
//         }
//       } catch (error) {
//         console.warn("Error notifying backend about channel:", error);
//       }

//       return chatChannel;
//     } catch (error) {
//       console.error("Channel creation/joining error:", error);
//       return null;
//     }
//   };

//   const sendCreatedChannel = async ({ guestId, hostId, channelName }) => {
//     try {
//       // Join the channel from backend
//       const response = await JoinChannel({
//         senderId: userTypes === "host" ? guestId : userId,
//         receiverId: userTypes === "host" ? userId : guestId,
//         groupChannel: channelName,
//         userType: String(userTypes) || "host",
//       });

//       if (!response) return;

//       // Fetch the list of channels for the current user
//       const channelResponse = await getChannelUser({
//         user_id: String(userId),
//         type: userTypes,
//       });

//       const channels = channelResponse?.data || [];

//       // Try to find the booking that matches current property_id
//       const matchedBooking = channels.find((item) => {
//         const groupParts = item?.group_name?.split('_');
//         const groupPropertyId = parseInt(groupParts?.[groupParts.length - 1]);
//         return groupPropertyId == property_id;
//       });

//       // Update chat list and selected booking
//       setGetList(channels);
//       setSelectedBooking(matchedBooking || channels[0]); // fallback to first if not found
//     } catch (error) {
//       console.error("Backend channel creation error:", error);
//     }
//   };

//   useEffect(() => {
//     if (channel) {
//       const loadMessages = async () => {
//         setTwilioLoading(true);
//         try {
//           const messagesResponse = await channel.getMessages(30);

//               // FIX: Sort messages by date (oldest first for proper display)
//     // const sortedMessages = messagesResponse.items.sort(
//     //   (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated)
//     // );
    
//           const processedMessages = await Promise.all(
//             messagesResponse.items.map(async (msg) => {
//               const messageAuthor = msg.author || userId;
//               const baseMsg = {
//                 ...msg,
//                 state: { ...msg.state, author: messageAuthor },
//                 isMyMessage: messageAuthor == userId,
//                 body: msg.body,
//               };

//               if (msg.type == "media" && msg.media) {
//                 try {
//                   const mediaUrl = await msg.media.getContentTemporaryUrl();
//                   return {
//                     ...baseMsg,
//                     mediaUrl,
//                     type: "media",
//                   };
//                 } catch (error) {
//                   console.warn("Error fetching media URL:", error);
//                   return { ...baseMsg, type: "text", };
//                 }
//               }
//               return {
//                 ...baseMsg,
//                 type: "text",
//               };
//             })
//           );

//           setMessages(processedMessages);

//           // ✅ Mark all messages as read when loading the conversation
//           await channel.setAllMessagesRead();

//           // ✅ Update unread status for this conversation
//           if (channel.uniqueName) {
//             setUnreadStatus(prev => ({
//               ...prev,
//               [channel.uniqueName]: false
//             }));

//             // ✅ Update timestamp for sorting
//             if (processedMessages.length > 0) {
//               const lastMsg = processedMessages[processedMessages.length - 1];
//               setConversationTimestamps(prev => ({
//                 ...prev,
//                 [channel.uniqueName]: lastMsg.dateCreated || new Date()
//               }));
//             }
//           }

//         } catch (error) {
//           console.error("Error loading messages:", error);
//         }
//         setTwilioLoading(false);
//       };

//       loadMessages();

//       // Update real-time message handler
//       const messageHandler = async (newMessage) => {
//         try {
//           if (newMessage.author == userId) {
//             return;
//           }

//           const messageAuthor = newMessage.author;
//           const baseMsg = {
//             ...newMessage,
//             state: {
//               ...newMessage.state,
//               author: messageAuthor,
//             },
//             isMyMessage: false,
//             body: newMessage.body,
//           };

//           // ✅ Update unread status when receiving new message
//           if (channel.uniqueName) {
//             setUnreadStatus(prev => ({
//               ...prev,
//               [channel.uniqueName]: true
//             }));

//             // ✅ Update timestamp for sorting
//             setConversationTimestamps(prev => ({
//               ...prev,
//               [channel.uniqueName]: newMessage.dateCreated || new Date()
//             }));
//           }

//           if (newMessage.type == "media" && newMessage.media) {
//             const mediaUrl = await newMessage.media.getContentTemporaryUrl();
//             setMessages((prev) => [
//               ...prev,
//               {
//                 ...baseMsg,
//                 mediaUrl,
//                 type: "media",
//               },
//             ]);
//           } else {
//             setMessages((prev) => [
//               ...prev,
//               {
//                 ...baseMsg,
//                 type: "text",
//               },
//             ]);
//           }
//         } catch (error) {
//           console.error("Error handling new message:", error);
//         }
//       };

//       const onAttributesUpdated = (updatedChannel) => {
//         const blockedUsers = updatedChannel.attributes?.blockedUsers || {};
//         const amIBlocked = blockedUsers[String(userId)] === true;

//         setSelectedBooking(prev => ({ ...prev, is_other_block: amIBlocked ? 1 : 0 }));

//         if (amIBlocked) {
//           toast.error("You have been blocked");
//         } else {
//           toast.success("You have been unblocked");
//         }
//       };

//       channel.on("attributesUpdated", onAttributesUpdated);
//       channel.on("messageAdded", messageHandler);
//       return () => {
//         channel.removeListener("messageAdded", messageHandler);
//         channel.off("attributesUpdated", onAttributesUpdated);
//       };
//     }
//   }, [channel, userId]);

//   const handleSendMessageClick = async () => {
//     const myIdentity = String(userId);
//     const isBlocked = await checkIfBlocked(channel, myIdentity);
//     if (selectedBooking?.is_other_block === 1 || isBlocked) {
//       // if (isBlocked) {
//         toast.error("You are blocked");
//         return;
//       // }
//     }

//     // 2. Check for Profanity
//     if (containsInappropriateWord(message)) {
//       toast.error("This message contains inappropriate words and is not allowed");
//       setMessage(""); // Clear the message input field
//       return; // Stop execution
//     }
//     sendMessage();
//   };

//   const checkIfBlocked = (currentChannel, myUserId) => {
//     if (!currentChannel) return true;
//     const blockedUsers = currentChannel.attributes?.blockedUsers || {};

//     return blockedUsers[String(myUserId)] === true;
//   };

//   const sendMessage = async (file = null, autoMessageContent = null) => {
//     if (!channel) {
//       console.error("No active channel");
//       return;
//     }

//     let messageToSend = ""; // Declare a variable to hold the final message content
//     let isAutoMessage = false; // Flag to indicate if it's an auto message

//     // --- New Logic for Automatic Messages ---
//     if (autoMessageContent) {
//       messageToSend = autoMessageContent;
//       isAutoMessage = true; // Set flag for auto message
//     }
//     // --- Existing File Sending Logic ---
//     else if (file) {
//       let tempMessage = null;
//       try {
//         setTwilioLoading(true);

//         tempMessage = {
//           type: "media",
//           isMyMessage: true,
//           state: { author: userId },
//           body: "Media message",
//           dateCreated: new Date(),
//           mediaUrl: URL.createObjectURL(file),
//         };

//         setMessages((prev) => [...prev, tempMessage]);

//         const sentMessage = await channel
//           .sendMessage({
//             contentType: file.type || "application/octet-stream",
//             media: file,
//             type: "media",
//           })
//           .catch((error) => {
//             console.error("Error sending media message:", error);
//             throw error;
//           });

//         await new Promise((resolve) => setTimeout(resolve, 2000));

//         try {
//           if (sentMessage.media) {
//             const mediaUrl = await sentMessage.media.getContentTemporaryUrl();
//             setMessages((prev) =>
//               prev.map((msg) =>
//                 msg == tempMessage
//                   ? { ...msg, mediaUrl, dateCreated: sentMessage.dateCreated }
//                   : msg
//               )
//             );
//           }
//         } catch (mediaError) {
//           console.error("Error getting media URL:", mediaError);
//         }
//       } catch (error) {
//         console.error("Error sending file:", error);
//         if (tempMessage) {
//           setMessages((prev) => prev.filter((msg) => msg !== tempMessage));
//         }
//       } finally {
//         setTwilioLoading(false);
//         document.getElementById("fileUpload").value = "";
//       }
//       return; // Exit after handling file sending
//     }
//     else if (message.trim()) {
//       messageToSend = message.trim();
//       setMessage(""); // Clear the input field for user messages
//     } else {
//       return;
//     }

//     if (messageToSend) {
//       try {
//         setTwilioLoading(true);
//         const sentMessage = await channel
//           .sendMessage(messageToSend)
//           .catch((error) => {
//             console.error("Error sending text message:", error);
//             throw error;
//           });

//         setMessages((prev) => [
//           ...prev,
//           {
//             ...sentMessage,
//             body: messageToSend,
//             type: "text",
//             isMyMessage: true, // You might want to adjust this for auto messages
//             state: { author: userId }, // Or differentiate for auto messages
//           },
//         ]);

//         // ✅ Update timestamp for sorting when sending a message
//         if (channel.uniqueName) {
//           setConversationTimestamps(prev => ({
//             ...prev,
//             [channel.uniqueName]: sentMessage.dateCreated || new Date()
//           }));
//         }

//         // ✅ Don't mark as unread when you send a message
//         if (channel.uniqueName) {
//           setUnreadStatus(prev => ({
//             ...prev,
//             [channel.uniqueName]: false // Keep as read when you send
//           }));
//         }

//       } catch (error) {
//         console.error("Failed to send message:", error);
//         if (!isAutoMessage) {
//           setMessage(messageToSend);
//         }
//       } finally {
//         setTwilioLoading(false);
//       }
//     }
//   };

//   const alreadSend = localStorage.getItem('is_already_sent')

//   useEffect(() => {
//     if (channel && selectedMsg && !hasSentAutoMessage.current) {
//       if (selectedBooking?.is_other_block != 0) {
//         toast.error("you are blocked");
//       } else {
//         if (!alreadSend) {
//           sendMessage(null, selectedMsg);
//           localStorage.setItem("is_already_sent", true)
//         }
//         hasSentAutoMessage.current = true; // Mark as sent after the first successful attempt
//       }
//     }
//   }, [channel, selectedBooking]);

//   useEffect(() => {
//     return () => {
//       localStorage.removeItem("is_already_sent");
//     };
//   }, [location.pathname]);

//   useEffect(() => {
//     return () => {
//       if (twilioClientRef.current) {
//         twilioClientRef.current.shutdown();
//         twilioClientRef.current = null;
//       }
//       isInitializingRef.current = false;
//     };
//   }, []);

//   const handleMuteUnmute = async (data) => {
//     const res = await muteUmuteUser({
//       user_id: userId,
//       group_channel: data?.group_name,
//       mute: data?.is_muted == 1 ? 0 : 1,
//     });
//     if (res?.success) {
//       if (selectedBooking) {
//         setSelectedBooking((prev) => ({
//           ...prev,
//           is_muted: data?.is_muted == 1 ? 0 : 1,
//         }));
//       }
//       getUserList();
//     }
//   };

//   const handleBlockUnblock = async (data) => {
//     const isCurrentlyBlocked = data?.is_blocked === 1;
//     const newBlockStatus = isCurrentlyBlocked ? 0 : 1;

//     const blockerId = userTypes === "host" ? data?.receiver_id : data?.sender_id;

//     const blockedId = userTypes === "host" ? data?.sender_id : data?.receiver_id;

//     // 1️⃣ Update DB (authority)
//     const res = await blockUnblockUser({
//       senderId: blockerId,
//       group_channel: data?.group_name,
//       blockUnblock: newBlockStatus,
//     });

//     if (!res?.success || !channel) return;

//     // 2️⃣ Update Twilio channel attributes (real-time signal)
//     const attributes = channel.attributes || {};
//     const blockedUsers = attributes.blockedUsers || {};

//     if (newBlockStatus === 1) {
//       blockedUsers[String(blockedId)] = true;
//     } else {
//       delete blockedUsers[String(blockedId)];
//     }

//     await channel.updateAttributes({ ...attributes, blockedUsers, });

//     // 3️⃣ Update local UI
//     setSelectedBooking(prev => ({ ...prev, is_blocked: newBlockStatus }));

//     toast.success(newBlockStatus === 1 ? "User blocked" : "User unblocked");
//   };

//   // const handleArchieveUnarchieve = async (data) => {
//   //   const res = await archieveUnarchieveUser({
//   //     user_id: userId,
//   //     group_channel: data?.group_name,
//   //   });
//   //   if (res?.success) {
//   //     // if (selectedBooking) {
//   //     // Update selected booking state
//   //     if (selectedBooking?.group_name === data?.group_name) {
//   //       setSelectedBooking((prev) => ({
//   //         ...prev,
//   //         is_archived: data?.is_archived == 1 ? 0 : 1,
//   //       }));
//   //     }
//   //     getUserList();
//   //   }
//   // };


//   const handleArchieveUnarchieve = async (data) => {
//     const res = await archieveUnarchieveUser({
//       user_id: userId,
//       group_channel: data?.group_name,
//     });

//     if (res?.success) {
//       // Update the specific booking in getList array
//       setGetList(prevList =>
//         prevList.map(booking =>
//           booking.group_name === data?.group_name
//             ? { ...booking, is_archived: data?.is_archived == 1 ? 0 : 1 }
//             : booking
//         )
//       );

//       // Also update selectedBooking if it's the same conversation
//       if (selectedBooking?.group_name === data?.group_name) {
//         setSelectedBooking(prev => ({
//           ...prev,
//           is_archived: data?.is_archived == 1 ? 0 : 1,
//         }));
//       }
//     }
//   };

//   const handleChatDelete = async (data) => {
//     const res = await deleteChatUser({
//       user_id: userTypes == "host" ? data?.receiver_id : data?.sender_id,
//       user_type: userTypes,
//       group_channel: data?.group_name,
//     });
//     if (res.success) {
//       getUserList();
//       toast.success("chat deleted successfully")
//     }
//   };

//   const handleFavoriteUnfavorite = async (data) => {
//     const res = await favoriteChatUser({
//       // senderId: userTypes == "host" ? data?.sender_id :data?.receiver_Id ,
//       senderId: data?.sender_id,
//       favorite: data?.is_favorite == 0 ? 1 : 0,
//       group_channel: data?.group_name,
//     });

//     if (res?.success) {

//       setSelectedBooking((prev) => ({
//         ...prev,
//         is_favorite: data?.is_favorite == 0 ? 1 : 0,
//       }));
//       getUserList();
//     }

//   };

//   const handleReport = async (data, selectedBooking) => {
//     if (data?.additionalDetails) {
//       const res = await reportUser({
//         reporter_id: userId,
//         reported_user_id:
//           userTypes == "host"
//             ? selectedBooking?.sender_id
//             : selectedBooking?.receiver_id,
//         reason: data?.selectedReason,
//         message: data?.additionalDetails,
//       });

//       if (res.status) {
//         getUserList();
//       }
//     }
//   };

//   const formatTimeAgo = (timestamp) => {
//     if (!timestamp) return "";

//     const now = new Date();
//     const then = new Date(timestamp);
//     const diffInSeconds = Math.floor((now - then) / 1000);

//     const minutes = Math.floor(diffInSeconds / 60);
//     const hours = Math.floor(diffInSeconds / 3600);
//     const days = Math.floor(diffInSeconds / (3600 * 24));
//     const months = Math.floor(diffInSeconds / (3600 * 24 * 30));
//     const years = Math.floor(diffInSeconds / (3600 * 24 * 365));

//     if (years >= 1) return `${years} years ago`;
//     if (months >= 1) return `${months} months ago`;
//     if (days >= 1) return `${days} days ago`;
//     if (hours >= 1) return `${hours} hours ago`;
//     if (minutes >= 1) return `${minutes} minutes ago`;

//     return "Just now";
//   };

//   function convertDate(dateStr) {
//     const date = new Date(dateStr);
//     const day = date.getDate().toString().padStart(2, '0');
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const month = monthNames[date.getMonth()];
//     const year = date.getFullYear();
//     return `${day} ${month} ${year}`;
//   }

//   const handleClose = () => {
//     setSelectedBooking(null)
//   }

//   const [isMobileWidth, setIsMobileWidth] = useState(false)

//   useEffect(() => {
//     const checkWindowWidth = () => {
//       setIsMobileWidth(window.innerWidth <= 768);
//     };

//     checkWindowWidth(); // run on mount
//     window.addEventListener('resize', checkWindowWidth);

//     return () => window.removeEventListener('resize', checkWindowWidth);
//   }, []);

//   return (
//     <>
//       <div className="mob-search-filter border-start-0 border-end-0 mob-booking-filter mob-chat-filter">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="mob-search-filter-in">
//                 <div className="mob-search-bar-back">
//                   <form action="" onSubmit={(e) => e.preventDefault()}>
//                     <label>
//                       <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//                       <button type="submit"><i className="fa-regular fa-magnifying-glass"></i></button>
//                     </label>
//                   </form>
//                 </div>
//                 <div className="mob-filter-in ms-auto dropdown">
//                   <a href="#" className="dropdown-toggle" role="button" data-bs-toggle="dropdown"
//                     aria-expanded="false">
//                     <img src="/images/mobile/filters/filter.svg" loading="lazy" alt="" />
//                   </a>
//                   <div className="dropdown-menu">
//                     <ul>
//                       <li><a href="#" onClick={() => setSelectedFilter("All Conversations")} >All Conversations</a></li>
//                       <li><a href="#" onClick={() => setSelectedFilter("Archived")} >Archived</a></li>
//                       <li><a href="#" onClick={() => setSelectedFilter("Unread")} >Unread</a></li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container-fluid mt-lg-4">
//         <div className="d-flex flex-column flex-md-row gap-3" style={!isMobileWidth ? { height: "calc(100vh - 17vh)" } : {}} >
//           <div className="flex-grow p-lg-2" style={{ borderRadius: "8px", overflowY: isMobileWidth ? "" : "auto", height: "100%", }} >
//             {(!showSearch && !isMobileWidth) ? (
//               <div className="d-flex align-items-center justify-content-between">
//                 <div className="d-flex align-items-center gap-2">
//                   <div style={{ fontWeight: "600" }}>{selectedFilter}</div>
//                   <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)} >
//                     <img src={"/images/dropdown.svg"} style={{ cursor: "pointer", width: "12px" }} onClick={() => setShowDropdown(!showDropdown)} />
//                     {/* <RiArrowDropDownLine style={{ cursor: "pointer", marginLeft: 5 }} onClick={() => setShowDropdown (!showDropdown)} /> */}

//                     <Dropdown.Menu show align="end" style={{ marginTop: "0.2rem" }} >
//                       <Dropdown.Item as="button" onClick={() => setSelectedFilter("All Conversations")} >
//                         All Conversations
//                       </Dropdown.Item>

//                       <Dropdown.Item as="button" onClick={() => setSelectedFilter("Archived")} >
//                         Archived
//                       </Dropdown.Item>

//                       <Dropdown.Item as="button" onClick={() => setSelectedFilter("Unread")} >
//                         Unread
//                       </Dropdown.Item>

//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </div>
//                 <IoSearch onClick={() => setShowSearch(true)} style={{ marginRight: 5, fontSize: "20px" }} />
//               </div>
//             ) : (
//               !isMobileWidth && (<InputGroup>
//                 <FormControl type="text"
//                   style={{
//                     outline: "none",
//                     boxShadow: "none",
//                     borderColor: "#e4e4e4",
//                     borderRightColor: "#6c757d",
//                   }}
//                   placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

//                 <Button variant="outline-secondary" onClick={() => {
//                   setShowSearch(false);
//                   setSearchQuery("");
//                 }} >
//                   X
//                 </Button>
//               </InputGroup>)
//             )}

//             {filteredBookings?.length > 0 ? (
//               filteredBookings.map((booking, index) => (
//                 <Card key={index} className={`mt-3 mt-lg-4 ${selectedBooking?.group_name == booking.group_name
//                   ? "border border-black" : ""}`} style={{
//                     cursor: "pointer",
//                     borderRadius: "20px",
//                   }} onClick={() => {
//                     setSelectedBooking(booking);
//                   }} >
//                   <Card.Body>
//                     <div className="d-flex align-items-center">
//                       <div style={{
//                         width: "65px",
//                         height: "60px",
//                         borderRadius: "50%",
//                         border: "2px solid #ccc",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         overflow: "hidden",
//                         backgroundColor: "#fff",
//                         marginRight: "10px",
//                         position: "relative"
//                       }} onClick={(e) => {
//                         e.stopPropagation();

//                         if (userTypes === "guest") {
//                           navigate("/host-listing", { state: { hostId: booking?.receiver_id } });
//                         }
//                       }}>
//                         <Image src={`${imageBase}${userTypes == "host" ? booking?.sender_profile : booking?.receiver_image}`} roundedCircle width="50" height="50" style={{ borderRadius: '50%' }}
//                         />
//                         <div style={{
//                           position: "absolute", bottom: "4px", right: "4px", width: "20px",
//                           height: "20px", borderRadius: "50%", backgroundColor: userStatuses[booking.group_name] == "online" ? "#4AEAB1" : "gray", border: "4px solid white", zIndex: "1"
//                         }} title={userStatuses[booking.group_name]} />
//                       </div>
//                       <div>
//                         <Card.Title style={{ fontSize: isMobileWidth ? "13px" : "15px", width: "99%" }}>
//                           {userTypes == "host" ? booking?.sender_name : booking?.receiver_name}{" "}{isMobileWidth && <br />}
//                           ({booking?.property_title})
//                         </Card.Title>

//                         <Card.Subtitle className="mb-2 text-muted"> {booking.booking_date} </Card.Subtitle>

//                         {/* {console.log(lastMessages[booking.group_name]?.timestamp,"@@@@@@@@@@@")} */}

//                         {lastMessages[booking.group_name]?.timestamp ? (
//                           <div style={{ fontSize: "12px", color: "#b9b9b9" }}>
//                             {/* {formatTimeAgo(lastMessages[booking.group_name]?.timestamp) || ""} */}
//                             {formatTimeAgo(lastMessages[booking.group_name]?.lastMessageDate) || ""}
//                             {/* {console.log(lastMessages[booking.group_name], "lastMessages[booking.group_name]@@@@@")} */}
//                             {/* {console.log(lastMessages[booking.group_name]?.timestamp, "lastMessages[booking.group_name]?.timestamp#####")} */}
//                           </div>
//                         ) : <div style={{ fontSize: "12px", color: "#b9b9b9" }}> Loading... </div>}

//                         {lastMessages[booking.group_name]?.body && (
//                           <p style={{ fontSize: "14px", marginBottom: "0px", fontWeight: lastMessages[booking.group_name]?.unread ? "bold" : "normal" }}>
//                             {lastMessages[booking.group_name].body.split(" ").length > 5 ? lastMessages[booking.group_name].body.split(" ").slice(0, 3).join(" ") + "..." : lastMessages[booking.group_name].body}
//                           </p>
//                         )}
//                       </div>

//                       <div style={{ position: "absolute", top: "10px", right: "0px" }} onClick={(e) => e.stopPropagation()}  >
//                         <Col className="d-flex justify-content-end align-items-center">
//                           {/* <Dropdown show={selectedBooking?.property_id === booking?.property_id && activeDropdown === index}
//                             onToggle={(isOpen) => {
//                               // if (!isSelected) return;   // only selected property can open
//                               setActiveDropdown(isOpen ? index : null);
//                             }}> */}
//                           <Dropdown show={!isMobileWidth ? selectedBooking?.property_id === booking?.property_id && activeDropdown === index : activeDropdown == index}
//                             onToggle={(isOpen) => {
//                               //  if (isMobileWidth && !isSelected) return;   // only 
//                               setActiveDropdown(isOpen ? index : null)
//                             }

//                             } >
//                             <Dropdown.Toggle className="no-caret" variant="link" id="dropdown-custom-components" >
//                               <style> {` .no-caret::after { display: none !important; }`} </style>
//                               <BsThreeDotsVertical size={26} color="#ccc" style={{ backgroundColor: "white" }} />
//                             </Dropdown.Toggle>
//                             <Dropdown.Menu>
//                               <Dropdown.Item as="button" onClick={() => { handleMuteUnmute(selectedBooking || booking) }} >
//                                 {(selectedBooking?.is_muted || booking?.is_muted) ? "Unmute" : "Mute"}
//                               </Dropdown.Item>

//                               <Dropdown.Item as="button" onClick={() => { handleReport(selectedBooking || booking); setShowReportForm(true) }} >
//                                 Report
//                               </Dropdown.Item>

//                               <Dropdown.Item as="button" onClick={() => { handleChatDelete(selectedBooking || booking) }} >
//                                 Delete chat
//                               </Dropdown.Item>

//                               <Dropdown.Item as="button" onClick={() => { handleBlockUnblock(selectedBooking || booking) }} >
//                                 {(selectedBooking?.is_blocked == 1 || booking?.is_blocked == 1) ? "Unblock" : "Block"}
//                               </Dropdown.Item>

//                               <Dropdown.Item as="button" onClick={() => { handleArchieveUnarchieve(selectedBooking || booking) }} >
//                                 {(booking?.is_archived) ? "Unarchived" : "Archived"}



//                               </Dropdown.Item>

//                             </Dropdown.Menu>
//                           </Dropdown>
//                         </Col>
//                       </div>

//                     </div>
//                   </Card.Body>
//                 </Card>
//               ))
//             ) : (
//               <div className="text-center mt-4" style={{ minWidth: "250px" }}> <p className="text-muted">No chatlist found.</p> </div>
//             )}
//           </div>
//           {!isMobileWidth ? <>
//             {/* second row */}
//             {!selectedBooking ? (
//               <div className="w-100 mb-4" style={{ flex: "1 0 400px", overflowY: "auto", height: "100%", }} >
//                 <Container fluid className="border border-2 p-3" style={{ minWidth: "250px", height: "100%" }} >
//                   <div className="h-100 d-flex justify-content-center align-items-center text-center">
//                     {filteredBookings?.length > 0 ? "Please select a User to chat" : "No messages found."}
//                   </div>
//                 </Container>
//               </div>
//             ) : (
//               <div className="flex-grow-1 w-50 h-100" style={{ overflowY: "auto" }}  >
//                 <Container className="border border-2 p-3 h-100" style={{ borderRadius: "10px" }}>
//                   <Row className="d-flex align-items-center border-bottom" style={{ padding: '10px' }}>
//                     <Col className="d-flex align-items-center" >
//                       <div style={{
//                         width: "55px",
//                         height: "55px",
//                         borderRadius: "50%",
//                         border: "2px solid #ccc",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         overflow: "hidden",
//                         backgroundColor: "#fff",
//                         marginRight: "10px",
//                       }} >
//                         <Image src={userTypes == "host" ? imageBase + selectedBooking?.sender_profile ||
//                           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
//                           : imageBase + selectedBooking?.receiver_image ||
//                           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
//                         }
//                           roundedCircle width="50" height="50" />
//                       </div>
//                       <div>
//                         <h5> {userTypes == "host" ? selectedBooking?.sender_name : selectedBooking?.receiver_name}  </h5>
//                         <p style={{ color: "#7DD2B0", margin: "0px" }}>{targetUserStatus}</p>
//                       </div>
//                     </Col>

//                     <Col className="d-flex justify-content-end align-items-center">
//                       <span style={{ border: '1px solid #ccc', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: "center", padding: '7px' }}>
//                         {selectedBooking?.is_favorite == 1 ? <FaStar size={25} style={{ color: '#2ee3a0', }} role="button" onClick={() => handleFavoriteUnfavorite(selectedBooking)} /> :
//                           <FaRegStar size={25} role="button" onClick={() => handleFavoriteUnfavorite(selectedBooking)} />}
//                       </span>
//                       <Dropdown show={showModal} onToggle={() => setShowModal(!showModal)} >
//                         <Dropdown.Toggle className="no-caret" variant="link" id="dropdown-custom-components" >
//                           <style> {` .no-caret::after { display: none !important; }`} </style>
//                           <span style={{ border: '1px solid #ccc', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: "center", padding: '7px' }}>
//                             <BsThreeDots size={25} color="black" />
//                           </span>
//                         </Dropdown.Toggle>

//                         <Dropdown.Menu>
//                           <Dropdown.Item as="button" onClick={() => { handleMuteUnmute(selectedBooking); }} >
//                             {selectedBooking?.is_muted ? "Unmute" : "Mute"}
//                           </Dropdown.Item>

//                           <Dropdown.Item as="button" onClick={() => { handleReport(selectedBooking); setShowReportForm(true) }} >
//                             Report
//                           </Dropdown.Item>

//                           <Dropdown.Item as="button" onClick={() => { handleChatDelete(selectedBooking); }} >
//                             Delete chat
//                           </Dropdown.Item>

//                           <Dropdown.Item as="button" onClick={() => { handleBlockUnblock(selectedBooking); }} >
//                             {selectedBooking?.is_blocked == 1 ? "Unblock" : "Block"}
//                           </Dropdown.Item>

//                           <Dropdown.Item as="button" onClick={() => { handleArchieveUnarchieve(selectedBooking); }} >
//                             {selectedBooking?.is_archived ? "Unarchived" : "Archive"}
//                           </Dropdown.Item>

//                         </Dropdown.Menu>
//                       </Dropdown>
//                     </Col>
//                   </Row>
//                   <Row className="rounded-3 p-3 w-100" style={{ height: "calc(100% - 30%)", }}>
//                     <Col xs={12} className="mb-3 chat-box" style={{ height: "100%", overflowY: "auto", }} ref={messagesContainerRef} >
//                       {twilioLoading ? (
//                         <div className="d-flex justify-content-center align-items-center" style={{ height: "250px", border: "1px solid #E5E5E5" }} >
//                           <div className="spinner-border text-primary" role="status" >
//                             <span className="visually-hidden">Loading...</span>
//                           </div>
//                         </div>
//                       ) : (
//                         <>
//                           {messages.map((msg, index) => {
//                             const isMyMessage = msg.isMyMessage;
//                             const messageDate = msg?.dateCreated || msg?.state?.timestamp || new Date();

//                             const formattedDate = new Date(messageDate).toLocaleString('en-US', {
//                               month: 'short',     // "Jul"
//                               day: 'numeric',     // "20"
//                               year: 'numeric',    // "2023"
//                               hour: 'numeric',    // "11"
//                               minute: '2-digit',  // "32"
//                               hour12: true        // "AM"/"PM"
//                             });


//                             return (
//                               <div key={index} className={`d-flex mb-2 flex-wrap ${isMyMessage ? "justify-content-start" : "justify-content-start"}`} style={{ fontWeight: 'lighter' }} >

//                                 <div className='chat-wrp-main' >
//                                   <div className="chat-single-upr">
//                                     <div className="chat-single-left">
//                                       {!isMyMessage ? (
//                                         <Image src={userTypes == "host" ? imageBase + selectedBooking?.sender_profile || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s" : imageBase + selectedBooking?.receiver_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"}
//                                           roundedCircle width="40" height="40px"
//                                         />
//                                       ) : (<Image src={imageBase + profileData?.profileData?.profile_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"} roundedCircle width="40" height="40px" />
//                                       )}

//                                       {!isMyMessage ? (
//                                         <h3 className="mb-0" style={{ fontSize: '16px', fontWeight: '500' }}>
//                                           {userTypes === "host" ? selectedBooking?.sender_name : `${selectedBooking?.receiver_name}`}
//                                         </h3>
//                                       ) : (
//                                         <h3 className="mb-0" style={{ fontSize: '16px', fontWeight: '500' }}>
//                                           {userTypes === "host" ? `${selectedBooking?.receiver_name}` : selectedBooking?.sender_name}
//                                         </h3>
//                                       )}
//                                     </div>
//                                     <span> {formattedDate} </span>
//                                   </div>

//                                   {msg.type == "media" ? (
//                                     <div className='chat-body'>
//                                       <Image src={msg.mediaUrl} loading="lazy" alt="Sent media" width="200" className="rounded" />
//                                     </div>
//                                   ) : (
//                                     <div className='chat-body' style={{ fontSize: '14px' }}> {msg.body} </div>
//                                   )}
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </>
//                       )}
//                     </Col>
//                     <Col xs={12} className="p-2" style={{ display: "flex", marginBottom: "0%" }}>
//                       {selectedBooking?.is_blocked == 1 ?
//                         <button onClick={() => handleBlockUnblock(selectedBooking)} style={{
//                           width: "100%", backgroundColor: "#4AEAB1", borderRadius: "25px", border: "none", padding: "10px"
//                         }}> Unblock </button> :
//                         <div className="d-flex align-items-center" style={{ width: "100%" }} >
//                           <div className="d-flex align-items-center px-3 flex-grow-1"
//                             style={{ background: "#f7f7f7", borderRadius: "30px", marginRight: "0px", height: "48px" }} >
//                             <input type="file" id="fileUpload" className="d-none"
//                               onChange={(e) => {
//                                 const file = e.target.files[0];
//                                 if (!file) return;

//                                 const allowedTypes = [
//                                   "image/jpeg",
//                                   "image/png",
//                                   "image/jpg",
//                                   "image/webp",
//                                   "image/gif"
//                                 ];

//                                 const maxSizeMB = 5;

//                                 if (!allowedTypes.includes(file.type)) {
//                                   toast.error("Only image files are allowed");
//                                   e.target.value = "";
//                                   return;
//                                 }

//                                 if (file.size > maxSizeMB * 1024 * 1024) {
//                                   toast.error("Image size must be less than 5MB");
//                                   e.target.value = "";
//                                   return;
//                                 }

//                                 sendMessage(file);
//                                 e.target.value = "";
//                               }}
//                             />

//                             <input type="text" className="form-control border-0 bg-transparent flex-grow-1"
//                               placeholder="Type a message..." style={{ boxShadow: "none" }} value={message}
//                               onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {
//                                 if (e.key === "Enter" && !e.shiftKey) {
//                                   e.preventDefault(); // Prevent newline
//                                   handleSendMessageClick()
//                                 }
//                               }
//                               }
//                             />

//                             <label htmlFor="fileUpload" className="ms-2" style={{ cursor: "pointer", color: "#555", flexShrink: 0 }}
//                               onClick={async (e) => {
//                                 const isBlocked = await checkIfBlocked(channel, userId);

//                                 if (selectedBooking?.is_other_block == 1 || isBlocked) {
//                                   e.preventDefault();
//                                   toast.error("You are blocked");
//                                 } else { sendMessage() }
//                               }}>
//                               <ImAttachment />
//                             </label>
//                           </div>

//                           <button className="ms-2 d-flex align-items-center justify-content-center"
//                             style={{
//                               backgroundColor: "#2ee3a0",
//                               border: "none",
//                               borderRadius: "50%",
//                               width: "40px",
//                               height: "40px",
//                               color: "#fff",
//                               flexShrink: 0,

//                             }}
//                             onClick={handleSendMessageClick}
//                             disabled={!message.trim() && !document.getElementById("fileUpload")?.files?.length} >
//                             <img src="images/chat/send.svg" style={{ color: 'white', margin: '5px', width: '20px' }} loading="lazy" alt="" />
//                           </button>
//                         </div>}
//                     </Col>
//                   </Row>
//                 </Container>
//               </div>
//             )}
//             {/* third row  */}
//             {selectedBooking && (
//               <div className="flex-grow-1"
//                 style={{
//                   borderRadius: "8px",
//                   padding: "0rem",
//                   overflowY: "auto",
//                   height: "100%",
//                   minWidth: "285px"
//                 }} >
//                 <Container className="border rounded-3">
//                   <h5 className="mt-3 text-center" style={{ fontWeight: "300", color: '#000000', fontSize: '18px' }}>{userTypes == "host" ? "Guest by" : "Hosted by"}</h5>
//                   <Row className="mb-3 px-3" >
//                     <Col xs={8} className="d-flex align-items-center justify-content-center  border-2  w-100 pb-2 " style={{ marginBottom: '10px' }} >
//                       <div style={{
//                         width: "55px",
//                         height: "55px",
//                         borderRadius: "50%",
//                         border: "2px solid #ccc",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         overflow: "hidden",
//                         backgroundColor: "#fff",
//                         marginRight: "5px",
//                       }} >
//                         <Image src={userTypes == "host" ? imageBase + selectedBooking?.sender_profile : selectedBooking?.receiver_image ? imageBase + selectedBooking?.receiver_image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"}
//                           roundedCircle
//                           width="50" height="50" />
//                       </div>
//                       <div>
//                         <h6 className="mb-0" style={{ color: "black", fontSize: '20px' }}> {userTypes == "host" ? selectedBooking?.sender_name : selectedBooking?.receiver_name} </h6>
//                       </div>
//                       {userTypes == "host" ?
//                         <>
//                           <FaStar className="text-warning mx-1" style={{ marginTop: "-2px" }} />
//                           <span style={{ color: "#FCA800", }}> {guestReview || "0.0"} </span>
//                         </> : (
//                           <>
//                             {selectedBooking?.is_star_host && (<Image src="/images/locations-grid/profile/batch.svg" loading="lazy" alt="Batch" style={{ marginLeft: "5px", width: "30px" }} />)}
//                           </>)}
//                     </Col>



//                   </Row>
//                   <hr style={{ marginTop: '-14px', marginBottom: '30px' }} />

//                   {/* <Row className="mt-3 mb-3 px-3 w-100"> */}
//                   {userTypes == "host" ?
//                     <Button className="border border-1 border-black w-100" variant="light"
//                       onClick={() => navigate("/booking", { state: { bookingId: selectedBooking?.booking_id }, })} style={{ fontSize: "20px", marginTop: '-9px', marginBottom: '16px' }}>
//                       Guest booking
//                     </Button> :
//                     <Button className=" border border-1 border-black w-100" variant="light"
//                       onClick={() => navigate("/host-listing", { state: { hostId: selectedBooking?.receiver_id } })} style={{ fontSize: "20px", marginTop: '-9px', marginBottom: '16px' }}>
//                       Host Properties
//                     </Button>
//                   }
//                   {/* </Row> */}
//                   <div className="d-flex justify-content-center mb-3">
//                     <PiClockCountdownFill size={24} color="#979797" />
//                     <span className="fs-7 ms-2">Typically respond within 1 hr</span>
//                   </div>
//                 </Container>
//                 <Container className="border rounded-3 w-100 p-3 mt-3 d-flex flex-column gap-4">
//                   <Row>
//                     <Col>From</Col>
//                     <Col className="text-end fw-bold"> {selectedBooking?.receiver_address || "Not Available"} </Col>
//                   </Row>
//                   <Row>
//                     <Col>Member Since</Col>
//                     <Col className="text-end"> {convertDate(selectedBooking?.receiver_member_since)} </Col>
//                   </Row>
//                   <Row>
//                     <Col>Language</Col>
//                     <Col className="text-end"> {selectedBooking?.receiver_language?.join(", ") || "Not Available"} </Col>
//                   </Row>
//                 </Container>
//               </div>
//             )}
//           </> :
//             <Modal show={!!selectedBooking} onHide={handleClose} dialogClassName="custom-modal chat-screen-modal custom-modal-css">
//               <Modal.Body className="chat-screen-body">
//                 <div className="chat-screen-header"  >
//                   <span className="chat-screen-back-btn" onClick={handleClose}>
//                     <i className="fa-regular fa-arrow-left"></i>
//                   </span>
//                 </div>

//                 <div className="chat-screen-content">
//                   <Container className="chat-screen-container">
//                     <Row className="chat-screen-top-row">
//                       <Col className="chat-screen-user-col">
//                         <div className="chat-screen-pic-wrapper">
//                           <Image src={userTypes === "host" ? imageBase + (selectedBooking?.sender_profile || fallbackImg)
//                             : imageBase + (selectedBooking?.receiver_image || fallbackImg)
//                           }
//                             roundedCircle width="50" height="50"
//                           />
//                         </div>
//                         <div className="chat-screen-user-info">
//                           <h6 className="chat-screen-username">
//                             {userTypes === "host" ? selectedBooking?.sender_name : selectedBooking?.receiver_name}
//                           </h6>
//                           <p className="chat-screen-status">{targetUserStatus}</p>
//                         </div>
//                       </Col>

//                       <Col className="chat-screen-actions-col">
//                         <span className="chat-screen-fav-btn">
//                           {selectedBooking?.is_favorite == 1 ? (
//                             <FaStar size={25} style={{ color: "#2ee3a0" }} role="button" onClick={() => handleFavoriteUnfavorite(selectedBooking)} />
//                           ) : (
//                             <FaRegStar size={25} role="button"
//                               onClick={() => handleFavoriteUnfavorite(selectedBooking)}
//                             />
//                           )}
//                         </span>

//                         <Dropdown show={showModal} onToggle={() => setShowModal(!showModal)} >
//                           <Dropdown.Toggle className="chat-screen-dropdown-toggle" variant="link" >
//                             <span className="chat-screen-dropdown-icon">
//                               <BsThreeDots size={25} color="black" />
//                             </span>
//                           </Dropdown.Toggle>

//                           <Dropdown.Menu>
//                             <Dropdown.Item as="button" onClick={() => handleMuteUnmute(selectedBooking)}>
//                               {selectedBooking?.is_muted ? "Unmute" : "Mute"}
//                             </Dropdown.Item>

//                             <Dropdown.Item as="button" onClick={() => { handleReport(selectedBooking); }} >
//                               Report
//                             </Dropdown.Item>

//                             <Dropdown.Item as="button" onClick={() => handleChatDelete(selectedBooking)}>
//                               Delete chat
//                             </Dropdown.Item>

//                             <Dropdown.Item as="button" onClick={() => handleBlockUnblock(selectedBooking)}>
//                               {selectedBooking?.is_blocked === 1 ? "Unblock" : "Block"}
//                             </Dropdown.Item>

//                             <Dropdown.Item as="button" onClick={() => handleArchieveUnarchieve(selectedBooking)} >
//                               {selectedBooking?.is_archived ? "Unarchived" : "Archive"}
//                             </Dropdown.Item>
//                           </Dropdown.Menu>
//                         </Dropdown>
//                       </Col>
//                     </Row>

//                     <Row className="chat-screen-messages-row">
//                       <Col xs={12} className="chat-screen-chat-box" ref={messagesContainerRef} >
//                         {twilioLoading ? (
//                           <div className="chat-screen-loading">
//                             <div className="spinner-border text-primary" role="status">
//                               <span className="visually-hidden">Loading...</span>
//                             </div>
//                           </div>
//                         ) : (
//                           messages.map((msg, index) => {
//                             const isMy = msg.isMyMessage;
//                             const messageDate = msg?.dateCreated || msg?.state?.timestamp || new Date();
//                             const formattedDate = new Date(messageDate).toLocaleString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                               hour: "numeric",
//                               minute: "2-digit",
//                               hour12: true,
//                             });

//                             return (
//                               <div key={index} className="chat-screen-message-row">
//                                 <div className="chat-screen-message-container">
//                                   <div className="chat-screen-message-top">
//                                     <div className="chat-screen-message-user">
//                                       <Image src={
//                                         !isMy ? userTypes === "host" ? imageBase + (selectedBooking?.sender_profile || fallbackImg)
//                                           : imageBase + (selectedBooking?.receiver_image || fallbackImg)
//                                           : imageBase + (profileData?.profileData?.profile_image || fallbackImg)
//                                       }
//                                         roundedCircle width="40" height="40"
//                                       />
//                                       <h3 className="chat-screen-message-username">
//                                         {!isMy ? userTypes === "host" ? selectedBooking?.sender_name : selectedBooking?.receiver_name
//                                           : userTypes === "host" ? selectedBooking?.receiver_name : selectedBooking?.sender_name}
//                                       </h3>
//                                     </div>
//                                     <span className="chat-screen-message-date"> {formattedDate} </span>
//                                   </div>

//                                   {msg.type === "media" ? (
//                                     <div className="chat-screen-message-body">
//                                       <Image src={msg.mediaUrl} loading="lazy" alt="media" width="200" className="rounded" />
//                                     </div>
//                                   ) : (
//                                     <div className="chat-screen-message-body">{msg.body}</div>
//                                   )}
//                                 </div>
//                               </div>
//                             );
//                           })
//                         )}
//                       </Col>

//                       <Col xs={12} className="chat-screen-input-row">
//                         {selectedBooking?.is_blocked === 1 ? (
//                           <button className="chat-screen-unblock-button" onClick={() => handleBlockUnblock(selectedBooking)} >
//                             Unblock
//                           </button>
//                         ) : (
//                           <div className="chat-screen-input-wrapper">
//                             <div className="chat-screen-input-area">
//                               <input type="file" id="chat-screen-file" className="d-none"
//                                 onChange={(e) => {
//                                   const file = e.target.files[0];
//                                   if (!file) return;

//                                   const allowedTypes = [
//                                     "image/jpeg",
//                                     "image/png",
//                                     "image/jpg",
//                                     "image/webp",
//                                     "image/gif"
//                                   ];

//                                   const maxSizeMB = 5;

//                                   if (!allowedTypes.includes(file.type)) {
//                                     toast.error("Only image files are allowed");
//                                     e.target.value = "";
//                                     return;
//                                   }

//                                   if (file.size > maxSizeMB * 1024 * 1024) {
//                                     toast.error("Image size must be less than 5MB");
//                                     e.target.value = "";
//                                     return;
//                                   }

//                                   sendMessage(file);
//                                   e.target.value = "";
//                                 }}
//                               />
//                               <label htmlFor="chat-screen-file" className="chat-screen-file-label"
//                                 onClick={async (e) => {
//                                   const isBlocked = await checkIfBlocked(channel, userId);

//                                   if (selectedBooking?.is_other_block === 1 || isBlocked) {
//                                     e.preventDefault();
//                                     toast.error("You are blocked")
//                                   } else {
//                                     sendMessage();
//                                   }
//                                 }} >
//                                 <ImAttachment />
//                               </label>
//                               <input type="text" className="chat-screen-text-input form-control" style={{ padding: isMobileWidth ? "10px" : "15px", border: "1px solid #000", borderRadius: "10px" }} placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)}
//                                 onKeyDown={(e) => {
//                                   if (e.key === "Enter" && !e.shiftKey) {
//                                     e.preventDefault();
//                                     handleSendMessageClick()
//                                   }
//                                 }}
//                               />
//                             </div>
//                             <button className="chat-screen-send-button" onClick={() => {
//                               handleSendMessageClick()
//                             }}
//                               disabled={!message.trim() && !document.getElementById("chat-screen-file")?.files?.length} >
//                               <img src="images/chat/send.svg" style={{ color: 'white', height: isMobileWidth ? "20px" : "" }} />
//                             </button>
//                           </div>
//                         )}
//                       </Col>
//                     </Row>
//                   </Container>
//                 </div>
//               </Modal.Body>
//             </Modal>
//           }
//         </div>
//       </div>
//       <ReportBookingModal show={showReportForm} handleClose={() => setShowReportForm(false)}
//         user_id={userId} booking_id={selectedBooking?.booking_id}
//         property_id={selectedBooking?.property_id}
//       />
//     </>
//   );
// };

// export default HostChat;






import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, Button, Image, Dropdown, FormControl, InputGroup, Container, Modal, Form, } from "react-bootstrap";
import { PiClockCountdownFill } from "react-icons/pi";
import { LuSend } from "react-icons/lu";
import { ImAttachment } from "react-icons/im";
import { useLocation, useNavigate } from "react-router-dom";
import { Client as TwilioClient } from "@twilio/conversations";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaSearch, FaCaretDown, FaStar, FaRegStar } from "react-icons/fa";
import useBook from "../../hooks/host/useBook";
import { KEYS, imageBase } from "../../config/Constant";
import useChat from "../../hooks/host/useChat";
import { Client as ConversationsClient } from "@twilio/conversations";
import useCommon from "../../hooks/useCommon";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import ReportBookingModal from "../../components/host/ReportBookingModal";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoSearch } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { containsInappropriateWord } from "../../config/ReusableFn";

const HostChat = () => {
  const { getTwilioToken, getChannelUser, JoinChannel, muteUmuteUser, blockUnblockUser, archieveUnarchieveUser, deleteChatUser, favoriteChatUser, reportUser, getReportList, isLoading, saveChatTimeStamp } = useChat();
  const { hostMarkBookings } = useCommon();
  const { fetchGuestReview } = useBook();
  const navigate = useNavigate();
  const { userInfo } = useSelector(({ user }) => user)
  const profileData = useSelector((state) => state.profile);

  const location = useLocation();
  const [targetUser, setTargetUser] = useState(null);
  const [targetUserStatus, setTargetUserStatus] = useState("offline");
  const selectedMsg = location?.state?.selectedReason;
  const senderDetail = (location?.state?.data?.sender_detail || location?.state?.sender_detail);
  const property_id = (location?.state?.data?.property_id || location?.state?.property_id);
  const fallbackImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"

  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showModal, setShowModal] = useState(false); // For show the dropdown of chat option
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Conversations");
  const [twilioToken, setTwilioToken] = useState(null)
  const sendChannelOnceRef = useRef(false); // Place this in your React component
  const [guestReview, setGuestReview] = useState(null)
  const hasSentAutoMessage = useRef(false);
  const isInitializingRef = useRef(false); // ADD THIS LINE
  const twilioClientRef = useRef(null); // ADD THIS LINE TOO
  const [getList, setGetList] = useState([]);
  // console.log(getList, "getList@@@")
  const [searchQuery, setSearchQuery] = useState("");
  const [twilioLoading, setTwilioLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [chatClient, setChatClient] = useState(null); // Fixed state variable
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO)) || JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userTypes = localStorage.getItem(KEYS.USER_TYPE);


  const userId = userInfo?.user_id ? String(userInfo?.user_id) : null || userData?.user_id ? String(userData?.user_id) : null;
  const messagesContainerRef = React.useRef(null);

  // NEW STATES FOR FIXES
  const [lastMessages, setLastMessages] = useState({});
  const [unreadStatus, setUnreadStatus] = useState({});
  const [userStatuses, setUserStatuses] = useState({});
  const [conversationTimestamps, setConversationTimestamps] = useState({});

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight; // ✅ Scrolls only the container
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user list
  useEffect(() => {
    getUserList();
    if (selectedBooking) {
      guestReviewDetail(selectedBooking)
    }
  }, [senderDetail, userId, userTypes]);

  const guestReviewDetail = async (data) => {
    if (userTypes == "host") {
      const response = await fetchGuestReview({ user_id: data?.sender_id })
      // const response = await fetchGuestReview({user_id : data?.receiver_id})

      if (response?.success) {
        setGuestReview(response?.data?.total_rating)
      }
    }
  }

  const getUserList = async () => {
    try {
      if (!senderDetail?.user_id && !senderDetail?.host_id) {
        const response = await getChannelUser({
          user_id: String(userId),
          type: userTypes,
        });
        if (response?.data) {
          setGetList(response.data);
        } else {
          setGetList([]);
          setSelectedBooking(null)
        }
      } else {
        // If sender detail exists, filter for specific user
        const response = await getChannelUser({
          user_id: String(userId),
          type: userTypes,
        });
        if (response?.data) {
          setGetList(response.data);
        }
      }
    } catch (error) {
      setGetList([]);
      console.error("Error fetching user list:", error);
    }
  };



    useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getChannelUser({
          user_id: String(userId),
          type: userTypes,
        });

        if (!senderDetail?.user_id && !senderDetail?.host_id) {
          if (response?.data) {
            setGetList(response.data);
          } else {
            setGetList([]);
            setSelectedBooking(null);
          }
        } else {
          if (response?.data) {
            setGetList(response.data);
          } else {
            setGetList([]);
          }
        }
      } catch (error) {
        setGetList([]);
        console.error("Error fetching user list:", error);
      }
    };

    fetchUsers();
  }, [selectedBooking]);

  useEffect(() => {
    const markMessagesRead = async () => {
      if (!userData || !userData.user_id) return;
      const response = await getTwilioToken({
        user_id: String(userData.user_id),
        role: userTypes || "host",
      });
      setTwilioToken(response?.data?.token)

      // const client = await ConversationsClient.create(response?.data?.token);

      const client = new ConversationsClient(response?.data?.token);

      // Wait for client to be initialized
      await new Promise((resolve, reject) => {
        client.on('stateChanged', (state) => {
          if (state === 'initialized') {
            resolve();
          } else if (state === 'failed') {
            reject(new Error('Client failed to initialize'));
          }
        });
      });


      const paginator = await client.getSubscribedConversations();

      for (const convo of paginator.items) {
        // This marks all messages as read
        await convo.setAllMessagesRead();
      }
    };

    markMessagesRead();
  }, []);

  // Filter bookings based on search query AND SORT BY LATEST MESSAGE
  const filteredBookings = useMemo(() => {
    let filtered = getList || [];

    // Apply search filter
    filtered = filtered.filter((booking) =>
      userTypes == "host"
        ? booking?.sender_name?.toLowerCase().includes(searchQuery?.toLowerCase())
        : booking?.receiver_name?.toLowerCase().includes(searchQuery?.toLowerCase())
    );

    // filtered = filtered.filter(
    //   (booking) =>
    //     booking?.is_blocked !== 1 &&
    //     (
    //       userTypes === "host"
    //         ? booking?.sender_name
    //         : booking?.receiver_name
    //     )?.toLowerCase().includes(searchQuery?.toLowerCase())
    // )

    if (selectedFilter == "Archived") {    // Apply selected filter logic
      filtered = filtered.filter((booking) => booking?.is_archived);
    }

    // ✅ FIXED: UNREAD FILTER (using unreadStatus state)
    if (selectedFilter === "Unread") {
      filtered = filtered.filter((booking) => {
        return unreadStatus[booking.group_name] === true;
      });
    }

    // ✅ FIXED: SORT BY LATEST MESSAGE TIMESTAMP (most recent first)
    filtered.sort((a, b) => {
      const timeA = conversationTimestamps[a.group_name]
        ? new Date(conversationTimestamps[a.group_name]).getTime()
        : new Date(a.booking_date || 0).getTime();

      const timeB = conversationTimestamps[b.group_name]
        ? new Date(conversationTimestamps[b.group_name]).getTime()
        : new Date(b.booking_date || 0).getTime();

      return timeB - timeA; // Latest messages first
    });

    // setShowDropdown(false);
    return filtered;
  }, [getList, searchQuery, selectedFilter, unreadStatus, conversationTimestamps]);


  // console.log(filteredBookings, "let get stated ");

  // NEW: Fetch last messages and unread status
  // useEffect(() => {
  //   const fetchConversationDetails = async () => {
  //     if (!filteredBookings?.length || !twilioToken) return;

  //     if (!filteredBookings?.length || !twilioToken || isInitializingRef.current) return;

  //     isInitializingRef.current = true;

  //     try {
  //       if (!twilioClientRef.current) {
  //         twilioClientRef.current = new ConversationsClient(twilioToken);

  //         // Wait for initialization
  //         await new Promise((resolve, reject) => {
  //           twilioClientRef.current.on('stateChanged', (state) => {
  //             if (state === 'initialized') {
  //               resolve();
  //             } else if (state === 'failed') {
  //               reject(new Error('Twilio client failed to initialize'));
  //             }
  //           });
  //         });
  //       }

  //       // const client = twilioClientRef.current;
  //       const client = await ConversationsClient.create(twilioToken);
  //       // const client = new ConversationsClient(twilioToken);
  //       const messagesData = {};
  //       const statuses = {};
  //       const unreadData = {};
  //       const timestamps = {};

  //       for (const booking of filteredBookings) {
  //         try {
  //           const convo = await client.getConversationByUniqueName(booking.group_name);

  //           // Get the current user's participant info
  //           const participant = await convo.getParticipantByIdentity(userId);
  //           const lastReadIndex = participant?.lastReadMessageIndex ?? -1;

  //           // Get the last message
  //           const messagesResponse = await convo.getMessages(1);
  //           const lastMsg = messagesResponse.items[0];

  //           // Check if unread
  //           // const isUnread = lastMsg && lastMsg.index > lastReadIndex;
  //           // Check if unread (only if message is from someone else)
  //           const isUnread = lastMsg && lastMsg.index > lastReadIndex && lastMsg.author !== userId;

  //           // Store last message data
  //           messagesData[booking.group_name] = {
  //             body: lastMsg?.body || "No message",
  //             timestamp: lastMsg?.dateCreated ? new Date(lastMsg.dateCreated).toLocaleString() : "N/A",
  //             unread: isUnread,
  //             lastMessageDate: lastMsg?.dateCreated || booking.booking_date || new Date(0)
  //           };

  //           // Store unread status
  //           unreadData[booking.group_name] = isUnread;

  //           // Store timestamp for sorting
  //           timestamps[booking.group_name] = lastMsg?.dateCreated || booking.booking_date || new Date(0);

  //           // Get online status for other user
  //           const otherUserId = userTypes === "host" ? booking.sender_id : booking.receiver_id;
  //           const otherParticipant = await convo.getParticipantByIdentity(otherUserId);
  //           const isOnline = otherParticipant?.isOnline ?? false;
  //           statuses[booking.group_name] = isOnline ? "online" : "offline";

  //         } catch (err) {
  //           console.error(`Error fetching conversation for ${booking.group_name}`, err);
  //           messagesData[booking.group_name] = {
  //             body: "Error loading",
  //             timestamp: "N/A",
  //             unread: false,
  //             lastMessageDate: booking.booking_date || new Date(0)
  //           };
  //           unreadData[booking.group_name] = false;
  //           timestamps[booking.group_name] = booking.booking_date || new Date(0);
  //         }
  //       }

  //       setLastMessages(messagesData);
  //       setUnreadStatus(unreadData);
  //       setUserStatuses(statuses);
  //       setConversationTimestamps(timestamps);
  //     } catch (err) {
  //       console.error("Error initializing Twilio Conversations client:", err);
  //     }
  //   };

  //   fetchConversationDetails();
  // }, [filteredBookings, twilioToken, userId, userTypes]);


  useEffect(() => {
    const fetchConversationDetails = async () => {
      if (!filteredBookings?.length || !twilioToken || isInitializingRef.current) return;

      isInitializingRef.current = true;

      try {
        // Initialize Twilio client if not already done
        if (!twilioClientRef.current) {
          twilioClientRef.current = new ConversationsClient(twilioToken);

          // Wait for initialization
          await new Promise((resolve, reject) => {
            twilioClientRef.current.on('stateChanged', (state) => {
              if (state === 'initialized') {
                resolve();
              } else if (state === 'failed') {
                reject(new Error('Twilio client failed to initialize'));
              }
            });
          });
        }

        const client = twilioClientRef.current;
        const messagesData = {};
        const statuses = {};
        const unreadData = {};
        const timestamps = {};

        for (const booking of filteredBookings) {
          try {
            const convo = await client.getConversationByUniqueName(booking.group_name);

            // Get the current user's participant info
            const participant = await convo.getParticipantByIdentity(userId);
            const lastReadIndex = participant?.lastReadMessageIndex ?? -1;

            // Get the last message
            const messagesResponse = await convo.getMessages(1);
            const lastMsg = messagesResponse.items[0];

            // Check if unread (only if message is from someone else)
            const isUnread = lastMsg && lastMsg.index > lastReadIndex && lastMsg.author !== userId;

            // Store last message data
            messagesData[booking.group_name] = {
              body: lastMsg?.body || "No message",
              timestamp: lastMsg?.dateCreated ? new Date(lastMsg.dateCreated).toLocaleString() : "N/A",
              unread: isUnread,
              lastMessageDate: lastMsg?.dateCreated || booking.booking_date || new Date(0)
            };

            // Store unread status
            unreadData[booking.group_name] = isUnread;

            // Store timestamp for sorting
            timestamps[booking.group_name] = lastMsg?.dateCreated || booking.booking_date || new Date(0);

            // Get online status for other user
            const otherUserId = userTypes === "host" ? booking.sender_id : booking.receiver_id;
            const otherParticipant = await convo.getParticipantByIdentity(otherUserId);
            const isOnline = otherParticipant?.isOnline ?? false;
            statuses[booking.group_name] = isOnline ? "online" : "offline";

          } catch (err) {
            console.error(`Error fetching conversation for ${booking.group_name}`, err);
            messagesData[booking.group_name] = {
              body: "No messages yet",
              timestamp: "N/A",
              unread: false,
              lastMessageDate: booking.booking_date || new Date(0)
            };
            unreadData[booking.group_name] = false;
            timestamps[booking.group_name] = booking.booking_date || new Date(0);
          }
        }

        setLastMessages(messagesData);
        setUnreadStatus(unreadData);
        setUserStatuses(statuses);
        setConversationTimestamps(timestamps);

        isInitializingRef.current = false;
      } catch (err) {
        console.error("Error initializing Twilio Conversations client:", err);
        isInitializingRef.current = false;
      }
    };

    if (filteredBookings?.length && twilioToken) {
      fetchConversationDetails();
    }
  }, [filteredBookings, twilioToken, userId, userTypes]);


  useEffect(() => {
    let isMounted = true;

    if (selectedBooking) {
      guestReviewDetail(selectedBooking)
    }

    const initializeChat = async () => {
      try {
        const targetUserId = selectedBooking
          ? userTypes == "host" ? selectedBooking.sender_id : selectedBooking.receiver_id
          : senderDetail?.user_id || senderDetail?.host_id;
        const targetPropertyId = property_id || selectedBooking?.property_id;

        if (property_id) {
          if (!targetUserId || !targetPropertyId) {

            return;
          }
        }

        // Get fresh token
        const response = await getTwilioToken({
          user_id: String(userId),
          role: userTypes || "host",
        });

        if (!response?.data?.token) {
          console.error("Failed to get Twilio token");
          return;
        }

        // Clean up existing client
        if (chatClient) {
          await chatClient.shutdown();
          setChatClient(null);
          setChannel(null);
        }

        // Initialize new client
        const client = new TwilioClient(response?.data?.token);

        client.on("stateChanged", async (state) => {
          if (state == "initialized" && isMounted) {
            setChatClient(client);
            try {
              const chatChannel = await getOrCreateChannel(
                client,
                String(targetUserId),
                String(userId),
                String(targetPropertyId)
              );
              if (chatChannel && isMounted) {
                setChannel(chatChannel);
                setMessages([]);

                // ✅ Update unread status when selecting a conversation
                if (chatChannel.uniqueName) {
                  setUnreadStatus(prev => ({
                    ...prev,
                    [chatChannel.uniqueName]: false
                  }));
                }
              }
            } catch (error) {
              console.error("Channel creation error:", error);
            }
          }
        });
        const user = await client.getUser(targetUserId);
        setTargetUser(user);
        setTargetUserStatus(user.isOnline ? "Online" : "Offline");


        user.on("updated", ({ user: updatedUser, updateReasons }) => {
          if (updateReasons.includes("reachabilityOnline")) {
            const newStatus = updatedUser.isOnline ? "Online" : "Offline";
            setTargetUserStatus(newStatus);

          }
        });

        client.on("connectionError", (error) => {
          console.error("Twilio connection error:", error);
        });

        client.on("tokenAboutToExpire", async () => {
          try {
            const newToken = await getTwilioToken({
              user_id: String(userId),
              role: userTypes || "host",
            });
            if (newToken?.data?.token) {
              await client.updateToken(newToken.data.token);
            }
          } catch (error) {
            console.error("Token refresh error:", error);
          }
        });
      } catch (error) {
        console.error("Chat initialization error:", error);
      }
    };

    initializeChat();

    return () => {
      isMounted = false;
      if (chatClient) {
        chatClient.shutdown();
      }

      if (targetUser) {
        targetUser.removeAllListeners("updated");
      }
    };
  }, [selectedBooking, userId, userTypes, property_id]); // Update dependencies

  const getOrCreateChannel = async (client, guestId, hostId, propertyId) => {
    try {
      if (!client || !guestId || !hostId || !propertyId) {
        console.error("Missing required parameters for channel creation");
        return null;
      }

      // Create channel name based on senderDetail presence
      let channelName;
      if (senderDetail && !selectedBooking?.group_name) {
        // If senderDetail exists but no group_name found in getList
        channelName = `ZYVOOPROJ_${Math.min(guestId, hostId)}_${Math.max(
          guestId,
          hostId
        )}_${propertyId}`;
      } else {
        // Use existing group_name if available
        channelName = selectedBooking?.group_name ||
          `ZYVOOPROJ_${Math.min(guestId, hostId)}_${Math.max(guestId, hostId)}_${propertyId}`;
      }

      let chatChannel;
      let retryCount = 0;
      const maxRetries = 1;

      while (retryCount < maxRetries) {
        try {
          chatChannel = await client.getConversationByUniqueName(channelName);
          break;
        } catch (error) {
          console.error("Error getting channel:", error);
          try {
            chatChannel = await client.createConversation({
              uniqueName: channelName,
              friendlyName: `Chat for Property ${propertyId}`,
            });
            break;
          } catch (createError) {
            console.error("Error creating channel:", createError);
            if (
              createError.message.includes("Conflict") &&
              retryCount < maxRetries - 1
            ) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              retryCount++;
              continue;
            }
            throw createError;
          }
        }
      }

      if (!chatChannel) {
        console.error("Failed to get or create channel after retries");
        return null;
      }

      const addParticipant = async (identity) => {
        let attempts = 0;
        while (attempts < 3) {
          try {
            const participants = await chatChannel.getParticipants();
            const isAlreadyParticipant = participants.some(
              (p) => p.identity == identity
            );

            if (!isAlreadyParticipant) {
              await chatChannel.add(identity);
            }
            return true;
          } catch (error) {
            if (error.message.includes("Conflict") && attempts < 2) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              attempts++;
              continue;
            }
            console.warn(`Failed to add participant ${identity}:`, error);
            return false;
          }
        }
      };

      // Try to add both participants
      await Promise.all([addParticipant(guestId), addParticipant(hostId)]);

      // Try to join the channel
      try {
        if (!chatChannel.joined) {
          await chatChannel.join();
        }
      } catch (joinError) {
        console.warn("Error joining channel:", joinError);
      }

      // Notify backend about the channel
      try {
        if (property_id && !sendChannelOnceRef.current) {
          sendChannelOnceRef.current = true;

          await sendCreatedChannel({
            guestId,
            hostId,
            channelName,
          });
        }
      } catch (error) {
        console.warn("Error notifying backend about channel:", error);
      }

      return chatChannel;
    } catch (error) {
      console.error("Channel creation/joining error:", error);
      return null;
    }
  };

  const sendCreatedChannel = async ({ guestId, hostId, channelName }) => {
    try {
      // Join the channel from backend
      const response = await JoinChannel({
        senderId: userTypes === "host" ? guestId : userId,
        receiverId: userTypes === "host" ? userId : guestId,
        groupChannel: channelName,
        userType: String(userTypes) || "host",
      });

      if (!response) return;

      // Fetch the list of channels for the current user
      const channelResponse = await getChannelUser({
        user_id: String(userId),
        type: userTypes,
      });

      const channels = channelResponse?.data || [];

      // Try to find the booking that matches current property_id
      const matchedBooking = channels.find((item) => {
        const groupParts = item?.group_name?.split('_');
        const groupPropertyId = parseInt(groupParts?.[groupParts.length - 1]);
        return groupPropertyId == property_id;
      });

      // Update chat list and selected booking
      setGetList(channels);
      setSelectedBooking(matchedBooking || channels[0]); // fallback to first if not found
    } catch (error) {
      console.error("Backend channel creation error:", error);
    }
  };

  useEffect(() => {
    if (channel) {
      const loadMessages = async () => {
        setTwilioLoading(true);
        try {
          const messagesResponse = await channel.getMessages(30);

              // FIX: Sort messages by date (oldest first for proper display)
    // const sortedMessages = messagesResponse.items.sort(
    //   (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated)
    // );
    
          const processedMessages = await Promise.all(
            messagesResponse.items.map(async (msg) => {
              const messageAuthor = msg.author || userId;
              const baseMsg = {
                ...msg,
                state: { ...msg.state, author: messageAuthor },
                isMyMessage: messageAuthor == userId,
                body: msg.body,
              };

              if (msg.type == "media" && msg.media) {
                try {
                  const mediaUrl = await msg.media.getContentTemporaryUrl();
                  return {
                    ...baseMsg,
                    mediaUrl,
                    type: "media",
                  };
                } catch (error) {
                  console.warn("Error fetching media URL:", error);
                  return { ...baseMsg, type: "text", };
                }
              }
              return {
                ...baseMsg,
                type: "text",
              };
            })
          );

          setMessages(processedMessages);

          // ✅ Mark all messages as read when loading the conversation
          await channel.setAllMessagesRead();

          // ✅ Update unread status for this conversation
          if (channel.uniqueName) {
            setUnreadStatus(prev => ({
              ...prev,
              [channel.uniqueName]: false
            }));

            // ✅ Update timestamp for sorting
            if (processedMessages.length > 0) {
              const lastMsg = processedMessages[processedMessages.length - 1];
              setConversationTimestamps(prev => ({
                ...prev,
                [channel.uniqueName]: lastMsg.dateCreated || new Date()
              }));
            }
          }

        } catch (error) {
          console.error("Error loading messages:", error);
        }
        setTwilioLoading(false);
      };

      loadMessages();

      // Update real-time message handler
      const messageHandler = async (newMessage) => {
        try {
          if (newMessage.author == userId) {
            return;
          }

          const messageAuthor = newMessage.author;
          const baseMsg = {
            ...newMessage,
            state: {
              ...newMessage.state,
              author: messageAuthor,
            },
            isMyMessage: false,
            body: newMessage.body,
          };

          // ✅ Update unread status when receiving new message
          if (channel.uniqueName) {
            setUnreadStatus(prev => ({
              ...prev,
              [channel.uniqueName]: true
            }));

            // ✅ Update timestamp for sorting
            setConversationTimestamps(prev => ({
              ...prev,
              [channel.uniqueName]: newMessage.dateCreated || new Date()
            }));
          }

          if (newMessage.type == "media" && newMessage.media) {
            const mediaUrl = await newMessage.media.getContentTemporaryUrl();
            setMessages((prev) => [
              ...prev,
              {
                ...baseMsg,
                mediaUrl,
                type: "media",
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                ...baseMsg,
                type: "text",
              },
            ]);
          }
        } catch (error) {
          console.error("Error handling new message:", error);
        }
      };

      const onAttributesUpdated = (updatedChannel) => {
        const blockedUsers = updatedChannel.attributes?.blockedUsers || {};
        const amIBlocked = blockedUsers[String(userId)] === true;

        setSelectedBooking(prev => ({ ...prev, is_other_block: amIBlocked ? 1 : 0 }));

        if (amIBlocked) {
          toast.error("You have been blocked");
        } else {
          toast.success("You have been unblocked");
        }
      };

      channel.on("attributesUpdated", onAttributesUpdated);
      channel.on("messageAdded", messageHandler);
      return () => {
        channel.removeListener("messageAdded", messageHandler);
        channel.off("attributesUpdated", onAttributesUpdated);
      };
    }
  }, [channel, userId]);

  const handleSendMessageClick = async () => {
    const myIdentity = String(userId);
    const isBlocked = await checkIfBlocked(channel, myIdentity);
    if (selectedBooking?.is_other_block === 1 || isBlocked) {
      // if (isBlocked) {
        toast.error("You are blocked");
        return;
      // }
    }

    // 2. Check for Profanity
    if (containsInappropriateWord(message)) {
      toast.error("This message contains inappropriate words and is not allowed");
      setMessage(""); // Clear the message input field
      return; // Stop execution
    }
    sendMessage();
  };

  const checkIfBlocked = (currentChannel, myUserId) => {
    if (!currentChannel) return true;
    const blockedUsers = currentChannel.attributes?.blockedUsers || {};

    return blockedUsers[String(myUserId)] === true;
  };

  const sendMessage = async (file = null, autoMessageContent = null) => {
    if (!channel) {
      console.error("No active channel");
      return;
    }

    let messageToSend = ""; // Declare a variable to hold the final message content
    let isAutoMessage = false; // Flag to indicate if it's an auto message

    // --- New Logic for Automatic Messages ---
    if (autoMessageContent) {
      messageToSend = autoMessageContent;
      isAutoMessage = true; // Set flag for auto message
    }
    // --- Existing File Sending Logic ---
    else if (file) {
      let tempMessage = null;
      try {
        setTwilioLoading(true);

        tempMessage = {
          type: "media",
          isMyMessage: true,
          state: { author: userId },
          body: "Media message",
          dateCreated: new Date(),
          mediaUrl: URL.createObjectURL(file),
        };

        setMessages((prev) => [...prev, tempMessage]);

        const sentMessage = await channel
          .sendMessage({
            contentType: file.type || "application/octet-stream",
            media: file,
            type: "media",
          })
          .catch((error) => {
            console.error("Error sending media message:", error);
            throw error;
          });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
          if (sentMessage.media) {
            const mediaUrl = await sentMessage.media.getContentTemporaryUrl();
            setMessages((prev) =>
              prev.map((msg) =>
                msg == tempMessage
                  ? { ...msg, mediaUrl, dateCreated: sentMessage.dateCreated }
                  : msg
              )
            );
          }
        } catch (mediaError) {
          console.error("Error getting media URL:", mediaError);
        }
      } catch (error) {
        console.error("Error sending file:", error);
        if (tempMessage) {
          setMessages((prev) => prev.filter((msg) => msg !== tempMessage));
        }
      } finally {
        setTwilioLoading(false);
        document.getElementById("fileUpload").value = "";
      }
      return; // Exit after handling file sending
    }
    else if (message.trim()) {
      messageToSend = message.trim();
      setMessage(""); // Clear the input field for user messages
    } else {
      return;
    }

    if (messageToSend) {
      try {
        setTwilioLoading(true);
        const sentMessage = await channel
          .sendMessage(messageToSend)
          .catch((error) => {
            console.error("Error sending text message:", error);
            throw error;
          });

        setMessages((prev) => [
          ...prev,
          {
            ...sentMessage,
            body: messageToSend,
            type: "text",
            isMyMessage: true, // You might want to adjust this for auto messages
            state: { author: userId }, // Or differentiate for auto messages
          },
        ]);

        // ✅ Update timestamp for sorting when sending a message
        if (channel.uniqueName) {
          setConversationTimestamps(prev => ({
            ...prev,
            [channel.uniqueName]: sentMessage.dateCreated || new Date()
          }));
        }

        // ✅ Don't mark as unread when you send a message
        if (channel.uniqueName) {
          setUnreadStatus(prev => ({
            ...prev,
            [channel.uniqueName]: false // Keep as read when you send
          }));
        }

      } catch (error) {
        console.error("Failed to send message:", error);
        if (!isAutoMessage) {
          setMessage(messageToSend);
        }
      } finally {
        setTwilioLoading(false);
      }
    }
  };

  const alreadSend = localStorage.getItem('is_already_sent')

  useEffect(() => {
    if (channel && selectedMsg && !hasSentAutoMessage.current) {
      if (selectedBooking?.is_other_block != 0) {
        toast.error("you are blocked");
      } else {
        if (!alreadSend) {
          sendMessage(null, selectedMsg);
          localStorage.setItem("is_already_sent", true)
        }
        hasSentAutoMessage.current = true; // Mark as sent after the first successful attempt
      }
    }
  }, [channel, selectedBooking]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("is_already_sent");
    };
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (twilioClientRef.current) {
        twilioClientRef.current.shutdown();
        twilioClientRef.current = null;
      }
      isInitializingRef.current = false;
    };
  }, []);

  const handleMuteUnmute = async (data) => {
    const res = await muteUmuteUser({
      user_id: userId,
      group_channel: data?.group_name,
      mute: data?.is_muted == 1 ? 0 : 1,
    });
    if (res?.success) {
      if (selectedBooking) {
        setSelectedBooking((prev) => ({
          ...prev,
          is_muted: data?.is_muted == 1 ? 0 : 1,
        }));
      }
      getUserList();
    }
  };

  const handleBlockUnblock = async (data) => {
    const isCurrentlyBlocked = data?.is_blocked === 1;
    const newBlockStatus = isCurrentlyBlocked ? 0 : 1;

    const blockerId = userTypes === "host" ? data?.receiver_id : data?.sender_id;

    const blockedId = userTypes === "host" ? data?.sender_id : data?.receiver_id;

    // 1️⃣ Update DB (authority)
    const res = await blockUnblockUser({
      senderId: blockerId,
      group_channel: data?.group_name,
      blockUnblock: newBlockStatus,
    });

    if (!res?.success || !channel) return;

    // 2️⃣ Update Twilio channel attributes (real-time signal)
    const attributes = channel.attributes || {};
    const blockedUsers = attributes.blockedUsers || {};

    if (newBlockStatus === 1) {
      blockedUsers[String(blockedId)] = true;
    } else {
      delete blockedUsers[String(blockedId)];
    }

    await channel.updateAttributes({ ...attributes, blockedUsers, });

    // 3️⃣ Update local UI
    setSelectedBooking(prev => ({ ...prev, is_blocked: newBlockStatus }));

    toast.success(newBlockStatus === 1 ? "User blocked" : "User unblocked");
  };

  // const handleArchieveUnarchieve = async (data) => {
  //   const res = await archieveUnarchieveUser({
  //     user_id: userId,
  //     group_channel: data?.group_name,
  //   });
  //   if (res?.success) {
  //     // if (selectedBooking) {
  //     // Update selected booking state
  //     if (selectedBooking?.group_name === data?.group_name) {
  //       setSelectedBooking((prev) => ({
  //         ...prev,
  //         is_archived: data?.is_archived == 1 ? 0 : 1,
  //       }));
  //     }
  //     getUserList();
  //   }
  // };


  const handleArchieveUnarchieve = async (data) => {
    const res = await archieveUnarchieveUser({
      user_id: userId,
      group_channel: data?.group_name,
    });

    if (res?.success) {
      // Update the specific booking in getList array
      setGetList(prevList =>
        prevList.map(booking =>
          booking.group_name === data?.group_name
            ? { ...booking, is_archived: data?.is_archived == 1 ? 0 : 1 }
            : booking
        )
      );

      // Also update selectedBooking if it's the same conversation
      if (selectedBooking?.group_name === data?.group_name) {
        setSelectedBooking(prev => ({
          ...prev,
          is_archived: data?.is_archived == 1 ? 0 : 1,
        }));
      }
    }
  };

  const handleChatDelete = async (data) => {
    const res = await deleteChatUser({
      user_id: userTypes == "host" ? data?.receiver_id : data?.sender_id,
      user_type: userTypes,
      group_channel: data?.group_name,
    });
    if (res.success) {
      getUserList();
      toast.success("chat deleted successfully")
    }
  };

  const handleFavoriteUnfavorite = async (data) => {
    const res = await favoriteChatUser({
      // senderId: userTypes == "host" ? data?.sender_id :data?.receiver_Id ,
      senderId: data?.sender_id,
      favorite: data?.is_favorite == 0 ? 1 : 0,
      group_channel: data?.group_name,
    });

    if (res?.success) {

      setSelectedBooking((prev) => ({
        ...prev,
        is_favorite: data?.is_favorite == 0 ? 1 : 0,
      }));
      getUserList();
    }

  };

  const handleReport = async (data, selectedBooking) => {
    if (data?.additionalDetails) {
      const res = await reportUser({
        reporter_id: userId,
        reported_user_id:
          userTypes == "host"
            ? selectedBooking?.sender_id
            : selectedBooking?.receiver_id,
        reason: data?.selectedReason,
        message: data?.additionalDetails,
      });

      if (res.status) {
        getUserList();
      }
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const then = new Date(timestamp);
    const diffInSeconds = Math.floor((now - then) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / (3600 * 24));
    const months = Math.floor(diffInSeconds / (3600 * 24 * 30));
    const years = Math.floor(diffInSeconds / (3600 * 24 * 365));

    if (years >= 1) return `${years} years ago`;
    if (months >= 1) return `${months} months ago`;
    if (days >= 1) return `${days} days ago`;
    if (hours >= 1) return `${hours} hours ago`;
    if (minutes >= 1) return `${minutes} minutes ago`;

    return "Just now";
  };

  function convertDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  const handleClose = () => {
    setSelectedBooking(null)
  }

  const [isMobileWidth, setIsMobileWidth] = useState(false)

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth(); // run on mount
    window.addEventListener('resize', checkWindowWidth);

    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);

  return (
    <>
      <div className="mob-search-filter border-start-0 border-end-0 mob-booking-filter mob-chat-filter">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="mob-search-filter-in">
                <div className="mob-search-bar-back">
                  <form action="" onSubmit={(e) => e.preventDefault()}>
                    <label>
                      <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      <button type="submit"><i className="fa-regular fa-magnifying-glass"></i></button>
                    </label>
                  </form>
                </div>
                <div className="mob-filter-in ms-auto dropdown">
                  <a href="#" className="dropdown-toggle" role="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <img src="/images/mobile/filters/filter.svg" loading="lazy" alt="" />
                  </a>
                  <div className="dropdown-menu">
                    <ul>
                      <li><a href="#" onClick={() => setSelectedFilter("All Conversations")} >All Conversations</a></li>
                      <li><a href="#" onClick={() => setSelectedFilter("Archived")} >Archived</a></li>
                      <li><a href="#" onClick={() => setSelectedFilter("Unread")} >Unread</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-lg-4">
        <div className="d-flex flex-column flex-md-row gap-3" style={!isMobileWidth ? { height: "calc(100vh - 17vh)" } : {}} >
          <div className="flex-grow p-lg-2" style={{ borderRadius: "8px", overflowY: isMobileWidth ? "" : "auto", height: "100%", }} >
            {(!showSearch && !isMobileWidth) ? (
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div style={{ fontWeight: "600" }}>{selectedFilter}</div>
                  <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)} >
                    <img src={"/images/dropdown.svg"} style={{ cursor: "pointer", width: "12px" }} onClick={() => setShowDropdown(!showDropdown)} />
                    {/* <RiArrowDropDownLine style={{ cursor: "pointer", marginLeft: 5 }} onClick={() => setShowDropdown (!showDropdown)} /> */}

                    <Dropdown.Menu show align="end" style={{ marginTop: "0.2rem" }} >
                      <Dropdown.Item as="button" onClick={() => setSelectedFilter("All Conversations")} >
                        All Conversations
                      </Dropdown.Item>

                      <Dropdown.Item as="button" onClick={() => setSelectedFilter("Archived")} >
                        Archived
                      </Dropdown.Item>

                      <Dropdown.Item as="button" onClick={() => setSelectedFilter("Unread")} >
                        Unread
                      </Dropdown.Item>

                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <IoSearch onClick={() => setShowSearch(true)} style={{ marginRight: 5, fontSize: "20px" }} />
              </div>
            ) : (
              !isMobileWidth && (<InputGroup>
                <FormControl type="text"
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    borderColor: "#e4e4e4",
                    borderRightColor: "#6c757d",
                  }}
                  placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

                <Button variant="outline-secondary" onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }} >
                  X
                </Button>
              </InputGroup>)
            )}

            {filteredBookings?.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <Card key={index} className={`mt-3 mt-lg-4 ${selectedBooking?.group_name == booking.group_name
                  ? "border border-black" : ""}`} style={{
                    cursor: "pointer",
                    borderRadius: "20px",
                  }} onClick={() => {
                    setSelectedBooking(booking);
                  }} >
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div style={{
                        width: "65px",
                        height: "65px",
                        borderRadius: "50%",
                        border: "2px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        backgroundColor: "#fff",
                        marginRight: "10px",
                        position: "relative"
                      }} onClick={(e) => {
                        e.stopPropagation();

                        if (userTypes === "guest") {
                          navigate("/host-listing", { state: { hostId: booking?.receiver_id } });
                        }
                      }}>

                        
                        <Image src={`${imageBase}${userTypes == "host" ? booking?.sender_profile : booking?.receiver_image}`} roundedCircle width="50" height="50" style={{ borderRadius: '50%' }}
                        />
                        <div style={{
                          position: "absolute", bottom: "4px", right: "4px", width: "20px",
                          height: "20px", borderRadius: "50%", backgroundColor: userStatuses[booking.group_name] == "online" ? "#4AEAB1" : "gray", border: "4px solid white", zIndex: "1"
                        }} title={userStatuses[booking.group_name]} />
                      </div>
                      <div>
                        <Card.Title style={{ fontSize: isMobileWidth ? "13px" : "15px", width: "99%" }}>
                          {userTypes == "host" ? booking?.sender_name : booking?.receiver_name}{" "}{isMobileWidth && <br />}
                          ({booking?.property_title})
                        </Card.Title>

                        <Card.Subtitle className="mb-2 text-muted"> {booking.booking_date} </Card.Subtitle>

                        {/* {console.log(lastMessages[booking.group_name]?.timestamp,"@@@@@@@@@@@")} */}

                        {lastMessages[booking.group_name]?.timestamp ? (
                          <div style={{ fontSize: "12px", color: "#b9b9b9" }}>
                            {/* {formatTimeAgo(lastMessages[booking.group_name]?.timestamp) || ""} */}
                            {formatTimeAgo(lastMessages[booking.group_name]?.lastMessageDate) || ""}
                            {/* {console.log(lastMessages[booking.group_name], "lastMessages[booking.group_name]@@@@@")} */}
                            {/* {console.log(lastMessages[booking.group_name]?.timestamp, "lastMessages[booking.group_name]?.timestamp#####")} */}
                          </div>
                        ) : <div style={{ fontSize: "12px", color: "#b9b9b9" }}> Loading... </div>}

                        {lastMessages[booking.group_name]?.body && (
                          <p style={{ fontSize: "14px", marginBottom: "0px", fontWeight: lastMessages[booking.group_name]?.unread ? "bold" : "normal" }}>
                            {lastMessages[booking.group_name].body.split(" ").length > 5 ? lastMessages[booking.group_name].body.split(" ").slice(0, 3).join(" ") + "..." : lastMessages[booking.group_name].body}
                          </p>
                        )}
                      </div>

                      <div style={{ position: "absolute", top: "10px", right: "0px" }} onClick={(e) => e.stopPropagation()}  >
                        <Col className="d-flex justify-content-end align-items-center">
                          {/* <Dropdown show={selectedBooking?.property_id === booking?.property_id && activeDropdown === index}
                            onToggle={(isOpen) => {
                              // if (!isSelected) return;   // only selected property can open
                              setActiveDropdown(isOpen ? index : null);
                            }}> */}
                          <Dropdown show={!isMobileWidth ? selectedBooking?.property_id === booking?.property_id && activeDropdown === index : activeDropdown == index}
                            onToggle={(isOpen) => {
                              //  if (isMobileWidth && !isSelected) return;   // only 
                              setActiveDropdown(isOpen ? index : null)
                            }

                            } >
                            <Dropdown.Toggle className="no-caret" variant="link" id="dropdown-custom-components" >
                              <style> {` .no-caret::after { display: none !important; }`} </style>
                              <BsThreeDotsVertical size={26} color="#ccc" style={{ backgroundColor: "white" }} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item as="button" onClick={() => { handleMuteUnmute(selectedBooking || booking) }} >
                                {(selectedBooking?.is_muted || booking?.is_muted) ? "Unmute" : "Mute"}
                              </Dropdown.Item>

                              <Dropdown.Item as="button" onClick={() => { handleReport(selectedBooking || booking); setShowReportForm(true) }} >
                                Report
                              </Dropdown.Item>

                              <Dropdown.Item as="button" onClick={() => { handleChatDelete(selectedBooking || booking) }} >
                                Delete chat
                              </Dropdown.Item>

                              <Dropdown.Item as="button" onClick={() => { handleBlockUnblock(selectedBooking || booking) }} >
                                {(selectedBooking?.is_blocked == 1 || booking?.is_blocked == 1) ? "Unblock" : "Block"}
                              </Dropdown.Item>

                              <Dropdown.Item as="button" onClick={() => { handleArchieveUnarchieve(selectedBooking || booking) }} >
                                {(booking?.is_archived) ? "Unarchived" : "Archived"}



                              </Dropdown.Item>

                            </Dropdown.Menu>
                          </Dropdown>
                        </Col>
                      </div>

                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="text-center mt-4" style={{ minWidth: "250px" }}> <p className="text-muted">No chatlist found.</p> </div>
            )}
          </div>
          {!isMobileWidth ? <>
            {/* second row */}
            {!selectedBooking ? (
              <div className="w-100 mb-4" style={{ flex: "1 0 400px", overflowY: "auto", height: "100%", }} >
                <Container fluid className="border border-2 p-3" style={{ minWidth: "250px", height: "100%" }} >
                  <div className="h-100 d-flex justify-content-center align-items-center text-center">
                    {filteredBookings?.length > 0 ? "Please select a User to chat" : "No messages found."}
                  </div>
                </Container>
              </div>
            ) : (
              <div className="flex-grow-1 w-50 h-100" style={{ overflowY: "auto" }}  >
                <Container className="border border-2 p-3 h-100" style={{ borderRadius: "10px" }}>
                  <Row className="d-flex align-items-center border-bottom" style={{ padding: '10px' }}>
                    <Col className="d-flex align-items-center" >
                      {/* <div style={{
                        width: "55px",
                        height: "55px",
                        borderRadius: "50%",
                        border: "2px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        backgroundColor: "#fff",
                        marginRight: "10px",
                      }} >
                          

                        <Image src={userTypes == "host" ? imageBase + selectedBooking?.sender_profile ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
                          : imageBase + selectedBooking?.receiver_image ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
                        }
                          roundedCircle width="50" height="50" />
                          

                          
                      </div> */}

                      <div
  style={{
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    border: "2px solid #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    backgroundColor: "#fff",
    marginRight: "10px",
    position: "relative", // important
  }}
>
  <Image
    src={
      userTypes === "host"
        ? imageBase + selectedBooking?.sender_profile ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
        : imageBase + selectedBooking?.receiver_image ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"
    }
    roundedCircle
    width="50"
    height="50"
  />

  {/* Status Dot */}
  <div
    style={{
      position: "absolute",
      bottom: "10px",
      right: "2px",
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      backgroundColor: "#8c8c8c", // gray dot
      border: "2px solid white", // white outline
      zIndex: 2,
    }}
  />
</div>
                      <div>
                        <h5> {userTypes == "host" ? selectedBooking?.sender_name : selectedBooking?.receiver_name}  </h5>
                        <p style={{ color: "#7DD2B0", margin: "0px" }}>{targetUserStatus}</p>
                      </div>
                    </Col>

                    <Col className="d-flex justify-content-end align-items-center">
                      <span style={{ border: '1px solid #ccc', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: "center", padding: '7px' }}>
                        {selectedBooking?.is_favorite == 1 ? <FaStar size={isMobileWidth?20:25} style={{ color: '#2ee3a0', }} role="button" onClick={() => handleFavoriteUnfavorite(selectedBooking)} /> :
                          <FaRegStar size={isMobileWidth?20:25} role="button" onClick={() => handleFavoriteUnfavorite(selectedBooking)} />}
                      </span>
                      <Dropdown show={showModal} onToggle={() => setShowModal(!showModal)} >
                        <Dropdown.Toggle className="no-caret" variant="link" id="dropdown-custom-components" >
                          <style> {` .no-caret::after { display: none !important; }`} </style>
                          <span style={{ border: '1px solid #ccc', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: "center", padding: '7px' }}>
                            <BsThreeDots size={25} color="black" />
                          </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item as="button" onClick={() => { handleMuteUnmute(selectedBooking); }} >
                            {selectedBooking?.is_muted ? "Unmute" : "Mute"}
                          </Dropdown.Item>

                          <Dropdown.Item as="button" onClick={() => { handleReport(selectedBooking); setShowReportForm(true) }} >
                            Report
                          </Dropdown.Item>

                          <Dropdown.Item as="button" onClick={() => { handleChatDelete(selectedBooking); }} >
                            Delete chat
                          </Dropdown.Item>

                          <Dropdown.Item as="button" onClick={() => { handleBlockUnblock(selectedBooking); }} >
                            {selectedBooking?.is_blocked == 1 ? "Unblock" : "Block"}
                          </Dropdown.Item>

                          <Dropdown.Item as="button" onClick={() => { handleArchieveUnarchieve(selectedBooking); }} >
                            {selectedBooking?.is_archived ? "Unarchived" : "Archive"}
                          </Dropdown.Item>

                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>
                  <Row className="rounded-3 p-3 w-100" style={{ height: "calc(100% - 30%)", }}>
                    <Col xs={12} className="mb-3 chat-box" style={{ height: "100%", overflowY: "auto", }} ref={messagesContainerRef} >
                      {twilioLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: "250px", border: "1px solid #E5E5E5" }} >
                          <div className="spinner-border text-primary" role="status" >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {messages.map((msg, index) => {
                            const isMyMessage = msg.isMyMessage;
                            const messageDate = msg?.dateCreated || msg?.state?.timestamp || new Date();

                            const formattedDate = new Date(messageDate).toLocaleString('en-US', {
                              month: 'short',     // "Jul"
                              day: 'numeric',     // "20"
                              year: 'numeric',    // "2023"
                              hour: 'numeric',    // "11"
                              minute: '2-digit',  // "32"
                              hour12: true        // "AM"/"PM"
                            });


                            return (
                              <div key={index} className={`d-flex mb-2 flex-wrap ${isMyMessage ? "justify-content-start" : "justify-content-start"}`} style={{ fontWeight: 'lighter' }} >

                                <div className='chat-wrp-main' >
                                  <div className="chat-single-upr">
                                    <div className="chat-single-left">
                                      {!isMyMessage ? (
                                        <Image src={userTypes == "host" ? imageBase + selectedBooking?.sender_profile || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s" : imageBase + selectedBooking?.receiver_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"}
                                          roundedCircle width="40" height="40px"
                                        />
                                      ) : (<Image src={imageBase + profileData?.profileData?.profile_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"} roundedCircle width="40" height="40px" />
                                      )}

                                      {!isMyMessage ? (
                                        <h3 className="mb-0" style={{ fontSize: '16px', fontWeight: '500' }}>
                                          {userTypes === "host" ? selectedBooking?.sender_name : `${selectedBooking?.receiver_name}`}
                                        </h3>
                                      ) : (
                                        <h3 className="mb-0" style={{ fontSize: '16px', fontWeight: '500' }}>
                                          {userTypes === "host" ? `${selectedBooking?.receiver_name}` : selectedBooking?.sender_name}
                                        </h3>
                                      )}
                                    </div>
                                    <span> {formattedDate} </span>
                                  </div>

                                  {msg.type == "media" ? (
                                    <div className='chat-body'>
                                      <Image src={msg.mediaUrl} loading="lazy" alt="Sent media" width="200" className="rounded" />
                                    </div>
                                  ) : (
                                    <div className='chat-body' style={{ fontSize: '14px' }}> {msg.body} </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </Col>
                    <Col xs={12} className="p-2" style={{ display: "flex", marginBottom: "0%" }}>
                      {selectedBooking?.is_blocked == 1 ?
                        <button onClick={() => handleBlockUnblock(selectedBooking)} style={{
                          width: "100%", backgroundColor: "#4AEAB1", borderRadius: "25px", border: "none", padding: "10px"
                        }}> Unblock </button> :
                        <div className="d-flex align-items-center" style={{ width: "100%" }} >
                          <div className="d-flex align-items-center px-3 flex-grow-1"
                            style={{ background: "#f7f7f7", borderRadius: "30px", marginRight: "0px", height: "48px" }} >
                            <input type="file" id="fileUpload" className="d-none"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                const allowedTypes = [
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                  "image/webp",
                                  "image/gif"
                                ];

                                const maxSizeMB = 5;

                                if (!allowedTypes.includes(file.type)) {
                                  toast.error("Only image files are allowed");
                                  e.target.value = "";
                                  return;
                                }

                                if (file.size > maxSizeMB * 1024 * 1024) {
                                  toast.error("Image size must be less than 5MB");
                                  e.target.value = "";
                                  return;
                                }

                                sendMessage(file);
                                e.target.value = "";
                              }}
                            />

                            <input type="text" className="form-control border-0 bg-transparent flex-grow-1"
                              placeholder="Type a message..." style={{ boxShadow: "none" }} value={message}
                              onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault(); // Prevent newline
                                  handleSendMessageClick()
                                }
                              }
                              }
                            />

                            <label htmlFor="fileUpload" className="ms-2" style={{ cursor: "pointer", color: "#555", flexShrink: 0 }}
                              onClick={async (e) => {
                                const isBlocked = await checkIfBlocked(channel, userId);

                                if (selectedBooking?.is_other_block == 1 || isBlocked) {
                                  e.preventDefault();
                                  toast.error("You are blocked");
                                } else { sendMessage() }
                              }}>
                              <ImAttachment />
                            </label>
                          </div>

                          <button className="ms-2 d-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor: "#2ee3a0",
                              border: "none",
                              borderRadius: "50%",
                              width: "40px",
                              height: "40px",
                              color: "#fff",
                              flexShrink: 0,

                            }}
                            onClick={handleSendMessageClick}
                            disabled={!message.trim() && !document.getElementById("fileUpload")?.files?.length} >
                            <img src="images/chat/send.svg" style={{ color: 'white', margin: '5px', width: '20px' }} loading="lazy" alt="" />
                          </button>
                        </div>}
                    </Col>
                  </Row>
                </Container>
              </div>
            )}
            {/* third row  */}
            {selectedBooking && (
              <div className="flex-grow-1"
                style={{
                  borderRadius: "8px",
                  padding: "0rem",
                  overflowY: "auto",
                  height: "100%",
                  minWidth: "285px"
                }} >
                <Container className="border rounded-3">
                  <h5 className="mt-3 text-center" style={{ fontWeight: "300", color: '#000000', fontSize: '18px' }}>{userTypes == "host" ? "Guest by" : "Hosted by"}</h5>
                  <Row className="mb-3 px-3" >
                    <Col xs={8} className="d-flex align-items-center justify-content-center  border-2  w-100 pb-2 " style={{ marginBottom: '10px' }} >
                      <div style={{
                        width: "55px",
                        height: "55px",
                        borderRadius: "50%",
                        border: "2px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        backgroundColor: "#fff",
                        marginRight: "5px",
                      }} >
                        <Image src={userTypes == "host" ? imageBase + selectedBooking?.sender_profile : selectedBooking?.receiver_image ? imageBase + selectedBooking?.receiver_image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbTOxk5mr0FZbuyX9htlwSpsdBPz-32lyXQ&s"}
                          roundedCircle
                          width="50" height="50" />
                      </div>
                      <div>
                        <h6 className="mb-0" style={{ color: "black", fontSize: '20px' }}> {userTypes == "host" ? selectedBooking?.sender_name : selectedBooking?.receiver_name} </h6>
                      </div>
                      {userTypes == "host" ?
                        <>
                          <FaStar className="text-warning mx-1" style={{ marginTop: "-2px" }} />
                          <span style={{ color: "#FCA800", }}> {guestReview || "0.0"} </span>
                        </> : (
                          <>
                            {selectedBooking?.is_star_host && (<Image src="/images/locations-grid/profile/batch.svg" loading="lazy" alt="Batch" style={{ marginLeft: "5px", width: "30px" }} />)}
                          </>)}
                    </Col>



                  </Row>
                  <hr style={{ marginTop: '-14px', marginBottom: '30px' }} />

                  {/* <Row className="mt-3 mb-3 px-3 w-100"> */}
                  {userTypes == "host" ?
                    <Button className="border border-1 border-black w-100" variant="light"
                      onClick={() => navigate("/booking", { state: { bookingId: selectedBooking?.booking_id }, })} style={{ fontSize: "20px", marginTop: '-9px', marginBottom: '16px' }}>
                      Guest booking
                    </Button> :
                    <Button className=" border border-1 border-black w-100" variant="light"
                      onClick={() => navigate("/host-listing", { state: { hostId: selectedBooking?.receiver_id } })} style={{ fontSize: "20px", marginTop: '-9px', marginBottom: '16px' }}>
                      Host Properties
                    </Button>
                  }
                  {/* </Row> */}
                  <div className="d-flex justify-content-center mb-3">
                    <PiClockCountdownFill size={24} color="#979797" />
                    <span className="fs-7 ms-2">Typically respond within 1 hr</span>
                  </div>
                </Container>
                <Container className="border rounded-3 w-100 p-3 mt-3 d-flex flex-column gap-4">
                  <Row>
                    <Col>From</Col>
                    <Col className="text-end fw-bold"> {selectedBooking?.receiver_address || "Not Available"} </Col>
                  </Row>
                  <Row>
                    <Col>Member Since</Col>
                    <Col className="text-end"> {convertDate(selectedBooking?.receiver_member_since)} </Col>
                  </Row>
                  <Row>
                    <Col>Language</Col>
                    <Col className="text-end"> {selectedBooking?.receiver_language?.join(", ") || "Not Available"} </Col>
                  </Row>
                </Container>
              </div>
            )}
          </> :
            <Modal show={!!selectedBooking} onHide={handleClose} dialogClassName="custom-modal chat-screen-modal custom-modal-css">
              <Modal.Body className="chat-screen-body">
                <div className="chat-screen-header"  >
                  <span className="chat-screen-back-btn" onClick={handleClose}>
                    <i className="fa-regular fa-arrow-left"></i>
                  </span>
                </div>

                <div className="chat-screen-content">
                  <Container className="chat-screen-container">
                    <Row className="chat-screen-top-row">
                      <Col className="chat-screen-user-col">
                        <div className="chat-screen-pic-wrapper">
                          <Image src={userTypes === "host" ? imageBase + (selectedBooking?.sender_profile || fallbackImg)
                            : imageBase + (selectedBooking?.receiver_image || fallbackImg)
                          }
                            roundedCircle width="50" height="50"
                          />
                        </div>
                        <div className="chat-screen-user-info">
                          <h6 className="chat-screen-username">
                            {userTypes === "host" ? selectedBooking?.sender_name : selectedBooking?.receiver_name}
                          </h6>
                          <p className="chat-screen-status">{targetUserStatus}</p>
                        </div>
                      </Col>

                      <Col className="chat-screen-actions-col">
                        <span className="chat-screen-fav-btn">
                          {selectedBooking?.is_favorite == 1 ? (
                            <FaStar size={isMobileWidth?20:25} style={{ color: "#2ee3a0" }} role="button" onClick={() => handleFavoriteUnfavorite(selectedBooking)} />
                          ) : (
                            <FaRegStar size={isMobileWidth?20:25} role="button"
                              onClick={() => handleFavoriteUnfavorite(selectedBooking)}
                            />
                          )}
                        </span>

                        <Dropdown show={showModal} onToggle={() => setShowModal(!showModal)} >
                          <Dropdown.Toggle className="chat-screen-dropdown-toggle" variant="link" >
                            <span className="chat-screen-dropdown-icon">
                              <BsThreeDots size={isMobileWidth?20:25} color="black" />
                            </span>
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item as="button" onClick={() => handleMuteUnmute(selectedBooking)}>
                              {selectedBooking?.is_muted ? "Unmute" : "Mute"}
                            </Dropdown.Item>

                            <Dropdown.Item as="button" onClick={() => { handleReport(selectedBooking); }} >
                              Report
                            </Dropdown.Item>

                            <Dropdown.Item as="button" onClick={() => handleChatDelete(selectedBooking)}>
                              Delete chat
                            </Dropdown.Item>

                            <Dropdown.Item as="button" onClick={() => handleBlockUnblock(selectedBooking)}>
                              {selectedBooking?.is_blocked === 1 ? "Unblock" : "Block"}
                            </Dropdown.Item>

                            <Dropdown.Item as="button" onClick={() => handleArchieveUnarchieve(selectedBooking)} >
                              {selectedBooking?.is_archived ? "Unarchived" : "Archive"}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>

                    <Row className="chat-screen-messages-row">
                      <Col xs={12} className="chat-screen-chat-box" ref={messagesContainerRef} >
                        {twilioLoading ? (
                          <div className="chat-screen-loading">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : (
                          messages.map((msg, index) => {
                            const isMy = msg.isMyMessage;
                            const messageDate = msg?.dateCreated || msg?.state?.timestamp || new Date();
                            const formattedDate = new Date(messageDate).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            });

                            return (
                              <div key={index} className="chat-screen-message-row">
                                <div className="chat-screen-message-container">
                                  <div className="chat-screen-message-top">
                                    <div className="chat-screen-message-user">
                                      <Image src={
                                        !isMy ? userTypes === "host" ? imageBase + (selectedBooking?.sender_profile || fallbackImg)
                                          : imageBase + (selectedBooking?.receiver_image || fallbackImg)
                                          : imageBase + (profileData?.profileData?.profile_image || fallbackImg)
                                      }
                                        roundedCircle width="40" height="40"
                                      />
                                      <h3 className="chat-screen-message-username">
                                        {!isMy ? userTypes === "host" ? selectedBooking?.sender_name : selectedBooking?.receiver_name
                                          : userTypes === "host" ? selectedBooking?.receiver_name : selectedBooking?.sender_name}
                                      </h3>
                                    </div>
                                    <span className="chat-screen-message-date"> {formattedDate} </span>
                                  </div>

                                  {msg.type === "media" ? (
                                    <div className="chat-screen-message-body">
                                      <Image src={msg.mediaUrl} loading="lazy" alt="media" width="200" className="rounded" />
                                    </div>
                                  ) : (
                                    <div className="chat-screen-message-body">{msg.body}</div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </Col>

                      <Col xs={12} className="chat-screen-input-row">
                        {selectedBooking?.is_blocked === 1 ? (
                          <button className="chat-screen-unblock-button" onClick={() => handleBlockUnblock(selectedBooking)} >
                            Unblock
                          </button>
                        ) : (
                          <div className="chat-screen-input-wrapper">
                            <div className="chat-screen-input-area">
                              <input type="file" id="chat-screen-file" className="d-none"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;

                                  const allowedTypes = [
                                    "image/jpeg",
                                    "image/png",
                                    "image/jpg",
                                    "image/webp",
                                    "image/gif"
                                  ];

                                  const maxSizeMB = 5;

                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error("Only image files are allowed");
                                    e.target.value = "";
                                    return;
                                  }

                                  if (file.size > maxSizeMB * 1024 * 1024) {
                                    toast.error("Image size must be less than 5MB");
                                    e.target.value = "";
                                    return;
                                  }

                                  sendMessage(file);
                                  e.target.value = "";
                                }}
                              />
                              <label htmlFor="chat-screen-file" className="chat-screen-file-label"
                                onClick={async (e) => {
                                  const isBlocked = await checkIfBlocked(channel, userId);

                                  if (selectedBooking?.is_other_block === 1 || isBlocked) {
                                    e.preventDefault();
                                    toast.error("You are blocked")
                                  } else {
                                    sendMessage();
                                  }
                                }} >
                                <ImAttachment />
                              </label>
                              <input type="text" className="chat-screen-text-input form-control" style={{ padding: isMobileWidth ? "10px" : "15px", border: "1px solid #000", borderRadius: "10px" }} placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessageClick()
                                  }
                                }}
                              />
                            </div>
                            <button className="chat-screen-send-button" onClick={() => {
                              handleSendMessageClick()
                            }}
                              disabled={!message.trim() && !document.getElementById("chat-screen-file")?.files?.length} >
                              <img src="images/chat/send.svg" style={{ color: 'white', height: isMobileWidth ? "20px" : "" }} />
                            </button>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Container>
                </div>
              </Modal.Body>
            </Modal>
          }
        </div>
      </div>
      <ReportBookingModal show={showReportForm} handleClose={() => setShowReportForm(false)}
        user_id={userId} booking_id={selectedBooking?.booking_id}
        property_id={selectedBooking?.property_id}
      />
    </>
  );
};

export default React.memo(HostChat);





