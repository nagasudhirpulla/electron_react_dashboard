import React from 'react';
import { VarTimeEditFormComp } from '../../variable_time/VarTimeEditFormComp';
import { TimePeriodEditFormComp } from './TimePeriodEditFormComp';
import { MeasEditFormComp } from './MeasEditFormComp';

const SeriesCompDivider = () => (<div className="series_divider"></div>);

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
            <span>Series Color</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.color}
                name={`${name}.color`}
            />

            <SeriesCompDivider />

            <div className='black_border'>
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

            <SeriesCompDivider />

            <div className='black_border'>
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

            <SeriesCompDivider />

            <div className='black_border'>
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

            <SeriesCompDivider />

            <div className='black_border'>
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