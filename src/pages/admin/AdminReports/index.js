// import React, { useState } from "react";
// import PageTitle from "../../../components/PageTitle";
// import { message, Table } from "antd";
// import { useDispatch } from "react-redux";
// import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
// import { getAllReports } from "../../../apicalls/reports";
// import { useEffect } from "react";
// import moment from "moment";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import * as XLSX from "xlsx";

// function AdminReports() {
//   const [reportsData, setReportsData] = React.useState([]);
//   const [recordings, setRecordings] = useState([]);

//   const dispatch = useDispatch();
//   const [filters, setFilters] = React.useState({
//     examName: "",
//     userName: ""
//   });

//   console.log(reportsData);

//   const columns = [
//     {
//       title: "Exam Name",
//       dataIndex: "examName",
//       render: (text, record) => <>{record.exam.name}</>
//     },
//     {
//       title: "User Name",
//       dataIndex: "userName",
//       render: (text, record) => <>{record.user.name}</>
//     },
//     {
//       title: "Contact",
//       dataIndex: "contact",
//       render: (text, record) => <>{record.user.mobile}</>
//     },
//     {
//       title: "Date",
//       dataIndex: "date",
//       render: (text, record) => (
//         <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
//       )
//     },
//     {
//       title: "Total Marks",
//       dataIndex: "totalQuestions",
//       render: (text, record) => <>{record.exam.totalMarks}</>
//     },
//     {
//       title: "Passing Marks",
//       dataIndex: "correctAnswers",
//       render: (text, record) => <>{record.exam.passingMarks}</>
//     },
//     {
//       title: "Obtained Marks",
//       dataIndex: "correctAnswers",
//       render: (text, record) => <>{record.result.correctAnswers.length}</>
//     },
//     {
//       title: "Result",
//       dataIndex: "verdict",
//       render: (text, record) => <>{record.result.verdict}</>
//     }
//   ];

//   const getData = async (tempFilters) => {
//     try {
//       dispatch(ShowLoading());
//       const response = await getAllReports(tempFilters);
//       if (response.success) {
//         setReportsData(response.data);
//       } else {
//         message.error(response.message);
//       }
//       dispatch(HideLoading());
//     } catch (error) {
//       dispatch(HideLoading());
//       message.error(error.message);
//     }
//   };

//   useEffect(() => {
//     getData(filters);
//   }, []);

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     const tableColumn = columns.map((col) => col.title);
//     const tableRows = reportsData.map((record) => [
//       record.exam.name,
//       record.user.name,
//       record.user.mobile,
//       moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss"),
//       record.exam.totalMarks,
//       record.exam.passingMarks,
//       record.result.correctAnswers.length,
//       record.result.verdict
//     ]);

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows
//     });

//     doc.save("reports.pdf");
//   };

//   const exportXLS = () => {
//     const ws = XLSX.utils.json_to_sheet(
//       reportsData.map((record) => ({
//         "Exam Name": record.exam.name,
//         "User Name": record.user.name,
//         "Contact": record.user.mobile,
//         Date: moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss"),
//         "Total Marks": record.exam.totalMarks,
//         "Passing Marks": record.exam.passingMarks,
//         "Obtained Marks": record.result.correctAnswers.length,
//         Verdict: record.result.verdict
//       }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Reports");
//     XLSX.writeFile(wb, "reports.xlsx");
//   };

//   return (
//     <div>
//       <div className="flex gap-2" style={{justifyContent:"space-between"}}></div>
//       <PageTitle title="Reports" />
//       <div className="gap-2 flex">
//         <button className="primary-contained-btn" onClick={exportPDF}>
//         Export PDF
//       </button>
//       <button className="primary-contained-btn" onClick={exportXLS}>
//         Export XLS
//       </button></div>
//       <div className="divider"></div>
//       <div className="flex gap-2">
//         <input
//           type="text"
//           placeholder="Exam"
//           value={filters.examName}
//           onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="User"
//           value={filters.userName}
//           onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
//         />
//         {/* <button
//           className="primary-outlined-btn"
//           onClick={() => {
//             setFilters({
//               examName: "",
//               userName: ""
//             });
//             getData({
//               examName: "",
//               userName: ""
//             });
//           }}
//         >
//           Clear
//         </button> */}
//         <button
//           className="primary-contained-btn"
//           onClick={() => getData(filters)}
//         >
//           Search
//         </button>
//       </div>
//       <Table
//         columns={columns}
//         dataSource={reportsData}
//         className="mt-2"
//         scroll={{ x: 800 }}
//       />
//     </div>
//   );
// }

