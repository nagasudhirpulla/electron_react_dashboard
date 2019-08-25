import React from 'react';
import { TimePeriodEditFormComp } from './TimePeriodEditFormComp';
import { ScadaMeasurement } from '../../measurements/ScadaMeasurement';
import { PMUMeasurement } from '../../measurements/PMUMeasurement';
import { SamplingStrategyEditFormComp } from './SamplingStrategyEditFormComp';
import { DummyMeasurement } from '../../measurements/DummyMeasurement';
import { SchType } from '../../measurements/WbesMeasurement';
import { WbesMeasurement } from './../../measurements/WbesMeasurement';

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

            {values.discriminator &&
                values.discriminator == DummyMeasurement.typename &&
                <DummyMeasEditFormComp
                    name={name}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched} />
            }

            {values.discriminator &&
                values.discriminator == WbesMeasurement.typename &&
                <WbesMeasEditFormComp
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

export const DummyMeasEditFormComp = (props) => {
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
        </>
    )
};

export const WbesMeasEditFormComp = (props) => {
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
            <span>Schedule Type -</span>
            <select
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.schType}
                name={`${name}.schType`}
            >
                <option value={SchType.OnBarDc}>Onbar DC</option>
                <option value={SchType.OffBarDc}>Offbar DC</option>
                <option value={SchType.TotalDc}>Total DC</option>
            </select>
            <br />

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