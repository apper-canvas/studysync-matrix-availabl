import { toast } from "react-toastify";

class StudentsService {
  constructor() {
    this.tableName = 'student_c';
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "major_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "gpa_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "chemistry_marks_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(student => ({
        Id: student.Id,
        name: student.name_c || '',
        email: student.email_c || '',
        major: student.major_c || '',
        year: student.year_c || '',
        gpa: student.gpa_c || 0.0,
phone: student.phone_c || '',
        enrollmentDate: student.enrollment_date_c || '',
        chemistry_marks_c: student.chemistry_marks_c || 0.0
      }));
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
{"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "major_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "gpa_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "chemistry_marks_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error(`Student with ID ${id} not found`);
      }
      
      const student = response.data;
      return {
        Id: student.Id,
        name: student.name_c || '',
        email: student.email_c || '',
        major: student.major_c || '',
year: student.year_c || '',
        gpa: student.gpa_c || 0.0,
        phone: student.phone_c || '',
        enrollmentDate: student.enrollment_date_c || '',
        chemistry_marks_c: student.chemistry_marks_c || 0.0
      };
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(studentData) {
    try {
// Sanitize data to prevent circular reference errors
      const sanitizedData = {
        name_c: String(studentData.name || '').trim(),
        email_c: String(studentData.email || '').trim(),
        major_c: String(studentData.major || '').trim(),
        year_c: String(studentData.year || '').trim(),
        gpa_c: parseFloat(String(studentData.gpa || '0')) || 0.0,
        phone_c: String(studentData.phone || '').trim(),
        chemistry_marks_c: parseFloat(String(studentData.chemistry_marks_c || '0')) || 0.0,
        enrollment_date_c: new Date().toISOString().split('T')[0]
      };

      const params = {
        records: [sanitizedData]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} students:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
const studentResult = {
            Id: created.Id,
            name: created.name_c || '',
            email: created.email_c || '',
            major: created.major_c || '',
            year: created.year_c || '',
            gpa: created.gpa_c || 0.0,
            phone: created.phone_c || '',
            enrollmentDate: created.enrollment_date_c || '',
            chemistry_marks_c: created.chemistry_marks_c || 0.0
          };

          // Check if Chemistry marks are greater than 5.0 and send email
          if (created.chemistry_marks_c && created.chemistry_marks_c > 5.0) {
            try {
              const { ApperClient } = window.ApperSDK;
              const apperClient = new ApperClient({
                apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
              });

              const emailResult = await apperClient.functions.invoke(import.meta.env.VITE_SEND_CHEMISTRY_PASS_EMAIL, {
                body: JSON.stringify({
                  studentEmail: created.email_c,
                  studentName: created.name_c
                }),
                headers: {
                  'Content-Type': 'application/json'
                }
              });

              const emailData = await emailResult.json();
              if (emailData.success) {
                toast.success('Chemistry pass notification sent successfully');
              } else {
                console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_SEND_CHEMISTRY_PASS_EMAIL}. The response body is: ${JSON.stringify(emailData)}.`);
                toast.warning('Student created successfully, but email notification failed');
              }
            } catch (emailError) {
              console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_SEND_CHEMISTRY_PASS_EMAIL}. The error is: ${emailError.message}`);
              toast.warning('Student created successfully, but email notification failed');
            }
}

          // Create corresponding Stripe customer
          try {
            const { ApperClient } = window.ApperSDK;
            const apperClient = new ApperClient({
              apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
              apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
            });

            const stripeResult = await apperClient.functions.invoke(import.meta.env.VITE_CREATE_STRIPE_CUSTOMER, {
              body: JSON.stringify({
                name: created.name_c,
                email: created.email_c
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            });

            const stripeData = await stripeResult.json();
            if (stripeData.success) {
              toast.success('Student created and Stripe customer account set up successfully');
            } else {
              console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_CREATE_STRIPE_CUSTOMER}. The response body is: ${JSON.stringify(stripeData)}.`);
              toast.warning('Student created successfully, but Stripe customer setup failed');
            }
          } catch (stripeError) {
            console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_CREATE_STRIPE_CUSTOMER}. The error is: ${stripeError.message}`);
            toast.warning('Student created successfully, but Stripe customer setup failed');
}

          // Create corresponding CompanyHub contact
          try {
            const { ApperClient } = window.ApperSDK;
            const apperClient = new ApperClient({
              apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
              apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
            });

            const companyhubResult = await apperClient.functions.invoke(import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT, {
              body: JSON.stringify({
                name: created.name_c,
                email: created.email_c,
                phone: created.phone_c
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            });

            const companyhubData = await companyhubResult.json();
            if (companyhubData.success) {
              toast.success('Student created and CompanyHub contact added successfully');
            } else {
              console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT}. The response body is: ${JSON.stringify(companyhubData)}.`);
              toast.warning('Student created successfully, but CompanyHub contact creation failed');
            }
          } catch (companyhubError) {
            console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT}. The error is: ${companyhubError.message}`);
            toast.warning('Student created successfully, but CompanyHub contact creation failed');
          }

          return studentResult;
        }
      }
      
      throw new Error("Failed to create student");
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
// Sanitize data to prevent circular reference errors
      const sanitizedData = {
        Id: parseInt(id),
        name_c: String(updateData.name || '').trim(),
        email_c: String(updateData.email || '').trim(),
        major_c: String(updateData.major || '').trim(),
        year_c: String(updateData.year || '').trim(),
        gpa_c: parseFloat(String(updateData.gpa || '0')) || 0.0,
        phone_c: String(updateData.phone || '').trim(),
        chemistry_marks_c: parseFloat(String(updateData.chemistry_marks_c || '0')) || 0.0
      };

      const params = {
        records: [sanitizedData]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} students:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
Id: updated.Id,
            name: updated.name_c || '',
            email: updated.email_c || '',
            major: updated.major_c || '',
            year: updated.year_c || '',
            gpa: updated.gpa_c || 0.0,
            phone: updated.phone_c || '',
            enrollmentDate: updated.enrollment_date_c || '',
            chemistry_marks_c: updated.chemistry_marks_c || 0.0
          };
        }
      }
      
      throw new Error("Failed to update student");
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} students:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const deleted = successful[0].data;
return {
            Id: deleted.Id,
            name: deleted.name_c || '',
            email: deleted.email_c || '',
            major: deleted.major_c || '',
            year: deleted.year_c || '',
            gpa: deleted.gpa_c || 0.0,
            phone: deleted.phone_c || '',
            enrollmentDate: deleted.enrollment_date_c || '',
            chemistry_marks_c: deleted.chemistry_marks_c || 0.0
          };
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Additional utility methods
  async getByMajor(major) {
    try {
      const params = {
fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "major_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "gpa_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "chemistry_marks_c"}}
        ],
        where: [{"FieldName": "major_c", "Operator": "Contains", "Values": [major]}]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(student => ({
Id: student.Id,
        name: student.name_c || '',
        email: student.email_c || '',
        major: student.major_c || '',
        year: student.year_c || '',
        gpa: student.gpa_c || 0.0,
        phone: student.phone_c || '',
        enrollmentDate: student.enrollment_date_c || '',
        chemistry_marks_c: student.chemistry_marks_c || 0.0
      }));
    } catch (error) {
      console.error("Error fetching students by major:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByYear(year) {
    try {
      const params = {
fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "major_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "gpa_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "chemistry_marks_c"}}
        ],
        where: [{"FieldName": "year_c", "Operator": "EqualTo", "Values": [year]}]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(student => ({
Id: student.Id,
        name: student.name_c || '',
        email: student.email_c || '',
        major: student.major_c || '',
        year: student.year_c || '',
        gpa: student.gpa_c || 0.0,
        phone: student.phone_c || '',
        enrollmentDate: student.enrollment_date_c || '',
        chemistry_marks_c: student.chemistry_marks_c || 0.0
      }));
    } catch (error) {
      console.error("Error fetching students by year:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async search(query) {
    try {
      const params = {
fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "major_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "gpa_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "chemistry_marks_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{"fieldName": "name_c", "operator": "Contains", "values": [query]}],
              operator: ""
            },
            {
              conditions: [{"fieldName": "email_c", "operator": "Contains", "values": [query]}],
              operator: ""
            },
            {
              conditions: [{"fieldName": "major_c", "operator": "Contains", "values": [query]}],
              operator: ""
            }
          ]
        }]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data.map(student => ({
        Id: student.Id,
        name: student.name_c || '',
        email: student.email_c || '',
        major: student.major_c || '',
        year: student.year_c || '',
gpa: student.gpa_c || 0.0,
        phone: student.phone_c || '',
        enrollmentDate: student.enrollment_date_c || '',
        chemistry_marks_c: student.chemistry_marks_c || 0.0
      }));
    } catch (error) {
      console.error("Error searching students:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getStats() {
    try {
      const students = await this.getAll();
      
      const stats = {
        total: students.length,
        byMajor: {},
        byYear: {},
        averageGpa: 0
      };

      let totalGpa = 0;
      let gpaCount = 0;

      students.forEach(student => {
        // Count by major
        stats.byMajor[student.major] = (stats.byMajor[student.major] || 0) + 1;
        
        // Count by year
        stats.byYear[student.year] = (stats.byYear[student.year] || 0) + 1;
        
        // Calculate average GPA
        if (student.gpa > 0) {
          totalGpa += student.gpa;
          gpaCount++;
        }
      });

      stats.averageGpa = gpaCount > 0 ? totalGpa / gpaCount : 0;

      return stats;
    } catch (error) {
      console.error("Error calculating student stats:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

// Export singleton instance
export const studentsService = new StudentsService();