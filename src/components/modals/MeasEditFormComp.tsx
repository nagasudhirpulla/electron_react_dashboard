import React from 'react';
import { TimePeriodEditFormComp } from './TimePeriodEditFormComp';
import { ScadaMeasurement } from '../../measurements/ScadaMeasurement';
import { PMUMeasurement } from '../../measurements/PMUMeasurement';
import { SamplingStrategyEditFormComp } from './SamplingStrategyEditFormComp';
import { DummyMeasurement } from '../../measurements/DummyMeasurement';
import { SchType } from '../../measurements/WbesMeasurement';
import { WbesMeasurement } from './../../measurements/WbesMeasurement';
import { getUtilsInfoAppState } from '../../utils/wbesUtils';

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
            {values.discriminator &&
                values.discriminator != WbesMeasurement.typename &&
                <input
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.meas_id}
                    name={`${name}.meas_id`}
                />
            }
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
            <span>Utility -</span>
            <select
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.meas_id}
                name={`${name}.meas_id`}
            >
                {Object.values(getUtilsInfoAppState()).map((util, index) => (
                    <option value={util.utilId}>{util.name}</option>
                ))}
            </select>
            <br />

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
                <option value={SchType.NetSch}>Net Schedule</option>
                <option value={SchType.Isgs}>ISGS Schedule</option>
                <option value={SchType.Lta}>LTA Schedule</option>
                <option value={SchType.Mtoa}>MTOA Schedule</option>
                <option value={SchType.Stoa}>STOA Schedule</option>
                <option value={SchType.Urs}>URS Schedule</option>
                <option value={SchType.Rras}>RRAS Schedule</option>
                <option value={SchType.Sced}>SCED Schedule</option>
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