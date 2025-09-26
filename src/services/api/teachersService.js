const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'teachers_c';

// Helper function to add realistic delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const teachersService = {
  async getAll() {
    try {
      await delay(300);
      
      const params = {
        fields: [
          { "field": { "Name": "Id" } },
          { "field": { "Name": "name_c" } },
          { "field": { "Name": "email_c" } },
          { "field": { "Name": "department_c" } },
          { "field": { "Name": "hire_date_c" } },
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "CreatedOn" } },
          { "field": { "Name": "ModifiedOn" } }
        ],
        orderBy: [{ "fieldName": "name_c", "sorttype": "ASC" }],
        pagingInfo: { "limit": 100, "offset": 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch teachers');
      }
      
      return response.data || [];
    } catch (error) {
console.error('Error fetching teachers:', error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);
      
      const params = {
        fields: [
          { "field": { "Name": "Id" } },
          { "field": { "Name": "name_c" } },
          { "field": { "Name": "email_c" } },
          { "field": { "Name": "department_c" } },
          { "field": { "Name": "hire_date_c" } },
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "CreatedOn" } },
          { "field": { "Name": "ModifiedOn" } }
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, id, params);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch teacher');
      }
      
      return response.data;
    } catch (error) {
console.error(`Error fetching teacher ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  },

  async create(teacherData) {
    try {
      await delay(400);
      
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          name_c: teacherData.name_c || '',
          email_c: teacherData.email_c || '',
          department_c: teacherData.department_c || '',
          hire_date_c: teacherData.hire_date_c || ''
        }]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create teacher');
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} teachers:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return response.data;
    } catch (error) {
console.error('Error creating teacher:', error?.response?.data?.message || error.message);
      return null;
    }
  },

  async update(id, teacherData) {
    try {
      await delay(350);
      
      // Only include Updateable fields for update operation
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: teacherData.name_c || '',
          email_c: teacherData.email_c || '',
          department_c: teacherData.department_c || '',
          hire_date_c: teacherData.hire_date_c || ''
        }]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to update teacher');
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} teachers:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return response.data;
    } catch (error) {
console.error('Error updating teacher:', error?.response?.data?.message || error.message);
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete teacher');
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} teachers:`, failed);
          failed.forEach(record => {
            if (record.message) {
              throw new Error(record.message);
            }
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
console.error('Error deleting teacher:', error?.response?.data?.message || error.message);
      return false;
    }
  }
};