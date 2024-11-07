import React, { useState, useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLaboratory, addLaboratory } from '../../redux/reducer';
import { useParams, useNavigate } from 'react-router-dom';
import './LaboratoryDetails.css';

interface FuelOilParameters {
  viscosity: string;
  sulfurContent: string;
  waterContent: string;
  flashPoint: string;
}

interface FormData {
  name: string;
  city: string;
  cluster: string;
  availableEquipment: string[];
  fuelOilParameters: FuelOilParameters;
  status: string;
}

interface Errors {
  [key: string]: string;
}

const LaboratoryDetails: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const laboratories = useSelector((state: any) => state.data);

  const lab = laboratories.find((lab: { id: number }) => lab.id === parseInt(id!));

  const [formData, setFormData] = useState<FormData>({
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

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (lab) {
      setIsEditMode(true);
      setFormData(lab);
    } else {
      setIsEditMode(false);
    }
  }, [lab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name in formData.fuelOilParameters) {
      setFormData(prevData => ({
        ...prevData,
        fuelOilParameters: {
          ...prevData.fuelOilParameters,
          [name]: value
        }
      }));
    } else if (name.startsWith('equipment-')) {
      const index = parseInt(name.split('-')[1]);
      const updatedEquipment = [...formData.availableEquipment];
      updatedEquipment[index] = value;
      setFormData(prevData => ({
        ...prevData,
        availableEquipment: updatedEquipment
      }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleAddEquipment = () => {
    setFormData(prevData => ({
      ...prevData,
      availableEquipment: [...prevData.availableEquipment, '']
    }));
  };

  const handleRemoveEquipment = (index: number) => {
    const updatedEquipment = formData.availableEquipment.filter((_, i) => i !== index);
    setFormData(prevData => ({
      ...prevData,
      availableEquipment: updatedEquipment
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    const { viscosity, sulfurContent, waterContent, flashPoint } = formData.fuelOilParameters;

    const requiredFields = ['name', 'city', 'cluster'];
    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    });

    if (formData.availableEquipment.every(equip => equip.trim() === '')) {
      newErrors.availableEquipment = 'All equipment fields are required';
    }

    const decimalWithPercentOrCelsius = /^\d+(\.\d+)?(%|°C)?$/;

    if (!viscosity) {
      newErrors.viscosity = 'Viscosity is required.';
    } else if (isNaN(Number(viscosity)) || Number(viscosity) <= 0) {
      newErrors.viscosity = 'Viscosity must be a positive number.';
    }

    if (!sulfurContent) {
      newErrors.sulfurContent = 'Sulfur content is required.';
    } else if (!decimalWithPercentOrCelsius.test(sulfurContent) || parseFloat(sulfurContent) < 0 || parseFloat(sulfurContent) > 5) {
      newErrors.sulfurContent = 'Sulfur content must be between 0 and 5, and can include %.';
    }

    if (!waterContent) {
      newErrors.waterContent = 'Water content is required.';
    } else if (!decimalWithPercentOrCelsius.test(waterContent) || parseFloat(waterContent) < 0 || parseFloat(waterContent) > 100) {
      newErrors.waterContent = 'Water content must be between 0 and 100, and can include %.';
    }

    if (!flashPoint) {
      newErrors.flashPoint = 'Flash point is required.';
    } else if (!decimalWithPercentOrCelsius.test(flashPoint) || parseFloat(flashPoint) <= 0) {
      newErrors.flashPoint = 'Flash point must be a positive number and can include °C.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const filteredEquipment = formData.availableEquipment.filter(equip => equip.trim() !== '');

    const updatedFormData = {
      ...formData,
      availableEquipment: filteredEquipment
    };

    if (isEditMode) {
      dispatch(updateLaboratory({ id: lab!.id, updatedData: updatedFormData }));
    } else {
      const maxId = laboratories.reduce((max: number, lab: { id: number }) => (lab.id > max ? lab.id : max), 0);
      const newLab = { id: maxId + 1, ...formData };
      dispatch(addLaboratory(newLab));
    }
    navigate('/');
  };

  return (
    <div className="laboratory-list-container">
      <h2 className='page-title'>{isEditMode ? `Edit Laboratory - ${formData.name}` : 'Add Laboratory'}</h2>

      <div className='container'>
        <button onClick={() => navigate('/')}>Back</button>
        <form onSubmit={handleSubmit}>
          <div className="flex-row">
            <div className="form-group">
              <label htmlFor="name">Laboratory Name<span className="required-symbol">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Laboratory Name"
                aria-required="true"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="city">City<span className="required-symbol">*</span></label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                aria-required="true"
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>
          </div>
          <div className="flex-row">
            <div className="form-group">
              <label htmlFor="cluster">Cluster<span className="required-symbol">*</span></label>
              <input
                type="text"
                id="cluster"
                name="cluster"
                value={formData.cluster}
                onChange={handleChange}
                placeholder="Cluster"
                aria-required="true"
              />
              {errors.cluster && <span className="error">{errors.cluster}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="equipment">Available Equipment<span className="required-symbol">*</span></label>
              {formData.availableEquipment.map((equipment, index) => (
                <div key={index} className="equipment-container">
                  <input
                    type="text"
                    id="equipment"
                    name={`equipment-${index}`}
                    value={equipment}
                    onChange={handleChange}
                    placeholder="Equipment"
                  />
                  {index === formData.availableEquipment.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleAddEquipment}
                      className="icon-button"
                    >
                      +
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemoveEquipment(index)}
                      className="icon-button"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              {errors.availableEquipment && <span className="error">{errors.availableEquipment}</span>}
            </div>
          </div>
          <h3>Fuel Oil Testing Parameters</h3>
          <div className="flex-row">
            <div className="form-group">
              <label htmlFor="viscosity">Viscosity<span className="required-symbol">*</span></label>
              <input
                type="text"
                id="viscosity"
                name="viscosity"
                value={formData.fuelOilParameters.viscosity}
                onChange={handleChange}
                placeholder="Viscosity"
                aria-required="true"
              />
              {errors.viscosity && <span className="error">{errors.viscosity}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="sulfurContent">Sulfur Content<span className="required-symbol">*</span></label>
              <input
                type="text"
                id="sulfurContent"
                name="sulfurContent"
                value={formData.fuelOilParameters.sulfurContent}
                onChange={handleChange}
                placeholder="Sulfur Content"
              />
              {errors.sulfurContent && <span className="error">{errors.sulfurContent}</span>}
            </div>
          </div>
          <div className="flex-row">
            <div className="form-group">
              <label htmlFor="waterContent">Water Content<span className="required-symbol">*</span></label>
              <input
                type="text"
                id="waterContent"
                name="waterContent"
                value={formData.fuelOilParameters.waterContent}
                onChange={handleChange}
                placeholder="Water Content"
              />
              {errors.waterContent && <span className="error">{errors.waterContent}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="flashPoint">Flash Point<span className="required-symbol">*</span></label>
              <input
                type="text"
                id="flashPoint"
                name="flashPoint"
                value={formData.fuelOilParameters.flashPoint}
                onChange={handleChange}
                placeholder="Flash Point"
              />
              {errors.flashPoint && <span className="error">{errors.flashPoint}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status<span className="required-symbol">*</span></label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Live">Live</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          <div className="button-group">
            <button className='saveButton' type="submit">{isEditMode ? 'Update Laboratory' : 'Add Laboratory'}</button>
            <button className="cancelButton" type="button" onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaboratoryDetails;