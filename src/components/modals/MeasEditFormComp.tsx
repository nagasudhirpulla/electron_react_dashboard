import React from 'react';
import { TimePeriodEditFormComp } from './TimePeriodEditFormComp';
import { ScadaMeasurement } from '../../measurements/ScadaMeasurement';
import { PMUMeasurement } from '../../measurements/PMUMeasurement';
import { SamplingStrategyEditFormComp } from './SamplingStrategyEditFormComp';
import { DummyMeasurement } from '../../measurements/DummyMeasurement';
import { SchType } from '../../measurements/WbesMeasurement';
import { WbesMeasurement } from './../../measurements/WbesMeasurement';
import { getUtilsInfoAppState } from '../../utils/wbesUtils';
import { ipcRenderer } from 'electron';
//import * as channels from '../../channelNames';

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
            {/* avoiding text input in case of WBES to accommodate meas combobox */}
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

            {/* avoiding new line in case of PMU to accommodate measurement picker */}
            {values.discriminator &&
                values.discriminator != PMUMeasurement.typename &&
                <br />
            }

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
            <span><b>Periodicity</b></span>
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
            <span><b>Sampling Strategy</b>{" "}</span>
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
    const onMeasPickerClick = () => {
        ipcRenderer.send('openPmuMeasPicker', name);
    };

    ipcRenderer.on('selectedMeas', (event, { measInfo, measName }) => {
        if (measName != name) {
            return;
        }
        console.log(`Obtained pmu meas from picker is ${measInfo}`) // prints "pong"
        // set the measurement Id and measurement name
        setFieldValue(`${name}.meas_id`, measInfo[0]);
        // todo change series name as `${measInfo[1]}.${measInfo[3]}`
    });

    return (
        <>
            <button type="button" onClick={onMeasPickerClick}>...</button>
            <br />
            <span><b>Sampling Strategy</b>{" "}</span>
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
            <span><b>Periodicity</b></span>
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
            <span><b>Fetch Window</b></span>
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
            <span><b>Value 1{" "}</b></span>
            <input
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.value1}
                name={`${name}.value1`}
            />

            <span><b>{"    Value2 "}</b></span>
            <input
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.value2}
                name={`${name}.value2`}
            />
            <br /><br />

            <span><b>Periodicity</b></span>
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
            <span><b>Utility</b>{" "}</span>
            <select
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.meas_id}
                name={`${name}.meas_id`}
            >
                {Object.values(getUtilsInfoAppState()).map((util, index) => (
                    <option key={`wbes_util_opt_${index}`} value={util.utilId}>{util.name}</option>
                ))}
            </select>
            <br />

            <span><b>Schedule Type</b>{" "}</span>
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

            <span><b>Periodicity</b></span>
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

            <span><b>Sampling Strategy</b>{" "}</span>
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