import React from 'react';
import { VarTimeEditFormComp } from '../../variable_time/VarTimeEditFormComp';
import { TimePeriodEditFormComp } from './TimePeriodEditFormComp';
import { MeasEditFormComp } from './MeasEditFormComp';

export const TslpSeriesEditFormComp = (props) => {
    const {
        values,
        name,
        touched,
        handleChange,
        handleBlur,
        errors,
        setFieldValue,
        setFieldTouched
    } = props;
    return (
        <>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.color}
                name={`${name}.color`}
            />

            <div>
                <h4>From Time</h4>
                <VarTimeEditFormComp
                    name={`${name}.fromVarTime`}
                    values={values.fromVarTime}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched} />
            </div>
            <div>
                <h4>To Time</h4>
                <VarTimeEditFormComp
                    name={`${name}.toVarTime`}
                    values={values.toVarTime}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched} />
            </div>
            <div>
                <TimePeriodEditFormComp
                    name={`${name}.displayTimeShift`}
                    values={values.displayTimeShift}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched} />
            </div>
            <div>
                <MeasEditFormComp
                    name={`${name}.meas`}
                    values={values.meas}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                />
            </div>
        </>
    )
};