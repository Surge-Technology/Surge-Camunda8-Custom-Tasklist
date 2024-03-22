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
// import { Toast } from "@coreui/coreui";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = () => {
  const [data, setData] = useState(null);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [searchParams, setSearchParams] = useSearchParams();
  // const [selectedValue, setSelectedValue] = useState("allOpen");
  const [isExpanded, setExpanded] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [claimedData, setClaimedData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState(null);
  // const [additionalDetails1, setAdditionalDetails1] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  const [isClaimed, setIsClaimed] = useState(false);
  const [rows, setRows] = useState([{ Name: "", Value: "" }]);
  const [areButtonsEnabled, setAreButtonsEnabled] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [variableRows, setVariableRows] = useState([{ name: "", value: "" }]);
  // const [selectedItem1, setSelectedItem1] = useState(
  //   JSON.parse(localStorage.getItem("selectedItem")) || null
  // );
  const [formDetails, setFormDetails] = useState(
    JSON.parse(localStorage.getItem("formDetails")) || null
  );

  const toggleSidebar = () => {
    setExpanded(!isExpanded);
    setShowDropdown(false);
  };
  useEffect(() => {
    localStorage.setItem("formDetails", JSON.stringify(formDetails));
  }, [formDetails]);

  //   const firstKey = Object.keys(selectedItem)[0]; // Get the first key from the selectedItem object
  // const nestedObject = selectedItem[firstKey]; // Access the nested object using the first key
  // const processId = Object.keys(nestedObject)[0]; // Get the process ID from the nested object
  // const process = nestedObject[processId].Process; // Access the Process property using the process ID

  // console.log(process); // Output the Process value
  const [selectedValue, setSelectedValue] = useState(
    localStorage.getItem("selectedValue") || "allOpen"
  );
  useEffect(() => {
    localStorage.setItem("selectedItem", JSON.stringify(selectedItem));
  }, [selectedItem]);
  // Update localStorage when the filter value changes
  useEffect(() => {
    localStorage.setItem("selectedValue", selectedValue);
  }, [selectedValue]);
  useEffect(() => {
    // Fetch data based on the selected filter value
    if (selectedValue === "allOpen") {
      fetchData(
        "http://localhost:8080/surge/camunda/tasklist/newIndex-all-active"
      );
    } else if (selectedValue === "claim") {
      fetchData(`http://localhost:8080/claimedByMeNewIndex/${username}`);
    } else if (selectedValue === "unClaim") {
      fetchData("http://localhost:8080/unclaimedByMeNewIndex");
    } else if (selectedValue === "complete") {
      fetchData("http://localhost:8080/completedField");
    }
    const urlParams = new URLSearchParams(window.location.search);
    const filterValue = urlParams.get("filter");
    const processIdValue = urlParams.get("processId");
    if (filterValue && processIdValue) {
      setSelectedValue(filterValue);
      setSearchParams({ processId: processIdValue, filter: filterValue });
    } else if (filterValue) {
      setSelectedValue(filterValue);
      setSearchParams({ filter: filterValue });
    }
  }, [selectedValue]);
  const fetchData = async (url, processId, value) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("API Response:", data[0]);
      if (data.length === 0) {
        <div className="no-item-selected"></div>;
        setClaimedData(null);
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
  // useEffect(() => {
  //   fetchData(
  //     "http://localhost:8080/surge/camunda/tasklist/newIndex-all-active"
  //   );
  // }, []);
    const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    setInputValues((prevInputValues) => ({}));
    console.log("_______________________",inputValues);
  }, [selectedItem]);

  const [details, setDetails] = useState();
  const fetchAdditionalDetails = async (processId, value) => {
    try {
      // const response = await fetch(
      //   `http://localhost:8080/getActiveDetails/${processId}`
      // );
      const response = await fetch(
        `http://localhost:8080/activeTaskDetailbyId/${processId}`
      );
      const details = await response.json();

      setDetails(details); // Set details to the parsed JSON data
      console.log("Additional Details:", details);
      console.log("Variable details:", details[0].Variables);

      setAdditionalDetails(details);
      console.log("fetchAdditionalDetails", additionalDetails);
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
  let allFetchedData = [];
  const handleOptionChange = (value, processId) => {
    setSelectedValue(value);
    localStorage.setItem("selectedValue", value);

    if (processId) {
      setSearchParams({ processId, filter: value });
      fetchAdditionalDetails(processId, value);
    } else {
      setSearchParams({ filter: value });
      //  fetchDataForDropdown(value);

      setSelectedItem(null);
    }
    const searchParams = new URLSearchParams();
    searchParams.append("filter", value);
    // if (processId) {
    //   searchParams.append("processId", processId);
    // }
    // const queryString = searchParams.toString();
    // window.history.pushState({}, "", `?${queryString}`);
    // let url;
    // if (value === "allOpen") {
    //   fetchData(
    //     "http://localhost:8080/surge/camunda/tasklist/newIndex-all-active"
    //   );
    // } else if (value === "claim") {
    //   fetchData(`http://localhost:8080/claimedByMeNewIndex/${username}`);
    // } else if (value === "unClaim") {
    //   fetchData("http://localhost:8080/unclaimedByMeNewIndex");
    // } else if (value === "complete") {
    //   fetchData("http://localhost:8080/completedField");
    // }
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


  const handleInputChange2 = (value, label) => {
    setInputValues({
      ...inputValues,
      [label]: value,
    });
  };

  const handleSelectionChange = (SelectedItem) => {
    setSelectedItem(selectedItem);
    setInputValues({});

    console.log("newSelectedItemKey", SelectedItem);
  };
  console.log("handleInputChange", inputValues);

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

      console.log(
        "***********************Data fetched for dropdown:***********************",
        data
      );
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
  // const datas = {
  //   "2251799813685387": {
  //     "2251799813685395": {
  //       "processInstanceKey": 2251799813685387,
  //       "zeebeFormKey": "UserTaskForm_0ou0q54",
  //       "CreationTime": "2024-03-05 11:36:24",
  //       "Process": "A",
  //       "_id": "1-395",
  //       "assignee": null,
  //       "Key": 2251799813685395,
  //       "Name": "p123"
  //     },
  //     "componentsNode": [
  //       {
  //         "layout": "",
  //         "number": "123",
  //         "label": "number",
  //         "id": "Field_1h8yled",
  //         "type": "number",
  //         "key": "number"
  //       },
  //       {
  //         "layout": "",
  //         "phonenumber": "8976543423",
  //         "label": "Phone Number",
  //         "id": "Field_1rw30ts",
  //         "type": "number",
  //         "key": "phonenumber",
  //         "validate": ""
  //       },
  //       {
  //         "layout": "",
  //         "firstname": "madhu",
  //         "label": "First Name",
  //         "id": "Field_137733g",
  //         "type": "textfield",
  //         "key": "firstname"
  //       }
  //     ]
  //   }
  // };

  // // Accessing Process property
  // console.log("Process:", datas["2251799813685387"]["2251799813685395"]["Process"]);

  // // Accessing CreationTime property
  // console.log("CreationTime:", datas["2251799813685387"]["2251799813685395"]["CreationTime"]);

  // // Accessing componentsNode array
  // console.log("Components:", datas["2251799813685387"]["componentsNode"]);

  // const handleClaimClick = async () => {
  //   try {
  //     const requestData = {
  //       _id: selectedItem.taskDetails._id,
  //       assignee: username,
  //     };

  //     const apiUrl = "http://localhost:8080/surge/camunda/tasklist/update-assignee";
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(requestData),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to update assignee');
  //     }

  //     const responseData = await response.json();
  // console.log("check item",requestData.assignee);
  // //     const updatedClaimedData = claimedData.map(item => {
  // //       console.log("check item.........",item);
  // //       if (item._id === selectedItem.taskDetails._id) {
  // //         return {
  // //           ...item,
  // //           taskDetails: {
  // //             ...item.taskDetails,
  // //             assignee: responseData.assignee,
  // //           }
  // //         };
  // //       }
  // //       return item;
  // //     });
  // // console.log("check item2",selectedItem.taskDetails.assignee);
  // //     setClaimedData(updatedClaimedData);

  //     setSelectedItem(prevSelectedItem => ({
  //       ...prevSelectedItem,
  //       taskDetails: {
  //         ...prevSelectedItem.taskDetails,
  //         assignee: responseData.assignee,
  //       },
  //     }));

  //     setIsClaimed(true);

  //     console.log("@Updated selectedItem:", selectedItem);
  //     // console.log("@@@@@Updated claimedData:", updatedClaimedData);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const handleClaimClick = async () => {
    try {
      const requestData = {
        _id: selectedItem.taskDetails._id,
        assignee: username,
      };

      const apiUrl =
        "http://localhost:8080/surge/camunda/tasklist/update-assignee";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to update assignee");
      }
      const responseData = await response.json();
console.log("222222222227",responseData);
      // Update the selected item's assignee
      setSelectedItem((prevSelectedItem) => ({
        ...prevSelectedItem,
        taskDetails: {
          ...prevSelectedItem.taskDetails,
          assignee: responseData.assignee,
        },
      }));

      setIsClaimed(true);
      console.log("222222222227",selectedItem);

// window.location.reload();
      // Fetch data based on the selected filter
      if (selectedValue !== "allOpen") {
        const apiUrl3 = "http://localhost:8080/unclaimedByMeNewIndex";

        //  window.location.reload();
        const unclaimedResponse = await fetch(apiUrl3);
        const unclaimedData = await unclaimedResponse.json();
        console.log("Unclaimed data:", unclaimedData);

        // Remove the claimed item from the list
        const updatedClaimedData = claimedData.filter(
          (item) => item._id !== selectedItem.taskDetails._id

          
        );
        console.log("Filtered claimed data:", updatedClaimedData);

        setClaimedData(updatedClaimedData);
      } else {
        const apiUrl2 =
          "http://localhost:8080/surge/camunda/tasklist/newIndex-all-active";
        await fetchData(apiUrl2);
      }

      console.log("@Updated selectedItem:", selectedItem);
    } catch (error) {
      console.error("Error:", error);
    }

    //  window.location.reload();
  };

  const handleUnclaimClick = () => {
    const apiUrl =
      "http://localhost:8080/surge/camunda/tasklist/remove-assignee-customeHeader";
    const requestData = {
      _id: selectedItem.taskDetails._id,
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
        const i = tbdcheck.findIndex(
          (item) => item._id == selectedItem.taskDetails._id
        );
        console.log(i);
        tbdcheck[i].assignee = null;
        setData(tbdcheck);
      })
      .then((response) => response.json())
      .then((responseData) => {
        const updatedClaimedData = claimedData.map((item) => {
          if (item._id === selectedItem.taskDetails._id) {
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
  // const [formDetails, setFormDetails] = useState();
  const handleDivClick = async (item, Key, selectedValue) => {
    console.log(
      "11111111111111111111111111111111111111111Clicked Item:",
      item,
      "processId:",
      Key,
      "value",
      selectedValue
    );
    //   console.log("checking with @@@@@@@@",         selectedItem.map(item => ({
    //     [item.componentsNode[0].key]: item.componentsNode
    // }))   );
    setSelectedItemKey(Key);
    console.log("fresh", Key);
    setSearchParams({ processId: Key, filter: selectedValue });

    try {
      if (selectedValue === "complete") {
        const completeApiUrl = `http://localhost:8080/getCompleteFilterlatest/${Key}`;
        const response = await fetch(completeApiUrl);
        const formDetails1 = await response.json();
        console.log("formDetails++++++++++++", formDetails1);

        console.log(
          "formDetails from complete----------",
          formDetails1[0].componentsNode
        );
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
//   const handleInputChange = (name, value, isChecked) => {
//     // Check if the value is empty and handle accordingly
//     if (value === "") {
//         // Clear the inputValues state for the specified name
//         setInputValues((prevInputValues) => {
//             const { [name]: _, [`${name}_isChecked`]: __, ...rest } = prevInputValues;
//             return rest;
//         });

//         // Clear the selectedItem state for the specified name
//         setSelectedItem((prevSelectedItem) => ({
//             ...prevSelectedItem,
//             componentsNode: prevSelectedItem.componentsNode.map((component) => {
//                 if (component.id === name || component.key === name) {
//                     console.log(`Clearing value for ${name} in componentsNode`);
//                     return { ...component, [name]: "" };
//                 }
//                 return component;
//             }),
//         }));
//     } else {
//         // Update the inputValues state with the new value
//         setInputValues((prevInputValues) => ({
//             ...prevInputValues,
//             [name]: value,
//             [`${name}_isChecked`]: isChecked,
//         }));

//         // Update the selectedItem state with the new value
//         setSelectedItem((prevSelectedItem) => ({
//             ...prevSelectedItem,
//             componentsNode: prevSelectedItem.componentsNode.map((component) => {
//                 if (component.id === name || component.key === name) {
//                     console.log(`Replacing value for ${name} in componentsNode`);
//                     return { ...component, [name]: value };
//                 }
//                 return component;
//             }),
//         }));
//     }
// };

 
  const handleInputChange = (name, value, isChecked,updatedChecklistString) => {
    // Update the inputValues state
    
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
      [`${name}_isChecked`]: isChecked,
    }));
  
    setSelectedItem((prevSelectedItem) => ({
      ...prevSelectedItem,
      componentsNode: prevSelectedItem.componentsNode.map((component) => {
        if (component.id === name || component.key === name) {
          console.log(`Replacing value for ${name} in componentsNode`);
          return { ...component, [name]: value };
        }
        return component;
      }),
    }));
  };

  // const handleInputChange = (name, value, isChecked, label) => {
  //   // Update the inputValues state
  //   setInputValues((prevInputValues) => ({
  //     ...prevInputValues,
  //     [name]: value ,
  //     [`${name}_isChecked`]: isChecked ? true : false,
  //   }));
  
  //   // Update the selectedItem state with the new value
  //   setSelectedItem((prevSelectedItem) => ({
  //     ...prevSelectedItem,
  //     componentsNode: prevSelectedItem.componentsNode.map((component) => {
  //       if (component.id === name || component.key === name) {
  //         console.log(`Replacing value for ${name} in componentsNode`);
  //         switch (component.type) {
  //           case "select":
  //             return { ...component, [name]: value };
  //           case "checkbox":
  //             return { ...component, [name]: isChecked};
  //           case "number":
  //             return { ...component, [name]: parseInt(value) || 0 };
  //           // Add more cases as needed for other input types
  //           default:
  //             return { ...component, [name]: value  };
  //         }
  //       }
  //       return component;
  //     }),
  //   }));
  // };
  
  const handleDateChange = (date, name) => {
    setInputValues((prevState) => ({
      ...prevState,
      [name]: date, // Assuming the date is directly stored in the inputValues state
    }));
  };
    const renderInput = (variable, valueToShow, component) => {
      const isAssigneePresent =
        selectedItem && selectedItem.taskDetails.assignee !== null;
      const name = variable.key.replace(/\s+/g, "-").toLowerCase();
      let inputValue = "";

      // Check if the value exists
      if (variable.hasOwnProperty("value")) {
        inputValue = variable.text; // If value exists, set it
      }
      // Initialize object to store key-value pairs`
      const keyValuePair = {};
      // Log key-value pair
      keyValuePair[variable.key] = variable[variable.key];

      // Log the object
      console.log("Key-value pair:", keyValuePair);
      const storeItem = localStorage.setItem(
        "keyValuePair",
        JSON.stringify(keyValuePair)
      );
      const isFormDisabled =
        selectedItem && selectedItem.taskDetails.assignee !== username;

        let marginBottomStyle = {}; 
        if (variable.type !== "checklist") {
          marginBottomStyle = { marginBottom: "16px" }; 
        }
        const defaultValue = variable[variable.key] || variable.defaultValue;
        const checkedValue =
          inputValues[variable.key] !== undefined
            ? inputValues[variable.key]
            : defaultValue;
      switch (variable.type) {
        case "text":
        case "number":
        case "textfield":
          // case "button":
          return (
            <div className="field-spac" style={{gap:"20px"}}>
            <div key={variable.id} style={marginBottomStyle}>
              <label id="form-label" htmlFor={variable.id}>
                {variable.label}
              </label>
              <input
                type={variable.type}
                name={name}
                //  value={inputValues[name] || ""}
                className="form-control"
                id={variable.id}
                // onChange={handleInputChange}
                onChange={(e) => handleInputChange(name, e.target.value)}
                // value={
                //   inputValues[name] ||
                //   variable[variable.key] ||
                //   variable.defaultValue
                // }
                              value={inputValues[name] !== undefined ? inputValues[name] : (variable[variable.key] || variable.defaultValue)}

                disabled={
                  !isAssigneePresent || variable.disabled || isFormDisabled
                }
                readOnly={variable.readonly === "true" || !isAssigneePresent}
                required={variable.Required}
                // defaultValue={variable[variable.key]}
                // readOnly={variable.readonly}
                // value={variable.value}
              />
              {console.log("Readonly property:", variable.readonly)}

              <p className="description">{variable.description}</p>
            </div>
            </div>
          );
          case "textarea":
            return (
              <div key={variable.id} className="textarea-wrapper" style={marginBottomStyle}>
                <label id="form-label" htmlFor={variable.id}>
                  {variable.label}
                </label>
                <div className="textarea-container">
                  <textarea
                    name={name}
                    value={
                      inputValues[name] ||
                      variable[variable.key] ||
                      variable.defaultValue
                    }
                    className="form-control"
                    id={variable.id}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                    required={variable.Required}
                    rows="4"
                    disabled={
                      !isAssigneePresent || variable.disabled || isFormDisabled
                    }
                    readOnly={variable.readonly}
                  />
                </div>
                <p className="description">{variable.description}</p>
              </div>
            );
        case "datetime":
          return (
            <div key={variable.id} style={marginBottomStyle}>
              <label id="form-label" htmlFor={variable.id}>
                {variable.dateLabel||variable.timeLabel}
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
                dateFormat="MMMM d, yyyy"
              />
            </div>
          );

          
        case "checkbox":
          return (
            <div key={variable.id}>
              <label id="form-label-select" htmlFor={variable.id}>
                <input
                  className="checkBox"
                  type={variable.type}
                  id={variable.id}
                  name={name} 
                  // checked={
                  //   variable[variable.key] === "true" || variable.defaultValue === "true"||inputValue[name]
                  // }
                  checked={checkedValue === "true"}

                  required={variable.Required}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    handleInputChange(variable.key, isChecked ? "true" : "false");
                  }}
                  disabled={!isAssigneePresent || isFormDisabled}
                    /> 

                   
                {console.log("default value property:",  variable[variable.key] )}

                {variable.label}
              </label>
              <p className="description">{variable.description}</p>

            </div>
          );

          // case "radio":
          //   return (
          //     <div key={variable.id}>
          //       <div className="var-label">{variable.label}</div>
          //       <div key={variable.value}>
          //         {variable.values.map((value, index) => (
          //           <label
          //             key={index}
          //             id="form-label-select"
          //             htmlFor={`${variable.id}_${index}`}
          //             className={
          //               valueToShow === value.value ? "selected-radio" : ""
          //             }
          //           >
          //             <input
          //               className="radioBox"
          //               type={variable.type}
          //               id={`${variable.id}_${index}`}
          //               value={value.value}
          //               name={variable.id}
          //               required={variable.Required}
          //               disabled={!isAssigneePresent || isFormDisabled}
          //               checked={
          //                 value.value === variable.defaultValue || // Check if the value matches the default value
          //                 !!inputValues[value.value] || // Check if the value exists in the inputValues object (assuming inputValues is an object with keys corresponding to checked values)
          //                 variable[variable.key] === value.value // Check if the value matches the value of variable[variable.key]
          //               }
          //               onChange={(e) => {
          //                 if (e.target.checked) {
          //                   handleInputChange(
          //                     variable.label,
          //                     value.value,
          //                     e.target.checked
          //                   );
          //                 }
          //               }}
          //             />
          //             {value.label}
          //           </label>
          //         ))}
          //       </div>
          //     </div>
          //   );   
          case "radio":
            return (
              <div key={variable.id}>
                <div>{variable.label}</div>
                {variable.values.map((value, index) => (
                  <div key={index}>
                    <input
                    className="radioBox"
                      type="radio"
                      id={`${variable.id}_${index}`}
                      name={variable.id}
                      value={value.value}
                      checked={defaultValue === value.value}
                      onChange={(e) => handleInputChange(variable.key, e.target.value)}
                      disabled={!isAssigneePresent || variable.disabled || isFormDisabled}
          readOnly={variable.readonly}
                    />
                    
                    <label htmlFor={`${variable.id}_${index}`}>{value.label}</label>
                  </div>
                ))}
                <p className="description">{variable.description}</p>

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
          style={{ marginTop: "3px" }}
          id={variable.id}
          defaultValue={
          
  inputValues[name] ||
            (variable[variable.key] && variable[variable.key] !== variable.defaultValue)
              ? variable[variable.key]
              : variable.defaultValue
          }       
          
                  //  onChange={(e) => handleInputChange(name, e.target.options[e.target.selectedIndex].text)}
  onChange={(e) =>
      handleInputChange(
        name,
        //  e.target.options[e.target.selectedIndex].text, // Use the text content of the selected option as the value
        e.target.value // Pass the actual value as well if needed
      )
    }
          // onChange={(e) => handleInputChange(name, e.target.value)}
          disabled={!isAssigneePresent || variable.disabled || isFormDisabled}
          readOnly={variable.readonly}
        >
          <option value=""></option>
          {variable.values.map((option, index) => (
            <option
              key={index}
              value={option.value}
              // selected={variable[variable.key]}
              selected={
                (inputValues[name] && option.value === inputValues[name]) ||
                option.value === variable[variable.key] ||
                option.value === variable.defaultValue
              } // Check if option value matches the value in inputValues state
            >
              {option.label}
            </option>
          ))}
        </select>
        <p className="description">{variable.description}</p>
      </div>
    );

    case "checklist":
      return (
        <div key={variable.id}>
          <div className="var-label">{variable.label}</div>
          <div>
            {variable.values.map((value, index) => {
              const isChecked = variable[variable.key] ? variable[variable.key].includes(value.value) : false;
    
              return (
                <div key={index}>
                  <label htmlFor={`${variable.id}_${index}`}>
                    <input
                      type="checkbox"
                      className="checkList"
                      id={`${variable.id}_${index}`}
                      value={value.value}
                      name={variable.id}
                      required={variable.Required}
                      disabled={variable.disabled === "true" || !isAssigneePresent || isFormDisabled}
                      // checked={isChecked}
                      onChange={(e) => {
                        const selectedValue = value.value;
                        const isChecked = e.target.checked;
                        
                        let updatedChecklist;
                        
                        // Parse the string representation of the array into an actual array
                        updatedChecklist = variable[variable.key] ? variable[variable.key].replace(/[\[\]']/g, '').split(',') : [];
    
                        // If the checkbox is checked, add the selected value
                        if (isChecked) {
                          updatedChecklist.push(selectedValue);
                        } else {
                          // If the checkbox is unchecked, find the index of the selected value and remove it
                          const index = updatedChecklist.indexOf(selectedValue);
                          if (index !== -1) {
                            updatedChecklist.splice(index, 1);
                          }
                        }
    
                        // Convert the updated array back to a string representation
                        const updatedChecklistString = updatedChecklist.join(',');
    
                        // Update the checklist values directly in the component
                        const updatedComponent = {
                          ...variable,
                          [variable.key]: updatedChecklistString
                        };
    
                        // Pass the updated component to handleInputChange
                        handleInputChange(variable.key, updatedChecklistString, isChecked, updatedComponent);
                      }}
                    />
                    {value.label}
                  </label>
                </div>
              );
            })}
          </div>
          <p className="description">{variable.description}</p>
        </div>
      );
    
        default:
          return null;
      }
    };
  const renderInputforcomplete = (variable, valueToShow) => {
    console.log("valueToShow:", valueToShow);

    const isAssigneePresent = selectedItem && selectedItem.assignee !== null;
    const name = variable.key;
    let inputValue = "";
    
    if (variable.hasOwnProperty("value")) {
      inputValue = variable.value;
    }
    const keyValuePair = {};

    keyValuePair[variable.key] = variable[variable.key];

     const keyValue = variable[name];
    // const keyValue = variable[name] !== undefined ? variable[name] : '';
    const  valueToShow1 =  keyValue;

    console.log("render complete from key name valueshow1",valueToShow1);
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
              value={valueToShow1||valueToShow}
              className="form-control"
              style={{"marginRight":"10px"}}
              id={variable.id}
              required={variable.Required}
              disabled={!isAssigneePresent}
            />
            <p className="description">{variable.description}</p>
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
              value={valueToShow1||valueToShow}
              className="form-control"
              id={variable.id}
              onChange={handleInputChange}
              required={variable.Required}
              disabled={!isAssigneePresent}
              rows="3"
            />
            <p className="description">{variable.description}</p>
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
        // case "radio":
        //   return (
        //     <div key={variable.id}>
        //       <div className="var-label">{variable.label}</div>
        //       <div key={variable.value}>
        //         {variable.values.map((value, index) => (
        //           <label
        //             key={index}
        //             id="form-label-select"
        //             htmlFor={`${variable.id}_${index}`}
        //             className={
        //               valueToShow === value.value ? "selected-radio" : ""
        //             }
        //           >
        //             <input
        //               className="radioBox"
        //               type={variable.type}
        //               id={`${variable.id}_${index}`}
        //               value={value.value}
        //               name={variable.id}
        //               required={variable.Required}
        //               disabled={!isAssigneePresent }
        //               checked={
        //                 value.value === variable.defaultValue || // Check if the value matches the default value
        //                 !!inputValues[value.value] || // Check if the value exists in the inputValues object (assuming inputValues is an object with keys corresponding to checked values)
        //                 variable[variable.key] === value.value // Check if the value matches the value of variable[variable.key]
        //               }
        //               onChange={(e) => {
        //                 if (e.target.checked) {
        //                   handleInputChange(
        //                     variable.label,
        //                     value.value,
        //                     e.target.checked
        //                   );
        //                 }
        //               }}
        //             />
        //             {value.label}
        //           </label>
        //         ))}
        //       </div>
        //     </div>
        //   );

      case "radio":
              return (
                <div key={variable.id}>
                  <div className="var-label">{variable.label}</div>
                  <div key={variable.value}>
                    {variable.values.map((value, index) => (
                      <label
                        key={index}
                        id="form-label-select"
                        htmlFor={`${variable.id}_${index}`}
                        className={
                          valueToShow === value.value ? "selected-radio" : ""
                        }
                      >
                        <input
                          className="radioBox"
                          type={variable.type}
                          id={`${variable.id}_${index}`}
                          value={value.value}
                          name={variable.id}
                          required={variable.Required}
                          disabled={!isAssigneePresent}
                          checked={
                            (valueToShow === value.value && !valueToShow1) ||
                            (valueToShow1 === value.value && valueToShow1)
                          }                         
                        />
                        {value.label}
                      </label>
                    ))}
                  </div>
                </div>
              );
              // case "checkbox":
              //   return (
              //     <div key={variable.id}>
              //       <label id="form-label-select" htmlFor={variable.id}>
              //         <input
              //           className="checkBox"
              //           type={variable.type}
              //           id={`${variable.id}_${variable.value}`}
              //           name={variable.label}
              //           required={variable.Required}
              //           disabled={!isAssigneePresent}
              //           checked={valueToShow1}
              //           // valueToShow1 is a boolean indicating whether the checkbox should be checked or not
              //         />
              //         {variable.label}
              //       </label>
              //     </div>
              //   );
              
              case "checkbox":
                const defaultValue = variable[variable.key] || variable.defaultValue;
          const checkedValue =
            inputValues[variable.key] !== undefined
              ? inputValues[variable.key]
              : defaultValue;
                return (
                  <div key={variable.id}>
                    <label id="form-label-select" htmlFor={variable.id}>
                      <input
                        className="checkBox"
                        type="checkbox" // Make sure the type is set to "checkbox"
                        id={variable.id}
                        name={variable.label}
                        required={variable.Required}
                        // value={variable.label} // Value attribute is not necessary for checkboxes
                        // checked={variable[variable.key]=== true|| variable.defaultValue==="true"}
                        // checked={valueToShow1 ===true||valueToShow==="true"}
                        checked={checkedValue=== "true"}
                        disabled={!isAssigneePresent}
                      />
                      {variable.label}
                    </label>
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
        style={{ marginTop: "3px" }}
        id={variable.id}
//         defaultValue={
        
// inputValues[name] ||
//           (variable[variable.key] && variable[variable.key] !== variable.defaultValue)
//             ? variable[variable.key]
//             : variable.defaultValue
//         }       
        

        disabled={!isAssigneePresent}
      >
        <option value=""></option>
        {variable.values.map((option, index) => (
          <option
            key={index}
            value={option.value}
            // selected={variable[variable.key]}
            selected={
              option.value === variable[variable.key]
               ||
              option.value === variable.defaultValue
            } 
          >
            {option.label}
          </option>
        ))}

        
      </select>
      <p className="description">{variable.description}</p>
    </div>
  );

//       case "select":
//         return (
//           <div key={variable.id}>
//             <label
//               id="form-label"
//               htmlFor={variable.id}
//               style={{ marginTop: "13px" }}
//             >
//               {variable.label}
//             </label>

//             <select
//               type={variable.type}
//               name={name}
//               value={ valueToShow1}
//               className="form-control"
//               style={{ marginTop: "3px" }}
//               id={variable.id}
        

//               disabled={!isAssigneePresent}
//             >
//               <option value={valueToShow}>{valueToShow1}</option>
  
 
//  {variable.values.map((option, index) => (
//           <option key={index} value={option.label}>
//             {option.label}
//           </option>
//         ))}
//             </select>
//             <p className="description">{variable.description}</p>
//           </div>
//         );

      // case "checklist":
      //   return (
      //     <div key={variable.id}>
      //       <CFormLabel>{variable.label}</CFormLabel>
      //       {variable.Options.map((option, index) => (
      //         <div key={index} className="form-check">
      //           <input
      //             className="form-check-input"
      //             type="checkbox"
      //             value={option.Value}
      //             id={`${variable.id}_${index}`}
      //             required={variable.Required}
      //             onChange={handleInputChange}
      //             disabled={!isAssigneePresent}
      //           />
      //           <label
      //             className="form-check-label"
      //             htmlFor={`${variable.id}_${index}`}
      //           >
      //             {option.label}
      //           </label>
      //         </div>
      //       ))}
      //       <p className="description">{variable.description}</p>
      //     </div>
      //   );


      case "checklist":
        return (
          <div key={variable.id}>
            <div className="var-label">{variable.label}</div>
            <div>
              {variable.values.map((value, index) => {
                const isChecked = variable[variable.key] && variable[variable.key].includes(value.value);
      
                return (
                  <div key={index} className="checkbox-item">
                    <label htmlFor={`${variable.id}_${index}`}>
                      <input
                        type="checkbox"
                        className="checkBox"
                        id={`${variable.id}_${index}`}
                        value={value.value}
                        name={variable.id}
                        required={variable.Required}
                        disabled={variable.disabled === "true" || !isAssigneePresent }
                        checked={isChecked}
                        onChange={(e) => {
                          const selectedValue = value.value;
                          const isChecked = e.target.checked;
      
                          let updatedChecklist = [...(variable[variable.key] || [])]; // Ensure variable[variable.key] is an array
      
                          // Toggle the selected value in the checklist
                          if (isChecked) {
                            updatedChecklist.push(selectedValue);
                          } else {
                            updatedChecklist = updatedChecklist.filter((item) => item !== selectedValue);
                          }
      
                          // Update the checklist values directly in the component
                          setSelectedItem((prevSelectedItem) => ({
                            ...prevSelectedItem,
                            componentsNode: prevSelectedItem.componentsNode.map((component) => {
                              if (component.id === variable.id || component.key === variable.key) {
                                console.log(`Updating checklist values for ${variable.id}`);
                                return { ...component, [variable.key]: updatedChecklist };
                              }
                              return component;
                            }),
                          }));
                        }}
                      />
                      {value.label}
                    </label>
                  </div>
                );
              })}
            </div>
            <p className="description">{variable.description}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  //   const requestBody={...inputValues}

  // console.log(requestBody);

  const updatedDataString = localStorage.getItem("keyValuePair");
  const updatedData = updatedDataString ? JSON.parse(updatedDataString) : {};
  const requestBody = { ...updatedData };
  const [isLoading, setIsLoading] = useState(false);

  // console.log("Heloo", requestBody);
  const onComplete = (task) => {
    setIsLoading(true);

    // const updatedDataString = localStorage.getItem("keyValuePair");
    // const updatedData = updatedDataString ? JSON.parse(updatedDataString) : {};
    // const requestBody = { ...updatedData }; // Copy all values from the response object
    const existingDataString = localStorage.getItem("keyValuePair");
    const existingData = existingDataString
      ? JSON.parse(existingDataString)
      : {};

    // Include all key-value pairs in the request body
    const requestBody = { ...inputValues };
    console.log("request body", requestBody);

    console.log(requestBody);
    console.log("variable", selectedItem?.Variable);
    const apiUrl = `http://localhost:8080/completeTaskAndAddToIndex/${selectedItem.taskDetails.Key}/${username}`;
    console.log("enter selectedItem variable", selectedItem.Key);
    console.log("enter selectedItem variable", selectedItem.username);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedItem),
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
        alert("completed successfully");

        window.location.reload();
        setIsClaimed(true);
        // <toast position="bottom-left" reverseOrder={true} />;
        // toast.success('Task completed successfully', {
        //   onClose: () => {
        //     setIsLoading(false);
        //     window.location.reload(); // Reload page or perform other actions
        //   }
        // });
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
                  value={selectedValue} // Set the value of the select element
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
                      {claimedData
                        .sort((a, b) => {
                          // Sort in descending order based on CreationTime
                          return (
                            new Date(b[Object.keys(b)[0]].CreationTime) -
                            new Date(a[Object.keys(a)[0]].CreationTime)
                          );
                        })

                        .map((item) => (
                          <li
                            key={Object.keys(item)[0]}
                            className={
                              selectedItemKey === Object.keys(item)[0]
                                ? "selected"
                                : ""
                            }
                            style={{
                              backgroundColor:
                                selectedItemKey === Object.keys(item)[0]
                                  ? "rgb(234, 243, 255)"
                                  : "transparent",
                              display: "flex",
                              flexDirection: "column",
                              textAlign: "left",
                              marginBottom: "3px",
                            }}
                            // onClick={() =>
                            //   handleDivClick( item[Object.keys(item)[0]], // Pass the item details
                            //   Object.keys(item)[0], // Pass the key

                            //   selectedValue)
                            // }

                            //           const ids = data.map(obj => Object.keys(obj)[0]);
                            // console.log(ids);

                            onClick={() =>
                              handleDivClick(
                                item,
                                Object.keys(item)[0],
                                selectedValue
                              )
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
                              {console.log("check item..", item)}
                              {item[Object.keys(item)[0]].Process}
                            </div>
                            <div
                              style={{
                                marginBottom: "35px",
                                color: "rgb(98, 98, 110)",
                                fontSize: "15px",
                              }}
                            >
                              {item[Object.keys(item)[0]].Name}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                              }}
                            >
                              <div>{item[Object.keys(item)[0]].assignee}</div>

                              <div>
                                {item[Object.keys(item)[0]].CreationTime}
                              </div>
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
        className="right-containers"
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

                {console.log("selected Item from list", selectedItem)}
                {console.log("selected form", selectedItem.componentsNode)}


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
                        <td>{selectedItem.taskDetails.Process}</td>
                      </tr>
                      <tr>
                        <th
                          className="t-head"
                          style={{ color: "rgba(69, 70, 78, 0.9)" }}
                        >
                          Process Name
                        </th>
                        <td>{selectedItem.taskDetails.Name}</td>
                      </tr>
                      <tr>
                        <th
                          className="t-head"
                          style={{ color: "rgba(69, 70, 78, 0.9)" }}
                        >
                          Creation Date
                        </th>
                        <td>{selectedItem.taskDetails.CreationTime}</td>
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
                              {selectedItem.taskDetails.assignee !== null
                                ? selectedItem.taskDetails.assignee
                                : "--"}{" "}
                            </div>
                          </td>

                          {selectedItem.taskDetails.assignee !== null ? (
                            selectedItem.taskDetails.assignee === username ? (
                              <CButton
                                type="button"
                                className="sc-lbxAil sc-gITdmR jmZChO hjUmcc"
                                style={{
                                  fontSize: "12px",
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
                                  fontSize: "12px",
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
                                  fontSize: "12px",
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
                
<div className="form-fs" >
<div className="form-sc">
  <div className="task-form">
    <h2>Task Form</h2>
  </div>
  <div className="form-th">
  <div className="fjs-fr">
 <form className="row needs-validation">

                      <div
                        className="sc-Con"
                        style={{
                         margin:"16px"
                        }}
                      >
                        <div>
                          <selectedItem onChange={handleSelectionChange} />

                          <CForm>
                            {selectedItem &&
                              selectedItem.componentsNode &&
                              selectedItem.componentsNode.map((variable) => (
                                <div key={variable.key}>
                                  {renderInput(variable)}
                                </div>
                              ))}
                            {renderInputs()}
                          </CForm>
                        </div>
                      </div>
                    
                  </form>
</div>
</div>
                  </div>
                  </div>
                  <div className="completeButton">
                    {selectedItem.taskDetails.assignee === username &&
                      !isCompleting &&
                      areButtonsEnabled && (
                        <p>
                          {!isCompleting && (
                            <div className="button-sc-1">
                              <button
                                type="submit"
                                className="sc-lbxAil gRAREz"
                                style={{
                                  backgroundColor: "#ff4000",
                                  color: "white",
                                  padding: "10px 10px",
                                  fontSize: "14px",
                                  border: "none",
                                  borderRadius: "13px",
                                  boxShadow: " 0 6px 20px 0 rgba(0,0,0,0.19)",
                                  cursor: "pointer",
                                }}
                                onClick={handleCompleteButtonClick}
                              >
                                Complete Task
                              </button>
                              <ToastContainer />
                            </div>
                          )}
                        </p>
                      )}
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
          formDetails ? (
            <div className="process">
              <div
                className={`right-side ${
                  isExpanded ? "expanded" : "minimized"
                }`}
              >
                <h2 className="text-1">Details</h2>
                {console.log("1Selected Item.......:", formDetails)}

                {console.log(
                  "1Selected Value in complete........:",
                  selectedValue
                )}
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
                        <td>{formDetails[0].taskDetails.Process}</td>
                      </tr>
                      <tr>
                        <th
                          className="t-head"
                          style={{ color: "rgba(69, 70, 78, 0.9)" }}
                        >
                          Process Name
                        </th>
                        <td>{formDetails[0].taskDetails.Name}</td>
                      </tr>{" "}
                      <tr>
                        <th
                          className="t-head"
                          style={{ color: "rgba(69, 70, 78, 0.9)" }}
                        >
                          Completion Time
                        </th>
                        <td>{formDetails[0].taskDetails.CompletionTime}</td>
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
                              {formDetails[0].taskDetails.assignee}
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
                            formDetails[0].componentsNode &&
                            formDetails[0].componentsNode.map(
                              (variable, index) => (
                                <div key={index}>
                                  {renderInputforcomplete(
                                    variable,
                                    variable[variable.label] !== null &&
                                      variable[variable.label] !== undefined
                                      ? variable[variable.label]
                                      : variable.defaultValue
                                  )}
                                </div>
                              )
                            )}
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
