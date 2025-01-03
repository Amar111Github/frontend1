const { default: axiosInstance } = require(".");

// add report
// export const addReport = async (payload) => {
//     try {
//         const response = await axiosInstance.post("/api/reports/add-report", payload);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

export const addReport = async (formData) => {
  try {
    const response = await axiosInstance.post("/api/reports/add-report", formData, {
      headers: { "Content-Type": "multipart/form-data" }, // Ensure the header is for form-data
    });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: "Network error" };
  }
};


// export const addReport = async (formData) => {
//     try {
//       const response = await axiosInstance.post("/api/reports/add-report", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return response.data;
//     } catch (error) {
//       return error.response.data;
//     }
//   };
  

// get all reports
export const getAllReports = async (filters) => {
    try {
        const response = await axiosInstance.post("/api/reports/get-all-reports" , filters);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
} 

// get all reports by user
export const getAllReportsByUser = async () => {
    try {
        const response = await axiosInstance.post("/api/reports/get-all-reports-by-user");
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}