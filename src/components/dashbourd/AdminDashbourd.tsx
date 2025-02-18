import React, { useEffect, useState } from "react";
import "./adminDashbourd.scss";
import axios from "axios";
import { Country } from "../../types/Country";
import { ApiConfig } from "../../config/ApiConfig";
import { useAuth } from "../../context/AuthContext";
import AddCountryModal from "../../modals/AddCountryModal";
import EditCountryModal from "../../modals/EditCountryModal";
import DeleteCountryModal from "../../modals/DeleteCountryModal";

const AdminDashboard: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [showAddCountryModal, setShowAddCountryModal] = useState<boolean>(false);
  const [showEditCountryModal, setShowEditCountryModal] = useState<boolean>(false);
  const [showDeleteCountryModal, setShowDeleteCountryModal] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "continent"| "population">("name");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const { logout } = useAuth();

  useEffect(() => {
    fetchCountries();
  }, [countries, page, search, sortBy, sortOrder]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(ApiConfig.API_URL + "api/country/filter-country", {
        params: { page, size, search, sortBy, sortOrder }
      });
      setCountries(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching countries", error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleAddCountryModal = () => {
    setShowAddCountryModal(false);
  };

  const handleOpenEditModal = (country: Country) => {
    setSelectedCountry(country);
    setShowEditCountryModal(true);
  };
  
  const handleCloseEditModal = () => {
    setShowEditCountryModal(false);
    setSelectedCountry(null);
  };

  const handleOpenDeleteModal = (country: Country) => {
    setSelectedCountry(country);
    setShowDeleteCountryModal(true);
  };
  
  const handleCloseDeleteModal = () => {
    setShowDeleteCountryModal(false);
    setSelectedCountry(null);
  };
  


  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <button className="add-button" onClick={() => setShowAddCountryModal(true)}>Add Country</button>
        {showAddCountryModal && (
          <AddCountryModal show={showAddCountryModal} handleClose={handleAddCountryModal}/>
        )}
        <input 
          type="text" 
          placeholder="Search..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <select onChange={(e) => setSortBy(e.target.value as "name" | "continent" | "population")} value={sortBy}>
          <option value="name">Name</option>
          <option value="continent">Continent</option>
          <option value="population">Population</option>
        </select>
        <select onChange={(e) => setSortOrder(e.target.value as "ASC" | "DESC")} value={sortOrder}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
        <button className="logout" onClick={handleLogout}>Odjava</button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Continent</th>
            <th>Capital</th>
            <th>Population</th>
            <th>Flag</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.countryId}>
              <td>{country.name}</td>
              <td>{country.continent}</td>
              <td>{country.capital}</td>
              <td>{country.population}</td>
              <td>
                {country.flagUrl && <img src={country.flagUrl} alt={country.name} width={30} />}
              </td>
              <td>
                <button className="edit-button"onClick={() => handleOpenEditModal(country)}>Edit</button>
                {showEditCountryModal && selectedCountry && (
                  <EditCountryModal show={showEditCountryModal} countryId={selectedCountry.countryId || 0} handleClose={handleCloseEditModal} />
                )}
                <button className="delete-button" onClick={() => handleOpenDeleteModal(country)}>Delete</button>
                {showDeleteCountryModal && selectedCountry && (
                  <DeleteCountryModal show={showDeleteCountryModal} countryId={selectedCountry.countryId || 0} handleClose={handleCloseDeleteModal} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span>Page {page} of {Math.ceil(total / size)}</span>
        <button onClick={() => setPage(page + 1)} disabled={page * size >= total}>Next</button>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
