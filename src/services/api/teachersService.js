// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'teachers_c';

// Helper function to simulate realistic delays
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get all teachers from database
export async function getAllTeachers() {
  try {
    await delay(300);
    
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "Email"}},
        {"field": {"Name": "Phone"}},
        {"field": {"Name": "Department"}},
        {"field": {"Name": "HireDate"}},
        {"field": {"Name": "Salary"}},
        {"field": {"Name": "Status"}},
        {"field": {"Name": "Specialization"}}
      ],
      orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
      pagingInfo: {"limit": 100, "offset": 0}
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error('Error fetching teachers:', response.message);
      return [];
    }
    
    return response.data || [];
    
  } catch (error) {
    console.error('Error fetching teachers:', error?.response?.data?.message || error.message);
    return [];
  }
}

// Get teacher by ID from database
export async function getTeacherById(id) {
  try {
    await delay(200);
    
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "Email"}},
        {"field": {"Name": "Phone"}},
        {"field": {"Name": "Department"}},
        {"field": {"Name": "HireDate"}},
        {"field": {"Name": "Salary"}},
        {"field": {"Name": "Status"}},
        {"field": {"Name": "Specialization"}}
      ]
    };
    
    const response = await apperClient.getRecordById(tableName, parseInt(id), params);
    
    if (!response.success) {
      console.error(`Error fetching teacher ${id}:`, response.message);
      return null;
    }
    
    return response.data;
    
  } catch (error) {
    console.error(`Error fetching teacher ${id}:`, error?.response?.data?.message || error.message);
    return null;
  }
}

// Create new teacher in database
export async function createTeacher(teacherData) {
  try {
    await delay(400);
    
    // Only include Updateable fields based on database schema
    const params = {
      records: [{
        Name: teacherData.Name,
        Email: teacherData.Email,
        Phone: teacherData.Phone,
        Department: teacherData.Department,
        HireDate: teacherData.HireDate,
        Salary: parseFloat(teacherData.Salary),
        Status: teacherData.Status,
        Specialization: teacherData.Specialization
      }]
    };
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error('Error creating teacher:', response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create teacher:`, failed);
        return null;
      }
      
      return successful.length > 0 ? successful[0].data : null;
    }
    
    return response.data;
    
  } catch (error) {
    console.error('Error creating teacher:', error?.response?.data?.message || error.message);
    return null;
  }
}

// Update teacher in database
export async function updateTeacher(id, teacherData) {
  try {
    await delay(400);
    
    // Only include Updateable fields based on database schema
    const params = {
      records: [{
        Id: parseInt(id),
        Name: teacherData.Name,
        Email: teacherData.Email,
        Phone: teacherData.Phone,
        Department: teacherData.Department,
        HireDate: teacherData.HireDate,
        Salary: parseFloat(teacherData.Salary),
        Status: teacherData.Status,
        Specialization: teacherData.Specialization
      }]
    };
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error('Error updating teacher:', response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update teacher:`, failed);
        return null;
      }
      
      return successful.length > 0 ? successful[0].data : null;
    }
    
    return response.data;
    
  } catch (error) {
    console.error('Error updating teacher:', error?.response?.data?.message || error.message);
    return null;
  }
}

// Delete teacher from database
export async function deleteTeacher(id) {
  try {
    await delay(300);
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error('Error deleting teacher:', response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete teacher:`, failed);
        return false;
      }
      
      return successful.length > 0;
    }
    
    return true;
    
  } catch (error) {
    console.error('Error deleting teacher:', error?.response?.data?.message || error.message);
    return false;
  }
}

export const teachersService = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
};