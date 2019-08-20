import React from 'react';

export const TimePeriodEditFormComp = ({
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
    return (
        <div>
            <span>Days</span>

            <input
                type="number"
                name={`${name}.days`}
                onChange={handleChange}
                value={values.days}
                onBlur={handleBlur}
            />

            <span>Months</span>

            <input
                type="number"
                name={`${name}.months`}
                onChange={handleChange}
                value={values.months}
                onBlur={handleBlur}
            />

            <span>Years</span>

            <input
                type="number"
                name={`${name}.years`}
                onChange={handleChange}
                value={values.years}
                onBlur={handleBlur}
            />

            <br />

            <span>Hours</span>

            <input
                type="number"
                name={`${name}.hrs`}
                onChange={handleChange}
                value={values.hrs}
                onBlur={handleBlur}
            />

            <span>Mins</span>

            <input
                type="number"
                name={`${name}.mins`}
                onChange={handleChange}
                value={values.mins}
                onBlur={handleBlur}
            />

            <span>Secs</span>

            <input
                type="number"
                name={`${name}.secs`}
                onChange={handleChange}
                value={values.secs}
                onBlur={handleBlur}
            />
        </div>
    );
};