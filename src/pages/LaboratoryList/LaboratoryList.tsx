import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import LaboratoryTable from '../../components/LaboratoryTable/LaboratoryTable';
import './LaboratoryList.css';

const LaboratoryList: FC = () => {
    const navigate: (path: string) => void = useNavigate();

    return (
        <div className="laboratory-list-container">
            <div className='header-content'>
            <h1 className="page-title">Laboratory List</h1>
            <button className="add-laboratory-btn" onClick={() => navigate('/createlaboratory')}>Add Laboratory</button>
            </div>
            <LaboratoryTable />
        </div>
    );
}

export default LaboratoryList;