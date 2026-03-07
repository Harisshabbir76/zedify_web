import React from 'react';
import { Modal, Button } from 'react-bootstrap';

// Logo pink color palette
const logoColors = {
  primary: '#FF69B4', // Hot pink - main logo color
  secondary: '#FF1493', // Deep pink - darker shade
  light: '#FFB6C1', // Light pink - for accents
  dark: '#C71585', // Medium violet red - very dark pink
  background: '#FFF5F7', // Super light pink - almost white
  gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)', // Pink gradient from logo
  softGradient: 'linear-gradient(135deg, #FFF0F3 0%, #FFE4E8 100%)', // Very soft pink gradient
};

const DeleteConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  productName
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      style={{
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <Modal.Header
        closeButton
        style={{
          background: logoColors.softGradient,
          borderBottom: `1px solid ${logoColors.light}`,
          padding: '1rem 1.5rem'
        }}
      >
        <Modal.Title style={{ color: logoColors.dark, fontWeight: '600' }}>
          Confirm Deletion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: '2rem 1.5rem', background: 'white' }}>
        <p style={{ color: '#4A5568', fontSize: '1rem', marginBottom: 0 }}>
          Are you sure you want to delete <strong style={{ color: logoColors.primary }}>{productName}</strong>?
          This action cannot be undone.
        </p>
      </Modal.Body>
      <Modal.Footer style={{
        borderTop: `1px solid ${logoColors.light}`,
        padding: '1rem 1.5rem',
        background: logoColors.lighterBg
      }}>
        <Button
          variant="secondary"
          onClick={onHide}
          style={{
            border: `1px solid ${logoColors.light}`,
            color: '#4A5568',
            background: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '6px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = logoColors.softGradient;
            e.target.style.borderColor = logoColors.primary;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white';
            e.target.style.borderColor = logoColors.light;
          }}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          style={{
            background: '#dc3545',
            border: 'none',
            padding: '0.5rem 1.5rem',
            borderRadius: '6px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.9';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 8px rgba(220,53,69,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;