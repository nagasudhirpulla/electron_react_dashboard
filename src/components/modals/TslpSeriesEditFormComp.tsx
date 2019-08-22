import React from 'react';
import { VarTimeEditFormComp } from '../../variable_time/VarTimeEditFormComp';
import { TimePeriodEditFormComp } from './TimePeriodEditFormComp';
import { MeasEditFormComp } from './MeasEditFormComp';
import { PlotlyRenderStrategy } from '../ITimeSeriesLinePlot';

const SeriesCompDivider = () => (<div className="series_divider"><hr /></div>);

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
            <span>Series Title</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                name={`${name}.title`}
            />

            <SeriesCompDivider />

            <span>Plotly Render Strategy</span>
            <select
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.renderStrategy}
                name={`${name}.renderStrategy`}
            >
                <option value={PlotlyRenderStrategy.scatter}>Scatter</option>
                <option value={PlotlyRenderStrategy.scattergl}>ScatterGL</option>
            </select>

            <SeriesCompDivider />

            <span>Series Color</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.color}
                name={`${name}.color`}
            />

            <SeriesCompDivider />

            <div>
                <span>From Time</span>
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

            <div>
                <span>To Time</span>
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

            <div>
                <span>Display Time Shift</span>
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

            <div>
                <span>Measurement</span>
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