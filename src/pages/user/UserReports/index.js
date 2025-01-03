import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import moment from "moment";
import axios from "axios";

function UserReports() {
  const [reportsData, setReportsData] = useState([]);
  const dispatch = useDispatch();


  console.log(reportsData);
  

//  const getAllReportsByUser = async () => {
//     try {
//         const response = await axios.post("/api/reports/get-all-reports-by-user", {}, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//         });
//         return response.data;
//     } catch (error) {
//         return error.response ? error.response.data : error.message;
//     }
// };


  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser();
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

  useEffect(() => {
    getData();
  }, [dispatch]);

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="divider"></div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Exam Name</th>
              {/* <th>Date</th> */}
              <th>Total Marks</th>
              <th>Passing Marks</th>
              <th>Obtained Marks</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {reportsData.map((report) => (
              <tr key={report._id}>
                <td>{report.exam.name}</td>
                {/* <td>
                  {moment(report.createdAt).format("DD-MM-YYYY hh:mm:ss")}
                </td> */}
                <td>{report.exam.totalMarks}</td>
                <td>{report.exam.passingMarks}</td>
                <td>{report.result.correctAnswers.length}</td>
                <td>{report.result.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserReports;

// import React from "react";
// import PageTitle from "../../../components/PageTitle";
// import { message, Modal, Table } from "antd";
// import { useDispatch } from "react-redux";
// import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
// import { getAllReportsByUser } from "../../../apicalls/reports";
// import { useEffect } from "react";
// import moment from "moment";

// function UserReports() {
//   const [reportsData, setReportsData] = React.useState([]);
//   const dispatch = useDispatch();

//   const columns = [
//     {
//       title: "Exam Name",
//       dataIndex: "examName",
//       render: (text, record) => <>{record.exam.name}</>
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
//       title: "Verdict",
//       dataIndex: "verdict",
//       render: (text, record) => <>{record.result.verdict}</>
//     }
//   ];

//   const getData = async () => {
//     try {
//       dispatch(ShowLoading());
//       const response = await getAllReportsByUser();
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
//     getData();
//   }, []);

//   return (
//     <div>
//       <PageTitle title="Reports" />
//       <div className="divider"></div>
//       <Table columns={columns} dataSource={reportsData} />
//     </div>
//   );
// }

// export default UserReports;
