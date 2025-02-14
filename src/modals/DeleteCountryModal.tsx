import axios from 'axios';
import React from 'react';
import './deleteCountryModal.scss';
import { ApiConfig } from '../config/ApiConfig';

interface DeleteCountryProps {
    show: boolean;
    countryId: number | null;
    handleClose: () => void;
}

const DeleteCountryModal: React.FC<DeleteCountryProps> = ({ show, countryId, handleClose }) => {
    if (countryId === null ) return;

    const handleDeleteCountry = async () => {
        try {
            await axios.delete(ApiConfig.API_URL + `api/country/${countryId}/remove`)
            alert('Podaci o državi su uspiješno obrisani.')
            handleClose();
        } catch (error) {
            console.error("Error:", error);
            alert("Došlo je do greške pri brisanju države.");
        }
    }
  return (
    <div className={`delete-modal ${show ? 'show' : 'hide'}`}>
        <div className='delete-modal-content'>
            <span className='close' onClick={handleClose}>X</span>
            <h2>Izbriši državu</h2>
            <div className='delete-modal-card'>
                <p>Da li ste sigurni da želite da izbrišete ovu državu??</p>
                <div className='delete-modal-actions'>
                    <button type='button' onClick={handleDeleteCountry}>
                        Da
                    </button>
                    <button type='button' onClick={handleClose}>
                        Ne
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DeleteCountryModal;