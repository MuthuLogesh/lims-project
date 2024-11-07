import React, { useState, useEffect } from 'react';
import './LaboratoryFilter.css';

interface LaboratoryFilterProps {
    onFilterChange: (filters: {
        searchTerm: string;
        cityFilter: string;
        clusterFilter: string;
        statusFilter: string;
    }) => void;

    cities: string[];
    cluster: string[];
    status: string[];
}

const LaboratoryFilter: React.FC<LaboratoryFilterProps> = ({
    onFilterChange,
    cities,
    cluster,
    status
}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [cityFilter, setCityFilter] = useState<string>('');
    const [clusterFilter, setClusterFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    useEffect(() => {
        onFilterChange({ searchTerm, cityFilter, clusterFilter, statusFilter });
    }, [searchTerm, cityFilter, clusterFilter, statusFilter, onFilterChange]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCityFilter(e.target.value);
    };

    const handleClusterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setClusterFilter(e.target.value);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    return (
        <div className="filter-container">
            <div className="search-input-container">

                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />

            </div>
            <select value={cityFilter} onChange={handleCityChange}>
                <option value="">All Cities</option>
                {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                ))}
            </select>
            <select value={clusterFilter} onChange={handleClusterChange}>
                <option value="">Cluster</option>
                {cluster.map((cluster, index) => (
                    <option key={index} value={cluster}>{cluster}</option>
                ))}
            </select>
            <select value={statusFilter} onChange={handleStatusChange}>
                <option value="">All Status</option>
                {status.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                ))}
            </select>
        </div>
    );
};

export default LaboratoryFilter;
