import React, { useState, useEffect } from "react";
import { Button, Row, Col, Toast } from "reactstrap";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { toast } from "react-toastify";
import history from "../utils/history";
import AddPageImage from "../assets/images/add_image.jpg";
export default function AddProducts() {
  const storage = getStorage();
  const initialState = {
    name: "",
    description: "",
    image: "",
    quantity: "",
    units: "",
  };

  const [values, setValues] = useState(initialState);
  const [products, setProducts] = useState([]);
  const [uploadedImageURL, setUploadedImageURL] = useState("");

  useEffect(() => {
    // AddProductsFunc();
    getProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    let path = `/images/${file.name}`;
    const storageRef = ref(storage, path);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);
      // get uploaded file url
      getDownloadURL(ref(storage, path))
        .then((url) => {
          console.log("uploaded image: ", url);
          setUploadedImageURL(url);
        })
        .catch((error) => {
          console.log("get url catch error: ", error);
        });
    });
  };

  //   const AddProductsFunc = async (data) => {
  //     try {
  //       const docRef = await addDoc(collection(db, "products"), {
  //         name: "testsss",
  //         description: "teststskjaj",
  //         quantity: "83",
  //       });
  //       console.log("Document written with ID: ", docRef.id);
  //     } catch (e) {
  //       console.error("Error adding document: ", e);
  //     }
  //   };

  const getProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    let temp = [];
    querySnapshot.forEach((doc) => {
      temp.push(doc.data());
    });
    setProducts(temp);
  };

  const handleSubmit = async () => {
    if (uploadedImageURL) {
      try {
        const docRef = await addDoc(collection(db, "products"), {
          name: values.name,
          description: values.description,
          image: uploadedImageURL,
          units: values.units,
          quantity: values.quantity,
        });
        console.log("Document written with ID: ", docRef.id);
        toast.success("Product added successfully");
        history.push("/products-list");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      toast.info("Please upload the product image..");
    }
  };
  return (
    <div
      className="container"
      style={{
        marginRight: "190px",
        marginTop: "100px",
        // backgroundImage: `url(${AddPageImage})`,
      }}
    >
      <h3 className="mb-4 addPdtHeading" style={{ marginLeft: "19em" }}>
        Add Products
      </h3>
      {/* <p>Add products screen</p>
      <input type="file" accept="image/*" onChange={uploadFile} /> */}
      <AvForm onValidSubmit={handleSubmit}>
        <Row className="text-center">
          <Col md={4}></Col>
          <Col md={2} style={{ fontWeight: "bold" }}>
            Title
          </Col>
          <Col md={4} className="mb-3">
            <AvField
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              placeholder="Enter Product Title here..."
              validate={{
                required: {
                  value: true,
                  errorMessage: "Please Enter Product Title",
                },
              }}
            />
          </Col>
          <Col md={2}></Col>
          <Col md={4}></Col>
          <Col md={2} style={{ fontWeight: "bold" }}>
            Description
          </Col>
          <Col md={4} className="mb-3">
            <AvField
              name="description"
              type="textarea"
              placeholder="Enter Product Description here..."
              value={values.description}
              onChange={handleChange}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Please Enter Product Description",
                },
              }}
            />
          </Col>
          <Col md={2}></Col>
          <Col md={4}></Col>
          <Col md={2} style={{ fontWeight: "bold" }}>
            Product Image
          </Col>
          {!uploadedImageURL && (
            <Col md={3} className="mb-3">
              <input
                name="image"
                type="file"
                value={values.image}
                onChange={uploadFile}
              />
            </Col>
          )}
          <Col md={3} className="mb-3" style={{ fontWeight: "bold" }}>
            {uploadedImageURL && (
              <div className="d-flex">
                <img
                  style={{ width: "100px", height: "100px" }}
                  src={uploadedImageURL}
                  id="uploaded-image"
                  alt="product_image"
                ></img>
                <p
                  className="ml-5"
                  style={{
                    marginLeft: "15px",
                    marginTop: "40px",
                    cursor: "pointer",
                  }}
                  onClick={() => setUploadedImageURL("")}
                >
                  Edit
                </p>
              </div>
            )}
          </Col>
          <Col md={4}></Col>
          <Col md={2} style={{ fontWeight: "bold" }}>
            Units
          </Col>
          <Col md={4} className="mb-3">
            <AvField
              type="select"
              name="units"
              onChange={handleChange}
              value={values.units}
              validate={{
                required: { value: true, errorMessage: "Please choose units" },
              }}
            >
              <option hidden value="">
                Select Unit
              </option>
              <option value="Kilograms">Kilograms</option>
              <option value="Litres">Litres</option>
              <option value="Pieces">Pieces</option>
            </AvField>
          </Col>
          <Col md={2}></Col>
          {values.units !== "" && (
            <>
              <Col md={4}></Col>
              <Col md={2} style={{ fontWeight: "bold" }}>
                Quantity
              </Col>
              <Col md={4} className="mb-3">
                <AvField
                  name="quantity"
                  type="number"
                  placeholder="Enter Product Quantity here..."
                  value={values.quantity}
                  onChange={handleChange}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Please Enter Product Quantity",
                    },
                  }}
                />
              </Col>
              {/* <Col md={2} className="float-left">
                {values.units}
              </Col> */}
            </>
          )}
        </Row>
        <Row>
          <Col md={6}></Col>
          <Col md={6}>
            <Button className="btn-success" type="submit">
              Add Product
            </Button>
            <Button
              className="addBtn btn-warning"
              onClick={() => {
                history.push("/products-list");
              }}
            >
              View All Products
            </Button>
          </Col>
        </Row>
      </AvForm>
    </div>
  );
}
