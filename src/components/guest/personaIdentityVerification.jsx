import PersonaReact from "persona-react";
import { useDispatch, useSelector } from "react-redux";
import { closePersona, personaStatus } from "../../store/slices/profileSlice";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { KEYS } from "../../config/Constant";
import useProfile from "../../hooks/useProfile";

const InlineInquiry = () => {
  const { verify_identity } = useProfile();
  const userData = JSON.parse(localStorage.getItem(KEYS.USER_INFO));
  const userId = userData?.user_id ? String(userData?.user_id) : null;
  const showVerification = useSelector(
    (state) => state.profile.showPersonaVerification
  );
  const dispatch = useDispatch();

  const [showVerificationModal, setShowVerificationModal] = useState(false);


  useEffect(() => {
    setShowVerificationModal(showVerification);
  }, [showVerification]);

  const verifyIdentity = async (status) => {
    try {
      const response = await verify_identity({
        user_id: userId,
        identity_verify: status === "approved" || "completed" ? "1" : "0",
      });
   
    } catch (error) {
      console.error(error, "error code of personaa");
    }
  };

  if (!showVerification) return null; 

  return (
    <Modal
      show={showVerificationModal}
      onHide={() => {
        setShowVerificationModal(false);
        dispatch(closePersona());
      }}
    >
      <div
      >
        <PersonaReact
          style={{}}
          templateId="itmpl_yEu1QvFA5fJ1zZ9RbUo1yroGahx2"
          environment="sandbox"
          onLoad={() => {
            console.log("Loaded inline");
          }}
          onComplete={({  status }) => {
            dispatch(personaStatus(status));
            dispatch(closePersona());
            verifyIdentity(status);
          }}
          onError={(error) => console.error("persona react error is", error)}
        />
      </div>
    </Modal>
  );
};

export default InlineInquiry;
