import React from 'react';

export const VarTimeEditFormComp = ({
    value,
    label,
    error,
    handleBlur,
    handleChange,
    name,
    ...props
}) => {
    return (
        <div>
            <h3>{label}</h3>

            <input
                type="date"
                name={`${name}.absoluteTime`}
                onChange={handleChange}
                value={value.absoluteTime}
                onBlur={handleBlur}
            />
            <br />

            <span>Offset Days</span>

            <input
                type="checkbox"
                name={`${name}.isVarDays`}
                onChange={handleChange}
                checked={value.isVarDays}
                onBlur={handleBlur}
            />

            <input
                type="number"
                name={`${name}.offsetDays`}
                onChange={handleChange}
                value={value.offsetDays}
                onBlur={handleBlur}
            />

            <span>Offset Months</span>

            <input
                type="checkbox"
                name={`${name}.isVarMonths`}
                onChange={handleChange}
                checked={value.isVarMonths}
                onBlur={handleBlur}
            />

            <input
                type="number"
                name={`${name}.offsetMonths`}
                onChange={handleChange}
                value={value.offsetMonths}
                onBlur={handleBlur}
            />

            <span>Offset Years</span>

            <input
                type="checkbox"
                name={`${name}.isVarYears`}
                onChange={handleChange}
                checked={value.isVarYears}
                onBlur={handleBlur}
            />

            <input
                type="number"
                name={`${name}.offsetYears`}
                onChange={handleChange}
                value={value.offsetYears}
                onBlur={handleBlur}
            />
        </div>
    );
}