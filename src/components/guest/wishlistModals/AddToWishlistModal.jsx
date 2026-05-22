import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import useCommon from "../../../hooks/useCommon";
import CreateNewWishlistModal from "./CreateNewWishlistModal";
import React, { useState } from "react";

const AddToWishlistModal = ({ showAddWishlistModal, handleClose, wishlistArr, propertyId, userId, fetchList,}) => {
  console.log("showAddWishlistModal3333", showAddWishlistModal)
  const { saveItemInWishlist } = useCommon();

  const [showCreateWishlistModal, setShowCreateWishlistModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyId);

  return (
    <div>
      <Modal show={showAddWishlistModal} onHide={handleClose} id="add-wishlist"
        style={{ boxShadow: "10px", zIndex:9999 }} >
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "start", fontSize: "20px", color:"#000" }} >
            Add To Wishlist
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "2rem", maxHeight: "70vh", overflowY: "auto",  }}>
          <Row className="g-3" xs={2} sm={2} md={2} lg={2}>
            {wishlistArr?.map((item, index) => (
              <Col key={index} className="d-flex align-items-stretch" >
                <Card className="border-0 rounded-4 w-100" style={{ overflow: "hidden",cursor: "pointer"}} 
                  onClick={() => {
                    saveItemInWishlist({user_id: userId, property_id: propertyId, 
                      wishlist_id: item?.wishlist_id,
                    });
                    setTimeout(() => { fetchList(); }, 100);
                    handleClose();
                }}>
                  <Card.Img src={`https://zyvo.tgastaging.com/${item.last_saved_property_image}`}
                    alt="Wishlist Item" className="wishlist-card-img" />
                  <Card.Body className="bg-white d-flex flex-column">
                    <div className="text-start">
                      <Card.Title style={{color:"#000000", margin:"0", fontSize: "18px"}}> {item?.wishlist_name} </Card.Title>
                      <Card.Text className="text-muted"> {item?.items_in_wishlist} saved </Card.Text>
                    </div>
                    {/* <Button variant="link" className="text-decoration-none text-primary mt-2 p-0 text-start"
                      onClick={() => {
                        saveItemInWishlist({ user_id: userId, property_id: propertyId, wishlist_id: item?.wishlist_id,});
                        handleClose();
                      }} >
                      Selected
                    </Button> */}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {/* <Row className="d-flex p-absolute " >
            <Col xs={12} className="d-flex " style={{ justifyContent: "center" }} >
              <Button
                style={{ marginTop: "50px", borderRadius: "20px", backgroundColor: "#5EE6A0", 
                  width: "50%", border: "none", color: "black" }} className="wishlist-btn"
                onClick={() => {
                  setSelectedPropertyId(propertyId);
                  handleClose();
                  setShowCreateWishlistModal(true);
                }} >
                Create Wishlist
              </Button>
            </Col>
          </Row> */}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center", borderTop: "none", background: "white"}}>
          <Button style={{ backgroundColor: "#5EE6A0", width: "50%", borderRadius:"50px",
            border: "none", color: "black" }} 
            onClick={() => {
              setSelectedPropertyId(propertyId);
              handleClose();
              setShowCreateWishlistModal(true);
            }} > Create Wishlist
          </Button>
        </Modal.Footer>
      </Modal>
      <CreateNewWishlistModal show={showCreateWishlistModal} userId={userId}
        propertyId={selectedPropertyId} handleCreateModalClose={() => setShowCreateWishlistModal(false)}
      />
    </div>
  );
};

export default React.memo(AddToWishlistModal);


// import { Button, Card, Col, Modal, Row } from "react-bootstrap";
// import useCommon from "../../../hooks/useCommon";
// import CreateNewWishlistModal from "./CreateNewWishlistModal";
// import React, { useState } from "react";

// const AddToWishlistModal = ({
//   showAddWishlistModal,
//   handleClose,
//   wishlistArr,
//   propertyId,
//   userId,
//   fetchList,
// }) => {
//   const { saveItemInWishlist } = useCommon();

//   const [showCreateWishlistModal, setShowCreateWishlistModal] = useState(false);
//   const [selectedPropertyId, setSelectedPropertyId] = useState(propertyId);

//   return (
//     <div>
//       <Modal
//         show={showAddWishlistModal}
//         onHide={handleClose}
//         id="add-wishlist"
//         style={{
//           boxShadow: "10px",
//           borderRadius: "20px",
//           zIndex:9999
//         }}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title
//             style={{
//               textAlign: "start",
//               fontSize: "20px",
//             }}
//           >
//             Add To Wishlist
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ padding: "50px" }}>
//           <Row className="g-3" xs={2} sm={2} md={2} lg={2}>
//             {wishlistArr?.map((item, index) => (
//               <Col key={index} className="d-flex align-items-stretch" >
//                 <Card onClick={() => {
//                   saveItemInWishlist({
//                     user_id: userId,
//                     property_id: propertyId,
//                     wishlist_id: item?.wishlist_id,
//                   });
//                   setTimeout(() => {
//                     fetchList();
//                   }, 100);
//                   handleClose();
//                 }}
//                   className="border-0 rounded-4"
//                   style={{ overflow: "hidden",cursor: "pointer", }}
//                 >
//                   <Card.Img
//                     src={`https://zyvo.tgastaging.com/${item.last_saved_property_image}`}
//                     loading="lazy" alt="Wishlist Item"
                
//                       className="wishlist-card-img"
//                   />
//                   <Card.Body className="bg-white d-flex flex-column">
//                     <div className="text-start">
//                       <Card.Title className="">
//                         {item?.wishlist_name}
//                       </Card.Title>
//                       <Card.Text className="text-muted">
//                         {item?.items_in_wishlist} saved
//                       </Card.Text>
//                     </div>
//                     {/* <Button
//                       variant="link"
//                       className="text-decoration-none text-primary mt-2 p-0 text-start"
//                       onClick={() => {
//                         saveItemInWishlist({
//                           user_id: userId,
//                           property_id: propertyId,
//                           wishlist_id: item?.wishlist_id,
//                         });
//                         handleClose();
//                       }}
//                     >
//                       Selected
//                     </Button> */}
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//           <Row className="d-flex  ">
//             <Col
//               xs={12}
//               className="d-flex "
//               style={{ justifyContent: "center" }}
//             >
//               <Button
//                 style={{
//                   marginTop: "50px",
//                   borderRadius: "20px",
//                   backgroundColor: "#5EE6A0",
//                   width: "50%",
//                   border: "none",
//                   color: "black",
//                 }}


//                 className="wishlist-btn"
//                 onClick={() => {
//                   setSelectedPropertyId(propertyId);
//                   handleClose();
//                   setShowCreateWishlistModal(true);
//                 }}
//               >
//                 Create Wishlist
//               </Button>
//             </Col>
//           </Row>
//         </Modal.Body>
//       </Modal>
//       <CreateNewWishlistModal
//         show={showCreateWishlistModal}
//         handleCreateModalClose={() => setShowCreateWishlistModal(false)}
//         propertyId={selectedPropertyId}
//         userId={userId}
//       />
//     </div>
//   );
// };

// export default React.memo(AddToWishlistModal);
