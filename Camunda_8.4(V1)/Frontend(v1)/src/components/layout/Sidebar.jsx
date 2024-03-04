import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
} from "@coreui/react";
import { useSearchParams } from "react-router-dom";
import "../style/sidebar.css";
import { Spinner } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import { Toast } from "@coreui/coreui";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  useEffect(() => {
    setInputValues({});
  }, [selectedItem]);

  const [details, setDetails] = useState();
  const fetchAdditionalDetails = async (processId, value) => {
    try {
      const response = await fetch(
        `http://localhost:8080/getActiveDetails/${processId}`
      );
      const details = await response.json(); // Parse JSON data here

      setDetails(details); // Set details to the parsed JSON data
      console.log("Additional Details:", details);
      console.log("Variable details:", details[0].Variables);

      setAdditionalDetails(details);
      setSelectedValue(value);
      setSearchParams({ processId, filter: value });

      return { item: details[0], details };
    } catch (error) {
      console.error("Error fetching additional details:", error);
    }
  };

  // const fetchDetailsFromComplete = async (processId, value) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/GetCompleteFilter/${processId}`
  //     );
  //     const formDetails = await response.json();

  //     setDetails(response);
  //     console.log("Additional Details:------------------", formDetails);
  //     ;
  //     console.log("Variable details-------------,", formDetails.Forms);

  //     // setAreButtonsEnabled(!shouldDisableButtons);
  //     setAdditionalDetails1(formDetails);
  //     setSelectedValue(value);

  //     setSearchParams({ processId, filter: value });
  //     return { item: formDetails, formDetails };
  //   } catch (error) {
  //     console.error("Error fetching additional details:", error);
  //   }
  // };
  const renderInputs = () => {
    if (!selectedItem || !selectedItem.Variables) {
      return null;
    }

    const inputs = [];

    for (const key in selectedItem.Variables) {
      const variables = selectedItem.Variables[key];
      variables.forEach((variable) => {
        inputs.push(
          <div key={variable.id}>
            <label htmlFor={variable.id}>{variable.label}</label>
            <input
              type={variable.type}
              id={variable.id}
              value={variable.text || ""}
              readOnly
            />
          </div>
        );
      });
    }
  };
