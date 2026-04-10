import React from 'react';
import Modal from '@shared/components/UI/Modal/Modal';
import { Link } from 'lucide-react';
import './SubMicroConcept.css';

const SubMicroConcept = ({ concept, onClose }) => {
  if (!concept) return null;

  return (
    <Modal isOpen={true} onClose={null} showClose={false} maxWidth="940px">
      <div className="confirmation-container">
        <h2 className="confirmation-title">{concept.title}</h2>

        <div className="confirmation-content-body">
          <p className="confirmation-body-text">{concept.summary}</p>

          {concept.url && (
            <div className="confirmation-resource-link">
              <span className="resource-header">Learning Resource</span>
              <a
                href={concept.url}
                target="_blank"
                rel="noopener noreferrer"
                className="confirmation-link-item"
              >
                <Link className="link-icon-inline" />
                <span>Visit: {concept.url}</span>
              </a>
            </div>
          )}
        </div>

        <div className="confirmation-footer">
          <button
            className="btn-agree"
            onClick={onClose}
          >
            Mark as Read
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SubMicroConcept;
