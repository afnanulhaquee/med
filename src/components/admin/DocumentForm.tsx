import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, Patient } from '../../types';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { useApp } from '../../contexts/AppContext';

interface DocumentFormProps {
  document?: Document;
  onSubmit?: () => void;
}

export default function DocumentForm({ document, onSubmit }: DocumentFormProps) {
  const navigate = useNavigate();
  const { addDocument, updateDocument, patients } = useApp();
  
  const [form, setForm] = useState({
    title: document?.title || '',
    content: document?.content || '',
    patientId: document?.patientId || '',
  });
  
  const [errors, setErrors] = useState({
    title: '',
    content: '',
    patientId: '',
  });
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear the error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validate = () => {
    const newErrors = {
      title: '',
      content: '',
      patientId: '',
    };
    
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!form.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!form.patientId) {
      newErrors.patientId = 'Please select a patient';
    }
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      if (document) {
        updateDocument(document.id, form);
      } else {
        addDocument(form);
      }
      
      if (onSubmit) {
        onSubmit();
      } else {
        navigate('/documents');
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Document Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Medical Report"
        required
      />
      
      <TextArea
        label="Document Content"
        name="content"
        value={form.content}
        onChange={handleChange}
        error={errors.content}
        placeholder="Enter document content here..."
        required
        rows={8}
      />
      
      <div className="mb-4">
        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
          Assign to Patient
        </label>
        <select
          id="patientId"
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          className={`w-full rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm ${
            errors.patientId ? 'border-red-300' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select a patient</option>
          {patients.map((patient: Patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name} ({patient.email})
            </option>
          ))}
        </select>
        {errors.patientId && <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onSubmit) {
              onSubmit();
            } else {
              navigate('/documents');
            }
          }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {document ? 'Update Document' : 'Create Document'}
        </Button>
      </div>
    </form>
  );
}