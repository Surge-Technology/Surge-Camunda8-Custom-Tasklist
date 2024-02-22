import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { CButton, CFormSelect } from "@coreui/react";
import { useSearchParams } from "react-router-dom";
import "../style/sidebar.css";
import { Spinner } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

const Sidebar = () => {
  const [data, setData] = useState(null);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedValue, setSelectedValue] = useState("allOpen");
  const [isExpanded, setExpanded] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [claimedData, setClaimedData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showNewVariableRow, setShowNewVariableRow] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState(null);
  const [additionalDetails1, setAdditionalDetails1] = useState(null);

  const [isClaimed, setIsClaimed] = useState(false);
  const [rows, setRows] = useState([{ Name: "", Value: "" }]);
  const [areButtonsEnabled, setAreButtonsEnabled] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [variableRows, setVariableRows] = useState([{ name: "", value: "" }]);

  const toggleSidebar = () => {
    setExpanded(!isExpanded);
    setShowDropdown(false);
  };

  const fetchData = async (url, processId, value) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("API Response:", data);
      if (data.length === 0) {
        <div className="no-item-selected">
          console.log("No data available");
        </div>;
        setClaimedData(null); // Set null for no data
        setShowDropdown(false);
        setIsClaimed(false);
      } else {
        setClaimedData(data);
        setShowDropdown(true);
        setIsClaimed(true);

        if (value !== undefined) {
          setSelectedValue(value);
          setSearchParams({ filter: value });
        }

        if (processId) {
          fetchAdditionalDetails(processId);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData(
      "http://localhost:8080/surge/camunda/tasklist/newIndex-all-active"
    );
  }, []);

  const fetchAdditionalDetails = async (processId, value) => {
    try {
      const response = await fetch(
        `http://localhost:8080/getActiveTaskDetailsByID/${processId}`
      );
      const details = await response.json();
      console.log("Additional Details:", details);

      // Check a condition based on details and set a flag
      const shouldDisableButtons = details.some((item) => item.someCondition);

      if (details && details.length > 0 && details[0].Variable) {
        console.log("Variable:", details[0].Variable);
        setSelectedItem((prevSelectedItem) => ({
          ...prevSelectedItem,
          Variable: details[0].Variable,
        }));
      }

      setAreButtonsEnabled(!shouldDisableButtons);
      setAdditionalDetails(details);
      setSelectedValue(value);

      setSearchParams({ processId, filter: value });
    } catch (error) {
      console.error("Error fetching additional details:", error);
    }
  };

  const handleOptionChange = (value, processId) => {
    // Clear selectedValue
    setSelectedValue(value);

    if (processId) {
      setSearchParams({ processId, filter: value });
      fetchAdditionalDetails(processId, value);
    } else {
      // If processId is not provided, it means the option change is from the dropdown
      setSearchParams({ filter: value });
      fetchDataForDropdown(value);

      // Clear selectedItem only if an option is selected from the dropdown
      setSelectedItem(null);
    }

    // Fetch data based on the selected value
    if (value === "allOpen") {
      fetchData(
        "http://localhost:8080/surge/camunda/tasklist/newIndex-all-active"
      );
    } else if (value === "claim") {
      fetchData(`http://localhost:8080/claimedByMeNewIndex/${username}`);
    } else if (value === "unClaim") {
      fetchData("http://localhost:8080/unclaimedByMeNewIndex");
    } else if (value === "complete") {
      fetchData("http://localhost:8080/completedField");
    }

    // Set the isCompleting state based on the selected value
    setIsCompleting(value === "complete");

    // Fetch additional details if processId is provided
    if (processId) {
      fetchAdditionalDetails(processId, value);
    }
    // alert("selected process completed")
    console.log("*************** Above Value from dropdown: *********", value);
  };
  const handleDivClick = async (item, Key, selectedValue) => {
    console.log(
      "Clicked Item:",
      item,
      "processId:",
      Key,
      "value",
      selectedValue
    ); // Log the clicked item
    console.log("selected value", selectedValue);
    if (item && item.Key) {
      // Log the item being set as selected
      setSelectedItem(item);
      setVariableRows(item.Variable ? [...item.Variable] : []);
      setSearchParams({ processId: Key, filter: selectedValue });

      if (selectedValue === "complete") {
        const completeApiUrl = `http://localhost:8080/getActiveTaskDetailsByID22/${item.Key}`;
        try {
          const response = await fetch(completeApiUrl);
          const detailsfromComplete = await response.json();
          console.log(
            "Additional Details from complete:",
            detailsfromComplete[0]
          );

          if (
            detailsfromComplete &&
            Array.isArray(detailsfromComplete) &&
            detailsfromComplete.length > 0 &&
            detailsfromComplete[0] &&
            detailsfromComplete[0].Variable
          ) {
            console.log("Variable:", detailsfromComplete[0].Variable);
            setSelectedItem((prevSelectedItem) => ({
              ...prevSelectedItem,
              Variable: detailsfromComplete[0].Variable,
            }));
          } else {
            console.log("Invalid or empty response:", detailsfromComplete);
          }

          setAreButtonsEnabled(true); // Enable buttons as all details are available
          setAdditionalDetails1(detailsfromComplete);
        } catch (error) {
          console.error("Error fetching data from different API:", error);
        }
      } else {
        // For other options, call the usual option change function
        handleOptionChange(selectedValue, item.Key);
      }
    }
  };
  const [newVariable, setNewVariable] = useState({ name: "", value: "" });

  const fetchDataForDropdown = async (selectedValue) => {
    try {
      let url;
      switch (selectedValue) {
        case "allOpen":
          url =
            "http://localhost:8080/surge/camunda/tasklist/newIndex-all-active";
          break;
        case "claim":
          url = `http://localhost:8080/claimedByMeNewIndex/${username}`;
          break;
        case "unClaim":
          url = "http://localhost:8080/unclaimedByMeNewIndex";
          break;
        case "complete":
          url = "http://localhost:8080/completedField";
          break;
        default:
          console.error("Invalid option selected");
          return;
      }

      const response = await fetch(url);
      const data = await response.json();

      console.log("Data fetched for dropdown:", data);
    } catch (error) {
      console.error("Error fetching data for dropdown:", error);
    }
  };
  const handleCompleteButtonClick = () => {
    const isAnyEmpty = variableRows.some(
      (variable) => variable.name.trim() === "" || variable.value.trim() === ""
    );
    if (isAnyEmpty) {
      // alert('Please fill in all variable names and values.');
      return;
    }

    setIsCompleting(true);
    onComplete();
  };

  const handleClaimClick = () => {
    const requestData = {
      _id: selectedItem._id,
      assignee: username,
    };
    // alert("resquest", requestData);
    console.log("assigne from claim click", requestData.assignee);

    const apiUrl =
      "http://localhost:8080/surge/camunda/tasklist/update-assignee";

    console.log("resquest", requestData);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())

      .then((responseData) => {
        const updatedClaimedData = claimedData.map((item) => {
          if (item._id === selectedItem._id) {
            return {
              ...item,
              assignee: responseData.assignee,
            };
          }
          return item;
        });
        setClaimedData(updatedClaimedData);
        setSelectedItem((prevSelectedItem) => ({
          ...prevSelectedItem,
          assignee: responseData.assignee,
        }));
        setIsClaimed(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    //  window.location.reload();
  };

  const handleUnclaimClick = () => {
    // alert("handleUnclaimClick clicked");
    const apiUrl =
      "http://localhost:8080/surge/camunda/tasklist/remove-assignee-customeHeader";
    const requestData = {
      _id: selectedItem._id,
      _index: selectedItem._index,
    };
    console.log("resquest", requestData);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      // .then((response) => response.json())
      .then((responseData) => {
        console.log("Success:", responseData);
        const tempData = { ...selectedItem, assignee: null };
        console.log(tempData);
        setSelectedItem(tempData);
        setIsClaimed(false);
        const tbdcheck = [...data];
        const i = tbdcheck.findIndex((item) => item._id == selectedItem._id);
        console.log(i);
        tbdcheck[i].assignee = null;
        setData(tbdcheck);
      })
      .then((response) => response.json())
      .then((responseData) => {
        const updatedClaimedData = claimedData.map((item) => {
          if (item._id === selectedItem._id) {
            return {
              ...item,
              assignee: null,
            };
          }
          return item;
        });
        setClaimedData(updatedClaimedData);
        const tempData = { ...selectedItem, assignee: null };
        setSelectedItem(tempData);
        setIsClaimed(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    window.location.reload();
  };

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
    //  setRows([...newRows, { Name: "", Value: "" }]);
  };

  const handleCloseNewVariableRow = () => {
    setShowNewVariableRow(false);
    setNewVariable({ name: "", value: "" });

    const index = variableRows.findIndex(
      (variable) =>
        variable.name === newVariable.name &&
        variable.value === newVariable.value
    );

    if (index !== -1) {
      const updatedVariableRows = [...variableRows];
      updatedVariableRows.splice(index, 1);
      setVariableRows(updatedVariableRows);
    }
  };

  const renderVariableRows = () => {
    try {
      console.log("Selected Item:", selectedItem);
      console.log("Variable Data:", selectedItem?.Variable);

      let renderedRows = [];

      if (
        selectedItem.Variable &&
        Array.isArray(selectedItem.Variable) &&
        selectedItem.Variable.length > 0
      ) {
        renderedRows = selectedItem.Variable.map((variable, index) => {
          const [key, value] = Object.entries(variable)[0];
          return (
            <tr
              key={`${key}-${index}`}
              style={{ display: "flex", marginBottom: "10px" }}
            >
              <td>
                <input
                  className="resVariable"
                  type="text"
                  placeholder="Name"
                  readOnly
                  value={key}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                  style={{ width: "200px", marginRight: "10px" }}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="resValue"
                  placeholder="Value"
                  readOnly
                  value={value !== undefined ? value : ""}
                  onChange={(e) =>
                    handleInputChange(index, "value", e.target.value)
                  }
                  style={{ width: "400px", marginleft: "10px" }}
                />
              </td>
            </tr>
          );
        });
      }

      return renderedRows.length > 0 ? (
        renderedRows
      ) : (
        <tr>
          <td colSpan="3">A task has no variable</td>
        </tr>
      );
    } catch (error) {
      console.log("Error rendering variable rows:", error);
      return null;
    }
  };

  const handleAddVariableClick = () => {
    setShowNewVariableRow(true);

    const initialVariable = { name: "", value: "" };

    // Add the new variable with initial values to the variable rows state
    setVariableRows((prevRows) => [...prevRows, initialVariable]);
  };

  const handleVariableChange = (index, field, value) => {
    const updatedVariableRows = [...variableRows];
    updatedVariableRows[index][field] = value;
    setVariableRows(updatedVariableRows);
  };
  const [isLoading, setIsLoading] = useState(false);

  const onComplete = (task) => {
    setIsLoading(true);

    const requestBody = variableRows.reduce((acc, variable) => {
      acc[variable.name] = variable.value;
      return acc;
    }, {});

    console.log("Request data:", requestBody);

    console.log("variable", selectedItem?.Variable);
    const apiUrl = `http://localhost:8080/completeTask1/${selectedItem.Key}/${username}`;
    console.log("enter selectedItem variable", selectedItem?.Variable);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to complete task");
        }
      })

      .then((data) => {
        console.log("Success:", data);
        setIsClaimed(true);

        alert("completed");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  };
  <Toaster position="bottom-left" reverseOrder={true} />;

  return (
    <div className="main-container">
      <div className="left-container">
        <div className="sideBar-Container">
          <div className={`sidebar ${isExpanded ? "expanded" : "minimized"}`}>
            <div className="toggle-container">
              {isExpanded && <span className="text">Tasks</span>}
              <button className="toggle-button" onClick={toggleSidebar}>
                {isExpanded ? <FaArrowLeft /> : <FaArrowRight />}
              </button>
            </div>
            {isExpanded && (
              <div className="dropdown">
                <CFormSelect
                  className="form-select"
                  aria-label="select"
                  onChange={(e) => handleOptionChange(e.target.value)}
                >
                  <option value="allOpen">All Open</option>
                  <option value="claim">Claim</option>
                  <option value="unClaim">UnClaim</option>
                  <option value="complete">Complete</option>
                </CFormSelect>

                {claimedData && claimedData.length > 0 ? (
                  <div
                    className="claimed-data"
                    onClick={fetchAdditionalDetails}
                  >
                    <ul>
                      {claimedData.map((item) => (
                        <li
                          key={item.Key}
                          className={
                            selectedItem && selectedItem.Key === item.Key
                              ? "selected"
                              : ""
                          }
                          style={{
                            background:
                              selectedItem && selectedItem.Key === item.Key
                                ? " rgb(234, 243, 255)"
                                : "none",
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left",
                            marginBottom: "3px",
                          }}
                          onClick={() =>
                            handleDivClick(item, item.Key, selectedValue)
                          }
                        >
                          <div
                            style={{
                              textAlign: "left",
                              display: "flex",
                              justifyContent: "space-between",
                              color: "rgba(69, 70, 78, 0.9)",
                              fontWeight: "600",
                            }}
                          >
                            {" "}
                            {item.Process}
                          </div>
                          <div
                            style={{
                              marginBottom: "35px",
                              color: "rgb(98, 98, 110)",
                              fontSize: "15px",
                            }}
                          >
                            {item.Name}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "10px",
                            }}
                          >
                            <div>{item.assignee}</div>

                            <div>{item.CreationTime}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="no-item-selected" style={{ color: "black" }}>
                    No data Available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="right-container"
        style={{ flex: isExpanded ? "50%" : "100%" }}
      >
        {selectedValue === "claim" ||
        selectedValue === "unClaim" ||
        selectedValue === "allOpen" ? (
          selectedItem ? (
            <div className="process">
              <div
                className={`right-side ${
                  isExpanded ? "expanded" : "minimized"
                }`}
              >
                <h2 className="text-1">Details</h2>
                {console.log("Selected Item.......:", selectedItem)}
                {console.log("Selected Value........:", selectedValue)}
                <div>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th
                          className="t-head"
                          style={{ color: "rgba(69, 70, 78, 0.9)" }}
                        >
                          Name
                        </th>
                        <td>{selectedItem.Process}</td>
                      </tr>
                      <tr>
                        <th
                          className="t-head"
                          style={{ color: "rgba(69, 70, 78, 0.9)" }}
                        >
                          Process
                        </th>
                        <td>{selectedItem.Name}</td>
                      </tr>
                      <tr>
                        <th
                          className="t-head"
                          style={{ color: "rgba(69, 70, 78, 0.9)" }}
                        >
                          CreationTime
                        </th>
                        <td>{selectedItem.CreationTime}</td>
                      </tr>

                      <tr>
                        <th
                          className="t-head"
                          style={{ color: "rgba(69, 70, 78, 0.9)" }}
                        >
                          Assignee
                        </th>
                        <td className="claim-details">
                          <td className="sc-olbas sc-evrZIY iVJMuP jYiRNe">
                            <div
                              data-testid="assignee-task-details"
                              className="sc-fIavCj goyRLq"
                            >
                              {selectedItem.assignee !== null
                                ? selectedItem.assignee
                                : "--"}{" "}
                            </div>
                          </td>
                          {selectedItem.assignee !== null ? (
                            selectedItem.assignee === username ? (
                              <CButton
                                type="button"
                                className="sc-lbxAil sc-gITdmR jmZChO hjUmcc"
                                style={{
                                  fontSize: "9px",
                                  padding: "3px 8px",
                                  backgroundColor: "rgb(182, 182, 182)",
                                  color: "black",
                                }}
                                onClick={handleUnclaimClick}
                                disabled={isCompleting}
                              >
                                Unclaim
                              </CButton>
                            ) : (
                              <CButton
                                type="button"
                                className="sc-lbxAil sc-gITdmR jmZChO hjUmcc"
                                style={{
                                  fontSize: "9px",
                                  padding: "3px 8px",
                                  backgroundColor: "rgb(182, 182, 182)",
                                  color: "black",
                                }}
                                onClick={() => {}}
                                disabled={true}
                              >
                                unclaim
                              </CButton>
                            )
                          ) : (
                            <div>
                              <CButton
                                type="button"
                                className="sc-lbxAil sc-gITdmR jmZChO hjUmcc"
                                style={{
                                  fontSize: "9px",
                                  padding: "3px 6px",
                                  backgroundColor: "rgb(182, 182, 182)",
                                  color: "black",
                                }}
                                onClick={handleClaimClick}
                                disabled={isCompleting}
                              >
                                Claim
                              </CButton>
                            </div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {isLoading && <Spinner />}

                  <div
                    className="right-container"
                    style={{ flex: isExpanded ? "50%" : "100%" }}
                  >
                    <form className="row g-3 needs-validation">
                      <div className="form-layout">
                        <div className="variables">
                          <h2>Variables</h2>
                          {selectedItem.assignee !== null && !isCompleting && (
                            <button
                              type="button"
                              className="add-variable"
                              // onClick={() => {
                              //   setShowNewVariableRow(true);
                              //   handleAddVariableClick()
                              // }}
                              onClick={() => handleAddVariableClick()}
                              disabled={isCompleting}
                            >
                              Add Variable +
                            </button>
                          )}
                        </div>

                        <div
                          className="sc-tableCon"
                          style={{
                            overflowY: "auto",
                            maxHeight: "200px",
                            marginLeft: "20px",
                          }}
                        >
                          <table className="sc-table">
                            <thead className="form-group">
                              {/*<tr
                            className="group-head"
                            style={{ marginBottom: "10px" }}
                          >
                            <th className="nameVar">Name</th>

                            <th className="ValueVar">Value</th>
                    </tr>*/}
                            </thead>
                            <tbody className="varRows">
                              <tr>{renderVariableRows()}</tr>
                              <tr>
                                {variableRows.map((variable, index) => (
                                  <tr key={index}>
                                    <td>
                                      <input
                                        type="text"
                                        placeholder="Name"
                                        value={variable.name}
                                        required
                                        onChange={(e) =>
                                          handleVariableChange(
                                            index,
                                            "name",
                                            e.target.value
                                          )
                                        }
                                        style={{
                                          display: "flex",
                                          width: "200px",
                                          marginRight: "10px",
                                          marginBottom: "5px",
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        placeholder="Value"
                                        value={variable.value}
                                        required
                                        onChange={(e) =>
                                          handleVariableChange(
                                            index,
                                            "value",
                                            e.target.value
                                          )
                                        }
                                        style={{
                                          display: "flex",
                                          width: "400px",
                                          marginRight: "10px",
                                        }}
                                      />
                                    </td>
                                    <button
                                      type="button"
                                      onClick={handleCloseNewVariableRow}
                                    >
                                      x
                                    </button>
                                  </tr>
                                ))}
                              </tr>
                            </tbody>
                          </table>

                          <div
                            style={{
                              textAlign: "right",
                              marginTop: "20px",
                              marginRight: "40px",
                            }}
                          >
                            {selectedItem.assignee !== null &&
                              !isCompleting &&
                              areButtonsEnabled && (
                                <p>
                                  {!isCompleting && (
                                    <button
                                      onClick={handleCompleteButtonClick}
                                      disabled={isCompleting}
                                      style={{
                                        backgroundColor: "#ff4000",
                                        color: "white",
                                        padding: "5px 10px",
                                        fontSize: "12px",
                                        border: "none",
                                        borderRadius: "3px",
                                        cursor: "pointer",
                                        margin: "6px 60px 20px 7px;",
                                      }}
                                    >
                                      Complete Task
                                    </button>
                                  )}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-item-selected">
              Select a task to view the details
            </div>
          )
        ) : selectedValue === "complete" ? (
          selectedItem ? (
            <div className="process">
              {console.log("1Selected Item.......:", selectedItem)}
              {console.log("1Selected Value........:", selectedValue)}
              <div
                className={`right-side ${
                  isExpanded ? "expanded" : "minimized"
                }`}
              >
                <h2 className="text-1">Details</h2>
                <div>
                  <table className="table">
                    <tbody>
                      {additionalDetails1 && additionalDetails1.length > 0 ? (
                        <>
                          <tr>
                            <th className="t-head">Name</th>
                            <td>{additionalDetails1[0].Name}</td>
                          </tr>
                          <tr>
                            <th className="t-head">Process</th>
                            <td>{additionalDetails1[0].Process}</td>
                          </tr>
                          <tr>
                            <th className="t-head">CreationTime</th>
                            <td>{additionalDetails1[0].CreationTime}</td>
                          </tr>
                          <tr>
                            <th className="t-head">Completion Time</th>

                            <td>{additionalDetails1[0].CompletionTime}</td>
                          </tr>

                          <tr>
                            <th className="t-head">Assignee</th>
                            <td className="claim-details">
                              <td className="sc-olbas sc-evrZIY iVJMuP jYiRNe">
                                <div
                                  data-testid="assignee-task-details"
                                  className="sc-fIavCj goyRLq"
                                >
                                  {selectedItem.assignee !== null
                                    ? selectedItem.assignee
                                    : "--"}{" "}
                                </div>
                              </td>
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td colSpan="2">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <form className="row g-3 needs-validation">
                    <div className="form-layout">
                      <div className="variables">
                        <h2>Variables</h2>
                      </div>

                      <div
                        className="sc-tableCon"
                        style={{
                          overflowY: "auto",
                          maxHeight: "200px",
                          marginLeft: "20px",
                        }}
                      >
                        <table className="sc-table">
                          <thead className="form-group"></thead>
                          <tbody className="varRows">
                            <tr>{renderVariableRows()}</tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-item-selected">
              Select a task to view the details
            </div>
          )
        ) : (
          <div className="no-item-selected">
            "Select a task to view the details"
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
