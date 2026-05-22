import { Modal } from "react-bootstrap";
import useCommon from "../../../hooks/useCommon";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const CreateNewWishlistModal = ({ show, handleCreateModalClose, propertyId, userId, }) => {
  const { createNewWishlist } = useCommon();
  const { register, handleSubmit, reset, formState: { errors }, } = useForm();

  const [isMobileWidth, setIsMobileWidth] = useState(false);
    
  useEffect(() => {
    const checkWindowWidth = () => {
      const isMobileOrTablet = window.innerWidth <= 991; // includes tablets
      setIsMobileWidth(isMobileOrTablet);
    };
    checkWindowWidth(); // Check immediately on mount
    window.addEventListener("resize", checkWindowWidth);
    return () => {
      window.removeEventListener("resize", checkWindowWidth);
    };
  }, []); // Don't put window.innerWidth in the deps
  
  const [descriptionLength, setDescriptionLength] = useState(0);
  const onSubmit = async (data) => {
    data.user_id = userId;
    data.property_id = propertyId;
    const submitResponse = await createNewWishlist(data);
    handleCreateModalClose();
  };

  const handleInputChange = (e) => {
    setDescriptionLength(e.target.value.length);
  };

  return (
    <>
      <Modal show={show} centered onHide={handleCreateModalClose} dialogClassName="custom-modal">
         <style>
          {`.modal-body{
              padding: 0.6rem 1rem 1rem 1rem !important;
            }
           .custom-modal  {
              padding:5px !important;
            } 
            .custom-modal .modal-content {
              border-radius: 15px !important;
              padding:0px !important;
            }         
            .btn-close {
              width: 10px;
              height: 10px;
              background: #3A4B4C;
              border-radius: 50%;
              opacity: 1;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .btn-close::after {
              content: '×';
              color: #fff;
              font-weight: 500;
              font-size: 20px;
              line-height: 1;
              height: ${isMobileWidth ? "9px" : "10px"} !important;
              width: ${isMobileWidth ? "9px" : "10px"} !important;
            }
          `}
        </style>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center mt-3" style={{fontSize: isMobileWidth ? "16px" : ''}}>
            Create Wishlist
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="create-wishlist-content">
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)} method="post">
              <p className="mb-3">Please Enter the Name</p>
              <label>
                <input type="text" className="ps-3" placeholder="Name"
                  {...register("name", {
                    required: "Name is required",
                    maxLength: { value: 20, message: "Max 20 characters allowed", },
                    minLength: { value: 3, message: "Min 3 characters allowed", },
                  })}/> 
                  <style> 
                    {` input::placeholder {
                        color: #999 !important; 
                        font-size: ${isMobileWidth ? "14px" : "16px"} !important;
                    }`}
                  </style>
              </label>
              {errors.name && <p className="error">{errors.name.message}</p>}

              <textarea className="mt-3" style={{borderRadius : "10px", padding : "7px 1rem"}} placeholder="Description"
                {...register("description", {
                  required: "Description is required",
                  maxLength: { value: 50, message: "Max 50 characters allowed", },
                })}
                onChange={handleInputChange} />
                <style>
                  {` textarea::placeholder {
                      color: #999 !important; 
                      font-size: ${isMobileWidth ? "14px" : "16px"} !important;
                    }`}
                  </style>
              {errors.description && (
                <p className="error" style={{color:"red"}}>{errors.description.message}</p>
              )}

              <p className="mb-3 ms-3" style={{ color: isMobileWidth ? "#999" :  descriptionLength > 50 ? "red" : "#999" ,fontSize:isMobileWidth?'12px':'14px'}}> {`Max ${descriptionLength}/${50} characters`} </p>

              <div className="custom-modal-label d-flex gap-3">
                <input type="submit" value="Create" data-bs-dismiss="modal" />
                <input type="button" className="cancel-btn" value="Clear" onClick={() => reset()} />
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateNewWishlistModal;

// import { Modal } from "react-bootstrap";
// import useCommon from "../../../hooks/useCommon";
// import { useForm } from "react-hook-form";
// import { useState } from "react";

// const CreateNewWishlistModal = ({
//   show,
//   handleCreateModalClose,
//   propertyId,
//   userId,
// }) => {
//   const { createNewWishlist } = useCommon();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();
  
//   const [descriptionLength, setDescriptionLength] = useState(0);
//   const onSubmit = async (data) => {
//     data.user_id = userId;
//     data.property_id = propertyId;
//     const submitResponse = await createNewWishlist(data);
//     handleCreateModalClose();
//   };

//   const handleInputChange = (e) => {
//     setDescriptionLength(e.target.value.length);
//   };

//   return (
//     <>
//       <Modal show={show} onHide={handleCreateModalClose}>
//         <Modal.Header closeButton>
//           <Modal.Title className="w-100 text-center">
//             Create Wishlist
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="create-wishlist-content">
//           <div className="modal-body px-4 py-4">
//             <form onSubmit={handleSubmit(onSubmit)} method="post">
//               <p className="mb-2">Please Enter the Name</p>
//               <label>
//                 <input
//                   type="text"
//                   className="ps-3"
//                   placeholder="Name"
//                   {...register("name", {
//                     required: "Name is required",
//                     maxLength: {
//                       value: 20,
//                       message: "Max 20 characters allowed",
//                     },
//                     minLength: {
//                       value: 3,
//                       message: "Min 3 characters allowed",
//                     },
//                   })}
//                 />
//               </label>
//               {errors.name && <p className="error">{errors.name.message}</p>}

//               <textarea
//                 style={{borderRadius : "10px", padding : "10px"}}
//                 placeholder="Description"
//                 {...register("description", {
//                   required: "Description is required",
//                   maxLength: {
//                     value: 50,
//                     message: "Max 50 characters allowed",
//                   },
//                 })}
//                 onChange={handleInputChange}
//               />
//               {errors.description && (
//                 <p className="error" style={{color:"red"}}>{errors.description.message}</p>
//               )}

//               <p  className="mb-3" style={{ color: descriptionLength > 50 ? "red" : "black" }}> {`Max ${descriptionLength}/${50} characters`} </p>

//               <div className="custom-modal-label d-flex gap-3">
//                 <input type="submit" value="Create" data-bs-dismiss="modal" />
//                 <input
//                   type="button"
//                   className="cancel-btn"
//                   value="Clear"
//                   onClick={() => reset()}
//                 />
//               </div>
//             </form>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default CreateNewWishlistModal;
