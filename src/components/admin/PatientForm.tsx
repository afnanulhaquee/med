import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';
import { useApp } from '../../contexts/AppContext';

interface PatientFormProps {
  patient?: Patient;
  onSubmit?: () => void;
}

export default function PatientForm({ patient, onSubmit }: PatientFormProps) {
  const navigate = useNavigate();
  const { addPatient, updatePatient } = useApp();
  
  const [form, setForm] = useState({
    name: patient?.name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear the error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validate = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
    };
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      if (patient) {
        updatePatient(patient.id, form);
      } else {
        addPatient(form);
      }
      
      if (onSubmit) {
        onSubmit();
      } else {
        navigate('/patients');
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="John Doe"
        required
      />
      
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="john@example.com"
        required
      />
      
      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="(123) 456-7890"
        required
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onSubmit) {
              onSubmit();
            } else {
              navigate('/patients');
            }
          }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {patient ? 'Update Patient' : 'Add Patient'}
        </Button>
      </div>
    </form>
  );
}