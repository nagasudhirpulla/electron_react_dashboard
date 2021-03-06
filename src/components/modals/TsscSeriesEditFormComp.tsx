import React from 'react';
import { VarTimeEditFormComp } from '../../variable_time/VarTimeEditFormComp';
import { TimePeriodEditFormComp } from './TimePeriodEditFormComp';
import { MeasEditFormComp } from './MeasEditFormComp';
import { PlotlyRenderStrategy } from '../ITimeSeriesLinePlot';

const SeriesCompDivider = () => (<div className="series_divider"><hr /></div>);

export const TsscSeriesEditFormComp = (props) => {
    const {
        values,
        name,
        onDeleteClick,
        onDuplicateClick,
        onTimeOverwriteClick,
        touched,
        handleChange,
        handleBlur,
        errors,
        setFieldValue,
        setFieldTouched
    } = props;
    return (
        <>
            <span><b>Series Title{" "}</b></span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                name={`${name}.title`}
            />
            <button type="button" onClick={onDuplicateClick} className="duplicate_series_btn">Duplicate Series</button>
            <button type="button" onClick={onTimeOverwriteClick} className="time_overwrite_series_btn">Time Overwrite all Series</button>
            <button type="button" onClick={onDeleteClick} className="delete_series_btn">Delete Series</button>

            <SeriesCompDivider />

            <span><b>Series Color{" "}</b></span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.color}
                name={`${name}.color`}
            />

            <SeriesCompDivider />

            <div>
                <span><b>X-Measurement</b>{` (${values.meas1.discriminator}) `}</span>
                <MeasEditFormComp
                    name={`${name}.meas1`}
                    values={values.meas1}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                />
            </div>

            <SeriesCompDivider />

            <div>
                <span><b>Y-Measurement</b>{` (${values.meas2.discriminator}) `}</span>
                <MeasEditFormComp
                    name={`${name}.meas2`}
                    values={values.meas2}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                />
            </div>

            <SeriesCompDivider />

            <div>
                <span><b>From Time</b></span>
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
                <span><b>To Time</b></span>
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

            <span><b>Marker Size{" "}</b></span>
            <input
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.size}
                name={`${name}.size`}
            />

            <SeriesCompDivider />

            <div>
                <span><b>Display Time Shift</b></span>
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

            <span><b>Plotly Render Strategy{" "}</b></span>
            <select
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.renderStrategy}
                name={`${name}.renderStrategy`}
            >
                <option value={PlotlyRenderStrategy.scatter}>No GPU</option>
                <option value={PlotlyRenderStrategy.scattergl}>Use GPU</option>
            </select>
        </>
    )
};