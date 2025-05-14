import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/common/Layout';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import DocumentForm from '../components/admin/DocumentForm';

export default function DocumentNew() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  
  return (
    <Layout>
      <div className="mb-6">
        <Link to="/documents" className="inline-flex items-center text-sky-600 hover:text-sky-700">
          <ArrowLeft size={16} className="mr-1" />
          Back to Documents
        </Link>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Document</h1>
        <p className="text-gray-600">
          Create a new document and assign it to a patient.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Document Information</h2>
        </CardHeader>
        <CardBody>
          <DocumentForm 
            document={patientId ? { patientId, title: '', content: '' } as any : undefined}
          />
        </CardBody>
      </Card>
    </Layout>
  );
}