// export default AdminReports;

import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Modal } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import ReactPlayer from "react-player";
import ModalComponent from "react-modal"; // Import Modal for video popup
import "./report.css";
import { FaDownload, FaRegPlayCircle } from "react-icons/fa";

function AdminReports() {
  const [reportsData, setReportsData] = useState([]);
  const [filters, setFilters] = useState({
    examName: "",
    userName: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // For opening/closing the modal
  const [videoUrl, setVideoUrl] = useState(""); // Store video URL to play

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      render: (text, record) => <>{record.user.mobile}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam.totalMarks}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam.passingMarks}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result.correctAnswers.length}</>,
    },
    {
      title: "Result",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict}</>,
    },
    {
      title: "Recording",
      dataIndex: "recording",
      render: (text, record) =>
        record.recording ? (
          // <button
          //   onClick={() => openVideoModal(record.recording.fileUrl)}
          //   className="play-button"
          // >
          //   <FaRegPlayCircle />

          // </button>
          <FaRegPlayCircle
          onClick={() => openVideoModal(record.recording.fileUrl)}
          style={{fontSize:"20px",cursor:"pointer"}}
          />

        ) : (
          "No Recording"
        ),
    },
  ];

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const openVideoModal = (url) => {
    setVideoUrl(url);
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setVideoUrl(""); // Clear the video URL
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map((col) => col.title);
    const tableRows = reportsData.map((record) => [
      record.exam.name,
      record.user.name,
      record.user.mobile,
      moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss"),
      record.exam.totalMarks,
      record.exam.passingMarks,
      record.result.correctAnswers.length,
      record.result.verdict,
      record.recording ? record.recording.fileUrl : "No Recording",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("reports.pdf");
  };

  const exportXLS = () => {
    const ws = XLSX.utils.json_to_sheet(
      reportsData.map((record) => ({
        "Exam Name": record.exam.name,
        "User Name": record.user.name,
        Contact: record.user.mobile,
        Date: moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss"),
        "Total Marks": record.exam.totalMarks,
        "Passing Marks": record.exam.passingMarks,
        "Obtained Marks": record.result.correctAnswers.length,
        Verdict: record.result.verdict,
        "Recording URL": record.recording
          ? record.recording.fileUrl
          : "No Recording",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");
    XLSX.writeFile(wb, "reports.xlsx");
  };

  useEffect(() => {
    getData(filters);
  }, [filters]);

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="gap-2 flex">
        <button className="primary-contained-btn" onClick={exportPDF}>
          Export PDF
        </button>
        <button className="primary-contained-btn" onClick={exportXLS}>
          Export XLS
        </button>
      </div>
      <div className="divider"></div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Exam"
          value={filters.examName}
          onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
        />
        <input
          type="text"
          placeholder="User"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
        />
        <button
          className="primary-contained-btn"
          onClick={() => getData(filters)}
        >
          Search
        </button>
      </div>
      <Table
        columns={columns}
        dataSource={reportsData}
        className="mt-2"
        scroll={{ x: 800 }}
      />

      {/* Video Modal */}

      <ModalComponent
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)", // Dim background
          },
          content: {
            height: "400px", // Fixed height
            width: "600px",
            top: "50px",
            margin: "auto",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "#f8f9fa", // Light background color
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            overflow:"hidden" // Ensures content is spaced out
          },
        }}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <div className="modal-content w-full h-full flex flex-col ">
          <div className="video-wrapper flex-grow flex justify-center items-center w-full">
            <ReactPlayer
              url={videoUrl}
              controls
              width="100%" // Occupies full modal width
              height="300px" // Fixed height for the player
              style={{ borderRadius: "8px",overflow: "hidden"  }}
            />
          </div>
          <div className="flex justify-between items-center w-full mt-4">
            <a
              href={videoUrl}
              download
              className="download-link px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {/* Download Recording */}
              <FaDownload />
            </a>
            <button
              onClick={closeModal}
              className="close-button px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
}

export default AdminReports;

// import React, { useState } from "react";
// import PageTitle from "../../../components/PageTitle";
// import { message, Table } from "antd";
// import { useDispatch } from "react-redux";
// import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
// import { getAllReports } from "../../../apicalls/reports";
// import { useEffect } from "react";
// import moment from "moment";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import * as XLSX from "xlsx";

// function AdminReports() {
//   const [reportsData, setReportsData] = React.useState([]);
//   const [recordings, setRecordings] = useState([]);

//   const dispatch = useDispatch();
//   const [filters, setFilters] = React.useState({
//     examName: "",
//     userName: ""
//   });

//   console.log(reportsData);

//   const columns = [
//     {
//       title: "Exam Name",
//       dataIndex: "examName",
//       render: (text, record) => <>{record.exam.name}</>
//     },
//     {
//       title: "User Name",
//       dataIndex: "userName",
//       render: (text, record) => <>{record.user.name}</>
//     },
//     {
//       title: "Contact",
//       dataIndex: "contact",
//       render: (text, record) => <>{record.user.mobile}</>
//     },
//     {
//       title: "Date",
//       dataIndex: "date",
//       render: (text, record) => (
//         <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
//       )
//     },
//     {
//       title: "Total Marks",
//       dataIndex: "totalQuestions",
//       render: (text, record) => <>{record.exam.totalMarks}</>
//     },
//     {
//       title: "Passing Marks",
//       dataIndex: "correctAnswers",
//       render: (text, record) => <>{record.exam.passingMarks}</>
//     },
//     {
//       title: "Obtained Marks",
//       dataIndex: "correctAnswers",
//       render: (text, record) => <>{record.result.correctAnswers.length}</>
//     },
//     {
//       title: "Result",
//       dataIndex: "verdict",
//       render: (text, record) => <>{record.result.verdict}</>
//     },
//     {
//       title: "Recording",
//       dataIndex: "recording",
//       render: (text, record) =>
//         record.recording ? (
//           <a href={record.recording.fileUrl} target="_blank" rel="noopener noreferrer">
//             Download Recording
//           </a>
//         ) : (
//           "No Recording"
//         )
//     }
//   ];

//   const getData = async (tempFilters) => {
//     try {
//       dispatch(ShowLoading());
//       const response = await getAllReports(tempFilters);
//       if (response.success) {
//         setReportsData(response.data);
//       } else {
//         message.error(response.message);
//       }
//       dispatch(HideLoading());
//     } catch (error) {
//       dispatch(HideLoading());
//       message.error(error.message);
//     }
//   };

//   useEffect(() => {
//     getData(filters);
//   }, []);

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     const tableColumn = columns.map((col) => col.title);
//     const tableRows = reportsData.map((record) => [
//       record.exam.name,
//       record.user.name,
//       record.user.mobile,
//       moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss"),
//       record.exam.totalMarks,
//       record.exam.passingMarks,
//       record.result.correctAnswers.length,
//       record.result.verdict,
//       record.recording ? record.recording.fileUrl : "No Recording"
//     ]);

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows
//     });

//     doc.save("reports.pdf");
//   };

//   const exportXLS = () => {
//     const ws = XLSX.utils.json_to_sheet(
//       reportsData.map((record) => ({
//         "Exam Name": record.exam.name,
//         "User Name": record.user.name,
//         "Contact": record.user.mobile,
//         Date: moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss"),
//         "Total Marks": record.exam.totalMarks,
//         "Passing Marks": record.exam.passingMarks,
//         "Obtained Marks": record.result.correctAnswers.length,
//         Verdict: record.result.verdict,
//         "Recording URL": record.recording ? record.recording.fileUrl : "No Recording"
//       }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Reports");
//     XLSX.writeFile(wb, "reports.xlsx");
//   };

//   return (
//     <div>
//       <div className="flex gap-2" style={{justifyContent:"space-between"}}></div>
//       <PageTitle title="Reports" />
//       <div className="gap-2 flex">
//         <button className="primary-contained-btn" onClick={exportPDF}>
//         Export PDF
//       </button>
//       <button className="primary-contained-btn" onClick={exportXLS}>
//         Export XLS
//       </button></div>
//       <div className="divider"></div>
//       <div className="flex gap-2">
//         <input
//           type="text"
//           placeholder="Exam"
//           value={filters.examName}
//           onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="User"
//           value={filters.userName}
//           onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
//         />
//         <button
//           className="primary-contained-btn"
//           onClick={() => getData(filters)}
//         >
//           Search
//         </button>
//       </div>
//       <Table
//         columns={columns}
//         dataSource={reportsData}
//         className="mt-2"
//         scroll={{ x: 800 }}
//       />
//     </div>
//   );
// }

// export default AdminReports;
