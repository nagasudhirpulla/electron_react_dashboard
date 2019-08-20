import React from 'react';
import { SamplingStrategy } from '../../measurements/ScadaMeasurement';

export const SamplingStrategyEditFormComp = (props) => {
    const {
        values,
        handleChange,
        handleBlur,
    } = props;
    return (
        <>
            <select
                onChange={handleChange}
                onBlur={handleBlur}
                value={values}
                name={name}
            >
                <option value={SamplingStrategy.Raw}>{SamplingStrategy.Raw}</option>
                <option value={SamplingStrategy.Snap}>{SamplingStrategy.Snap}</option>
                <option value={SamplingStrategy.Average}>{SamplingStrategy.Average}</option>
                <option value={SamplingStrategy.Max}>{SamplingStrategy.Max}</option>
                <option value={SamplingStrategy.Min}>{SamplingStrategy.Min}</option>
                <option value={SamplingStrategy.Interpolated}>{SamplingStrategy.Interpolated}</option>
            </select>
        </>
    )
};