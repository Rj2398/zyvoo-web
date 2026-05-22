import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

const ItemSelector = ({ onItemsUpdate, propertyData, }) => {
  const itemsList = [
    "Computer Screen",
    "Studio Lights",
    "Projectors",
    "Speakers",
    "Microphones",
    "Sounds Systems",
    "DJ Equipment",
    "Tables",
    "Chairs",
    "Stage PlaMorms",
    "Art Supplies (Paint, brushes)",
    "Allow Alcohol",
    "Onsite Food Prep (Event)",
    "Extra Person above Max Capacity",
    "Photographer (Per Hour)",
    "Videographer (Per Hour)",
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [price, setPrice] = useState("");
  const [addedItems, setAddedItems] = useState(
    propertyData?.add_ons != null && Array.isArray(propertyData.add_ons)
      ? propertyData.add_ons
      : []
  );

    const [isMobileWidth, setIsMobileWidth] = useState(false);
  
    useEffect(() => {
      const checkWindowWidth = () => {
        setIsMobileWidth(window.innerWidth >= 768 || window.innerWidth <= 768 );
      };
  
      checkWindowWidth();
      window.addEventListener('resize', checkWindowWidth);
  
      return () => window.removeEventListener('resize', checkWindowWidth);
    }, [])


  const updateParent = (newItems) => {
    setAddedItems(newItems);
    onItemsUpdate && onItemsUpdate(newItems); 
  };


  const handleAddItem = () => {
    if (selectedItem && price) {
      const newItems = [...addedItems, { name: selectedItem, price:parseFloat(price).toFixed(2) }];
      updateParent(newItems);
      setSelectedItem(null);
      setPrice("");
      setShowModal(false);
    }
  };


  const handleDeleteItem = (index) => {
    const newItems = addedItems.filter((_, i) => i !== index);
    updateParent(newItems);
  };

  return (
    <div>
      {/* Dynamically Added Items */}

      <div className={`d-flex ${isMobileWidth ? "no-wrap" : "flex-wrap"}  align-items-center gap-2`} 
        style={{ marginBottom: "1rem", flexDirection: "row", flexWrap: "nowrap", overflowX: "auto", overflowY: "hidden", width: "100%", scrollBehavior: "smooth", paddingBottom: isMobileWidth ? "10px" : "" }}>

        {addedItems.map((entry, index) => (
          <div key={index}
            className="align-items-center justify-content-between px-2 px-lg-3 py-2"
            style={{
              border: "1px solid #ddd",
              borderRadius: "999px",
              backgroundColor: "#fff",
              width: isMobileWidth ? "max-content" : "fit-content",
              maxWidth: "100%",
              display: "flex",
              gap: "10px",
              flex: isMobileWidth ? "0 0 auto" : "",        // prevent stretching or shrinking
              whiteSpace: isMobileWidth ? "nowrap" :"",    // keep text in one line
            }}
          >
            <span className="add-ons-entity-name">{entry.name}</span>
            <div>
              <span className="add-ons-entity-name">${entry.price}</span>
              <Button
                variant="light"
                size="sm"
                onClick={() => handleDeleteItem(index)}
                style={{
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  padding: 0,
                 fontSize:isMobileWidth?"13px":'',
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f1f1f1",
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </Button>
            </div>
          </div>
        ))}

 
        {itemsList.some(item => !addedItems.some(added => added.name === item)) && (
          <Button
            variant="light"
            onClick={() => setShowModal(true)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "999px",
              padding: "6px 12px",
              backgroundColor: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              flex: isMobileWidth ? "0 0 auto" : "",        // prevent stretching or shrinking
              whiteSpace: isMobileWidth ? "nowrap" :"",
              fontSize:isMobileWidth?"13px":''
            }}
          >
            <span className="add-ons-entity-name">Add New add-on</span>
            <span style={{
                backgroundColor: "#3EF4AE",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
              }}
            >
              <FaPlus />
            </span>
          </Button>
        )}
      </div>

      {/* Show "Add New" Button if items are fewer than 2 */}

      {/* Modal */}
      <Modal className="add-on-item-modal" show={showModal} onHide={() => {setShowModal(false); setSelectedItem(null)}} 
        centered 
        size="lg"
        style={{ zIndex: 10000 ,background:"rgba(0,0, 0,0.5)",}}
      >

      {!isMobileWidth &&
        <Modal.Header closeButton> 
        <Modal.Title>Select an Item</Modal.Title>
        </Modal.Header>}

        <Modal.Body   >
          {/* List of Items */}
          <div className="mb-3 add-on-wrap" style={
    isMobileWidth
    ? {
        overflowY: "scroll",     // enables vertical scrolling
        maxHeight: "300px",      // optional: limit height so scrolling appears
        scrollBehavior: "smooth" // optional: smooth scroll
      }
    : {}
}
>
            {itemsList.filter(item => !addedItems.some(added => added.name === item)).map((item, index) => (
              <Button key={index}
                variant={selectedItem === item ? "primary" : "outline-secondary"}
                className={`d-block mb-2 ${isMobileWidth ? "w-100" : ""}`}
              
                onClick={() => setSelectedItem(item)}
              style={ isMobileWidth ? {
            backgroundColor: "white",
             color: "black",
             textAlign: "start",
             borderRadius: "14px",
              border: "1px solid #ccc",
              boxShadow:'0 2px 8px rgba(0, 0, 0, 0.15)'

              } : {
                
              } }
              >
                {item}
              </Button>
            ))}
          </div>

          {/* Show Selected Item Above Price Input */}
          {isMobileWidth &&( 
           <div className=" text-start py-1"  style={{border:'1px solid grey',borderRadius:'10px',color:'black'}}>
              {/* Selected Item: <strong>{selectedItem}</strong> */}
            
               <Form.Group>
               <Form.Control
               type="text"
              placeholder="Others.."
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              style={{  outline : "none",border:'none'}}
             />
               </Form.Group> 
             </div>   
            )}                         
          {/* Price Input */}
      { !isMobileWidth  &&   <Form.Group>
              <Form.Label style={{fontWeight : 500}}>Enter Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{borderRadius : "20px", padding : "8px 15px", outline : "none", boxShadow : "none", borderColor : "#E5E5E5",marginLeft:'10px'}}
              />
            </Form.Group>}
          </Modal.Body>

        {/* Add Button */}
        <Modal.Footer style={{marginLeft:'0px',borderWidth:'10% !important'}}>


             {isMobileWidth &&
           <Form.Control
              type="number"
              placeholder="$0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{borderRadius : "20px", outline : "none", boxShadow : "none", borderColor : "black",width:'47%',borderRadius:'10px'}}
            />}
             <Button className={(!selectedItem || !price) ? isMobileWidth?"": "add-on-item-btn bg-secondary": isMobileWidth?"":"add-on-item-btn"  }
             onClick={handleAddItem}
             style={isMobileWidth ?{
                backgroundColor: !selectedItem?"rgb(21 49 43)":"rgb(21 49 43)" ,
                 borderRadius:" 30px !important",
                 opacity:" 1 !important",
                 border: "none",
                 color:" white !important",
                 width:'47%'
             }:{}}
             disabled={!selectedItem || !price}   
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ItemSelector;
