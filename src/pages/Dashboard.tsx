import React from 'react';
import { Users, FileText, FileCheck, FilePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card, { CardBody } from '../components/common/Card';
import Layout from '../components/common/Layout';
import { useApp } from '../contexts/AppContext';

export default function Dashboard() {
  const { patients, documents } = useApp();

  const signedDocumentsCount = documents.filter(doc => doc.signed).length;
  const unsignedDocumentsCount = documents.length - signedDocumentsCount;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to DocSign</h1>
        <p className="text-gray-600">
          Manage your patients and their documents from one central dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-sky-100 text-sky-600 mr-4">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-semibold text-gray-900">{patients.length}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/patients"
                className="text-sm font-medium text-sky-600 hover:text-sky-700"
              >
                View all patients →
              </Link>
            </div>
          </CardBody>
        </Card>

        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
                <FileCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Signed Documents</p>
                <p className="text-2xl font-semibold text-gray-900">{signedDocumentsCount}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/documents"
                className="text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                View all documents →
              </Link>
            </div>
          </CardBody>
        </Card>

        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Signatures</p>
                <p className="text-2xl font-semibold text-gray-900">{unsignedDocumentsCount}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/documents"
                className="text-sm font-medium text-sky-600 hover:text-sky-700"
              >
                View pending documents →
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
            <Link
              to="/patients/new"
              className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              <Users size={16} className="mr-1" />
              Add New Patient
            </Link>
          </div>
          
          <Card>
            <div className="divide-y divide-gray-200">
              {patients.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No patients added yet
                </div>
              ) : (
                patients
                  .slice(0, 5)
                  .map(patient => (
                    <div key={patient.id} className="p-4 hover:bg-gray-50">
                      <Link to={`/patients/${patient.id}`} className="block">
                        <h3 className="text-sm font-medium text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                      </Link>
                    </div>
                  ))
              )}
            </div>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
            <Link
              to="/documents/new"
              className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              <FilePlus size={16} className="mr-1" />
              Create New Document
            </Link>
          </div>
          
          <Card>
            <div className="divide-y divide-gray-200">
              {documents.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No documents added yet
                </div>
              ) : (
                documents
                  .slice(0, 5)
                  .map(document => {
                    const patient = patients.find(p => p.id === document.patientId);
                    
                    return (
                      <div key={document.id} className="p-4 hover:bg-gray-50">
                        <Link to={`/documents/${document.id}`} className="block">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{document.title}</h3>
                            {document.signed ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Signed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {patient ? patient.name : 'Unknown Patient'}
                          </p>
                        </Link>
                      </div>
                    );
                  })
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}