let allFetchedData=[];
  const handleOptionChange = (value, processId) => {
    setSelectedValue(value);

    if (processId) {
      setSearchParams({ processId, filter: value });
      fetchAdditionalDetails(processId, value);
    } else {
      setSearchParams({ filter: value });
      //  fetchDataForDropdown(value);

       setSelectedItem(null);
    }
// let url;
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
    // fetchData(url)
    // .then(newData => {
    //     // Sort newData based on CreationTime, newest first
    //     newData.sort((a, b) => new Date(b.CreationTime) - new Date(a.CreationTime));
    //     console.log("***********************Data fetched and sorted for dropdown:***********************", newData);
        
    //     // Prepend newData to existing data
    //     allFetchedData = [...newData, ...allFetchedData];
    //     console.log("***********************All data (existing and newly fetched):***********************", allFetchedData);
    // })
    // .catch(error => console.error("Error fetching data for dropdown:", error));

    setIsCompleting(value === "complete");

    if (processId) {
      fetchAdditionalDetails(processId, value);
    }
    console.log("*************** Above Value from dropdown: *********", value);
  };

  const [inputValues, setInputValues] = useState({});


  
  const handleInputChange2 = (value, label) => {
    setInputValues({
      ...inputValues,
      [label]: value,
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues(prevState => ({
        ...prevState,
        [name]: value
    }));
    
};
const handleSelectionChange = (SelectedItem) => {
  setSelectedItem(selectedItem);
  setInputValues({});

console.log("newSelectedItemKey",SelectedItem);
}
  console.log("handleInputChange",inputValues);

  const fetchDataForDropdown = async (selectedValue) => {
    try {
      let url;
      switch (selectedValue) {
        case "allOpen":
          url =
            "http://localhost:8080/surge/camunda/tasklist/newIndex-all-active";
          break;
        // case "claim":
        //   url = `http://localhost:8080/claimedByMeNewIndex/${username}`;
        //   break;
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


      console.log("***********************Data fetched for dropdown:***********************", data);
    } catch (error) {
      console.error("Error fetching data for dropdown:", error);
    }
  };
  const handleCompleteButtonClick = () => {
    const isAnyEmpty = variableRows.some(
      (variable) => variable.name.trim() === "" || variable.value.trim() === ""
    );

    if (isAnyEmpty) {
      alert("Please fill values.");
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

  const [selectedItemKey, setSelectedItemKey] = useState(null);
  const [formDetails, setFormDetails] = useState();
  const handleDivClick = async (item, Key, selectedValue) => {
    console.log(
      "Clicked Item:",
      item,
      "processId:",
      Key,
      "value",
      selectedValue
    );
    setSelectedItemKey(Key);
    setSearchParams({ processId: Key, filter: selectedValue });

    try {
      if (selectedValue === "complete") {
        const completeApiUrl = `http://localhost:8080/getCompleteFilternew/${Key}`;
        const response = await fetch(completeApiUrl);
        const formDetails1 = await response.json();
        console.log("formDetails++++++++++++", formDetails1);

        console.log("formDetails from complete----------", formDetails1.Forms);
        // Update state variables with the fetched data
        setFormDetails(formDetails1);
        setAreButtonsEnabled(true);
      } else {
        const { item: newItem, details } = await fetchAdditionalDetails(
          Key,
          selectedValue
        );

        setSelectedItem(newItem);
        setVariableRows(newItem.Variable ? [...newItem.Variable] : []);
      }
    } catch (error) {
      console.error("Error handling click:", error);
    }
    // setSelectedItem(null)
  };

  const handleDateChange = (date, name) => {
    setInputValues((prevState) => ({
      ...prevState,
      [name]: date, // Assuming the date is directly stored in the inputValues state
    }));
  };

  const renderInput = (variable,valueToShow) => {
    const isAssigneePresent = selectedItem && selectedItem.assignee !== null;
    const name = variable.label.replace(/\s+/g, "-").toLowerCase();
    let inputValue = "";

    // Check if the value exists
    if (variable.hasOwnProperty("value")) {
      inputValue = variable.text; // If value exists, set it
    }
    const inputs = variable.text;
    console.log("input value--------------", inputs);
    switch (variable.type) {
      case "text":
      case "number":
      case "textfield":
        // case "button":
        return (
          <div key={variable.id}>
            <label id="form-label" htmlFor={variable.id}>
              {variable.label}
            </label>
            <input
              type={variable.type}
              name={name} 
              // value={inputValues[name] || ""}
              className="form-control"
              id={variable.id}
              onChange={handleInputChange}
              defaultValue={variable.defaultValue}
               disabled={!isAssigneePresent || variable.disabled}
              readOnly={variable.readonly} 
              required={variable.Required}
            />
            <p className="description" >
            {variable.description}
        </p>
          </div>
        );
      // case "text":
      //   return (
      //     <div key={variable.id}>
      //       <label id="form-label" htmlFor={variable.id}>
      //         {variable.label}
      //       </label>
      //       <p style={{ textAlign: "left", marginTop: "10px" }}>{inputs}</p>
      //     </div>
      //   );
      case "textarea":
        return (
          <div key={variable.id}>
            <label id="form-label" htmlFor={variable.id}>
              {variable.label}
            </label>
            <textarea
              name={name} // Use unique name attribute
              // value={inputValues[name] || ""}
              defaultValue={variable.defaultValue}
              className="form-control"
              id={variable.id}
              onChange={handleInputChange}
              required={variable.Required}
              // disabled={!isAssigneePresent}
              rows="4"
              disabled={!isAssigneePresent || variable.disabled} // Disable based on "disabled" property
              readOnly={variable.readonly} 
            />
            <p className="description" >
            {variable.description}
        </p>
          </div>
        );

      case "datetime":
        return (
          <div key={variable.id}>
            <label id="form-label" htmlFor={variable.id}>
              {variable.label}
            </label>
            <DatePicker
              selected={inputValues[name] ? new Date(inputValues[name]) : null}
              onChange={(date) => handleDateChange(date, name)} // Implement handleDateChange function
              className="form-control"
              id={variable.id}
              required={variable.Required}
              disabled={!isAssigneePresent}
              showTimeSelect
              timeFormat="HH:mm"
              // timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
        );

    
      //   return (
      //     <div key={variable.id}>
      //       <input
      //         type={variable.type}
      //         id={variable.id}
      //         value={inputValues[name]}
      //         required={variable.Required}
      //         onChange={handleInputChange}
      //         disabled={!isAssigneePresent}
      //       />
      //       <CFormLabel htmlFor={variable.ID}>{variable.label}</CFormLabel>
      //       <div><p className="description" >
      //       {variable.description}
      //   </p>
      //       </div>
      //     </div>
      //   );
      case "checkbox":
        return (
          <div key={variable.id}>
          <label id="form-label-select" htmlFor={variable.id}>

            <input
            className="checkBox"
              type={variable.type}
              id={variable.id}
              name={variable.label}
              required={variable.Required}
              onChange={(e) => {
                const newValue = e.target.checked; 
                handleInputChange({
                  target: {
                    name: variable.label,
                    value: newValue,
                  },
                });
              }}
              disabled={!isAssigneePresent}
              checked={inputValues[variable.label] !== undefined ? inputValues[variable.label] : variable.defaultValue === true}

            />
              {variable.label}
            </label>
          </div>
        );
 
      case "radio":
        return (
          <div key={variable.id}>
          <div className="var-label">{variable.label}</div>
            {variable.values.map((option) => (
              <div key={option.value}>
              <label id="form-label-select" htmlFor={variable.id}>

                <input
                className="radioBox"
                  type={variable.type}
                  id={variable.id}
                  value={option.value} // Use the option value as the input value
                  name={variable.label}
                  required={variable.Required}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInputChange({
                        target: {
                          name: variable.label,
                          value: option.value, 
                        },
                      });
                    }
                  }}
                  disabled={!isAssigneePresent}
                  // checked={variable.defaultValue === option.value} 
                  checked={inputValues[variable.label] ? inputValues[variable.label] === option.value : variable.defaultValue === option.value}
                  />
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
     
        case "select":
        return (
          <div key={variable.id}>
            <label id="form-label" htmlFor={variable.id}>
              {variable.label}
            </label>
            <select
              className="form-control"
              style={{"marginTop":'   3px'}}
              id={variable.id}
              defaultValue={variable.defaultValue}
              onChange={(e) =>
                handleInputChange2(e.target.value, variable.label)
              } 
              // disabled={!isAssigneePresent}
              disabled={!isAssigneePresent || variable.disabled} // Disable based on "disabled" property
              readOnly={variable.readonly} 
            >
              <option value="">Select an option</option>
              {variable.values.map((option, index) => (
                <option
                  key={index}
                  // value={option.value}

                  defaultValue={variable.defaultValue}
                  selected={option.value === inputValues[variable.label]}
                >
                  {option.label}
                </option>
              ))}
              <p className="description" >
                  {variable.description}
              </p>
          
            </select>
            {/* Include the selected option in the request body with the name as the label */}
            <input
              type="hidden"
              name={variable.label}
              value={inputValues[variable.label] || ""}
            />
          </div>
        );

      case "checklist":
        return (
          <div key={variable.id}>
            <CFormLabel>{variable.label}</CFormLabel>
            {variable.Options.map((option, index) => (
              <div key={index} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.Value}
                  id={`${variable.id}_${index}`}
                  required={variable.Required}
                  onChange={handleInputChange}
                  disabled={!isAssigneePresent}
                />
                <label
                  className="form-check-label"
                  htmlFor={`${variable.id}_${index}`}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };
  const renderInputforcomplete = (variable, valueToShow) => {
    console.log("valueToShow:", valueToShow);

    const isAssigneePresent = selectedItem && selectedItem.assignee !== null;
    const name = variable.label.replace(/\s+/g, "-").toLowerCase();

    let inputValue = "";

    if (variable.hasOwnProperty("value")) {
      inputValue = variable.value;
    }
    switch (variable.type) {
      case "text":
      case "number":
      case "textfield":
        // case "button":
        return (
          <div key={variable.id}>
            <label id="form-label" htmlFor={variable.id}>
              {variable.label}
            </label>
            <input
              type={variable.type}
              name={name}
              value={valueToShow}
              className="form-control"
              id={variable.id}
              onChange={handleInputChange}
              required={variable.Required}
              disabled={!isAssigneePresent}
            />
            <p className="description">
            {variable.description}
        </p>
          </div>
        );
      case "textarea":
        return (
          <div key={variable.id}>
            <label id="form-label" htmlFor={variable.id}>
              {variable.label}
            </label>
            <textarea
            type={variable.type}
              name={name} // Use unique name attribute
              value={valueToShow}
              className="form-control"
              id={variable.id}
              onChange={handleInputChange}
              required={variable.Required}
              disabled={!isAssigneePresent}
              rows="4"
            />
            <p className="description" >
            {variable.description}
        </p>
          </div>
        );

      // case "datetime":
      //   return (
      //     <div key={variable.id}>
      //       <label id="form-label" htmlFor={variable.id}>
      //         {variable.label}
      //       </label>
      //       <DatePicker
      //         selected={inputValues[name] ? new Date(inputValues[name]) : null}
      //         onChange={(date) => handleDateChange(date, name)} // Implement handleDateChange function
      //         className="form-control"
      //         id={variable.id}
      //         required={variable.Required}
      //         disabled={!isAssigneePresent}
      //         showTimeSelect
      //         timeFormat="HH:mm"
      //         // timeIntervals={15}
      //         timeCaption="Time"
      //         dateFormat="MMMM d, yyyy h:mm aa"
      //       />
      //     </div>
      //   );

   
        case "radio":
          
          return (
            
            <div key={variable.id}>
            
            <div className="var-label">{variable.label}</div>

                <div key={variable.value}>
                <label id="form-label-select" htmlFor={variable.id}>

                  <input
                    className="radioBox"

                    type={variable.type}
                    id={`${variable.id}_${variable.value}`}
                    value={variable.value}
                    name={variable.label}
                    required={variable.Required}
                   
                     disabled={!isAssigneePresent}
                    checked={valueToShow }
                  />
                  {variable.label}
                  </label>

                </div>
             
            </div>
          );
         
          
            case "checkbox":
            return (
              
              <div key={variable.id}>
              
  
                  <label id="form-label-select" htmlFor={variable.id}>
  
                    <input
                      className="checkBox"
  
                      type={variable.type}
                      id={`${variable.id}_${variable.value}`}
                      value={variable.value}
                      name={variable.label}
                      required={variable.Required}
                     
                       disabled={!isAssigneePresent}
                      checked={valueToShow }
                    />
                    {variable.label}
                    </label>
  
               
              </div>
            );
           
      case "select":
        return (
          <div key={variable.id}>
            <label id="form-label" htmlFor={variable.id}               style={{"marginTop":'13px'}}
            >
              {variable.label}
            </label>

            <select
            type={variable.type}
            name={name}
            value={valueToShow}
            className="form-control"
            style={{"marginTop":'   3px'}}

            id={variable.id}
            disabled={!isAssigneePresent}
          >
            <option value={valueToShow}>{valueToShow}</option>
            </select>
            <p className="description" >
            {variable.description}
        </p>
          </div>
        );

      case "checklist":
        return (
          <div key={variable.id}>
            <CFormLabel>{variable.label}</CFormLabel>
            {variable.Options.map((option, index) => (
              <div key={index} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option.Value}
                  id={`${variable.id}_${index}`}
                  required={variable.Required}
                  onChange={handleInputChange}
                  disabled={!isAssigneePresent}
                />
                <label
                  className="form-check-label"
                  htmlFor={`${variable.id}_${index}`}
                >
                  {option.label}
                </label>
              </div>
            ))}
            <p className="description" >
            {variable.description}
        </p>
          </div>
        );
      default:
        return null;
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const onComplete = (task) => {
    setIsLoading(true);

    const requestBody = {
      ...inputValues,
    };

    console.log("Request data:", requestBody);

    console.log("variable", selectedItem?.Variable);
    const apiUrl = `http://localhost:8080/completeTask1/${selectedItem.Key}/${username}`;
    console.log("enter selectedItem variable", selectedItem.Key);
    console.log("enter selectedItem variable", selectedItem.username);

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
        // <toast position="bottom-left" reverseOrder={true} />;

        alert("completed");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  };

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
                            selectedItemKey === item.Key ? "selected" : ""
                          }
                          style={{
                            backgroundColor:
                              selectedItemKey === item.Key
                                ? "rgb(234, 243, 255)"
                                : "transparent",
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
                    <Toaster position="bottom-left" />
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
                          style={{
                            color: "rgba(69, 70, 78, 0.9)",
                            padding: "10px",
                          }}
                        >
                          Task Name
                        </th>
                        <td>{selectedItem.Process}</td>
                      </tr>
                      <tr>
                        <th
                          className="t-head"
                          style={{ color: "rgba(69, 70, 78, 0.9)" }}
                        >
                          Process Name
                        </th>
                        <td>{selectedItem.Name}</td>
                      </tr>
                      <tr>
                        <th
                          className="t-head"
                          style={{ color: "rgba(69, 70, 78, 0.9)" }}
                        >
                          Creation Date
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

                  <form className="row needs-validation">
                    <div className="form-layout">
                      <div id="task-form">
                        <h2>Task Form</h2>
                      </div>

                      <div
                        className="sc-Con"
                        style={{
                          overflowY: "auto",
                          maxHeight: "300px",
                          marginLeft: "20px",
                          marginRight: "30px",
                          overflowX: "hidden",
                        }}
                      >
                        <div>
                        <selectedItem onChange={handleSelectionChange} />

                          <CForm>
                            {Object.keys(selectedItem.Variables).map(
                              (formId) => (
                                <div key={formId}>
                                  {selectedItem.Variables[formId].map(
                                    (variable) => (
                                      <div key={variable.Key}>
                                        {renderInput(variable)}
                                      </div>
                                    )
                                  )}
                                </div>
                              )
                            )}
                            {renderInputs()}
                          </CForm>
                          <div>
                            {selectedItem.assignee === username &&
                              !isCompleting &&
                              areButtonsEnabled && (
                                <p>
                                  {!isCompleting && (
                                    <div
                                      style={{
                                        position: "fixed",
                                        bottom: "20px",
                                        right: "20px",
                                      }}
                                    >
                                      <div className="completeButton">
                                        <button
                                          type="submit"
                                          className="sc-lbxAil gRAREz"
                                          style={{
                                            backgroundColor: "#ff4000",
                                            color: "white",
                                            padding: "5px 10px",
                                            fontSize: "12px",
                                            border: "none",
                                            borderRadius: "3px",
                                            cursor: "pointer",
                                          }}
                                          onClick={handleCompleteButtonClick}
                                        >
                                          Complete Task
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </p>
                              )}
                          </div>
                        </div>
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
        ) : selectedValue === "complete" ? (
          formDetails ? (
            <div className="process">
              <div
                className={`right-side ${
                  isExpanded ? "expanded" : "minimized"
                }`}
              >
                <h2 className="text-1">Details</h2>
                {console.log("1Selected Item.......:", formDetails)}

                {console.log("1Selected Value........:", selectedValue)}
                <div>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th
                          className="t-head"
                          style={{
                            color: "rgba(69, 70, 78, 0.9)",
                            padding: "10px",
                          }}
                        >
                          Task Name
                        </th>
                        <td>{formDetails.Process}</td>
                      </tr>
                      <tr>
                        <th
                          className="t-head"
                          style={{ color: "rgba(69, 70, 78, 0.9)" }}
                        >
                          Process Name
                        </th>
                        <td>{formDetails.Name}</td>
                      </tr>{" "}
                      <tr>
                        <th
                          className="t-head"
                          style={{ color: "rgba(69, 70, 78, 0.9)" }}
                        >
                          Completion Time
                        </th>
                        <td>{formDetails.CompletionTime}</td>
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
                              {formDetails.Assignee !== null
                                ? formDetails.Assignee
                                : "--"}{" "}
                            </div>
                          </td>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <form className="row needs-validation">
                    <div className="form-layout">
                      <div id="task-form">
                        <h2>Task Form</h2>
                      </div>

                      <div
                        className="sc-Con"
                        style={{
                          overflowY: "auto",
                          maxHeight: "300px",
                          marginLeft: "20px",
                          marginRight: "30px",
                          overflowX: "hidden",
                        }}
                      >
                      <CForm>
                      {formDetails &&
                        formDetails.Forms &&
                        formDetails.Forms.map((variable, index) => (
                          <div key={index}>
                          {renderInputforcomplete(
                            variable,
            variable[variable.label] !== null && variable[variable.label] !== undefined
              ? variable[variable.label]
              : variable.defaultValue    )}
                          </div>
                        ))}
                    </CForm>
                    
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
      <Toaster position="bottom-left" />
    </div>
  );
};

export default Sidebar;
