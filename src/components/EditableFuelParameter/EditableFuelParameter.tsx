import React, { useState } from 'react';
import './EditableFuelOilParameters.css'; // Import the CSS file

// Define types for props
interface FuelOilParameters {
    viscosity: string;
    sulfurContent: string;
    waterContent: string;
    flashPoint: string;
}

interface EditableFuelOilParametersProps {
    fuelOilParameters: FuelOilParameters;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (updatedParameters: FuelOilParameters) => void;
}

const EditableFuelOilParameters: React.FC<EditableFuelOilParametersProps> = ({
    fuelOilParameters,
    isEditing,
    onEdit,
    onSave,
}) => {
    const [editedParameter, setEditedParameter] = useState<FuelOilParameters>(fuelOilParameters);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedParameters = { ...editedParameter, [name]: value } as FuelOilParameters;
        setEditedParameter(updatedParameters);
    };

    const handleBlur = (name: keyof FuelOilParameters) => {
        // Call onSave with updated parameters when input loses focus
        onSave({ ...editedParameter, [name]: editedParameter[name] });
        console.log({ ...editedParameter, [name]: editedParameter[name] });
    };

    return (
        <div className="editable-fuel-oil-parameters" onDoubleClick={onEdit}>
            {isEditing ? (
                <div>
                    {Object.keys(editedParameter).map((key) => (
                        <div className="parameter" key={key}>
                            <label>{key}: </label>
                            <input
                                type="text"
                                name={key}
                                value={(editedParameter as any)[key]} // Type assertion here
                                onChange={handleChange}
                                onBlur={() => handleBlur(key as keyof FuelOilParameters)} // Specify key type for handleBlur
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {Object.entries(fuelOilParameters).map(([key, value]) => (
                        <div className="readonly" key={key}>
                            <span>{key}:</span>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EditableFuelOilParameters;
