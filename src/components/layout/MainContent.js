import {
  CButton,
  CCol,
  CContainer,
  CFormSelect,
  CNavItem,
  CRow,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
} from "@coreui/react";
import React, { useState } from "react";
import "../style/mainContent.css";
export default function MainContent() {
  const [isExpanded, setExpanded] = useState(true);

 

  return (
    <main className="ksUgYX">
      <div className="left-container">
        <div data-testid="expanded-panel" className="side-panel">
          <div >
            <div className="title-name">
              Tasks
              <button data-testid="collapse-button" className="col-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.5,12.9494942 L6.55025253,7.99974671 L11.5,3.04999924 L12.9142136,4.4642128 L9.37867966,7.99974671 L12.9142136,11.5352806 L11.5,12.9494942 Z M6,3 L6,13 L4,13 L4,3 L6,3 Z"
                  ></path>
                </svg>
              </button>
            </div>
            <div >
              <div className="dropdown" style={{ padding: " 22px 20px 20px;" }}>
                <form>
                  <select
                    name="filter"
                    id="filter"
                    aria-label="Filter"
                    className="filter-opt"
                  >
                    <option value="all-open">All open</option>
                    <option value="claimed-by-me">Claimed by me</option>
                    <option value="unclaimed">Unclaimed</option>
                    <option value="completed">Completed</option>
                  </select>
                </form>
              </div>
              <div >
                <ul data-testid="scrollable-list" >
                  <a href="/2251799813686045?all-open">
                    <li
                      className="instance-block"
                    >
                      <div className="name-block">
                        <div className="assigne-name">A</div>
                        <div className="instance-id">Process_0d49ou7</div>
                      </div>
                      <div className="assigne-block">
                        <div data-testid="assignee" className="assignee">
                          --
                        </div>
                        <div
                          data-testid="creation-time"
                          className="creation-time"
                        >
                          2024-01-12 12:50:33
                        </div>
                      </div>
                    </li>
                  </a>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="right-container show-table">
        <div className="title-name">Details</div>
        <div className="sc-ezWOiH fabOcg">
          <div className="sc-ikjQzJ gfcpuo">
            <div className="sc-brCFrO blKIyq">
              <table data-testid="details-table" className="sc-iNWwEs FGpqU">
                <tbody>
                  <tr className="sc-hiMGwR gVObmX">
                    <th className="sc-jfmDQi ldGcji">Name</th>
                    <td className="sc-olbas iVJMuP">A</td>
                  </tr>
                  <tr className="sc-hiMGwR gVObmX">
                    <th className="sc-jfmDQi ldGcji">Process</th>
                    <td className="sc-olbas iVJMuP">Process_0d49ou7</td>
                  </tr>
                  <tr className="sc-hiMGwR gVObmX">
                    <th className="sc-jfmDQi ldGcji">Creation Time</th>
                    <td className="sc-olbas iVJMuP">2024-01-12 12:50:33</td>
                  </tr>
                  <tr className="sc-hiMGwR gVObmX">
                    <th className="sc-jfmDQi ldGcji">Assignee</th>
                    <td className="sc-olbas sc-evrZIY iVJMuP jYiRNe">
                      <div
                        data-testid="assignee-task-details"
                        className="sc-fIavCj goyRLq"
                      >
                        --
                        <CButton
                          type="button"
                          className="sc-lbxAil sc-gITdmR jmZChO hjUmcc"
                        >
                          Claim
                        </CButton>
                      </div>
                      <div className="sc-duzrYq iMdwvT">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          className="sc-dkdnUF JhxYN"
                        >
                        </svg>
                        Claim the Task to start working on it
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <form className="sc-hNKHps jyklRn">
            </form>
          </div>
        </div>
        
      </div>
    </main>
  );
}
