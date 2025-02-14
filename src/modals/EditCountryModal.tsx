import React, { useEffect, useState } from 'react';
import './editCountryModal.scss';
import { Country } from '../types/Country';
import axios from 'axios';
import { ApiConfig } from '../config/ApiConfig';

interface EditCountryProps {
    show: boolean;
    countryId: number;
    handleClose: () => void;
}

const EditCountryModal: React.FC<EditCountryProps> = ({ show, countryId, handleClose}) => {
    const [country, setCountry] = useState<Omit<Country, "countryId">>({
        name: "",
        continent: "Afrika",
        capital: "",
        population: 0,
      });

      useEffect(() => {
       if (countryId) fetchCountry();
      }, [countryId])

      const fetchCountry = async () => {
        try {
            const res = await axios.get(ApiConfig.API_URL + `api/country/${countryId}`)
            setCountry(res.data);
        } catch (error) {
            console.error(error, 'Error to fetch country!');
        }
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCountry({ ...country, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!countryId) return;
    
        try {
            const response = await axios.patch(`${ApiConfig.API_URL}api/country/${countryId}/editCountry`, country, {
                headers: { "Content-Type": "application/json" }
            });
            alert("Država uspiješno ažurirana!");
            setCountry(response.data);
            handleClose();
        } catch (error) {
            console.error("Greška:", error);
            alert("Došlo je do greške pri ažuriranju države.");
        }
    };
        
      return (
        <div className={`edit-modal ${show ? "show" : "hide"}`}>
          <div className="edit-modal-content">
            <span className="close" onClick={handleClose}>X</span>
            <h2>Uredi državu</h2>
            <div className="edit-content">
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Naziv: </label>
                <input type="text" name="name" value={country.name} onChange={handleChange} />
    
                <label htmlFor="continent">Kontinent: </label>
                <select name="continent" value={country.continent} onChange={handleChange}>
                  <option value="Afrika">Afrika</option>
                  <option value="Azija">Azija</option>
                  <option value="Evropa">Evropa</option>
                  <option value="Sjeverna Amerika">Sjeverna Amerika</option>
                  <option value="Južna Amerika">Južna Amerika</option>
                  <option value="Okeanija">Okeanija</option>
                </select>
    
                <label htmlFor="capital">Glavni grad: </label>
                <input type="text" name="capital" value={country.capital} onChange={handleChange} />
    
                <label htmlFor="population">Populacija: </label>
                <input type="number" name="population" value={country.population} onChange={handleChange} />
    
                <button type="submit">Sačuvaj izmjene</button>
              </form>
            </div>
          </div>
        </div>
      );
}

export default EditCountryModal;