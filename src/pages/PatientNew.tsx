import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/common/Layout';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import PatientForm from '../components/admin/PatientForm';

export default function PatientNew() {
  return (
    <Layout>
      <div className="mb-6">
        <Link to="/patients" className="inline-flex items-center text-sky-600 hover:text-sky-700">
          <ArrowLeft size={16} className="mr-1" />
          Back to Patients
        </Link>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
        <p className="text-gray-600">
          Create a new patient profile by filling out the form below.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Patient Information</h2>
        </CardHeader>
        <CardBody>
          <PatientForm />
        </CardBody>
      </Card>
    </Layout>
  );
}