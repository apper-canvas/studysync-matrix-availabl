import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import FilterBar from '@/components/molecules/FilterBar';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { teachersService } from '@/services/api/teachersService';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name_c: '',
    email_c: '',
    department_c: '',
    hire_date_c: ''
  });

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' },
    { value: 'Economics', label: 'Economics' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Engineering', label: 'Engineering' }
  ];

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teachersService.getAll();
      setTeachers(data);
    } catch (err) {
setError(err?.response?.data?.message || err.message || 'Failed to load teachers');
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = (teacher.name_c?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                         (teacher.email_c?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                         (teacher.department_c?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || teacher.department_c === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await teachersService.update(editingTeacher.Id, formData);
        setTeachers(prev => prev.map(teacher => 
          teacher.Id === editingTeacher.Id 
            ? { ...teacher, ...formData }
            : teacher
        ));
        toast.success('Teacher updated successfully');
        setIsEditModalOpen(false);
      } else {
        const newTeacher = await teachersService.create(formData);
        setTeachers(prev => [...prev, newTeacher]);
        toast.success('Teacher added successfully');
        setIsAddModalOpen(false);
      }
      resetForm();
} catch (err) {
      console.error('Teacher form submission error:', err?.response?.data?.message || err.message);
      toast.error(editingTeacher ? 'Failed to update teacher' : 'Failed to add teacher');
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name_c: teacher.name_c ?? '',
      email_c: teacher.email_c ?? '',
      department_c: teacher.department_c ?? '',
      hire_date_c: teacher.hire_date_c ?? ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (teacher) => {
    if (window.confirm(`Are you sure you want to delete ${teacher.name_c ?? 'this teacher'}?`)) {
      try {
        await teachersService.delete(teacher.Id);
        setTeachers(prev => prev.filter(t => t.Id !== teacher.Id));
        toast.success('Teacher deleted successfully');
} catch (err) {
        console.error('Teacher deletion error:', err?.response?.data?.message || err.message);
        toast.error('Failed to delete teacher');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name_c: '',
      email_c: '',
      department_c: '',
      hire_date_c: ''
    });
    setEditingTeacher(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const formatHireDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTeachers} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-1">Manage teacher information and records</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Add Teacher
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search teachers..."
          className="md:col-span-1"
        />
        <Select
          value={selectedDepartment}
          onChange={(value) => setSelectedDepartment(value)}
          options={departmentOptions}
          placeholder="Filter by Department"
        />
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <Empty 
          title="No teachers found" 
          description="No teachers match your current search criteria."
          action={
            <Button onClick={openAddModal} variant="outline">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add First Teacher
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <motion.div
              key={teacher.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="GraduationCap" size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{teacher.name_c ?? ''}</h3>
                      <p className="text-sm text-gray-600">{teacher.email_c ?? ''}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(teacher)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(teacher)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Department:</span>
                    <Badge variant="secondary">{teacher.department_c ?? ''}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hire Date:</span>
                    <span className="text-sm font-medium">{formatHireDate(teacher.hire_date_c)}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Teacher"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Full Name" required>
            <Input
              name="name_c"
              value={formData.name_c}
              onChange={handleInputChange}
              placeholder="Enter teacher's full name"
              required
            />
          </FormField>

          <FormField label="Email Address" required>
            <Input
              name="email_c"
              type="email"
              value={formData.email_c}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
          </FormField>

          <FormField label="Department" required>
            <Select
              name="department_c"
              value={formData.department_c}
              onChange={(e) => setFormData(prev => ({ ...prev, department_c: e.target.value }))}
              options={departmentOptions.slice(1)}
              placeholder="Select department"
              required
            />
          </FormField>

          <FormField label="Hire Date">
            <Input
              name="hire_date_c"
              type="date"
              value={formData.hire_date_c}
              onChange={handleInputChange}
            />
          </FormField>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Teacher
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Teacher Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Teacher"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Full Name" required>
            <Input
              name="name_c"
              value={formData.name_c}
              onChange={handleInputChange}
              placeholder="Enter teacher's full name"
              required
            />
          </FormField>

          <FormField label="Email Address" required>
            <Input
              name="email_c"
              type="email"
              value={formData.email_c}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
          </FormField>

          <FormField label="Department" required>
            <Select
              name="department_c"
              value={formData.department_c}
              onChange={(e) => setFormData(prev => ({ ...prev, department_c: e.target.value }))}
              options={departmentOptions.slice(1)}
              placeholder="Select department"
              required
            />
          </FormField>

          <FormField label="Hire Date">
            <Input
              name="hire_date_c"
              type="date"
              value={formData.hire_date_c}
              onChange={handleInputChange}
            />
          </FormField>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Teacher
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Teachers;