import React from 'react';
import { TimePeriodEditFormComp } from './TimePeriodEditFormComp';
import { ScadaMeasurement } from '../../measurements/ScadaMeasurement';
import { PMUMeasurement } from '../../measurements/PMUMeasurement';
import { SamplingStrategyEditFormComp } from './SamplingStrategyEditFormComp';

export const MeasEditFormComp = (props) => {
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
                value={values.meas_id}
                name={`${name}.meas_id`}
            />
            <br />

            {values.discriminator &&
                values.discriminator == ScadaMeasurement.typename &&
                <ScadaMeasEditFormComp
                    name={name}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                />
            }

            {values.discriminator &&
                values.discriminator == PMUMeasurement.typename &&
                <PMUMeasEditFormComp
                    name={name}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched} />
            }
        </>
    )
};

export const ScadaMeasEditFormComp = (props) => {
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
            <span>Periodicity</span>
            <TimePeriodEditFormComp
                name={`${name}.periodicity`}
                values={values.periodicity}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched} />
            <br />
            <span>Sampling Strategy -</span>
            <SamplingStrategyEditFormComp
                name={`${name}.sampling_strategy`}
                values={values.sampling_strategy}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched} />
        </>
    )
};

export const PMUMeasEditFormComp = (props) => {
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
            <span>Periodicity</span>
            <TimePeriodEditFormComp
                name={`${name}.periodicity`}
                values={values.periodicity}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched} />
            <br />
            <span>Sampling Strategy -</span>
            <SamplingStrategyEditFormComp
                name={`${name}.sampling_strategy`}
                values={values.sampling_strategy}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched} />
            <br />
            <span>Fetch Window</span>
            <TimePeriodEditFormComp
                name={`${name}.fetchWindow`}
                values={values.fetchWindow}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched} />
        </>
    )
};