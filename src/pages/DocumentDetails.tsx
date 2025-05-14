import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Download, User, Calendar, FileText, Share2 } from 'lucide-react';
import Layout from '../components/common/Layout';
import Card, { CardHeader, CardBody, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import DocumentForm from '../components/admin/DocumentForm';
import SignatureCanvas from '../components/common/SignatureCanvas';
import { useApp } from '../contexts/AppContext';

export default function DocumentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documents, patients, deleteDocument, signDocument } = useApp();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const document = documents.find(d => d.id === id);
  const patient = document ? patients.find(p => p.id === document.patientId) : null;
  
  if (!document || !patient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Document Not Found</h2>
          <p className="mb-6 text-gray-600">The document you're looking for does not exist.</p>
          <Link to="/documents">
            <Button variant="primary">Back to Documents</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  const handleDelete = () => {
    deleteDocument(document.id);
    navigate('/documents');
  };
  
  const handleSignatureSave = (signature: string) => {
    signDocument(document.id, signature);
    setSignModalOpen(false);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const getSigningLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/documents/${document.id}/sign`;
  };
  
  const copySigningLink = async () => {
    const link = getSigningLink();
    await navigator.clipboard.writeText(link);
  };
  
  const downloadDocument = () => {
    const documentContent = `
      ${document.title}
      
      ${document.content}
      
      Patient: ${patient.name}
      Date: ${formatDate(document.createdAt)}
      ${document.signed ? 'SIGNED' : 'UNSIGNED'}
    `;
    
    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <Link to="/documents" className="inline-flex items-center text-sky-600 hover:text-sky-700">
          <ArrowLeft size={16} className="mr-1" />
          Back to Documents
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{document.title}</h1>
        <div className="flex space-x-3">
          {!document.signed && (
            <Button
              variant="secondary"
              onClick={() => setShowShareModal(true)}
              className="flex items-center"
            >
              <Share2 size={16} className="mr-2" />
              Share for Signing
            </Button>
          )}
          <Button
            variant="outline"
            onClick={downloadDocument}
            className="flex items-center"
          >
            <Download size={16} className="mr-2" />
            Download
          </Button>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Document Content</h2>
            </CardHeader>
            <CardBody>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{document.content}</p>
              </div>
            </CardBody>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-1" />
                Last updated: {formatDate(document.updatedAt)}
              </div>
              {document.signed ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Signed
                </span>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSignModalOpen(true)}
                  className="flex items-center"
                >
                  Sign Document
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {document.signed && document.signature && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Signature</h2>
              </CardHeader>
              <CardBody>
                <SignatureCanvas 
                  onSave={() => {}} 
                  initialSignature={document.signature} 
                  readOnly={true} 
                />
              </CardBody>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Details</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    <User size={14} className="mr-1" />
                    Patient
                  </div>
                  <Link to={`/patients/${patient.id}`} className="text-sky-600 hover:text-sky-900">
                    {patient.name}
                  </Link>
                </div>
                <div>
                  <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    <Calendar size={14} className="mr-1" />
                    Created On
                  </div>
                  <p className="text-gray-900">{formatDate(document.createdAt)}</p>
                </div>
                <div>
                  <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    <FileText size={14} className="mr-1" />
                    Status
                  </div>
                  {document.signed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Signed on {formatDate(document.updatedAt)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Pending Signature
                    </span>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      
      {/* Edit Document Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Document"
      >
        <DocumentForm
          document={document}
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
            Are you sure you want to delete document <span className="font-semibold">{document.title}</span>?
          </p>
          <p className="text-sm text-red-600 mt-2">
            This action cannot be undone.
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
      
      {/* Sign Document Modal */}
      <Modal
        isOpen={signModalOpen}
        onClose={() => setSignModalOpen(false)}
        title="Sign Document"
      >
        <div className="mb-4">
          <p className="text-gray-700 mb-4">
            Please sign below to complete this document.
          </p>
          <SignatureCanvas onSave={handleSignatureSave} />
        </div>
      </Modal>
      
      {/* Share Document Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Document for Signing"
      >
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Share this link with {patient.name} to allow them to sign the document:
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={getSigningLink()}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            />
            <Button variant="outline" onClick={copySigningLink}>
              Copy
            </Button>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setShowShareModal(false)}>
            Done
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}