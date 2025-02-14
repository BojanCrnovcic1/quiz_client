import React, { useState } from 'react';
import './addCountryModal.scss';
import { Country } from '../types/Country';
import axios from 'axios';
import { ApiConfig } from '../config/ApiConfig';


interface AddCountryProps {
    show: boolean;
    handleClose: () => void;
}

const AddCountryModal: React.FC<AddCountryProps> = ({show, handleClose}) => {
    const [country, setCountry] = useState<Omit<Country, "countryId">>({
        name: "",
        continent: "Afrika",
        capital: "",
        population: 0,
        flagUrl: "",
    });
    const [flagFile, setFlagFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCountry({ ...country, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFlagFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("name", country.name ?? "");
        formData.append("continent", country.continent ?? "Afrika");
        formData.append("capital", country.capital ?? "");
        formData.append("population", String(country.population ?? 0));
    
        if (flagFile) {
            formData.append("flag", flagFile);
        }
    
        try {
            const response = await axios.post(ApiConfig.API_URL + "api/country/addCountry", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            setCountry(response.data);
            console.log('set country: ',response.data);
    
            alert("Država uspešno dodata!");
            handleClose();
        } catch (error) {
            console.error("Greška:", error);
            alert("Došlo je do greške pri dodavanju države.");
        }
    };
    
  return (
    <div className={`add-modal ${show ? 'show' : 'hide'}`}>
        <div className='add-modal-content'>
            <span className='close' onClick={handleClose}>X</span>
            <h2>Dodaj novu državu</h2>
            <div className='add-content'>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='name'>Naziv: </label>
                    <input type='text' name='name' value={country.name} onChange={handleChange} />

                    <label htmlFor='continent'>Kontinent: </label>
                    <select name='continent' value={country.continent} onChange={handleChange}>
                        <option value="Afrika">Afrika</option>
                        <option value="Azija">Azija</option>
                        <option value="Evropa">Evropa</option>
                        <option value="Sjeverna Amerika">Sjeverna Amerika</option>
                        <option value="Južna Amerika">Južna Amerika</option>
                        <option value="Okeanija">Okeanija</option>
                    </select>

                    <label htmlFor='capital'>Glavni grad: </label>
                    <input type='text' name='capital' value={country.capital} onChange={handleChange} />

                    <label htmlFor='population'>Populacija: </label>
                    <input type='number' name='population' value={country.population} onChange={handleChange} />

                    <label htmlFor="flagUrl">Zastava: </label>
                    <input type="file" name='flagUrl' accept="image/*" onChange={handleFileChange} required />

                    <button type="submit">Dodaj</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default AddCountryModal;