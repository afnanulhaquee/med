import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, FileText } from 'lucide-react';
import Layout from '../components/common/Layout';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import PatientForm from '../components/admin/PatientForm';
import { useApp } from '../contexts/AppContext';

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, documents, deletePatient } = useApp();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const patient = patients.find(p => p.id === id);
  const patientDocuments = documents.filter(doc => doc.patientId === id);
  
  if (!patient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Not Found</h2>
          <p className="mb-6 text-gray-600">The patient you're looking for does not exist.</p>
          <Link to="/patients">
            <Button variant="primary">Back to Patients</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  const handleDelete = () => {
    deletePatient(patient.id);
    navigate('/patients');
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <Link to="/patients" className="inline-flex items-center text-sky-600 hover:text-sky-700">
          <ArrowLeft size={16} className="mr-1" />
          Back to Patients
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{patient.name}</h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setModalOpen(true)}
            className="flex items-center"
          >
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Patient Information</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </h3>
                <p className="mt-1 text-gray-900">{patient.name}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </h3>
                <p className="mt-1 text-gray-900">{patient.email}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </h3>
                <p className="mt-1 text-gray-900">{patient.phone}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added On
                </h3>
                <p className="mt-1 text-gray-900">
                  {new Date(patient.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Documents</h2>
              <Link to={`/documents/new?patientId=${patient.id}`}>
                <Button variant="primary" size="sm" className="flex items-center">
                  <FileText size={16} className="mr-1" />
                  Create Document
                </Button>
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              {patientDocuments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p className="mb-4">No documents created for this patient yet.</p>
                  <Link to={`/documents/new?patientId=${patient.id}`}>
                    <Button variant="outline" className="flex items-center mx-auto">
                      <FileText size={16} className="mr-2" />
                      Create First Document
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {patientDocuments.map(doc => (
                    <div key={doc.id} className="p-4 hover:bg-gray-50">
                      <Link
                        to={`/documents/${doc.id}`}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{doc.title}</h3>
                          <p className="text-sm text-gray-500">
                            Created on {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {doc.signed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Signed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Pending Signature
                          </span>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
      
      {/* Edit Patient Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Patient"
      >
        <PatientForm
          patient={patient}
          onSubmit={() => setModalOpen(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete patient <span className="font-semibold">{patient.name}</span>?
          </p>
          <p className="text-sm text-red-600 mt-2">
            This will also delete all associated documents and cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}