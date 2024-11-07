import React, { useEffect, useState, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateLaboratory } from '../../redux/reducer';
import EditableFuelOilParameters from '../EditableFuelParameter/EditableFuelParameter';
import LaboratoryFilter from '../LaboratoryFilter/LaboratoryFilter';
import './laboratoryTable.css';

interface Laboratory {
    id: number;
    name: string;
    city: string;
    cluster: string;
    availableEquipment: string[];
    fuelOilParameters: {
        viscosity: string;
        sulfurContent: string;
        waterContent: string;
        flashPoint: string;
    };
    status: string;
}

interface Filters {
    searchTerm: string;
    cityFilter: string;
    clusterFilter: string;
    statusFilter: string;
}

const LaboratoryTable: FC = () => {
    const dispatch = useDispatch();
    const laboratories: Laboratory[] = useSelector((state: any) => state.data);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [filters, setFilters] = useState<Filters>({ searchTerm: '', cityFilter: '', clusterFilter: '', statusFilter: '' });
    const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'id', direction: 'desc' });
    const [formData, setFormData] = useState<{
        name: string;
        city: string;
        cluster: string;
        availableEquipment: string[];
        fuelOilParameters: {
            viscosity: string;
            sulfurContent: string;
            waterContent: string;
            flashPoint: string;
        };
        status: string;
    }>({
        name: '',
        city: '',
        cluster: '',
        availableEquipment: [''],
        fuelOilParameters: {
            viscosity: '',
            sulfurContent: '',
            waterContent: '',
            flashPoint: ''
        },
        status: 'Live'
    });
    const itemsPerPage: number = 5;

    const cities: string[] = Array.from(new Set(laboratories.map(lab => lab.city))).filter(city => city);
    const cluster: string[] = Array.from(new Set(laboratories.map(lab => lab.cluster))).filter(cluster => cluster);
    const status: string[] = Array.from(new Set(laboratories.map(lab => lab.status))).filter(status => status);

    const filteredLabs: Laboratory[] = laboratories
    .filter(lab => {
        const matchesSearchTerm = lab.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
        const matchesCity = filters.cityFilter ? lab.city === filters.cityFilter : true;
        const matchesCluster = filters.clusterFilter ? lab.cluster === filters.clusterFilter : true;
        const matchesStatus = filters.statusFilter ? lab.status === filters.statusFilter : true;
        return matchesSearchTerm && matchesCity && matchesCluster && matchesStatus;
    })
    .sort((a, b) => {
        const fieldA = a[sortConfig.field as keyof Laboratory];
        const fieldB = b[sortConfig.field as keyof Laboratory];
        if (fieldA < fieldB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });


    const totalPages: number = Math.ceil(filteredLabs.length / itemsPerPage);
    const currentLabs: Laboratory[] = filteredLabs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (field: string): void => {
        const isAsc = sortConfig.field === field && sortConfig.direction === 'asc';
        setSortConfig({ field, direction: isAsc ? 'desc' : 'asc' });
        setCurrentPage(1);
    };

    const renderSortIndicator = (field: string): string => {
        if (sortConfig.field === field) {
            return sortConfig.direction === 'asc' ? '▲' : '▼';
        }
        return '⇅';
    };

    const handleEdit = (lab: Laboratory): void => {
        setEditingId(lab.id);
        setFormData({
            name: lab.name,
            city: lab.city,
            cluster: lab.cluster,
            availableEquipment: lab.availableEquipment || [''],
            fuelOilParameters: lab.fuelOilParameters,
            status: lab.status
        });
    };

    const handleSaveEdit = (id: number, updatedParameter: any): void => {
        setFormData(prevData => ({
            ...prevData,
            fuelOilParameters: {
                ...prevData.fuelOilParameters,
                ...updatedParameter
            }
        }));
    };

    const handleSave = (id: number): void => {
        dispatch(updateLaboratory({ id, updatedData: formData }));
        setEditingId(null);
    };

    // Close Editable Fuel Oil Parameter input on filter change
    useEffect(() => {
        setEditingId(null); // Close the input when filters change
        setCurrentPage(1);
    }, [filters]);

    return (
        <div className='LaboratoryTable-container'>
            <LaboratoryFilter
                onFilterChange={setFilters}
                cities={cities}
                cluster={cluster}
                status={status}
            />

            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>
                            Laboratory Name {renderSortIndicator('name')}
                        </th>
                        <th onClick={() => handleSort('city')}>
                            City {renderSortIndicator('city')}
                        </th>
                        <th onClick={() => handleSort('cluster')}>
                            Cluster {renderSortIndicator('cluster')}
                        </th>
                        <th>Available Equipment</th>
                        <th>Fuel Oil Testing Parameters</th>
                        <th onClick={() => handleSort('status')}>
                            Status {renderSortIndicator('status')}
                        </th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentLabs.map((lab) => (
                        <tr key={lab.id}>
                            <td><Link to={`/laboratoryDetails/${lab.id}`}>{lab.name}</Link></td>
                            <td>{lab.city}</td>
                            <td>{lab.cluster}</td>
                            <td>{Array.isArray(lab.availableEquipment) ? lab.availableEquipment.join(', ') : lab.availableEquipment}</td>
                            <td>
                                <EditableFuelOilParameters
                                    fuelOilParameters={lab.fuelOilParameters}
                                    isEditing={editingId === lab.id}
                                    onEdit={() => handleEdit(lab)}
                                    onSave={(updatedParameter: any) => handleSaveEdit(lab.id, updatedParameter)}
                                />
                            </td>
                            <td>{lab.status}</td>
                            <td>
                                <button className={editingId === lab.id ? 'saveButton' : ''} onClick={() => editingId === lab.id ? handleSave(lab.id) : handleEdit(lab)}>
                                    {editingId === lab.id ? 'Save' : 'Edit'}
                                </button>
                                {editingId === lab.id && <button className='cancelButton' onClick={() => setEditingId(null)}>Cancel</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {totalPages > 1 &&
                <div className="pagination">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</button>
                    <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>Previous</button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                        const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                        const pageNumber = startPage + index;
                        return (
                            <button
                                key={pageNumber}
                                className={`button ${currentPage === pageNumber ? 'active' : ''}`}
                                onClick={() => setCurrentPage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
                </div>
            }
        </div>
    );
};

export default LaboratoryTable;
