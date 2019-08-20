import React from 'react';
import DateTime from 'react-datetime';
import moment from 'moment';

export const VarTimeEditFormComp = ({
    values,
    name,
    touched,
    handleChange,
    handleBlur,
    errors,
    setFieldValue,
    setFieldTouched,
    ...props
}) => {
    const onAbsTimeChange = value => {
        if (value instanceof moment) {
            let dateObj = (moment(value).toDate()).getTime();
            setFieldValue(`${name}.absoluteTime`, dateObj);
        }
    };

    const onAbsTimeBlur = () => {
        setFieldTouched(`${name}.absoluteTime`, true);
    };

    return (
        <div>
            <DateTime
                name={`${name}.absoluteTime`}
                value={values.absoluteTime}
                dateFormat={'DD-MM-YYYY'}
                timeFormat={'HH:mm:ss'}
                onChange={onAbsTimeChange}
                onBlur={onAbsTimeBlur}
            />
            <br />

            <span>Offset Days</span>

            <input
                type="checkbox"
                name={`${name}.isVarDays`}
                onChange={handleChange}
                checked={values.isVarDays}
                onBlur={handleBlur}
            />

            <input
                type="number"
                name={`${name}.offsetDays`}
                onChange={handleChange}
                value={values.offsetDays}
                onBlur={handleBlur}
            />

            <span>Offset Months</span>

            <input
                type="checkbox"
                name={`${name}.isVarMonths`}
                onChange={handleChange}
                checked={values.isVarMonths}
                onBlur={handleBlur}
            />

            <input
                type="number"
                name={`${name}.offsetMonths`}
                onChange={handleChange}
                value={values.offsetMonths}
                onBlur={handleBlur}
            />

            <span>Offset Years</span>

            <input
                type="checkbox"
                name={`${name}.isVarYears`}
                onChange={handleChange}
                checked={values.isVarYears}
                onBlur={handleBlur}
            />

            <input
                type="number"
                name={`${name}.offsetYears`}
                onChange={handleChange}
                value={values.offsetYears}
                onBlur={handleBlur}
            />
        </div>
    );
}