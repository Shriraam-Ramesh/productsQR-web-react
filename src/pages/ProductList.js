import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  PaginationItem,
  PaginationLink,
  Pagination,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import QRCode from "qrcode.react";
import "../Css/ProductsList.css";
import { toast } from "react-toastify";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";
import NoImage from "../assets/images/no_image.jpg";
import history from "../utils/history";
export default function ProductList() {
  const [databaseData, setDatabaseData] = useState([]);
  const [text1, setText1] = useState(false);
  const [text2, setText2] = useState(false);
  const [text3, setText3] = useState(false);
  const [text4, setText4] = useState(false);
  const [typedData, setTypedData] = useState("");
  const [filterData, setFilterData] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [pagiNation, setPagination] = useState(true);
  const [noDataFound, setNoDataFound] = useState(false);
  const [modal, setModal] = useState(false);
  const [singleProduct, setSingleProduct] = useState("");
  const toggle = () => setModal(!modal);
  useEffect(() => {
    getProducts();
  }, []);

  useEffect(async () => {
    if (typedData.length == 0) {
      console.warn("helloooo");
      const querySnapshot = await getDocs(collection(db, "products"));
      let temp = [];
      querySnapshot.forEach((doc) => {
        let obj = { ...doc.data(), docId: doc.id };
        temp.push(obj);
      });
      setFilterData(temp);
      setNoDataFound(false);
      setCurrentPage(0);
    }
  }, [typedData]);
  const getProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    let temp = [];
    querySnapshot.forEach((doc) => {
      let obj = { ...doc.data(), docId: doc.id };
      temp.push(obj);
    });
    setDatabaseData(temp);
    setFilterData(temp);
  };

  const deleteProduct = async (e, data) => {
    try {
      await deleteDoc(doc(db, "products", data.docId));
      toast.success("Product Deleted Successfully");
      getProducts();
    } catch (err) {
      console.log("del err", err);
    }
  };
  const viewProduct = (e, data) => {
    setModal(true);
    delete data.docId;
    setSingleProduct(JSON.stringify(data));
  };
  const handleClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
    console.log(`Viewing Page ${index + 1} Data`);
  };

  const downloadQR = (name) => {
    const canvas = document.getElementById("productDetails");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${name}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success("QR code downloaded successfully");
  };
  const changeText1 = () => {
    setText1(!text1);
    if (text1 === true) {
      sortByNameAsc();
    } else {
      sortByTokenDesc();
    }
  };
  const sortByNameAsc = () => {
    setFilterData(
      filterData.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
    );
  };
  const sortByTokenDesc = () => {
    setFilterData(
      filterData.sort((a, b) => {
        if (a.name > b.name) {
          return -1;
        }
        if (a.name < b.name) {
          return 1;
        }
        return 0;
      })
    );
  };
  const changeText2 = () => {
    setText2(!text2);
    if (text2 === true) {
      sortByDescriptionAsc();
    } else {
      sortByDescriptionDesc();
    }
  };

  const sortByDescriptionAsc = () => {
    setFilterData(
      filterData.sort((a, b) => {
        if (a.description < b.description) {
          return -1;
        }
        if (a.description > b.description) {
          return 1;
        }
        return 0;
      })
    );
  };
  const sortByDescriptionDesc = () => {
    setFilterData(
      filterData.sort((a, b) => {
        if (a.description > b.description) {
          return -1;
        }
        if (a.description < b.description) {
          return 1;
        }
        return 0;
      })
    );
  };
  const changeText3 = () => {
    setText3(!text3);
    if (text3 === true) {
      sortByQuanAsc();
    } else {
      sortByQuanDesc();
    }
  };

  const sortByQuanAsc = () => {
    setFilterData(filterData.sort((a, b) => a.quantity - b.quantity));
  };

  const sortByQuanDesc = () => {
    setFilterData(filterData.sort((a, b) => a.quantity - b.quantity).reverse());
  };

  const changeText4 = () => {
    setText4(!text4);
    if (text4 === true) {
      sortByUnitsAsc();
    } else {
      sortByUnitsDesc();
    }
  };

  const sortByUnitsAsc = () => {
    setFilterData(
      filterData.sort((a, b) => {
        if (a.units < b.units) {
          return -1;
        }
        if (a.units > b.units) {
          return 1;
        }
        return 0;
      })
    );
  };

  const sortByUnitsDesc = () => {
    setFilterData(
      filterData.sort((a, b) => {
        if (a.units > b.units) {
          return -1;
        }
        if (a.units < b.units) {
          return 1;
        }
        return 0;
      })
    );
  };
  const handleSearchInputChange = (e, pageSize) => {
    setTypedData(e.target.value);
    if (e.target.value == "") {
      setFilterData(databaseData);
    }
    getInput();
  };
  const getInput = () => {
    let newDetails = [...databaseData];
    const filterData = newDetails.filter((item) => {
      return (
        item.name.toLowerCase().indexOf(typedData.toLowerCase()) !== -1 ||
        item.description.toLowerCase().indexOf(typedData.toLowerCase()) !==
          -1 ||
        item.quantity.toLowerCase().indexOf(typedData.toLowerCase()) !== -1 ||
        item.units.toLowerCase().indexOf(typedData.toLowerCase()) !== -1
      );
    });
    if (filterData.length === 0) {
      setNoDataFound(true);
      //   notify();
    } else {
      setFilterData(filterData);
    }
    console.log(`Filtered Data ---->${filterData.length}`);
  };

  const hidePagination = () => {
    let pageSize = 500;
    if (filterData.length <= pageSize) {
      setPagination(false);
    } else {
      setPagination(true);
    }
  };
  const notify = () => toast.error("No such data Here...");
  const pageSize = 10;
  const pagesCount = Math.ceil(filterData.length / pageSize);
  return (
    <div>
      <div className="p-0 m-0 col-lg-12 col-md-12">
        <div className="container-fluid p-0 m-0 col-lg-12 col-md-12">
          <div className="search-block col-lg-12 col-md-12">
            <h3 className="search-heading d-flex justify-content-center">
              Products List
            </h3>
            <div className="search">
              <input
                id="searchData"
                className="search-input-field"
                name={typedData}
                onChange={(e) => handleSearchInputChange(e)}
                placeholder="Search Tokens Here.."
              />
              <UncontrolledTooltip placement="right" target="searchData">
                Filter data you want to see
              </UncontrolledTooltip>
              <Button
                className="addBtn btn-warning"
                id="addNew"
                onClick={() => history.push("/add-product")}
              >
                Add Products
              </Button>
              <UncontrolledTooltip placement="left" target="addNew">
                Add new Product
              </UncontrolledTooltip>
            </div>
            {pagesCount > 1 && (
              <div className="d-flex justify-content-center">
                {pagiNation && (
                  <div className="page">
                    <Pagination>
                      <PaginationItem disabled={currentPage <= 0}>
                        <PaginationLink
                          className={
                            currentPage <= 0
                              ? "prev-next-buttons text-black"
                              : "prev-next-buttons text-white"
                          }
                          onClick={(e) => handleClick(e, currentPage - 1)}
                          href="#"
                        >
                          Previous
                        </PaginationLink>
                      </PaginationItem>
                      {[...Array(pagesCount)].map((currentPageno, i) => (
                        <PaginationItem active={i === currentPage} key={i}>
                          <PaginationLink
                            className="page-numbers"
                            onClick={(e) => handleClick(e, i)}
                            href="#"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem disabled={currentPage >= pagesCount - 1}>
                        <PaginationLink
                          className={
                            currentPage >= pagesCount - 1
                              ? "prev-next-buttons text-black"
                              : "prev-next-buttons text-white"
                          }
                          onClick={(e) => handleClick(e, currentPage + 1)}
                          href="#"
                        >
                          Next
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </div>
                )}
              </div>
            )}
            <div className="p-0 m-0 col-lg-12 col-md-12 text-center">
              <Table className="tableData w-100 p-0 m-0 table table-striped col-lg-12 col-md-12">
                <thead>
                  <tr>
                    <th className="heading pb-3">
                      No <span />
                    </th>
                    <th className="heading">
                      Name <span />
                      <Button
                        id="first"
                        outline
                        style={{ border: "none" }}
                        type="button"
                        onClick={(e) => changeText1(e)}
                      >
                        {text1 ? (
                          <i className="fas fa-sort-amount-down-alt" />
                        ) : (
                          <i className="fas fa-sort-amount-down" />
                        )}
                        {text1 ? (
                          <UncontrolledTooltip placement="top" target="first">
                            Ascending
                          </UncontrolledTooltip>
                        ) : (
                          <UncontrolledTooltip placement="top" target="first">
                            Desscending
                          </UncontrolledTooltip>
                        )}
                      </Button>
                    </th>
                    <th className="heading">
                      Description <span />
                      <Button
                        id="second"
                        style={{ border: "none" }}
                        outline
                        type="button"
                        onClick={(e) => changeText2(e)}
                      >
                        {text2 ? (
                          <i className="fas fa-sort-amount-down-alt" />
                        ) : (
                          <i className="fas fa-sort-amount-down" />
                        )}
                      </Button>
                      {text2 ? (
                        <UncontrolledTooltip placement="top" target="second">
                          Ascending
                        </UncontrolledTooltip>
                      ) : (
                        <UncontrolledTooltip placement="top" target="second">
                          Desscending
                        </UncontrolledTooltip>
                      )}
                    </th>
                    <th className="heading pb-3">
                      Image <span />
                    </th>
                    <th className="heading">
                      {" "}
                      Quantity <span />
                      <Button
                        id="fourth"
                        outline
                        style={{ border: "none" }}
                        type="button"
                        onClick={(e) => changeText3(e)}
                      >
                        {text3 ? (
                          <i className="fas fa-sort-amount-down-alt" />
                        ) : (
                          <i className="fas fa-sort-amount-down" />
                        )}
                      </Button>
                      {text3 ? (
                        <UncontrolledTooltip placement="top" target="fourth">
                          Ascending
                        </UncontrolledTooltip>
                      ) : (
                        <UncontrolledTooltip placement="top" target="fourth">
                          Desscending
                        </UncontrolledTooltip>
                      )}
                    </th>
                    <th className="heading">
                      {" "}
                      Units <span />
                      <Button
                        id="fifth"
                        outline
                        style={{ border: "none" }}
                        type="button"
                        onClick={(e) => changeText4(e)}
                      >
                        {text4 ? (
                          <i className="fas fa-sort-amount-down-alt" />
                        ) : (
                          <i className="fas fa-sort-amount-down" />
                        )}
                      </Button>
                      {text4 ? (
                        <UncontrolledTooltip placement="top" target="fifth">
                          Ascending
                        </UncontrolledTooltip>
                      ) : (
                        <UncontrolledTooltip placement="top" target="fifth">
                          Desscending
                        </UncontrolledTooltip>
                      )}
                    </th>
                    <th className="heading pb-3">
                      {" "}
                      Actions
                      <span />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!noDataFound && filterData.length > 0 ? (
                    filterData
                      .slice(
                        currentPage * pageSize,
                        (currentPage + 1) * pageSize
                      )
                      .map((i, index) => {
                        return (
                          <tr key={i.mobile} className="pdtRow">
                            <td>{index + 1}</td>
                            <td style={{ textTransform: "capitalize" }}>
                              {i.name ? i.name : "-"}
                            </td>
                            <td>{i.description ? i.description : "-"}</td>
                            <td>
                              <img
                                className="pdtImg"
                                src={i.image ? i.image : NoImage}
                                alt="pdt"
                                id={`pdt${i}`}
                              />
                            </td>
                            <td>{i.quantity ? i.quantity : "-"}</td>
                            <td>{i.units ? i.units : "-"}</td>
                            <td>
                              <i
                                style={{ cursor: "pointer" }}
                                onClick={(e) => viewProduct(e, i)}
                                className="delBtn fas fa-eye text-primary"
                              />
                              <i
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "10px",
                                }}
                                onClick={(e) => deleteProduct(e, i)}
                                className="delBtn fas fa-trash-alt text-danger"
                              />
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <span className="text-warning font-weight-bold">
                          OOPS! NO DATA FOUND
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modal} className="modal-dialog-centered">
        <ModalBody style={{ backgroundColor: "#FAFAFC" }}>
          <div className="text-center">
            <h4>Scan QR Code here</h4>
            <div>
              <QRCode
                id="productDetails"
                value={`${singleProduct}`}
                size={330}
                level={"H"}
                includeMargin={true}
              />
            </div>
            <Button
              color="success"
              onClick={() =>
                downloadQR(
                  JSON.parse(singleProduct).name
                    ? JSON.parse(singleProduct).name
                    : "product"
                )
              }
            >
              Download QR
            </Button>{" "}
            <Button color="danger" onClick={toggle}>
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
