import React, { useEffect, useMemo, useRef, useState } from "react";
import { db, storage } from "../../config/firebase";
import {
  Card,
  Button,
  Image,
  Dropdown,
  FormControl,
  InputGroup,
  Container,
  Modal,
} from "react-bootstrap";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  writeBatch,
  getDocs,
  where,
  limit,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { PiClockCountdownFill } from "react-icons/pi";
import { ImAttachment } from "react-icons/im";
import { useLocation, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaStar, FaRegStar } from "react-icons/fa";
import axios from "axios";
import { KEYS, baseURL, imageBase } from "../../config/Constant";
import { formDataApi } from "../../utils/api";
import useChat from "../../hooks/host/useChat";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import ReportBookingModal from "../../components/host/ReportBookingModal";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoSearch } from "react-icons/io5";
import { containsInappropriateWord } from "../../config/ReusableFn";
import defaultContact from "../../assets/defaultContact.jpg";
import useBook from "../../hooks/host/useBook";

const HostChat = () => {
  const {
    muteUmuteUser,
    blockUnblockUser,
    archieveUnarchieveUser,
    deleteChatUser,
    favoriteChatUser,
    getChannelUser,
    JoinChannel,
  } = useChat();

  const { fetchGuestReview } = useBook();
  const navigate = useNavigate();
  const { userInfo } = useSelector(({ user }) => user);
  const profileData = useSelector((state) => state.profile);

  const location = useLocation();
  const [targetUserStatus, setTargetUserStatus] = useState("Offline");
  const selectedMsg = location?.state?.selectedReason;
  const senderDetail =
    location?.state?.data?.sender_detail || location?.state?.sender_detail;
  // console.log(senderDetail, "send details", selectedMsg, "Selected Message**")
  const property_id =
    location?.state?.data?.property_id || location?.state?.property_id;

  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Conversations");
  const [channel, setChannel] = useState(null);

  const initializedChannelRef = useRef(null);
  const isInitializingChannelRef = useRef(false);
  const createdChannelsRef = useRef(new Set());
  const deletedChannelsRef = useRef(new Set());
  const [guestReview, setGuestReview] = useState(null);
  const hasSentAutoMessage = useRef(false);

  const [getList, setGetList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const userData =
    JSON.parse(localStorage.getItem(KEYS.USER_INFO)) ||
    JSON.parse(sessionStorage.getItem(KEYS.USER_INFO));
  const userTypes = localStorage.getItem(KEYS.USER_TYPE);

  const userId = userInfo?.user_id
    ? String(userInfo.user_id)
    : userData?.user_id
      ? String(userData.user_id)
      : null;

  const messagesContainerRef = useRef(null);

  const [lastMessages, setLastMessages] = useState({});
  const [unreadStatus, setUnreadStatus] = useState({});
  const [userStatuses, setUserStatuses] = useState({});
  const [conversationTimestamps, setConversationTimestamps] = useState({});

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update current user's presence in Firebase chat_presence collection (matches iOS safeDocumentID)
  useEffect(() => {
    if (!userId) return;

    const updatePresence = async () => {
      try {
        const docId = btoa(String(userId))
          .replace(/\//g, "_")
          .replace(/\+/g, "-")
          .replace(/=/g, "");
        const presenceRef = doc(db, "chat_presence", docId);
        const now = new Date();
        const activeUntil = new Date(now.getTime() + 60 * 1000); // 60s matching iOS

        await setDoc(
          presenceRef,
          {
            user_id: String(userId),
            active_until: activeUntil,
            last_seen_at: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error("Error updating chat_presence:", err);
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 25000); // 25s heartbeat matching iOS

    return () => clearInterval(interval);
  }, [userId]);

  // Real-time listener on chat_presence collection for Online/Offline status
  useEffect(() => {
    if (!userId) return;

    const presenceRef = collection(db, "chat_presence");

    const unsubscribe = onSnapshot(
      presenceRef,
      (snapshot) => {
        const now = new Date();
        const presenceMap = {};

        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          let docUserId = data.user_id || data.userId;
          if (!docUserId && docSnap.id) {
            try {
              let b64 = docSnap.id.replace(/_/g, "/").replace(/-/g, "+");
              while (b64.length % 4 !== 0) {
                b64 += "=";
              }
              const decoded = atob(b64);
              if (decoded && !isNaN(decoded)) docUserId = decoded;
            } catch (e) {
              docUserId = docSnap.id;
            }
          }

          if (docUserId) {
            let activeUntil = null;
            if (data.active_until?.toDate) {
              activeUntil = data.active_until.toDate();
            } else if (data.active_until?.seconds) {
              activeUntil = new Date(data.active_until.seconds * 1000);
            } else if (data.active_until) {
              activeUntil = new Date(data.active_until);
            }

            let lastSeenAt = null;
            if (data.last_seen_at?.toDate) {
              lastSeenAt = data.last_seen_at.toDate();
            } else if (data.last_seen_at?.seconds) {
              lastSeenAt = new Date(data.last_seen_at.seconds * 1000);
            } else if (data.last_seen_at) {
              lastSeenAt = new Date(data.last_seen_at);
            }

            const isOnline =
              (activeUntil && activeUntil.getTime() > now.getTime() - 10000) ||
              (lastSeenAt && now.getTime() - lastSeenAt.getTime() < 90 * 1000);

            presenceMap[String(docUserId)] = isOnline ? "Online" : "Offline";
          }
        });

        const getOtherId = (item) => {
          if (!item) return null;
          const candidateIds = [
            item.sender_id,
            item.sender_user_id,
            item.user_id,
            item.guest_id,
            item.receiver_id,
            item.host_id,
          ]
            .filter(Boolean)
            .map(String);
          const other = candidateIds.find((id) => id !== String(userId));
          if (other) return other;
          return userTypes === "host"
            ? String(item.sender_id || item.guest_id || "")
            : String(item.receiver_id || item.host_id || "");
        };

        // Determine status for selected target user
        const currentTargetId = selectedBooking
          ? getOtherId(selectedBooking)
          : senderDetail?.user_id || senderDetail?.host_id;

        if (currentTargetId) {
          const status = presenceMap[String(currentTargetId)] || "Offline";
          setTargetUserStatus(status);
        } else {
          setTargetUserStatus("Offline");
        }

        // Map statuses for conversation list items
        if (getList?.length > 0) {
          const mapGroupStatuses = {};
          getList.forEach((b) => {
            const otherUserId = getOtherId(b);
            if (otherUserId) {
              mapGroupStatuses[b.group_name] =
                presenceMap[String(otherUserId)] || "Offline";
            }
          });
          setUserStatuses(mapGroupStatuses);
        }
      },
      (error) => {
        console.error("Error listening to chat_presence:", error);
      }
    );

    return () => unsubscribe();
  }, [userId, selectedBooking, getList, userTypes, senderDetail]);

  // Main chat initialization effect
  useEffect(() => {
    let isMounted = true;

    const initializeFirebaseChat = async () => {
      if (!userId || !userTypes) return;

      const currentPropertyId = selectedBooking?.property_id || property_id;

      let guestId;
      let hostId;

      if (selectedBooking) {
        if (userTypes === "host") {
          hostId = String(userId);
          guestId = String(
            selectedBooking.sender_id ||
            selectedBooking.sender_user_id ||
            selectedBooking.user_id
          );
        } else {
          guestId = String(userId);
          hostId = String(
            selectedBooking.receiver_id ||
            selectedBooking.host_id
          );
        }
      } else if (senderDetail?.user_id && senderDetail?.host_id && String(senderDetail.user_id) !== String(senderDetail.host_id)) {
        guestId = String(senderDetail.user_id);
        hostId = String(senderDetail.host_id);
      } else {
        if (userTypes === "host") {
          hostId = String(userId);
          guestId = senderDetail?.user_id ? String(senderDetail.user_id) : "";
        } else {
          guestId = String(userId);
          hostId = senderDetail?.host_id ? String(senderDetail.host_id) : "";
        }
      }

      if (!guestId || !hostId || String(guestId) === String(hostId)) return;

      guestId = String(guestId);
      hostId = String(hostId);

      const channelKey =
        selectedBooking?.group_name ||
        `Zyvoo_guest_${Number(guestId)}_host_${Number(hostId)}`;

      if (channelKey && deletedChannelsRef.current.has(channelKey)) {
        return;
      }

      // console.log("Chat initializing for channel:", channelKey, {
      //   guestId,
      //   hostId,
      //   propertyId: currentPropertyId,
      //   selectedBooking,
      //   senderDetail,
      // });

      // Always ensure channel state is set so messages listener attaches to channelKey
      setChannel((prev) => {
        if (prev?.channelName === channelKey) return prev;
        return {
          id: channelKey,
          channelName: channelKey,
          guestId: String(guestId),
          hostId: String(hostId),
          propertyId: String(currentPropertyId || 0),
        };
      });
      setChatId(channelKey);

      if (
        initializedChannelRef.current === channelKey ||
        isInitializingChannelRef.current
      ) {
        return;
      }

      isInitializingChannelRef.current = true;

      try {
        initializedChannelRef.current = channelKey;

        // STEP 1: If navigated from MessageHost (senderDetail exists), hit JoinChannel API FIRST to register/join channel in backend DB
        if (senderDetail?.user_id || senderDetail?.host_id) {
          const sId = userTypes === "host" ? userId : guestId;
          const rId = userTypes === "host" ? guestId : hostId;
          // console.log("Hitting JoinChannel API for:", {
          //   senderId: String(sId),
          //   receiverId: String(rId),
          //   groupChannel: channelKey,
          //   userType: String(userTypes) || "host",
          // });
          await JoinChannel({
            senderId: String(sId),
            receiverId: String(rId),
            groupChannel: channelKey,
            userType: String(userTypes) || "host",
          });
          // console.log("Joined channel successfully:", channelKey);
          // Refresh conversation list from backend API after channel registration
          await getUserList();
        }

        // STEP 2: Get or create Firebase Firestore document (prevents duplicate room creation in Firebase)
        const chatChannel = await getOrCreateChannel(
          guestId,
          hostId,
          String(currentPropertyId || 0)
        );

        if (!chatChannel || !isMounted) return;

        setChannel(chatChannel);
        setChatId(chatChannel.channelName || chatChannel.id);
        // console.log("Chat channel initialized in Firebase:", chatChannel.channelName);

        if (senderDetail?.user_id || senderDetail?.host_id) {
          const targetUserId = senderDetail?.user_id || senderDetail?.host_id;
          const target = getList.find(
            (b) =>
              b.group_name === channelKey ||
              String(b.sender_id) === String(targetUserId) ||
              String(b.receiver_id) === String(targetUserId)
          );
          if (target) {
            setSelectedBooking(target);
          }
        }

        if (selectedMsg && !hasSentAutoMessage.current) {
          const alreadySent = localStorage.getItem("is_already_sent");
          if (!alreadySent) {
            hasSentAutoMessage.current = true;
            localStorage.setItem("is_already_sent", "true");
            // console.log("Sending auto-selected message:", selectedMsg);
            await sendMessage(null, selectedMsg, chatChannel);
          }
        }
      } catch (error) {
        console.error("Firebase chat initialization error:", error);
      } finally {
        isInitializingChannelRef.current = false;
      }
    };

    initializeFirebaseChat();

    return () => {
      isMounted = false;
    };
  }, [
    selectedBooking?.group_name,
    selectedBooking?.property_id,
    selectedBooking?.sender_id,
    selectedBooking?.sender_user_id,
    selectedBooking?.receiver_id,
    selectedBooking?.host_id,
    property_id,
    userId,
    userTypes,
    senderDetail?.user_id,
    senderDetail?.host_id,
  ]);

  // Fetch conversation user list
  const getUserList = async () => {
    try {
      if (!userId || !userTypes) return;

      const response = await getChannelUser({
        user_id: String(userId),
        type: userTypes,
      });

      if (response?.data && Array.isArray(response.data)) {
        const validChannels = response.data.filter(
          (b) =>
            !b?.is_deleted &&
            b?.is_deleted !== 1 &&
            !deletedChannelsRef.current.has(b.group_name)
        );
        setGetList(validChannels);
        // console.log(response?.data, "fetch channgel");

        if (senderDetail?.user_id || senderDetail?.host_id) {
          const targetUserId = senderDetail?.user_id || senderDetail?.host_id;
          const target = validChannels.find((b) => {
            const matchUser =
              String(b.sender_id) === String(targetUserId) ||
              String(b.receiver_id) === String(targetUserId) ||
              String(b.host_id) === String(targetUserId);
            const matchProp = property_id
              ? String(b.property_id) === String(property_id)
              : true;
            return matchUser || matchProp;
          });
          if (target) {
            setSelectedBooking(target);
          }
        }
      } else {
        setGetList([]);
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
      setGetList([]);
    }
  };

  // Initial conversation list fetch effect
  useEffect(() => {
    if (!userId || !userTypes) return;
    // Skip initial fetch when senderDetail is present so initializeFirebaseChat hits JoinChannel API first
    if (senderDetail?.user_id || senderDetail?.host_id) return;
    getUserList();
  }, [userId, userTypes, senderDetail?.user_id, senderDetail?.host_id]);

  // Auto-select initial conversation when getList arrives
  useEffect(() => {
    if (getList?.length > 0) {
      let target = null;
      if (senderDetail?.user_id || senderDetail?.host_id || property_id) {
        const targetUserId = senderDetail?.user_id || senderDetail?.host_id;
        target = getList.find((b) => {
          const matchUser =
            String(b.sender_id) === String(targetUserId) ||
            String(b.receiver_id) === String(targetUserId) ||
            String(b.host_id) === String(targetUserId);
          const matchProp = property_id
            ? String(b.property_id) === String(property_id)
            : true;
          return matchUser || matchProp;
        });
      }
      if (target) {
        setSelectedBooking(target);
      } else if (!selectedBooking) {
        setSelectedBooking(getList[0]);
      }
    }
  }, [getList, senderDetail, property_id]);

  // Guest rating review
  const guestReviewDetail = async (data) => {
    if (userTypes === "host" && data?.sender_id) {
      try {
        const response = await fetchGuestReview({ user_id: data.sender_id });
        if (response?.success) {
          setGuestReview(response?.data?.total_rating);
        }
      } catch (err) {
        console.error("Error fetching guest review:", err);
      }
    }
  };

  useEffect(() => {
    if (selectedBooking) {
      guestReviewDetail(selectedBooking);
    }
  }, [selectedBooking]);

  // Mark all unread messages as read in Firestore
  useEffect(() => {
    const markMessagesRead = async () => {
      if (!userData?.user_id) return;

      try {
        const currentUserId = String(userData.user_id);
        const channelsQuery = query(
          collection(db, "chat_channels"),
          where("participants", "array-contains", currentUserId)
        );

        const snapshot = await getDocs(channelsQuery);
        const batch = writeBatch(db);

        snapshot.docs.forEach((channelDoc) => {
          batch.update(channelDoc.ref, {
            [`readBy.${currentUserId}`]: serverTimestamp(),
          });
        });

        await batch.commit();
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };

    markMessagesRead();
  }, [userData?.user_id]);

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let filtered = getList || [];

    filtered = filtered.filter(
      (booking) => !booking?.is_deleted && booking?.is_deleted !== 1
    );

    filtered = filtered.filter((booking) =>
      userTypes === "host"
        ? booking?.sender_name
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase())
        : booking?.receiver_name
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase())
    );

    if (selectedFilter === "Archived") {
      filtered = filtered.filter((booking) => booking?.is_archived);
    }

    if (selectedFilter === "Unread") {
      filtered = filtered.filter((booking) => {
        return unreadStatus[booking.group_name] === true;
      });
    }

    filtered.sort((a, b) => {
      const timeA = conversationTimestamps[a.group_name]
        ? new Date(conversationTimestamps[a.group_name]).getTime()
        : new Date(a.booking_date || 0).getTime();

      const timeB = conversationTimestamps[b.group_name]
        ? new Date(conversationTimestamps[b.group_name]).getTime()
        : new Date(b.booking_date || 0).getTime();

      return timeB - timeA;
    });

    return filtered;
  }, [
    getList,
    searchQuery,
    selectedFilter,
    unreadStatus,
    conversationTimestamps,
    userTypes,
  ]);

  // Fetch last messages & unread status for getList items (runs on getList change)
  useEffect(() => {
    if (!getList?.length || !userId) return;

    let isMounted = true;

    const fetchConversationDetails = async () => {
      try {
        const messagesData = {};
        const unreadData = {};
        const timestamps = {};

        for (const booking of getList) {
          try {
            const channelName =
              booking?.group_name || getBookingChatId(booking);
            if (!channelName) continue;

            const channelRef = doc(db, "chat_channels", channelName);
            const channelSnap = await getDoc(channelRef);

            if (!channelSnap.exists()) {
              messagesData[channelName] = {
                body: "No messages yet",
                timestamp: "N/A",
                unread: false,
                lastMessageDate: booking.booking_date || new Date(0),
              };
              unreadData[channelName] = false;
              timestamps[channelName] = booking.booking_date || new Date(0);
              continue;
            }

            const channelData = channelSnap.data();
            let lastMsg = null;

            const lastMsgText = channelData.last_message || channelData.lastMessage;
            const lastMsgType = channelData.last_media_type || channelData.lastMessageType || "text";
            const lastMsgAt = channelData.last_message_at || channelData.lastMessageAt;
            const lastMsgSender = channelData.last_sender_id || channelData.lastMessageSenderId || null;

            if (lastMsgText || lastMsgAt) {
              lastMsg = {
                body: lastMsgText,
                type: lastMsgType,
                createdAt: lastMsgAt,
                senderId: lastMsgSender,
              };
            }

            if (!lastMsg) {
              const messagesRef = collection(
                db,
                "chat_channels",
                channelName,
                "messages"
              );
              const messagesQuery = query(
                messagesRef,
                orderBy("created_at", "desc"),
                limit(1)
              );
              const messageSnapshot = await getDocs(messagesQuery);

              if (!messageSnapshot.empty) {
                const lastDoc = messageSnapshot.docs[0];
                const data = lastDoc.data();
                lastMsg = {
                  id: lastDoc.id,
                  body: data.text || data.body || data.message,
                  type: data.type || "text",
                  createdAt: data.created_at || data.createdAt,
                  senderId: data.sender_id || data.senderId || data.author,
                };
              }
            }

            const readBy = channelData.readBy || {};
            const myLastRead = readBy[String(userId)];

            const lastMessageDate = lastMsg?.createdAt?.toDate
              ? lastMsg.createdAt.toDate()
              : lastMsgAt?.toDate
                ? lastMsgAt.toDate()
                : booking.booking_date
                  ? new Date(booking.booking_date)
                  : new Date(0);

            const lastMessageSender = String(
              lastMsg?.senderId || lastMsgSender || ""
            );
            const isMyLastMessage = lastMessageSender === String(userId);

            let isUnread = false;

            if (lastMsg && !isMyLastMessage) {
              if (!myLastRead) {
                isUnread = true;
              } else {
                const readDate = myLastRead?.toDate
                  ? myLastRead.toDate()
                  : new Date(myLastRead);
                isUnread = lastMessageDate > readDate;
              }
            }

            messagesData[channelName] = {
              body:
                lastMsg?.body || lastMsgText || "No messages yet",
              timestamp:
                lastMessageDate && lastMessageDate.getTime() > 0
                  ? lastMessageDate.toLocaleString()
                  : "N/A",
              unread: isUnread,
              lastMessageDate,
            };

            unreadData[channelName] = isUnread;
            timestamps[channelName] = lastMessageDate;
          } catch (err) {
            console.error(
              `Error fetching conversation for ${booking.group_name}`,
              err
            );
          }
        }

        if (!isMounted) return;

        setLastMessages(messagesData);
        setUnreadStatus(unreadData);
        setConversationTimestamps(timestamps);
      } catch (err) {
        console.error("Error fetching Firebase conversations:", err);
      }
    };

    fetchConversationDetails();

    return () => {
      isMounted = false;
    };
  }, [getList, userId]);

  const safeMemberDocId = (val) => {
    if (!val) return "";
    return btoa(String(val))
      .replace(/\//g, "_")
      .replace(/\+/g, "-")
      .replace(/=/g, "");
  };

  // Realtime Firestore listeners for current active channel
  useEffect(() => {
    if (!channel?.channelName || !userId) {
      return;
    }

    const channelName = channel.channelName;
    setChatLoading(true);

    const channelRef = doc(db, "chat_channels", channelName);
    const messagesRef = collection(
      db,
      "chat_channels",
      channelName,
      "messages"
    );
    const messagesQuery = query(messagesRef, orderBy("created_at", "asc"));

    // Listen to member document for deletion boundary (deleted_before)
    const memberDocId = safeMemberDocId(userId);
    const memberRef = doc(db, "chat_channels", channelName, "members", memberDocId);

    let deletedBeforeDate = null;
    const unsubscribeMember = onSnapshot(memberRef, (memberSnap) => {
      if (memberSnap.exists()) {
        const data = memberSnap.data();
        if (data.deleted_before?.toDate) {
          deletedBeforeDate = data.deleted_before.toDate();
        } else if (data.deleted_before) {
          deletedBeforeDate = new Date(data.deleted_before);
        } else {
          deletedBeforeDate = null;
        }
      } else {
        deletedBeforeDate = null;
      }
    });

    const unsubscribeMessages = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const processedMessages = snapshot.docs
          .map((messageDoc) => {
            const data = messageDoc.data();
            const author = String(data.sender_id || data.senderId || data.author || "");

            let messageDate = new Date();
            const ts = data.created_at || data.createdAt;
            if (ts?.toDate) {
              messageDate = ts.toDate();
            } else if (ts?.seconds) {
              messageDate = new Date(ts.seconds * 1000);
            } else if (ts) {
              messageDate = new Date(ts);
            }

            return {
              id: messageDoc.id,
              ...data,
              author,
              senderId: author,
              body: data.text || data.body || data.message || "",
              type: data.type || "text",
              mediaUrl: data.media_url || data.mediaUrl || null,
              mediaType: data.media_type || data.mediaType || null,
              fileName: data.file_name || data.fileName || null,
              isMyMessage: String(author) === String(userId),
              dateCreated: messageDate,
            };
          })
          .filter((msg) => {
            if (!deletedBeforeDate) return true;
            return msg.dateCreated.getTime() > deletedBeforeDate.getTime();
          });

        setMessages(processedMessages);
        setChatLoading(false);
      },
      (error) => {
        console.error("Firebase messages listener error:", error);
        setChatLoading(false);
      }
    );

    const unsubscribeChannel = onSnapshot(
      channelRef,
      (snapshot) => {
        if (!snapshot.exists()) return;
        const channelData = snapshot.data();
        const blockedUsers = channelData.blockedUsers || {};
        const blockedBy = channelData.blocked_by || [];
        const mutedBy = channelData.muted_by || [];

        const isBlockedByOther =
          blockedBy.some((id) => String(id) !== String(userId)) ||
          Object.entries(blockedUsers).some(
            ([id, isB]) => String(id) !== String(userId) && isB === true
          );

        const isBlockedByMe =
          blockedBy.includes(String(userId)) ||
          blockedUsers[String(userId)] === true;

        const isMutedByMe = mutedBy.includes(String(userId));

        setSelectedBooking((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            is_other_block: isBlockedByOther ? 1 : 0,
            is_blocked: isBlockedByMe ? 1 : prev.is_blocked,
            is_muted: isMutedByMe ? 1 : prev.is_muted,
          };
        });
      },
      (error) => {
        console.error("Channel listener error:", error);
      }
    );

    return () => {
      unsubscribeMember();
      unsubscribeMessages();
      unsubscribeChannel();
    };
  }, [channel?.channelName, userId]);

  // Realtime listeners for conversation list items
  const getBookingChatId = (booking) => {
    if (booking?.group_name) return booking.group_name;
    if (!booking?.property_id) return null;

    let guestId;
    let hostId;

    if (userTypes === "host") {
      guestId = booking?.sender_id;
      hostId = userId;
    } else {
      guestId = userId;
      hostId = booking?.receiver_id || booking?.host_id;
    }

    if (!guestId || !hostId) return null;

    return `Zyvoo_guest_${Number(guestId)}_host_${Number(hostId)}`;
  };

  useEffect(() => {
    if (!getList?.length || !userId) return;

    const unsubscribers = [];

    getList.forEach((booking) => {
      const firebaseChatId = getBookingChatId(booking);
      if (!firebaseChatId) return;

      const chatRef = doc(db, "chat_channels", firebaseChatId);

      const unsubscribe = onSnapshot(chatRef, (snapshot) => {
        if (!snapshot.exists()) return;

        const data = snapshot.data();
        const channelName = booking.group_name || firebaseChatId;
        const msgText = data.last_message || data.lastMessage || "";
        const msgDate = data.last_message_at?.toDate?.() || data.lastMessageAt?.toDate?.() || null;

        setLastMessages((prev) => ({
          ...prev,
          [channelName]: {
            body: msgText,
            timestamp: msgDate,
            lastMessageDate: msgDate,
          },
        }));

        setConversationTimestamps((prev) => ({
          ...prev,
          [channelName]: msgDate || booking.booking_date || null,
        }));
      });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [getList, userId, userTypes]);

  const getOrCreateChannel = async (guestId, hostId, propertyId) => {
    try {
      if (!guestId || !hostId) {
        console.error("Missing required parameters for channel creation");
        return null;
      }

      if (String(guestId) === String(hostId)) {
        if (
          senderDetail?.user_id &&
          senderDetail?.host_id &&
          String(senderDetail.user_id) !== String(senderDetail.host_id)
        ) {
          guestId = String(senderDetail.user_id);
          hostId = String(senderDetail.host_id);
        } else {
          console.error(
            "Invalid channel parameters: guestId and hostId are identical",
            guestId
          );
          return null;
        }
      }

      // Generate unique channel key: Zyvoo_guest_{guestId}_host_{hostId}
      const channelName =
        selectedBooking?.group_name ||
        `Zyvoo_guest_${Number(guestId)}_host_${Number(hostId)}`;

      // Check if room document already exists in Firebase Firestore
      const channelRef = doc(db, "chat_channels", channelName);
      const channelSnapshot = await getDoc(channelRef);

      let isNewChannel = false;

      if (!channelSnapshot.exists()) {
        // Room DOES NOT exist: Create single new channel document in Firestore
        isNewChannel = true;

        await setDoc(channelRef, {
          channel_name: channelName,
          property_id: String(propertyId),
          guest_id: String(guestId),
          host_id: String(hostId),
          participant_ids: [String(guestId), String(hostId)],
          participants: [String(guestId), String(hostId)],
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
          last_message: null,
          last_media_url: null,
          last_file_name: null,
          last_media_type: null,
        });
      } else {
        // Room ALREADY exists: Update existing document (Prevents Duplicate Channel Creation in Firebase)
        await updateDoc(channelRef, {
          participant_ids: arrayUnion(String(guestId), String(hostId)),
          participants: arrayUnion(String(guestId), String(hostId)),
          updated_at: serverTimestamp(),
        });
      }

      if (isNewChannel && !createdChannelsRef.current.has(channelName)) {
        createdChannelsRef.current.add(channelName);
        const sId = userTypes === "host" ? userId : guestId;
        const rId = userTypes === "host" ? guestId : hostId;
        await JoinChannel({
          senderId: String(sId),
          receiverId: String(rId),
          groupChannel: channelName,
          userType: String(userTypes) || "host",
        });
        await getUserList();
      }

      return {
        id: channelName,
        channelName,
        guestId: String(guestId),
        hostId: String(hostId),
        propertyId: String(propertyId),
      };
    } catch (error) {
      console.error("Firebase channel creation error:", error);
      return null;
    }
  };

  const checkIfBlocked = (currentChannel, myUserId) => {
    if (!currentChannel || !myUserId) return false;
    return currentChannel.blockedUsers?.[String(myUserId)] === true;
  };

  const handleSendMessageClick = async () => {
    const myIdentity = String(userId);
    const isBlocked = checkIfBlocked(channel, myIdentity);
    if (selectedBooking?.is_other_block === 1 || isBlocked) {
      toast.error("You are blocked");
      return;
    }

    if (!message.trim()) return;

    if (containsInappropriateWord(message)) {
      toast.error(
        "This message contains inappropriate words and is not allowed"
      );
      setMessage("");
      return;
    }
    await sendMessage();
  };

  const sendMessage = async (
    file = null,
    autoMessageContent = null,
    activeChannel = null
  ) => {
    const currentChannel = activeChannel || channel;
    const channelName =
      currentChannel?.channelName ||
      currentChannel?.id ||
      chatId ||
      initializedChannelRef.current ||
      selectedBooking?.group_name ||
      (senderDetail?.user_id && senderDetail?.host_id
        ? `Zyvoo_guest_${Number(senderDetail.user_id)}_host_${Number(senderDetail.host_id)}`
        : null);

    if (!channelName) {
      console.error("No active channel");
      toast.error("Chat is initializing. Please wait...");
      return;
    }

    let messageToSend = "";
    let isAutoMessage = false;

    if (autoMessageContent) {
      messageToSend = autoMessageContent;
      isAutoMessage = true;
    } else if (file) {
      let tempMessage = null;

      try {
        setSendingMessage(true);
        const localMediaUrl = URL.createObjectURL(file);
        const tempId = `temp_${Date.now()}`;

        const isPdf =
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf");
        const mediaType =
          file.type || (isPdf ? "application/pdf" : "image/jpeg");
        const previewText = isPdf ? "Document" : "Photo";
        const displayMsgText = isPdf ? file.name : "Photo";

        tempMessage = {
          id: tempId,
          type: "media",
          isMyMessage: true,
          author: String(userId),
          senderId: String(userId),
          body: displayMsgText,
          dateCreated: new Date(),
          mediaUrl: localMediaUrl,
          uploading: true,
          fileName: file.name,
          fileType: mediaType,
          mediaType: mediaType,
        };

        setMessages((prev) => [...prev, tempMessage]);

        // Upload media file to API using baseURL & localStorage authorization token
        const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
        const token = userData?.access_token || "";

        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post(
          `${baseURL}upload_chat_media`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token ? `Bearer ${token}` : "",
              Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          }
        );

        const uploadData = uploadRes?.data;
        const mediaPath =
          uploadData?.data?.media_path || uploadData?.media_path;

        if (!mediaPath) {
          throw new Error(
            uploadData?.message || "Failed to upload chat media to server"
          );
        }

        const fullMediaUrl = mediaPath.startsWith("http")
          ? mediaPath
          : `${imageBase}${mediaPath.replace(/^\/+/, "")}`;

        const messagesRef = collection(
          db,
          "chat_channels",
          channelName,
          "messages"
        );

        const newMsgDoc = await addDoc(messagesRef, {
          sender_id: String(userId),
          text: displayMsgText,
          body: displayMsgText,
          type: "media",
          media_type: mediaType,
          media_url: fullMediaUrl,
          file_name: file.name,
          created_at: serverTimestamp(),
        });

        const channelRef = doc(db, "chat_channels", channelName);
        await updateDoc(channelRef, {
          channel_name: channelName,
          last_file_name: file.name,
          last_media_type: mediaType,
          last_media_url: fullMediaUrl,
          last_message: previewText,
          last_message_at: serverTimestamp(),
          last_message_id: newMsgDoc.id,
          last_sender_id: String(userId),
          updated_at: serverTimestamp(),
        });

        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        setConversationTimestamps((prev) => ({
          ...prev,
          [channelName]: new Date(),
        }));
        setUnreadStatus((prev) => ({
          ...prev,
          [channelName]: false,
        }));

        URL.revokeObjectURL(localMediaUrl);
      } catch (error) {
        console.error("Error sending Firebase file:", error);
        toast.error("Failed to upload file: " + (error.message || "Upload error"));
        if (tempMessage) {
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== tempMessage.id)
          );
        }
      } finally {
        setSendingMessage(false);
        const fileInput = document.getElementById("fileUpload");
        if (fileInput) fileInput.value = "";
        const screenFileInput = document.getElementById("chat-screen-file");
        if (screenFileInput) screenFileInput.value = "";
      }
      return;
    } else if (message.trim()) {
      messageToSend = message.trim();
      setMessage("");
    } else {
      return;
    }

    if (!messageToSend) return;

    try {
      setSendingMessage(true);

      const messagesRef = collection(
        db,
        "chat_channels",
        channelName,
        "messages"
      );

      const newMsgDoc = await addDoc(messagesRef, {
        sender_id: String(userId),
        text: messageToSend,
        body: messageToSend,
        type: "text",
        media_type: "text",
        is_auto_message: isAutoMessage,
        created_at: serverTimestamp(),
      });

      const channelRef = doc(db, "chat_channels", channelName);
      await updateDoc(channelRef, {
        channel_name: channelName,
        last_message: messageToSend,
        last_message_id: newMsgDoc.id,
        last_media_type: "text",
        last_media_url: null,
        last_file_name: null,
        last_message_at: serverTimestamp(),
        last_sender_id: String(userId),
        updated_at: serverTimestamp(),
      });

      // Reset is_deleted to false in members subcollection for participants so chat re-appears on new message
      const participantIds = [
        String(userId),
        String(selectedBooking?.sender_id || selectedBooking?.receiver_id || "")
      ].filter(Boolean);

      participantIds.forEach(async (pId) => {
        try {
          const mDocId = safeMemberDocId(pId);
          const mRef = doc(db, "chat_channels", channelName, "members", mDocId);
          await setDoc(
            mRef,
            {
              user_id: String(pId),
              is_deleted: false,
            },
            { merge: true }
          );
        } catch (e) {
          console.error("Error updating member is_deleted status:", e);
        }
      });

      setConversationTimestamps((prev) => ({
        ...prev,
        [channelName]: new Date(),
      }));

      setUnreadStatus((prev) => ({
        ...prev,
        [channelName]: false,
      }));
    } catch (error) {
      console.error("Failed to send Firebase message:", error);
      if (!isAutoMessage) {
        setMessage(messageToSend);
      }
    } finally {
      setSendingMessage(false);
    }
  };

  // Auto-message logic for booking enquiry / pre-selected message
  useEffect(() => {
    if (!selectedMsg || hasSentAutoMessage.current) return;

    const alreadySent = localStorage.getItem("is_already_sent");
    if (alreadySent) {
      hasSentAutoMessage.current = true;
      return;
    }

    const sendAutoMessage = async () => {
      try {
        if (
          selectedBooking?.is_other_block !== 0 &&
          selectedBooking?.is_other_block != null
        ) {
          toast.error("You are blocked");
          return;
        }

        const activeChannel =
          channel ||
          (chatId || initializedChannelRef.current
            ? {
              id: chatId || initializedChannelRef.current,
              channelName: chatId || initializedChannelRef.current,
            }
            : null);
        if (!activeChannel) return;

        hasSentAutoMessage.current = true;
        localStorage.setItem("is_already_sent", "true");

        await sendMessage(null, selectedMsg, activeChannel);
      } catch (error) {
        console.error("Auto message sending error:", error);
      }
    };

    sendAutoMessage();
  }, [
    selectedMsg,
    senderDetail?.user_id,
    senderDetail?.host_id,
    property_id,
    selectedBooking?.property_id,
    selectedBooking?.is_other_block,
  ]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("is_already_sent");
    };
  }, [location.pathname]);

  const handleMuteUnmute = async (data) => {
    const targetBooking = data || selectedBooking;
    const channelName = targetBooking?.group_name || channel?.channelName;
    const isCurrentlyMuted = targetBooking?.is_muted == 1;
    const newMuteStatus = isCurrentlyMuted ? 0 : 1;

    // Commented backend API call to rely solely on Firebase
    // const res = await muteUmuteUser({
    //   user_id: userId,
    //   group_channel: channelName,
    //   mute: newMuteStatus,
    // });

    if (channelName && userId) {
      try {
        const channelRef = doc(db, "chat_channels", channelName);
        await setDoc(
          channelRef,
          {
            muted_by:
              newMuteStatus === 1
                ? arrayUnion(String(userId))
                : arrayRemove(String(userId)),
            updated_at: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error("Error updating Firestore muted_by:", err);
      }
    }

    if (selectedBooking?.group_name === channelName) {
      setSelectedBooking((prev) => ({
        ...prev,
        is_muted: newMuteStatus,
      }));
    }

    setGetList((prev) =>
      prev.map((item) =>
        item.group_name === channelName
          ? { ...item, is_muted: newMuteStatus }
          : item
      )
    );

    toast.success(newMuteStatus === 1 ? "Chat muted" : "Chat unmuted");
  };

  const handleBlockUnblock = async (data) => {
    const targetBooking = data || selectedBooking;
    const channelName = targetBooking?.group_name || channel?.channelName;
    const isCurrentlyBlocked = targetBooking?.is_blocked === 1;
    const newBlockStatus = isCurrentlyBlocked ? 0 : 1;

    // Commented backend API call to rely solely on Firebase
    // const blockerId =
    //   userTypes === "host"
    //     ? targetBooking?.receiver_id || targetBooking?.host_id || userId
    //     : targetBooking?.sender_id || userId;
    // const res = await blockUnblockUser({
    //   senderId: blockerId,
    //   group_channel: channelName,
    //   blockUnblock: newBlockStatus,
    // });

    if (channelName && userId) {
      try {
        const channelRef = doc(db, "chat_channels", channelName);
        await setDoc(
          channelRef,
          {
            blocked_by:
              newBlockStatus === 1
                ? arrayUnion(String(userId))
                : arrayRemove(String(userId)),
            [`blockedUsers.${String(userId)}`]: newBlockStatus === 1,
            updated_at: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error("Error updating Firestore blocked_by:", err);
      }
    }

    if (selectedBooking?.group_name === channelName) {
      setSelectedBooking((prev) => ({
        ...prev,
        is_blocked: newBlockStatus,
      }));
    }

    setGetList((prev) =>
      prev.map((item) =>
        item.group_name === channelName
          ? {
            ...item,
            is_blocked: newBlockStatus,
          }
          : item
      )
    );

    toast.success(newBlockStatus === 1 ? "User blocked" : "User unblocked");
  };

  const handleArchieveUnarchieve = async (data) => {
    const res = await archieveUnarchieveUser({
      user_id: userId,
      group_channel: data?.group_name,
    });

    if (res?.success) {
      setGetList((prevList) =>
        prevList.map((booking) =>
          booking.group_name === data?.group_name
            ? { ...booking, is_archived: data?.is_archived == 1 ? 0 : 1 }
            : booking
        )
      );

      if (selectedBooking?.group_name === data?.group_name) {
        setSelectedBooking((prev) => ({
          ...prev,
          is_archived: data?.is_archived == 1 ? 0 : 1,
        }));
      }
    }
  };

  const handleChatDelete = async (data) => {
    const targetBooking = data || selectedBooking;
    const channelName = targetBooking?.group_name || channel?.channelName;

    const res = await deleteChatUser({
      user_id: String(userId),
      user_type: String(userTypes),
      group_channel: channelName,
    });

    if (res?.success) {
      if (channelName && userId) {
        try {
          const docId = safeMemberDocId(userId);
          const memberRef = doc(
            db,
            "chat_channels",
            channelName,
            "members",
            docId
          );
          await setDoc(
            memberRef,
            {
              user_id: String(userId),
              deleted_before: serverTimestamp(),
              is_deleted: true,
              unread_count: 0,
            },
            { merge: true }
          );
        } catch (err) {
          console.error("Error updating Firestore deleted_before boundary:", err);
        }
      }

      if (channelName) {
        deletedChannelsRef.current.add(channelName);
        createdChannelsRef.current.delete(channelName);
      }
      if (selectedBooking?.group_name === channelName) {
        setSelectedBooking(null);
        setChannel(null);
        setChatId(null);
      }
      initializedChannelRef.current = null;
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      setGetList((prev) =>
        prev.filter((item) => item.group_name !== channelName)
      );
      toast.success("Chat deleted successfully");
    }
  };

  const handleFavoriteUnfavorite = async (data) => {
    const res = await favoriteChatUser({
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
    if (!dateStr) return "Not Available";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Not Available";

    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  const handleClose = () => {
    setSelectedBooking(null);
  };

  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const checkWindowWidth = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    checkWindowWidth();
    window.addEventListener("resize", checkWindowWidth);

    return () => window.removeEventListener("resize", checkWindowWidth);
  }, []);

  return (
    <>
      {/* Mobile Search and Filter Bar */}
      <div className="mob-search-filter border-start-0 border-end-0 mob-booking-filter mob-chat-filter">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="mob-search-filter-in">
                <div className="mob-search-bar-back">
                  <form action="" onSubmit={(e) => e.preventDefault()}>
                    <label>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button type="submit">
                        <i className="fa-regular fa-magnifying-glass"></i>
                      </button>
                    </label>
                  </form>
                </div>
                <div className="mob-filter-in ms-auto dropdown">
                  <a
                    href="#"
                    className="dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src="/images/mobile/filters/filter.svg"
                      loading="lazy"
                      alt=""
                    />
                  </a>
                  <div className="dropdown-menu">
                    <ul>
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedFilter("All Conversations");
                          }}
                        >
                          All Conversations
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedFilter("Archived");
                          }}
                        >
                          Archived
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedFilter("Unread");
                          }}
                        >
                          Unread
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-lg-4">
        <div
          className="d-flex flex-column flex-md-row gap-3"
          style={!isMobileWidth ? { height: "calc(100vh - 17vh)" } : {}}
        >
          {/* Sidebar Chat List */}
          <div
            className="flex-grow p-lg-2"
            style={{
              borderRadius: "8px",
              overflowY: isMobileWidth ? "" : "auto",
              height: "100%",
            }}
          >
            {!showSearch && !isMobileWidth ? (
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div style={{ fontWeight: "600" }}>{selectedFilter}</div>
                  <Dropdown
                    show={showDropdown}
                    onToggle={() => setShowDropdown(!showDropdown)}
                  >
                    <img
                      src={"/images/dropdown.svg"}
                      alt="Dropdown"
                      style={{ cursor: "pointer", width: "12px" }}
                      onClick={() => setShowDropdown(!showDropdown)}
                    />

                    <Dropdown.Menu
                      show={showDropdown}
                      align="end"
                      style={{ marginTop: "0.2rem" }}
                    >
                      <Dropdown.Item
                        as="button"
                        onClick={() => {
                          setSelectedFilter("All Conversations");
                          setShowDropdown(false);
                        }}
                      >
                        All Conversations
                      </Dropdown.Item>

                      <Dropdown.Item
                        as="button"
                        onClick={() => {
                          setSelectedFilter("Archived");
                          setShowDropdown(false);
                        }}
                      >
                        Archived
                      </Dropdown.Item>

                      <Dropdown.Item
                        as="button"
                        onClick={() => {
                          setSelectedFilter("Unread");
                          setShowDropdown(false);
                        }}
                      >
                        Unread
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <IoSearch
                  onClick={() => setShowSearch(true)}
                  style={{
                    marginRight: 5,
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                />
              </div>
            ) : (
              !isMobileWidth && (
                <InputGroup>
                  <FormControl
                    type="text"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      borderColor: "#e4e4e4",
                      borderRightColor: "#6c757d",
                    }}
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchQuery("");
                    }}
                  >
                    X
                  </Button>
                </InputGroup>
              )
            )}

            {filteredBookings?.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <Card
                  key={index}
                  className={`mt-3 mt-lg-4 ${selectedBooking?.group_name === booking.group_name
                    ? "border border-black"
                    : ""
                    }`}
                  style={{
                    cursor: "pointer",
                    borderRadius: "20px",
                  }}
                  onClick={() => {
                    setSelectedBooking(booking);
                  }}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div
                        className="CircleView"
                        style={{ position: "relative" }}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (userTypes === "guest") {
                            navigate("/host-listing", {
                              state: { hostId: booking?.receiver_id },
                            });
                          }
                        }}
                      >
                        <Image
                          src={
                            (userTypes === "host"
                              ? booking?.sender_profile
                              : booking?.receiver_image)
                              ? `${imageBase}${userTypes === "host"
                                ? booking?.sender_profile
                                : booking?.receiver_image
                              }`
                              : defaultContact
                          }
                          roundedCircle
                          width="50"
                          height="50"
                          style={{ borderRadius: "50%" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultContact;
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: "2px",
                            right: "2px",
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            backgroundColor:
                              userStatuses[booking.group_name] === "Online"
                                ? "#54E49F"
                                : "gray",
                            border: "2px solid white",
                            zIndex: 2,
                          }}
                          title={userStatuses[booking.group_name] || "Offline"}
                        />
                      </div>
                      <div className="text-card ms-2">
                        <Card.Title
                          style={{
                            fontSize: isMobileWidth ? "13px" : "15px",
                            width: "99%",
                          }}
                        >
                          {userTypes === "host"
                            ? booking?.sender_name
                            : booking?.receiver_name}{" "}
                          {isMobileWidth && <br />}({booking?.property_title})
                        </Card.Title>

                        <Card.Subtitle className="mb-2 text-muted">
                          {booking.booking_date}
                        </Card.Subtitle>

                        {lastMessages[booking.group_name]?.timestamp ? (
                          <div style={{ fontSize: "12px", color: "#b9b9b9" }}>
                            {formatTimeAgo(
                              lastMessages[booking.group_name]?.lastMessageDate
                            ) || ""}
                          </div>
                        ) : (
                          <div style={{ fontSize: "12px", color: "#b9b9b9" }}>
                            Loading...
                          </div>
                        )}

                        {lastMessages[booking.group_name]?.body && (
                          <p
                            style={{
                              fontSize: "14px",
                              marginBottom: "0px",
                              fontWeight: lastMessages[booking.group_name]
                                ?.unread
                                ? "bold"
                                : "normal",
                            }}
                          >
                            {lastMessages[booking.group_name].body.split(" ")
                              .length > 5
                              ? lastMessages[booking.group_name].body
                                .split(" ")
                                .slice(0, 3)
                                .join(" ") + "..."
                              : lastMessages[booking.group_name].body}
                          </p>
                        )}
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "0px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Col className="d-flex justify-content-end align-items-center">
                          <Dropdown
                            show={activeDropdown === index}
                            onToggle={(isOpen) => {
                              setActiveDropdown(isOpen ? index : null);
                            }}
                          >
                            <Dropdown.Toggle
                              className="no-caret"
                              variant="link"
                              id={`dropdown-${index}`}
                            >
                              <style>
                                {` .no-caret::after { display: none !important; }`}
                              </style>
                              <BsThreeDotsVertical
                                size={26}
                                color="#ccc"
                                style={{ backgroundColor: "white" }}
                              />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                as="button"
                                onClick={() => {
                                  handleMuteUnmute(booking);
                                  setActiveDropdown(null);
                                }}
                              >
                                {booking?.is_muted
                                  ? "Unmute"
                                  : "Mute"}
                              </Dropdown.Item>

                              <Dropdown.Item
                                as="button"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowReportForm(true);
                                  setActiveDropdown(null);
                                }}
                              >
                                Report
                              </Dropdown.Item>

                              <Dropdown.Item
                                as="button"
                                onClick={() => {
                                  handleChatDelete(booking);
                                  setActiveDropdown(null);
                                }}
                              >
                                Delete chat
                              </Dropdown.Item>

                              <Dropdown.Item
                                as="button"
                                onClick={() => {
                                  handleBlockUnblock(booking);
                                  setActiveDropdown(null);
                                }}
                              >
                                {booking?.is_blocked === 1
                                  ? "Unblock"
                                  : "Block"}
                              </Dropdown.Item>

                              <Dropdown.Item
                                as="button"
                                onClick={() => {
                                  handleArchieveUnarchieve(booking);
                                  setActiveDropdown(null);
                                }}
                              >
                                {booking?.is_archived
                                  ? "Unarchive"
                                  : "Archive"}
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
              <div className="text-center mt-4" style={{ minWidth: "250px" }}>
                <p className="text-muted">No chatlist found.</p>
              </div>
            )}
          </div>

          {/* Chat Window & Info Panel */}
          {!isMobileWidth ? (
            <>
              {!selectedBooking ? (
                <div
                  className="w-100 mb-4"
                  style={{
                    flex: "1 0 400px",
                    overflowY: "auto",
                    height: "100%",
                  }}
                >
                  <Container
                    fluid
                    className="border border-2 p-3"
                    style={{ minWidth: "250px", height: "100%" }}
                  >
                    <div className="h-100 d-flex justify-content-center align-items-center text-center">
                      {filteredBookings?.length > 0
                        ? "Please select a User to chat"
                        : "No messages found."}
                    </div>
                  </Container>
                </div>
              ) : (
                <div
                  className="flex-grow-1 w-50 h-100"
                  style={{ overflow: "hidden" }}
                >
                  <Container
                    className="border border-2 p-3 h-100 d-flex flex-column"
                    style={{ borderRadius: "10px", overflow: "hidden" }}
                  >
                    {/* Header */}
                    <Row
                      className="d-flex align-items-center border-bottom flex-shrink-0"
                      style={{ padding: "10px" }}
                    >
                      <Col className="d-flex align-items-center">
                        <div
                          style={{
                            padding: "3px",
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
                            position: "relative",
                          }}
                        >
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                            src={
                              (userTypes === "host"
                                ? selectedBooking?.sender_profile
                                : selectedBooking?.receiver_image)
                                ? `${imageBase}${userTypes === "host"
                                  ? selectedBooking.sender_profile
                                  : selectedBooking.receiver_image
                                }`
                                : defaultContact
                            }
                            roundedCircle
                            width="50"
                            height="50"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultContact;
                            }}
                          />

                          <div
                            style={{
                              position: "absolute",
                              bottom: "6px",
                              right: "2px",
                              width: "14px",
                              height: "14px",
                              borderRadius: "50%",
                              backgroundColor:
                                targetUserStatus === "Online"
                                  ? "#54E49F"
                                  : "gray",
                              border: "2px solid white",
                              zIndex: 2,
                              marginRight: "5px",
                            }}
                          />
                        </div>
                        <div>
                          <h5 className="mb-0">
                            {userTypes === "host"
                              ? selectedBooking?.sender_name
                              : selectedBooking?.receiver_name}
                          </h5>
                          <p
                            style={{
                              color:
                                targetUserStatus === "Online"
                                  ? "#7DD2B0"
                                  : "#999999",
                              margin: "0px",
                              fontSize: "14px",
                            }}
                          >
                            {targetUserStatus}
                          </p>
                        </div>
                      </Col>

                      <Col className="d-flex justify-content-end align-items-center">
                        <span
                          style={{
                            border: "1px solid #ccc",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "7px",
                            cursor: "pointer",
                          }}
                        >
                          {selectedBooking?.is_favorite === 1 ? (
                            <FaStar
                              size={25}
                              style={{ color: "#2ee3a0" }}
                              role="button"
                              onClick={() =>
                                handleFavoriteUnfavorite(selectedBooking)
                              }
                            />
                          ) : (
                            <FaRegStar
                              size={25}
                              role="button"
                              onClick={() =>
                                handleFavoriteUnfavorite(selectedBooking)
                              }
                            />
                          )}
                        </span>
                        <Dropdown
                          show={showModal}
                          onToggle={() => setShowModal(!showModal)}
                        >
                          <Dropdown.Toggle
                            className="no-caret"
                            variant="link"
                            id="dropdown-header-menu"
                          >
                            <style>
                              {` .no-caret::after { display: none !important; }`}
                            </style>
                            <span
                              style={{
                                border: "1px solid #ccc",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "7px",
                              }}
                            >
                              <BsThreeDots size={25} color="black" />
                            </span>
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item
                              as="button"
                              onClick={() => {
                                handleMuteUnmute(selectedBooking);
                                setShowModal(false);
                              }}
                            >
                              {selectedBooking?.is_muted ? "Unmute" : "Mute"}
                            </Dropdown.Item>

                            <Dropdown.Item
                              as="button"
                              onClick={() => {
                                setShowReportForm(true);
                                setShowModal(false);
                              }}
                            >
                              Report
                            </Dropdown.Item>

                            <Dropdown.Item
                              as="button"
                              onClick={() => {
                                handleChatDelete(selectedBooking);
                                setShowModal(false);
                              }}
                            >
                              Delete chat
                            </Dropdown.Item>

                            <Dropdown.Item
                              as="button"
                              onClick={() => {
                                handleBlockUnblock(selectedBooking);
                                setShowModal(false);
                              }}
                            >
                              {selectedBooking?.is_blocked === 1
                                ? "Unblock"
                                : "Block"}
                            </Dropdown.Item>

                            <Dropdown.Item
                              as="button"
                              onClick={() => {
                                handleArchieveUnarchieve(selectedBooking);
                                setShowModal(false);
                              }}
                            >
                              {selectedBooking?.is_archived
                                ? "Unarchive"
                                : "Archive"}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>

                    {/* Messages Body */}
                    <Row
                      className="flex-grow-1 p-3"
                      style={{ minHeight: 0, overflow: "hidden" }}
                    >
                      <Col
                        xs={12}
                        className="mb-2 chat-box"
                        style={{ height: "100%", overflowY: "auto" }}
                        ref={messagesContainerRef}
                      >
                        {chatLoading ? (
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              height: "250px",
                              border: "1px solid #E5E5E5",
                            }}
                          >
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            {messages.map((msg, index) => {
                              const isMyMessage = msg.isMyMessage;
                              const messageDate = msg?.dateCreated || new Date();

                              const formattedDate = new Date(
                                messageDate
                              ).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              });

                              return (
                                <div
                                  key={index}
                                  className="d-flex mb-2 flex-wrap justify-content-start"
                                  style={{ fontWeight: "lighter" }}
                                >
                                  <div className="chat-wrp-main">
                                    <div className="chat-single-upr">
                                      <div className="chat-single-left">
                                        {!isMyMessage ? (
                                          <Image
                                            src={
                                              (userTypes === "host"
                                                ? selectedBooking?.sender_profile
                                                : selectedBooking?.receiver_image)
                                                ? `${imageBase}${userTypes === "host"
                                                  ? selectedBooking.sender_profile
                                                  : selectedBooking.receiver_image
                                                }`
                                                : defaultContact
                                            }
                                            roundedCircle
                                            width="40"
                                            height="40px"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = defaultContact;
                                            }}
                                          />
                                        ) : (
                                          <Image
                                            src={
                                              profileData?.profileData
                                                ?.profile_image
                                                ? `${imageBase}${profileData.profileData.profile_image}`
                                                : defaultContact
                                            }
                                            roundedCircle
                                            width="40"
                                            height="40px"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = defaultContact;
                                            }}
                                          />
                                        )}

                                        <h3
                                          className="mb-0"
                                          style={{
                                            fontSize: "16px",
                                            fontWeight: "500",
                                          }}
                                        >
                                          {!isMyMessage
                                            ? userTypes === "host"
                                              ? selectedBooking?.sender_name
                                              : selectedBooking?.receiver_name
                                            : userTypes === "host"
                                              ? selectedBooking?.receiver_name
                                              : selectedBooking?.sender_name}
                                        </h3>
                                      </div>
                                      <span> {formattedDate} </span>
                                    </div>

                                    {msg.type === "media" || msg.mediaUrl || msg.media_url ? (
                                      <div className="chat-body">
                                        {(msg.mediaType === "application/pdf" ||
                                          msg.media_type === "application/pdf" ||
                                          (msg.fileName && msg.fileName.toLowerCase().endsWith(".pdf")) ||
                                          (msg.file_name && msg.file_name.toLowerCase().endsWith(".pdf")) ||
                                          (msg.mediaUrl && msg.mediaUrl.toLowerCase().includes(".pdf")) ||
                                          (msg.media_url && msg.media_url.toLowerCase().includes(".pdf"))) ? (
                                          <a
                                            href={msg.mediaUrl || msg.media_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="d-flex align-items-center gap-2 p-2 rounded text-decoration-none"
                                            style={{
                                              backgroundColor: "#f5f5f5",
                                              border: "1px solid #ddd",
                                              color: "#333",
                                              maxWidth: "280px",
                                            }}
                                          >
                                            <span style={{ fontSize: "28px" }}>📄</span>
                                            <div style={{ overflow: "hidden" }}>
                                              <div
                                                style={{
                                                  fontWeight: "600",
                                                  fontSize: "13px",
                                                  whiteSpace: "nowrap",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                }}
                                              >
                                                {msg.fileName || msg.file_name || "Document.pdf"}
                                              </div>
                                              <small style={{ color: "#007bff", fontSize: "11px" }}>
                                                Click to view PDF
                                              </small>
                                            </div>
                                          </a>
                                        ) : (
                                          <Image
                                            src={msg.mediaUrl || msg.media_url}
                                            loading="lazy"
                                            alt="Sent media"
                                            width="200"
                                            className="rounded"
                                          />
                                        )}
                                      </div>
                                    ) : (
                                      <div
                                        className="chat-body"
                                        style={{ fontSize: "14px" }}
                                      >
                                        {msg.body || msg.text}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </Col>
                    </Row>

                    {/* Input controls */}
                    <Row className="flex-shrink-0 p-2 mt-auto border-top">
                      <Col xs={12}>
                        {selectedBooking?.is_blocked === 1 ? (
                          <button
                            onClick={() => handleBlockUnblock(selectedBooking)}
                            style={{
                              width: "100%",
                              backgroundColor: "#4AEAB1",
                              borderRadius: "25px",
                              border: "none",
                              padding: "10px",
                            }}
                          >
                            Unblock
                          </button>
                        ) : (
                          <div
                            className="d-flex align-items-center"
                            style={{ width: "100%" }}
                          >
                            <div
                              className="d-flex align-items-center px-3 flex-grow-1"
                              style={{
                                background: "#f7f7f7",
                                borderRadius: "30px",
                                marginRight: "0px",
                                height: "48px",
                              }}
                            >
                              <input
                                type="file"
                                id="fileUpload"
                                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,application/pdf,.pdf"
                                className="d-none"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;

                                  const isImage =
                                    (file.type && file.type.startsWith("image/")) ||
                                    /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
                                  const isPdf =
                                    file.type === "application/pdf" ||
                                    /\.pdf$/i.test(file.name);

                                  const maxSizeMB = 5;

                                  if (!isImage && !isPdf) {
                                    toast.error(
                                      "Only image and PDF files are allowed"
                                    );
                                    e.target.value = "";
                                    return;
                                  }

                                  if (file.size > maxSizeMB * 1024 * 1024) {
                                    toast.error(
                                      "File size must be less than 5MB"
                                    );
                                    e.target.value = "";
                                    return;
                                  }

                                  sendMessage(file);
                                  e.target.value = "";
                                }}
                              />

                              <input
                                type="text"
                                className="form-control border-0 bg-transparent flex-grow-1"
                                placeholder="Type a message..."
                                style={{ boxShadow: "none" }}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessageClick();
                                  }
                                }}
                              />

                              <label
                                htmlFor="fileUpload"
                                className="ms-2"
                                style={{
                                  cursor: "pointer",
                                  color: "#555",
                                  flexShrink: 0,
                                }}
                                onClick={(e) => {
                                  if (selectedBooking?.is_other_block === 1) {
                                    e.preventDefault();
                                    toast.error("You are blocked");
                                  }
                                }}
                              >
                                <ImAttachment />
                              </label>
                            </div>

                            <button
                              className="ms-2 d-flex align-items-center justify-content-center"
                              style={{
                                backgroundColor: "#2ee3a0",
                                border: "none",
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                color: "#fff",
                                flexShrink: 0,
                                opacity: !message.trim() || sendingMessage ? 0.6 : 1,
                              }}
                              onClick={handleSendMessageClick}
                              disabled={!message.trim() || sendingMessage}
                            >
                              <img
                                src="/images/chat/send.svg"
                                style={{
                                  color: "white",
                                  margin: "5px",
                                  width: "20px",
                                }}
                                loading="lazy"
                                alt="Send"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/images/chat/send.svg";
                                }}
                              />
                            </button>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Container>
                </div>
              )}

              {/* Right User Details Panel */}
              {selectedBooking && (
                <div
                  className="flex-grow-1"
                  style={{
                    borderRadius: "8px",
                    padding: "0rem",
                    overflowY: "auto",
                    height: "100%",
                    minWidth: "285px",
                  }}
                >
                  <Container className="border rounded-3">
                    <h5
                      className="mt-3 text-center"
                      style={{
                        fontWeight: "300",
                        color: "#000000",
                        fontSize: "18px",
                      }}
                    >
                      {userTypes === "host" ? "Guest" : "Hosted by"}
                    </h5>
                    <Row className="mb-3 px-3">
                      <Col
                        xs={8}
                        className="d-flex align-items-center justify-content-center border-2 w-100 pb-2"
                        style={{ marginBottom: "10px" }}
                      >
                        <div
                          style={{
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
                          }}
                        >
                          <Image
                            src={
                              (userTypes === "host"
                                ? selectedBooking?.sender_profile
                                : selectedBooking?.receiver_image)
                                ? `${imageBase}${userTypes === "host"
                                  ? selectedBooking.sender_profile
                                  : selectedBooking.receiver_image
                                }`
                                : defaultContact
                            }
                            roundedCircle
                            width="50"
                            height="50"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultContact;
                            }}
                          />
                        </div>
                        <div>
                          <h6
                            className="mb-0"
                            style={{ color: "black", fontSize: "20px" }}
                          >
                            {userTypes === "host"
                              ? selectedBooking?.sender_name
                              : selectedBooking?.receiver_name}
                          </h6>
                        </div>
                        {userTypes === "host" ? (
                          <>
                            <FaStar
                              className="text-warning mx-1"
                              style={{ marginTop: "-2px" }}
                            />
                            <span style={{ color: "#FCA800" }}>
                              {guestReview || "0.0"}
                            </span>
                          </>
                        ) : (
                          <>
                            {selectedBooking?.is_star_host && (
                              <Image
                                src="/images/locations-grid/profile/batch.svg"
                                loading="lazy"
                                alt="Batch"
                                style={{ marginLeft: "5px", width: "30px" }}
                              />
                            )}
                          </>
                        )}
                      </Col>
                    </Row>
                    <hr style={{ marginTop: "-14px", marginBottom: "30px" }} />

                    {userTypes === "host" ? (
                      <Button
                        className="border border-1 border-black w-100"
                        variant="light"
                        onClick={() =>
                          navigate("/booking", {
                            state: { bookingId: selectedBooking?.booking_id },
                          })
                        }
                        style={{
                          fontSize: "20px",
                          marginTop: "-9px",
                          marginBottom: "16px",
                        }}
                      >
                        Guest booking
                      </Button>
                    ) : (
                      <Button
                        className="border border-1 border-black w-100"
                        variant="light"
                        onClick={() =>
                          navigate("/host-listing", {
                            state: { hostId: selectedBooking?.receiver_id },
                          })
                        }
                        style={{
                          fontSize: "20px",
                          marginTop: "-9px",
                          marginBottom: "16px",
                        }}
                      >
                        Host Properties
                      </Button>
                    )}

                    <div className="d-flex justify-content-center mb-3">
                      <PiClockCountdownFill size={24} color="#979797" />
                      <span className="fs-7 ms-2">
                        Typically respond within 1 hr
                      </span>
                    </div>
                  </Container>

                  <Container className="border rounded-3 w-100 p-3 mt-3 d-flex flex-column gap-4">
                    <Row>
                      <Col>From</Col>
                      <Col className="text-end fw-bold">
                        {selectedBooking?.receiver_address || "Not Available"}
                      </Col>
                    </Row>
                    <Row>
                      <Col>Member Since</Col>
                      <Col className="text-end">
                        {convertDate(selectedBooking?.receiver_member_since)}
                      </Col>
                    </Row>
                    <Row>
                      <Col>Language</Col>
                      <Col className="text-end">
                        {selectedBooking?.receiver_language?.join(", ") ||
                          "Not Available"}
                      </Col>
                    </Row>
                  </Container>
                </div>
              )}
            </>
          ) : (
            /* Mobile Modal Chat Screen */
            <Modal
              show={!!selectedBooking}
              onHide={handleClose}
              dialogClassName="custom-modal chat-screen-modal custom-modal-css"
            >
              <Modal.Body className="chat-screen-body">
                <div className="chat-screen-header">
                  <span className="chat-screen-back-btn" onClick={handleClose}>
                    <i className="fa-regular fa-arrow-left"></i>
                  </span>
                </div>

                <div className="chat-screen-content">
                  <Container className="chat-screen-container">
                    <Row className="chat-screen-top-row">
                      <Col className="chat-screen-user-col">
                        <div className="chat-screen-pic-wrapper">
                          <Image
                            src={
                              (userTypes === "host"
                                ? selectedBooking?.sender_profile
                                : selectedBooking?.receiver_image)
                                ? `${imageBase}${userTypes === "host"
                                  ? selectedBooking.sender_profile
                                  : selectedBooking.receiver_image
                                }`
                                : defaultContact
                            }
                            roundedCircle
                            width="50"
                            height="50"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultContact;
                            }}
                          />
                        </div>
                        <div className="chat-screen-user-info">
                          <h6 className="chat-screen-username">
                            {userTypes === "host"
                              ? selectedBooking?.sender_name
                              : selectedBooking?.receiver_name}
                          </h6>
                          <p className="chat-screen-status">
                            {targetUserStatus}
                          </p>
                        </div>
                      </Col>

                      <Col className="chat-screen-actions-col">
                        <span className="chat-screen-fav-btn">
                          {selectedBooking?.is_favorite === 1 ? (
                            <FaStar
                              size={isMobileWidth ? 20 : 25}
                              style={{ color: "#2ee3a0" }}
                              role="button"
                              onClick={() =>
                                handleFavoriteUnfavorite(selectedBooking)
                              }
                            />
                          ) : (
                            <FaRegStar
                              size={isMobileWidth ? 20 : 25}
                              role="button"
                              onClick={() =>
                                handleFavoriteUnfavorite(selectedBooking)
                              }
                            />
                          )}
                        </span>

                        <Dropdown
                          show={showModal}
                          onToggle={() => setShowModal(!showModal)}
                        >
                          <Dropdown.Toggle
                            className="chat-screen-dropdown-toggle"
                            variant="link"
                          >
                            <span className="chat-screen-dropdown-icon">
                              <BsThreeDots
                                size={isMobileWidth ? 20 : 25}
                                color="black"
                              />
                            </span>
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item
                              as="button"
                              onClick={() => {
                                handleMuteUnmute(selectedBooking);
                                setShowModal(false);
                              }}
                            >
                              {selectedBooking?.is_muted ? "Unmute" : "Mute"}
                            </Dropdown.Item>

                            <Dropdown.Item
                              as="button"
                              onClick={() => {
                                setShowReportForm(true);
                                setShowModal(false);
                              }}
                            >
                              Report
                            </Dropdown.Item>

                            <Dropdown.Item
                              as="button"
                              onClick={() => {
                                handleChatDelete(selectedBooking);
                                setShowModal(false);
                              }}
                            >
                              Delete chat
                            </Dropdown.Item>

                            <Dropdown.Item
                              as="button"
                              onClick={() => {
                                handleBlockUnblock(selectedBooking);
                                setShowModal(false);
                              }}
                            >
                              {selectedBooking?.is_blocked === 1
                                ? "Unblock"
                                : "Block"}
                            </Dropdown.Item>

                            <Dropdown.Item
                              as="button"
                              onClick={() => {
                                handleArchieveUnarchieve(selectedBooking);
                                setShowModal(false);
                              }}
                            >
                              {selectedBooking?.is_archived
                                ? "Unarchive"
                                : "Archive"}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>

                    <Row className="chat-screen-messages-row">
                      <Col
                        xs={12}
                        className="chat-screen-chat-box"
                        ref={messagesContainerRef}
                      >
                        {chatLoading ? (
                          <div className="chat-screen-loading">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          </div>
                        ) : (
                          messages.map((msg, index) => {
                            const isMy = msg.isMyMessage;
                            const messageDate = msg?.dateCreated || new Date();
                            const formattedDate = new Date(
                              messageDate
                            ).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            });

                            return (
                              <div
                                key={index}
                                className="chat-screen-message-row"
                              >
                                <div className="chat-screen-message-container">
                                  <div className="chat-screen-message-top">
                                    <div className="chat-screen-message-user">
                                      <Image
                                        src={
                                          !isMy
                                            ? (userTypes === "host"
                                              ? selectedBooking?.sender_profile
                                              : selectedBooking?.receiver_image)
                                              ? `${imageBase}${userTypes === "host"
                                                ? selectedBooking.sender_profile
                                                : selectedBooking.receiver_image
                                              }`
                                              : defaultContact
                                            : profileData?.profileData
                                              ?.profile_image
                                              ? `${imageBase}${profileData.profileData.profile_image}`
                                              : defaultContact
                                        }
                                        roundedCircle
                                        width="40"
                                        height="40"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = defaultContact;
                                        }}
                                      />
                                      <h3 className="chat-screen-message-username">
                                        {!isMy
                                          ? userTypes === "host"
                                            ? selectedBooking?.sender_name
                                            : selectedBooking?.receiver_name
                                          : userTypes === "host"
                                            ? selectedBooking?.receiver_name
                                            : selectedBooking?.sender_name}
                                      </h3>
                                    </div>
                                    <span className="chat-screen-message-date">
                                      {formattedDate}
                                    </span>
                                  </div>

                                  {msg.type === "media" || msg.mediaUrl || msg.media_url ? (
                                    <div className="chat-screen-message-body">
                                      {(msg.mediaType === "application/pdf" ||
                                        msg.media_type === "application/pdf" ||
                                        (msg.fileName && msg.fileName.toLowerCase().endsWith(".pdf")) ||
                                        (msg.file_name && msg.file_name.toLowerCase().endsWith(".pdf")) ||
                                        (msg.mediaUrl && msg.mediaUrl.toLowerCase().includes(".pdf")) ||
                                        (msg.media_url && msg.media_url.toLowerCase().includes(".pdf"))) ? (
                                        <a
                                          href={msg.mediaUrl || msg.media_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="d-flex align-items-center gap-2 p-2 rounded text-decoration-none"
                                          style={{
                                            backgroundColor: "#f5f5f5",
                                            border: "1px solid #ddd",
                                            color: "#333",
                                            maxWidth: "240px",
                                          }}
                                        >
                                          <span style={{ fontSize: "24px" }}>📄</span>
                                          <div style={{ overflow: "hidden" }}>
                                            <div
                                              style={{
                                                fontWeight: "600",
                                                fontSize: "12px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                              }}
                                            >
                                              {msg.fileName || msg.file_name || "Document.pdf"}
                                            </div>
                                            <small style={{ color: "#007bff", fontSize: "10px" }}>
                                              Click to view PDF
                                            </small>
                                          </div>
                                        </a>
                                      ) : (
                                        <Image
                                          src={msg.mediaUrl || msg.media_url}
                                          loading="lazy"
                                          alt="media"
                                          width="200"
                                          className="rounded"
                                        />
                                      )}
                                    </div>
                                  ) : (
                                    <div className="chat-screen-message-body">
                                      {msg.body || msg.text}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </Col>

                      <Col xs={12} className="chat-screen-input-row">
                        {selectedBooking?.is_blocked === 1 ? (
                          <button
                            className="chat-screen-unblock-button"
                            onClick={() => handleBlockUnblock(selectedBooking)}
                          >
                            Unblock
                          </button>
                        ) : (
                          <div className="chat-screen-input-wrapper">
                            <div className="chat-screen-input-area">
                              <input
                                type="file"
                                id="chat-screen-file"
                                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,application/pdf,.pdf"
                                className="d-none"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;

                                  const isImage =
                                    (file.type && file.type.startsWith("image/")) ||
                                    /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
                                  const isPdf =
                                    file.type === "application/pdf" ||
                                    /\.pdf$/i.test(file.name);

                                  const maxSizeMB = 5;

                                  if (!isImage && !isPdf) {
                                    toast.error(
                                      "Only image and PDF files are allowed"
                                    );
                                    e.target.value = "";
                                    return;
                                  }

                                  if (file.size > maxSizeMB * 1024 * 1024) {
                                    toast.error(
                                      "File size must be less than 5MB"
                                    );
                                    e.target.value = "";
                                    return;
                                  }

                                  sendMessage(file);
                                  e.target.value = "";
                                }}
                              />
                              <label
                                htmlFor="chat-screen-file"
                                className="chat-screen-file-label"
                                onClick={(e) => {
                                  if (selectedBooking?.is_other_block === 1) {
                                    e.preventDefault();
                                    toast.error("You are blocked");
                                  }
                                }}
                              >
                                <ImAttachment />
                              </label>
                              <input
                                type="text"
                                className="chat-screen-text-input form-control"
                                style={{
                                  padding: isMobileWidth ? "10px" : "15px",
                                  border: "1px solid #000",
                                  borderRadius: "10px",
                                }}
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessageClick();
                                  }
                                }}
                              />
                            </div>
                            <button
                              className="chat-screen-send-button"
                              onClick={handleSendMessageClick}
                              disabled={!message.trim() || sendingMessage}
                            >
                              <img
                                src="/images/chat/send.svg"
                                alt="Send"
                                style={{
                                  color: "white",
                                  height: isMobileWidth ? "20px" : "",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/images/chat/send.svg";
                                }}
                              />
                            </button>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Container>
                </div>
              </Modal.Body>
            </Modal>
          )}
        </div>
      </div>
      <ReportBookingModal
        show={showReportForm}
        handleClose={() => setShowReportForm(false)}
        user_id={userId}
        booking_id={selectedBooking?.booking_id}
        property_id={selectedBooking?.property_id}
      />
    </>
  );
};

export default React.memo(HostChat);
