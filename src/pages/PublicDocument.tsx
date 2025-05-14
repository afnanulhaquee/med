import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Card, { CardHeader, CardBody, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import SignatureCanvas from '../components/common/SignatureCanvas';
import { useApp } from '../contexts/AppContext';

export default function PublicDocument() {
  const { id } = useParams<{ id: string }>();
  const { documents, patients, signDocument } = useApp();
  const [showSignature, setShowSignature] = useState(false);
  
  const document = documents.find(d => d.id === id);
  const patient = document ? patients.find(p => p.id === document.patientId) : null;
  
  if (!document || !patient) {
    return <Navigate to="/login" replace />;
  }
  
  if (document.signed) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <FileText className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Document Already Signed
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This document has already been signed and cannot be modified.
          </p>
        </div>
      </div>
    );
  }
  
  const handleSignatureSave = (signature: string) => {
    signDocument(document.id, signature);
    setShowSignature(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <FileText className="h-12 w-12 text-sky-600 mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {document.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            For: {patient.name}
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Document Content</h3>
          </CardHeader>
          <CardBody>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{document.content}</p>
            </div>
          </CardBody>
          <CardFooter>
            {!showSignature && (
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setShowSignature(true)}
              >
                Sign Document
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {showSignature && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Sign Document</h3>
            </CardHeader>
            <CardBody>
              <p className="mb-4 text-sm text-gray-600">
                Please sign in the box below to complete this document.
              </p>
              <SignatureCanvas onSave={handleSignatureSave} />
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}